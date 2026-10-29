import {gradeDeepAnswer} from './deep-engine.ts';
import type {ExamPaper,ExamPart,ExamProfile,ExamReview,ExamSession} from './exam-types.ts';
const fields=['communication','complexity','organization','accuracy'] as const;
export const examWritingCriteria=[{key:'communication',label:'Выполнение задачи'},{key:'complexity',label:'Языковой диапазон'},{key:'organization',label:'Организация и связность'},{key:'accuracy',label:'Точность'}];
export const examSpeakingCriteria=[['interaction','Взаимодействие'],['production','Развёрнутый ответ']].flatMap(([section,title])=>[{key:section+'.communication',label:title+' · выполнение задачи'},{key:section+'.complexity',label:title+' · языковой диапазон'},{key:section+'.fluency',label:title+' · беглость и связность'},{key:section+'.accuracy',label:title+' · точность и понятность'}]);
function text(value:unknown,max=20000){if(typeof value!=='string'||value.length>max)throw new Error('Некорректный ответ');return value}
function id(value:unknown){const s=text(value,100);if(!/^[a-zA-Z0-9_.:-]+$/.test(s))throw new Error('Некорректный идентификатор');return s}
export function examRemaining(session:ExamSession,now=Date.now()){
 if(session.submittedAt||session.mode==='learning')return null;
 const minutes=session.profile.parts[session.partIndex]?.minutes??0;
 return Math.max(0,Math.ceil((Date.parse(session.partStartedAt)+minutes*60000-now)/1000));
}
export function examActivePart(session:ExamSession){return session.profile.parts[session.partIndex]?.id}
function itemsFor(paper:ExamPaper,part:ExamPart){return part==='writing'?paper.writing:part==='speaking'?paper.speaking:paper[part].flatMap(b=>b.items)}
export function validateExamPayload(p:Record<string,unknown>,papers:Map<string,ExamPaper>,profile:ExamProfile,sessions:Record<string,ExamSession>,at:string,profiles?:Map<string,ExamProfile>):Record<string,unknown>{
 const action=text(p.action,30);const sessionId=id(p.sessionId);
 if(action==='start'){
  if(sessions[sessionId])throw new Error('Такая попытка уже существует');
  const paperId=id(p.paperId);const paperVersion=text(p.paperVersion,30);const paper=papers.get(paperId+'@'+paperVersion);if(!paper)throw new Error('Версия пробника недоступна');
  if(p.mode!=='learning'&&p.mode!=='timed')throw new Error('Выбери режим пробника');
  const wantedProfile=typeof p.profileVersion==='string'?p.profileVersion:(p.profile&&typeof p.profile==='object'&&'version' in p.profile?String(p.profile.version):profile.version);
  const selectedProfile=wantedProfile===profile.version?profile:profiles?.get(wantedProfile);if(!selectedProfile)throw new Error('Версия профиля этого пробника недоступна для восстановления');
  const novel=!Object.values(sessions).some(s=>s.paper.id===paperId);
  return {action,sessionId,paperId,paperVersion,profileVersion:selectedProfile.version,paper:structuredClone(paper),profile:structuredClone(selectedProfile),mode:p.mode,novel};
 }
 const session=sessions[sessionId];if(!session)throw new Error('Сначала начни пробник');
 const part=examActivePart(session);const active=!session.submittedAt&&part;
 if(action==='review'){
  if(p.part!=='writing'&&p.part!=='speaking')throw new Error('Оценка доступна для письма и речи');
  const target=p.part;if(!session.results[target])throw new Error('Сначала заверши этот компонент');
  if(itemsFor(session.paper,target).some(t=>!session.results[target]?.answers[t.id]?.trim()))throw new Error('Для оценки нужны ответы или заметки по всем заданиям компонента');
  if(p.source!=='self'&&p.source!=='teacher-reported')throw new Error('Укажи источник оценки');
  const required=target==='writing'?session.paper.writing.flatMap(t=>fields.map(f=>t.id+'.'+f)):examSpeakingCriteria.map(c=>c.key);const maximum=2.5;
  const raw=p.scores;if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Заполни все критерии');
  const scores:Record<string,number>={};for(const key of required){const value=(raw as Record<string,unknown>)[key];if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>maximum||!Number.isInteger(value*2))throw new Error('Заполни все критерии с шагом 0,5');scores[key]=value}
  return {action,sessionId,part:target,source:p.source,scores,total:Object.values(scores).reduce((a,b)=>a+b,0),comment:text(p.comment??'',8000)};
 }
 if(!active)throw new Error('Попытка завершена. Ответы сохранены без изменений.');
 if(Date.parse(at)<Date.parse(session.partStartedAt))throw new Error('Время ответа раньше начала компонента');
 if(action==='answer'){
  if(session.mode==='timed'&&examRemaining(session,Date.parse(at))===0)throw new Error('Время компонента закончилось. Заверши его, чтобы продолжить.');
  const itemId=id(p.itemId);if(!itemsFor(session.paper,part).some(i=>i.id===itemId))throw new Error('Это задание другого компонента');
  return {action,sessionId,itemId,answer:text(p.answer,part==='writing'||part==='speaking'?20000:2000)};
 }
 if(action==='listen'){
  const blockId=id(p.blockId);if(part!=='listening'||!session.paper.listening.some(b=>b.id===blockId))throw new Error('Неизвестный аудиофрагмент');
  if(session.mode==='timed'&&(session.listens[blockId]??0)>=2)throw new Error('В этом учебном режиме доступны два воспроизведения');
  if(session.mode==='timed'&&examRemaining(session,Date.parse(at))===0)throw new Error('Время аудирования закончилось');
  return {action,sessionId,blockId};
 }
 if(action==='recording'){
  if(part!=='speaking')throw new Error('Запись относится к устному компоненту');return {action,sessionId,recordingId:id(p.recordingId)};
 }
 if(action==='help')return {action,sessionId};
 if(action==='submit-part'){
  if(p.part!==part)throw new Error('Компонент уже завершён или ещё не начат');
  const answers=Object.fromEntries(itemsFor(session.paper,part).map(i=>[i.id,session.answers[i.id]??'']));
  const items=part==='writing'||part==='speaking'?[]:session.paper[part].flatMap(b=>b.items);
  const correct=items.length?items.filter(i=>gradeDeepAnswer(answers[i.id],i).status==='correct').length:null;
  const score=correct===null?null:Math.round(correct/items.length*20*10)/10;
  const deadline=Date.parse(session.partStartedAt)+session.profile.parts[session.partIndex].minutes*60000;
  const nextPartStartedAt=session.mode==='timed'?new Date(Math.min(Date.parse(at),deadline)).toISOString():at;
  return {action,sessionId,part,nextPartStartedAt,result:{submittedAt:at,score,correct,total:items.length||null,secondsUsed:Math.max(0,Math.floor((Date.parse(nextPartStartedAt)-Date.parse(session.partStartedAt))/1000)),answers},unheard:part==='listening'&&session.paper.listening.some(b=>!(session.listens[b.id]>0))};
 }
 throw new Error('Неизвестное действие пробника');
}
export function applyExamEvent(sessions:Record<string,ExamSession>,event:{id:string;at:string;payload:Record<string,unknown>}){
 const p=event.payload;const key=String(p.sessionId);
 if(p.action==='start'){
  if(sessions[key])return;
  sessions[key]={id:key,paper:structuredClone(p.paper) as ExamPaper,profile:structuredClone(p.profile) as ExamProfile,mode:p.mode as ExamSession['mode'],startedAt:event.at,partIndex:0,partStartedAt:event.at,novel:p.novel===true,assisted:false,answers:{},listens:{},recordingIds:[],results:{},reviews:[]};return;
 }
 const s=sessions[key];if(!s)return;
 if(p.action==='answer')s.answers[String(p.itemId)]=String(p.answer);
 else if(p.action==='listen')s.listens[String(p.blockId)]=(s.listens[String(p.blockId)]??0)+1;
 else if(p.action==='recording'){const recording=String(p.recordingId);if(!s.recordingIds.includes(recording))s.recordingIds.push(recording)}
 else if(p.action==='help')s.assisted=true;
 else if(p.action==='submit-part'){
  const part=p.part as ExamPart;if(s.results[part])return;
  s.results[part]=structuredClone(p.result) as NonNullable<ExamSession['results'][ExamPart]>;
  if(p.unheard)s.assisted=true;
  s.partIndex++;s.partStartedAt=typeof p.nextPartStartedAt==='string'?p.nextPartStartedAt:event.at;if(s.partIndex>=s.profile.parts.length)s.submittedAt=event.at;
 }else if(p.action==='review')s.reviews.push({id:event.id,at:event.at,part:p.part as ExamReview['part'],source:p.source as ExamReview['source'],scores:p.scores as Record<string,number>,total:Number(p.total),comment:String(p.comment)});
}
export function examScores(session:ExamSession){
 const scores:Record<ExamPart,number|null>={listening:session.results.listening?.score??null,reading:session.results.reading?.score??null,language:session.results.language?.score??null,writing:null,speaking:null};
 const sources:Partial<Record<ExamPart,string>>={};
 for(const part of ['writing','speaking'] as const){const last=session.reviews.filter(r=>r.part===part).at(-1);if(last){scores[part]=last.total;sources[part]=last.source}}
 const all=Object.values(scores);return {scores,sources,total:all.every(n=>n!==null)?all.reduce<number>((sum,n)=>sum+(n??0),0):null,objectiveTotal:(scores.listening??0)+(scores.reading??0)+(scores.language??0)};
}
export function examReadiness(sessions:ExamSession[]){
 const eligible=sessions.filter(s=>{const result=examScores(s);return s.submittedAt&&s.mode==='timed'&&s.novel&&!s.assisted&&s.paper.kind==='reserve'&&result.sources.writing==='teacher-reported'&&result.sources.speaking==='teacher-reported'&&result.total!==null&&result.total>=s.profile.internalTarget.total&&Object.values(result.scores).every(n=>n!==null&&n>=s.profile.internalTarget.component)});
 const days=new Set(eligible.map(s=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s.startedAt))));
 return {eligible,distinctDays:days.size,met:eligible.length>=2&&days.size>=2};
}
