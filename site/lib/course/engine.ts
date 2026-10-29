import type {Grade} from './types.ts';
export function normalize(text:string){return text.normalize('NFC').toLocaleLowerCase('ro').replaceAll('ş','ș').replaceAll('ţ','ț').replace(/[’‘]/g,"'").replace(/[.,!?;:"„”«»…]/g,'').replace(/\s+/g,' ').trim()}
export function fold(text:string){return normalize(text).normalize('NFD').replace(/\p{M}/gu,'')}
export function grade(answer:string,item:{answers:string[]}):Grade{
 const entered=normalize(answer);
 const exact=item.answers.find(a=>normalize(a)===entered);
 if(entered&&exact)return {correct:true,spelling:false,canonical:exact};
 const omitted=item.answers.find(a=>fold(a)===fold(entered));
 if(entered&&omitted)return {correct:true,spelling:true,canonical:omitted};
 return {correct:false,spelling:false,canonical:item.answers[0]??''};
}
export function scheduleReview(streak:number,correct:boolean,now:string){const steps=[1,3,7,14,30];return {due:new Date(Date.parse(now)+(correct?steps[Math.min(Math.max(streak,0),4)]:0)*86400000).toISOString(),streak:correct?streak+1:0}}
export function sessionPlan(minutes:60|75|90){const times=minutes===60?[8,12,12,12,12,4]:minutes===90?[10,20,20,17,18,5]:[10,15,15,15,15,5];return ['Повторение','Теория','Практика','Чтение','Письмо','Разбор ошибок'].map((label,i)=>({label,minutes:times[i]}))}
export function canFastPass(id:string,ids:string[],s:import('./types.ts').Snapshot){const p=s.productions[id];return !!s.completed[id]&&!!p&&!p.modelViewed&&ids.length>=8&&ids.filter(x=>{const a=s.attempts[x]?.[0];return a?.correct&&!a.assisted}).length/ids.length>=.85}
export function initialExerciseAnswer(item:{type:string;choices?:string[]},draft:string){return ['choice','read'].includes(item.type)&&item.choices?.length&&!item.choices.includes(draft)?'':draft}
