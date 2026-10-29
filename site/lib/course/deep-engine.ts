import type {DeepChapter,DeepExercise,StudyEvidence,StudyEvaluation} from './deep-types.ts';
export const DEEP_VERSION='3.0.0';
export const studyIssueCategories={spelling:'Написание',form:'Форма слова',syntax:'Построение фразы',vocabulary:'Выбор слова',cohesion:'Связность',register:'Регистр и тон'};
const DAY=86_400_000;
export function normalizeDeep(value:string){return value.normalize('NFC').toLocaleLowerCase('ro').replaceAll('ş','ș').replaceAll('ţ','ț').replace(/[’‘]/g,"'").replace(/[‐‑]/g,'-').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'').trim()}
export function gradeDeepAnswer(answer:string,item:Pick<DeepExercise,'answers'|'kind'|'caseSensitive'|'punctuationSensitive'>):{status:'correct'|'spelling'|'incorrect'|'pending';canonical:string}{
 if(item.kind==='explain')return {status:'pending',canonical:''};
 const normalize=(s:string)=>{let n=s.normalize('NFC').replaceAll('ş','ș').replaceAll('ţ','ț').replaceAll('Ş','Ș').replaceAll('Ţ','Ț').replace(/[’‘]/g,"'").replace(/[‐‑]/g,'-').replace(/\s+/g,' ').trim();if(!item.caseSensitive)n=n.toLocaleLowerCase('ro');if(!item.punctuationSensitive)n=n.replace(/[.!?]+$/,'').trim();return n};
 const value=normalize(answer);const canonical=item.answers.find(a=>normalize(a)===value);
 if(value&&canonical)return {status:'correct',canonical};
 const fold=(s:string)=>normalize(s).normalize('NFD').replace(/\p{M}/gu,'');
 const missing=item.answers.find(a=>fold(a)===fold(answer));
 return {status:value&&missing?'spelling':'incorrect',canonical:missing??item.answers[0]??''};
}
function readText(value:unknown,max:number,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error('Проверьте текст ответа');return value}
export function validateStudyPayload(p:Record<string,unknown>,chapters:Map<string,DeepChapter>,history:StudyEvidence[],_at:string):Record<string,unknown>{
 const chapterId=readText(p.chapterId,100,true);const chapter=chapters.get(chapterId);if(!chapter)throw new Error('Неизвестная глава');
 const chapterVersion=p.chapterVersion===undefined?DEEP_VERSION:readText(p.chapterVersion,24,true);
 if(!/^\d+\.\d+\.\d+$/.test(chapterVersion))throw new Error('Некорректная версия главы');
 const prior=history.filter(e=>e.chapterId===chapterId);
 const scenario=p.scenario===undefined?'main':p.scenario;
 if(scenario!=='main'&&scenario!=='transfer')throw new Error('Неизвестная ситуация');
 const base={chapterId,chapterVersion,action:p.action,assisted:p.assisted===true,skill:'grammar'};
 const helped=(targetId:string)=>p.assisted===true||prior.some(e=>e.action==='help'&&e.targetId===targetId);
 if(p.action==='view')return base;
 if(p.action==='draft'){
  if(p.skill!=='writing'&&p.skill!=='speaking')throw new Error('Неизвестный тип черновика');
  return {...base,answer:readText(p.answer,20000),scenario,skill:p.skill};
 }
 if(p.action==='help'){
  const targetId=readText(p.targetId,150,true);
  const known=chapter.exercises.some(e=>e.id===targetId)||['listen.main','listen.transfer','writing.main','writing.transfer','speaking.main','speaking.transfer'].some(s=>targetId===chapterId+'.'+s);
  if(!known)throw new Error('Неизвестная подсказка');
  return {...base,targetId,assisted:true};
 }
 if(p.action==='attempt'){
  const exercise=chapter.exercises.find(e=>e.id===p.exerciseId);if(!exercise)throw new Error('Неизвестное задание этой главы');
  const answer=readText(p.answer,4000,true);const result=gradeDeepAnswer(answer,exercise);
  const objective=chapter.objectives.find(o=>o.id===exercise.objectiveId);if(!objective)throw new Error('Нет учебной цели задания');
  return {...base,answer,exerciseId:exercise.id,objectiveId:objective.id,familyId:exercise.familyId,mode:exercise.mode,skill:objective.skill,
   assisted:helped(exercise.id),novel:!prior.some(e=>e.action==='attempt'&&e.familyId===exercise.familyId),status:chapterVersion===DEEP_VERSION?result.status:'pending'};
 }
 if(p.action==='writing'||p.action==='speaking'){
  const answer=readText(p.answer,20000,true);const recordingId=p.recordingId===undefined?undefined:readText(p.recordingId,80,true);
  if(recordingId&&!/^[a-zA-Z0-9_-]+$/.test(recordingId))throw new Error('Некорректная запись');
  return {...base,answer,scenario,skill:p.action,status:'submitted',assisted:helped(`${chapterId}.${p.action}.${scenario}`),...(recordingId?{recordingId}:{})};
 }
 if(p.action==='listening'){
  const questions=scenario==='main'?chapter.listening.questions:chapter.listening.transferQuestions;
  if(!Array.isArray(p.answers)||p.answers.length!==questions.length)throw new Error('Ответьте на все вопросы аудирования');
  const answers=p.answers.map(a=>readText(a,1000,true));
  const score=answers.reduce((n,a,i)=>n+(gradeDeepAnswer(a,{kind:'gap',answers:questions[i].answers}).status==='correct'?1:0),0);
  return {...base,answers,answer:JSON.stringify(answers),scenario,skill:'listening',score,total:questions.length,status:'submitted',assisted:helped(`${chapterId}.listen.${scenario}`),mode:'synthetic',novel:!prior.some(e=>e.action==='listening'&&e.scenario===scenario)};
 }
 if(p.action==='feedback'){
  const targetId=readText(p.targetId,100,true);const target=prior.find(e=>e.id===targetId&&(e.action==='writing'||e.action==='speaking'));
  if(!target)throw new Error('Не найдена работа для обратной связи');
  const raw=p.evaluation as StudyEvaluation|undefined;
  if(!raw||!['self','teacher-reported'].includes(raw.source))throw new Error('Укажите источник оценки');
  const rubric=target.action==='writing'?chapter.writing.rubric:chapter.speaking.rubric;
  if(!raw.scores||typeof raw.scores!=='object'||Array.isArray(raw.scores))throw new Error('Нужны оценки по критериям');
  const scores:Record<string,number>={};
  for(const r of rubric){const n=raw.scores[r.key];if(!Number.isInteger(n)||n<0||n>4)throw new Error('Оценка каждого критерия — от 0 до 4');scores[r.key]=n;}
  if(raw.issues!==undefined&&(!Array.isArray(raw.issues)||raw.issues.length>12))throw new Error('Можно добавить до 12 разборов фрагментов');
  const issues=(raw.issues??[]).map(issue=>{if(!issue||!Object.hasOwn(studyIssueCategories,issue.category))throw new Error('Выбери тип ошибки');return {category:issue.category,fragment:readText(issue.fragment,2000,true),correction:readText(issue.correction,2000,true),why:readText(issue.why,3000,true)}});
  return {...base,targetId,skill:target.skill,status:'submitted',evaluation:{source:raw.source,scores,comment:readText(raw.comment,6000),issues}};
 }
 if(p.action==='review'){const targetId=p.targetId===undefined?undefined:readText(p.targetId,150,true);if(targetId&&!chapter.exercises.some(e=>e.id===targetId))throw new Error('Неизвестное задание для разбора');return {...base,answer:readText(p.answer,4000,true),status:'submitted',...(targetId?{targetId}:{})}};
 throw new Error('Неизвестное учебное действие');
}
export function objectiveProgress(chapter:DeepChapter,history:StudyEvidence[]){
 const relevant=history.filter(e=>e.chapterId===chapter.id&&e.chapterVersion===DEEP_VERSION&&e.action==='attempt');
 return chapter.objectives.map(o=>{
  const all=relevant.filter(e=>e.objectiveId===o.id);
  const checks=all.filter(e=>!e.assisted&&e.novel&&['control','retention'].includes(e.mode??'')&&e.status!=='pending');
  const unique=[...new Map(checks.map(e=>[e.familyId,e])).values()].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
  const recent=unique.slice(-2);const correct=unique.filter(e=>e.status==='correct');const accuracy=recent.length?recent.filter(e=>e.status==='correct').length/recent.length:0;
  const independent=recent.length>=2&&accuracy===1;
  const retained=independent&&correct.some(e=>e.mode==='retention'&&correct.some(before=>before.id!==e.id&&Date.parse(e.at)-Date.parse(before.at)>=DAY));
  return {id:o.id,label:o.label,attempts:all.length,independent,retained,accuracy};
 });
}
export function nextStudyReview(chapterId:string,history:StudyEvidence[]):string|undefined{
 const items=history.filter(e=>e.chapterId===chapterId&&e.chapterVersion===DEEP_VERSION&&e.action==='attempt'&&!e.assisted&&e.status!=='pending').sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 if(!items.length)return;
 const last=items.at(-1)!;if(last.status!=='correct')return new Date(last.at).toISOString();
 const successfulDays=new Set(items.filter(e=>e.mode==='retention'&&e.status==='correct').map(e=>e.at.slice(0,10))).size;
 return new Date(Date.parse(last.at)+[1,7,21][Math.min(successfulDays,2)]*DAY).toISOString();
}
export function studyReviewMode(chapterId:string,history:StudyEvidence[],now=Date.now()):'practice'|'control'|'retention'{
 const checks=history.filter(e=>e.chapterId===chapterId&&e.chapterVersion===DEEP_VERSION&&e.action==='attempt'&&!e.assisted&&e.mode==='control');
 if(!checks.length)return 'control';
 return checks.some(e=>now-Date.parse(e.at)>=DAY)?'retention':'practice';
}
export function retentionReadyAt(chapterId:string,objectiveId:string,history:StudyEvidence[]):number|undefined{
 const dates=history.filter(e=>e.chapterId===chapterId&&e.chapterVersion===DEEP_VERSION&&e.action==='attempt'&&e.objectiveId===objectiveId&&!e.assisted&&e.mode==='control').map(e=>Date.parse(e.at));
 return dates.length?Math.min(...dates)+DAY:undefined;
}
