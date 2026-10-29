import {grade,scheduleReview} from './engine.ts';
import {hasRecentWordExposure} from './word-ui.ts';
import {transferWritingRubric} from './writing.ts';
import {courseVersion} from './version.ts';
import {scheduleWordPractice,wordReviewKey} from './word-memory.ts';
import {validateStudyPayload} from './deep-engine.ts';
import {validateExamPayload,applyExamEvent} from './exam-engine.ts';
import type {ExamPaper,ExamProfile} from './exam-types.ts';
import type {DeepChapter,StudyEvidence} from './deep-types.ts';
import type {LearningEvent,Snapshot,ExerciseItem,Mission,WordRecallItem,WordReviewMode,WritingScenario,Grade} from './types.ts';
export type Catalog={examPapers?:Map<string,ExamPaper>;examProfile?:ExamProfile;examProfiles?:Map<string,ExamProfile>;studyChapters?:Map<string,DeepChapter>;exercises:Map<string,ExerciseItem>;lessonIds:Set<string>;wordIds:Set<string>;missions:Map<string,Mission>;lessonExercises:Map<string,string[]>;productionCriteria?:Map<string,number>;wordRecall?:Map<string,WordRecallItem>;writingTasks?:Map<string,number>;checkpointIds?:Set<string>};
export function emptySnapshot():Snapshot{return {exams:{},study:[],checkpointExposures:{},wordExposures:{},customCards:{},writing:{},events:[],attempts:{},wordAttempts:{},wordReviews:{},drafts:{},cursors:{},productions:{},completed:{},savedWords:[],notes:{},preferences:{minutes:75,level:'A1'},missions:{},realLife:{},xp:0,reviews:{},assistance:{}}}
function text(v:unknown,max=5000){if(typeof v!=='string'||v.length>max)throw new Error('Некорректный текст');return v}
function known(v:unknown,ids:Set<string>|Map<string,unknown>,label:string){const s=text(v,100);if(!ids.has(s))throw new Error(`Неизвестное ${label}`);return s}
function knownWord(v:unknown,c:Catalog,s:Snapshot){const id=text(v,100);if(!c.wordIds.has(id)&&(!Object.hasOwn(s.customCards,id)||s.customCards[id].deleted))throw new Error('Неизвестное слово');return id}
export function validateEvent(e:LearningEvent,c:Catalog,s:Snapshot):LearningEvent{
 if(!e||typeof e!=='object'||typeof e.id!=='string'||!/^[a-zA-Z0-9_.:-]{1,100}$/.test(e.id))throw new Error('Некорректный ID события');
 if(!Number.isFinite(Date.parse(e.at))||Date.parse(e.at)>Date.now()+60000)throw new Error('Некорректная дата');
 const p=e.payload;if(!p||typeof p!=='object'||Array.isArray(p))throw new Error('Некорректное событие');
 let q:Record<string,unknown>={};
 switch(e.type){
 case 'study':q=validateStudyPayload(p,c.studyChapters??new Map(),s.study,e.at);break;
 case 'exam':if(!c.examProfile)throw new Error('Профиль экзамена недоступен');q=validateExamPayload(p,c.examPapers??new Map(),c.examProfile,s.exams,e.at,c.examProfiles);break;
 case 'customCard':{
  const cardId=text(p.cardId,100);
  if(!/^custom\.[a-zA-Z0-9_.:-]+$/.test(cardId)||c.wordIds.has(cardId))throw new Error('Некорректный ID своей карточки');
  if(p.action==='delete'){
   if(!s.customCards[cardId])throw new Error('Неизвестная своя карточка');
   q={action:'delete',cardId};
  }else if(p.action==='upsert'){
   const ro=text(p.ro,200).trim();const ru=text(p.ru,400).trim();const example=text(p.example??'',1000).trim();
   if(!ro||!ru)throw new Error('Заполните румынское слово и перевод');
   if((!s.customCards[cardId]||s.customCards[cardId].deleted)&&Object.values(s.customCards).filter(card=>!card.deleted).length>=1000)throw new Error('Можно добавить не более 1000 своих карточек');
   q={action:'upsert',cardId,ro,ru,example};
  }else throw new Error('Некорректное действие карточки');
  break;
 }
 case 'writing':{
  const taskId=known(p.taskId,c.writingTasks??new Map(),'письменное задание');
  if(p.action!=='draft'&&p.action!=='revision')throw new Error('Некорректное действие письма');
  const scenario=p.scenario??'main';
  if(scenario!=='main'&&scenario!=='transfer')throw new Error('Некорректная ситуация письма');
  const value=text(p.text,20000);const count=scenario==='transfer'?transferWritingRubric.length:c.writingTasks!.get(taskId)!;
  if(!Array.isArray(p.criteria)||p.criteria.some(index=>!Number.isInteger(index)||index<0||index>=count)||new Set(p.criteria).size!==p.criteria.length)throw new Error('Некорректные критерии письма');
  if(typeof p.modelViewed!=='boolean')throw new Error('Некорректная отметка образца');
  if(p.action==='revision'&&!value.trim())throw new Error('Введите текст версии');
  q={taskId,scenario,action:p.action,text:value,criteria:[...p.criteria],modelViewed:p.modelViewed||s.writing[taskId]?.modelViewed===true};
  break;
 }
 case 'checkpointExposure':q={exerciseId:known(p.exerciseId,c.checkpointIds??new Set(),'контрольное задание')};break;
 case 'wordExposure':{
  const wordId=knownWord(p.wordId,c,s);
  if(p.mode!=='recognition'&&p.mode!=='recall')throw new Error('Некорректный режим показа слова');
  q={wordId,mode:p.mode};break;
 }
 case 'attempt':{const id=known(p.exerciseId,c.exercises,'задание');const answer=text(p.answer,2000);q={exerciseId:id,answer,assisted:p.assisted===true||s.assistance[id]===true||s.assistance[id.split('.e')[0]]===true,result:grade(answer,c.exercises.get(id)!),tag:c.exercises.get(id)!.tag,skill:c.exercises.get(id)!.skill};break;}
 case 'assist':q={key:known(p.key,c.exercises.has(String(p.key))?c.exercises:c.lessonIds,'тема или задание')};break;
 case 'draft':q={key:known(p.key,c.exercises,'задание'),text:text(p.text,2000)};break;
 case 'cursor':{const id=known(p.lessonId,c.lessonIds,'урок');const n=Number(p.index);if(!Number.isInteger(n)||n<0||n>(c.lessonExercises.get(id)?.length??0)+2)throw new Error('Некорректный шаг');q={lessonId:id,index:n};break;}
 case 'production':{const id=known(p.lessonId,c.lessonIds,'урок');const criteria=Array.isArray(p.criteria)?p.criteria.filter(x=>Number.isInteger(x)&&Number(x)>=0&&Number(x)<(c.productionCriteria?.get(id)??3)):[];q={lessonId:id,text:text(p.text,12000),criteria:[...new Set(criteria)],modelViewed:p.modelViewed===true||s.productions[id]?.modelViewed===true,spoken:p.spoken===true};break;}
 case 'finish':{const id=known(p.lessonId,c.lessonIds,'урок');const items=c.lessonExercises.get(id)??[];if(!items.length||!items.every(x=>s.attempts[x]?.length))throw new Error('Сначала выполните все задания практики');const prod=s.productions[id];if(id.startsWith('CHECK.')&&(!prod||prod.criteria.length<(c.productionCriteria?.get(id)??3)||(!(prod as {spoken?:boolean}).spoken&&prod.text.trim().length<20)))throw new Error('Завершите самостоятельную практику и отметьте критерии');q={lessonId:id};break;}
 case 'word':q={wordId:knownWord(p.wordId,c,s),saved:p.saved===true};break;
 case 'wordReview':{
  const wordId=knownWord(p.wordId,c,s);
  if(p.mode!=='recognition'&&p.mode!=='recall')throw new Error('Некорректный режим тренировки слова');
  const mode=p.mode;
  const assisted=p.assisted===true||hasRecentWordExposure(wordId,mode,s.wordExposures,Date.parse(e.at));
  if(mode==='recognition'){
   if(typeof p.recalled!=='boolean')throw new Error('Укажите, вспомнил ли слово');
   q={wordId,mode,recalled:p.recalled,answer:'',assisted,source:'self',result:{correct:p.recalled,spelling:false,canonical:''}};
  }else{
   const custom=s.customCards[wordId];
   const item=custom&&!custom.deleted?{answers:[custom.ro]}:c.wordRecall?.get(wordId);
   if(!item)throw new Error('Для слова нет проверенного воспроизведения');
   const answer=text(p.answer,200);
   if(!answer.trim()&&!assisted)throw new Error('Введите ответ');
   q={wordId,mode,answer,assisted,source:'checked',result:grade(answer,item)};
  }
  break;
 }
 case 'note':q={wordId:knownWord(p.wordId,c,s),text:text(p.text,5000)};break;
 case 'preference':{if(p.minutes!==undefined&&![60,75,90].includes(Number(p.minutes)))throw new Error('Некорректное время');if(p.level!==undefined&&!['A1','A2','B1','B2'].includes(String(p.level)))throw new Error('Неизвестный уровень');q={...(p.minutes!==undefined?{minutes:Number(p.minutes)}:{}),...(p.level!==undefined?{level:p.level}:{})};break;}
 case 'mission':{const id=known(p.missionId,c.missions,'диалог');const m=c.missions.get(id)!;const v=Number(p.variant);const variant=m.variants[v];if(!variant||!Array.isArray(p.choices)||p.choices.length>20)throw new Error('Некорректный диалог');let node=variant.nodes[0];let good=0;let done=false;for(const i of p.choices){if(done||!Number.isInteger(i)||!node.options[Number(i)])throw new Error('Неверный шаг диалога');const option=node.options[Number(i)];if(option.good)good++;done=option.next==='done';if(!done){const next=variant.nodes.find(x=>x.id===option.next);if(!next)throw new Error('Неверная ветка диалога');node=next;}}if(!done)throw new Error('Диалог ещё не завершён');q={missionId:id,variant:v,choices:p.choices,good,total:p.choices.length,mode:p.mode==='guided'?'guided':'independent',assisted:p.mode==='guided'||p.assisted===true};break;}
 case 'realLife':q={missionId:known(p.missionId,c.missions,'диалог'),text:text(p.text,3000)};break;
 case 'report':q={exerciseId:known(p.exerciseId,c.exercises,'задание'),text:text(p.text,3000)};break;
 default:throw new Error('Неизвестный тип события');
 }
 return {id:e.id,type:e.type,at:new Date(e.at).toISOString(),payload:{...q,courseVersion}};
}
export function createAccumulator(c:Catalog,events:LearningEvent[]=[]){
 const s=emptySnapshot();const seen=new Set<string>();const xpItems=new Set<string>();
 const append=(e:LearningEvent)=>{if(seen.has(e.id))return;seen.add(e.id);s.events.push(e);const p=e.payload;
 switch(e.type){
 case 'study':s.study.push({...p,id:e.id,at:e.at} as StudyEvidence);break;
 case 'exam':applyExamEvent(s.exams,e);break;
 case 'customCard':{
  const id=String(p.cardId);const prior=s.customCards[id];
  if(p.action==='delete'){if(prior)s.customCards[id]={...prior,deleted:true};break;}
  const ro=String(p.ro);const ru=String(p.ru);
  if(prior&&(prior.ro!==ro||prior.ru!==ru)){
   delete s.wordExposures[wordReviewKey(id,'recognition')];delete s.wordExposures[wordReviewKey(id,'recall')];
   delete s.wordAttempts[id];delete s.wordReviews[wordReviewKey(id,'recognition')];delete s.wordReviews[wordReviewKey(id,'recall')];
  }
  s.customCards[id]={id,ro,ru,example:String(p.example??''),deleted:false};break;
 }
 case 'writing':{
  const id=String(p.taskId);const prior=s.writing[id];const modelViewed=p.modelViewed===true||prior?.modelViewed===true;
  const scenario:WritingScenario=p.scenario==='transfer'?'transfer':'main';
  const latest={text:String(p.text),criteria:[...(p.criteria as number[])],modelViewed,scenario};
  const revisions=p.action==='revision'?[...(prior?.revisions??[]),{id:e.id,at:e.at,...latest}].slice(-30):prior?.revisions??[];
  s.writing[id]={...latest,drafts:{...prior?.drafts,[scenario]:{text:latest.text,criteria:latest.criteria}},revisions};break;
 }
 case 'attempt':{const id=String(p.exerciseId);const item=c.exercises.get(id);if(!item)break;const result=(p.result&&typeof p.result==='object'?p.result:grade(String(p.answer),item)) as ReturnType<typeof grade>;const attempts=s.attempts[id]??[];attempts.push({exerciseId:id,answer:String(p.answer),correct:result.correct,spelling:result.spelling,assisted:p.assisted===true,at:e.at,tag:String(p.tag||item.tag),skill:String(p.skill||item.skill)});s.attempts[id]=attempts;s.drafts[id]=String(p.answer);if(result.correct&&!xpItems.has(id)){s.xp+=5;xpItems.add(id)}const prior=s.reviews[id];s.reviews[id]=scheduleReview(prior?.streak??0,result.correct,e.at);break;}
 case 'checkpointExposure':s.checkpointExposures[String(p.exerciseId)]=e.at;break;
 case 'wordExposure':{const key=wordReviewKey(String(p.wordId),p.mode as WordReviewMode);s.wordExposures[key]=Math.max(s.wordExposures[key]??0,Date.parse(e.at));break;}
 case 'assist':s.assistance[String(p.key)]=true;break;
 case 'draft':s.drafts[String(p.key)]=String(p.text);break;
 case 'cursor':s.cursors[String(p.lessonId)]=Number(p.index);break;
 case 'production':{const id=String(p.lessonId);s.productions[id]={text:String(p.text),criteria:p.criteria as number[],modelViewed:p.modelViewed===true||s.productions[id]?.modelViewed===true,spoken:p.spoken===true} as Snapshot['productions'][string];break;}
 case 'finish':{const id=String(p.lessonId);if(!s.completed[id]){s.completed[id]=e.at;s.xp+=20}break;}
 case 'word':{const id=String(p.wordId);s.savedWords=s.savedWords.filter(x=>x!==id);if(p.saved)s.savedWords.push(id);break;}
 case 'wordReview':{
  const wordId=String(p.wordId);const mode=p.mode as WordReviewMode;
  if(mode!=='recognition'&&mode!=='recall')break;
  const answer=typeof p.answer==='string'?p.answer:'';
  const stored=p.result&&typeof p.result==='object'?p.result as Grade:undefined;
  const custom=s.customCards[wordId];
  const result=mode==='recall'&&custom?grade(answer,{answers:[custom.ro]}):stored??(mode==='recall'&&c.wordRecall?.has(wordId)?grade(answer,c.wordRecall.get(wordId)!):{correct:p.recalled===true,spelling:false,canonical:''});
  const assisted=p.assisted===true;
  const attempt={wordId,mode,answer,correct:result.correct,spelling:result.spelling,canonical:result.canonical,assisted,source:mode==='recall'?'checked' as const:'self' as const,at:e.at};
  (s.wordAttempts[wordId]??=[]).push(attempt);
  const key=wordReviewKey(wordId,mode);
  s.wordReviews[key]=scheduleWordPractice(s.wordReviews[key],result.correct,assisted,e.at);
  break;
 }
 case 'note':s.notes[String(p.wordId)]=String(p.text);break;
 case 'preference':s.preferences={...s.preferences,...p} as Snapshot['preferences'];break;
 case 'mission':{const id=String(p.missionId)+'.'+p.variant;if(!s.missions[id])s.xp+=15;s.missions[id]={at:e.at,good:Number(p.good),total:Number(p.total),variant:Number(p.variant),mode:String(p.mode||'independent'),assisted:p.assisted===true};break;}
 case 'realLife':s.realLife[String(p.missionId)]=String(p.text);break;
 }
 };
 events.forEach(append);return {snapshot:s,append};
}
export function reduceEvents(events:LearningEvent[],c:Catalog):Snapshot{return createAccumulator(c,events).snapshot}

