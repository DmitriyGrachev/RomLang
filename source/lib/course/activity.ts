import type {Snapshot} from './types.ts';

type Attempts=Record<string,{at:string}[]>;
type ModuleLike={id:string;checkpoint_id:string;lessons:{id:string}[]};

export function dailyAttemptCount(attempts:Attempts,now=new Date()){
 const day=(date:Date)=>`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
 const today=day(now);
 return Object.values(attempts).filter(entries=>entries.some(entry=>{
  const at=new Date(entry.at);
  return !Number.isNaN(at.valueOf())&&day(at)===today;
 })).length;
}

export function nextOpenModuleIndex(modules:ModuleLike[],completed:Snapshot['completed'],missionIds:Record<string,string>,finishedMissions:Snapshot['missions'],fastPassed:(id:string)=>boolean=()=>false,events:Snapshot['events']=[]){
 const index=modules.findIndex(module=>module.lessons.some(lesson=>!completed[lesson.id])||(!completed[module.checkpoint_id]&&!fastPassed(module.checkpoint_id))||!!missionIds[module.id]&&!missionCompleted(missionIds[module.id],finishedMissions,events));
 return index<0?Math.max(0,modules.length-1):index;
}

export function missionCompleted(id:string,missions:Snapshot['missions'],events:Snapshot['events']=[]){
 return Object.entries(missions).some(([key,value])=>key.startsWith(`${id}.`)&&value.mode!=='guided')||events.some(event=>event.type==='mission'&&event.payload.missionId===id&&event.payload.mode!=='guided');
}

export function lessonEntryPage(id:string,attempts:Attempts,completed:Snapshot['completed'],coreExerciseIds:string[]):'theory'|'lesson'{
 return completed[id]||coreExerciseIds.some(key=>attempts[key]?.length)?'lesson':'theory';
}

export function replayIntent(lessonId:string,exerciseIds:string[]){
 return [...exerciseIds.map(key=>({type:'draft' as const,payload:{key,text:''}})),{type:'cursor' as const,payload:{lessonId,index:0}}];
}
