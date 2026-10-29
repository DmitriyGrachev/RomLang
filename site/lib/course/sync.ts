import {emptySnapshot,reduceEvents,validateEvent,createAccumulator} from './records.ts';
import type {Catalog} from './records.ts';
import type {LearningEvent,Snapshot} from './types.ts';
import type {RecoveryStore,LearningConflict} from './recovery.ts';

export type SyncState={snapshot:Snapshot;status:'loading'|'saved'|'saving'|'error'|'signin';error:string;hasPending:boolean;recoveryWarning:string;conflicts:LearningConflict[]};
export type Transport={load:()=>Promise<LearningEvent[]>;save:(events:LearningEvent[])=>Promise<LearningEvent[]>};
export function selectLearningBatch(pending:LearningEvent[],maximum=100,byteLimit=4_800_000){
 const batch:LearningEvent[]=[];const encoder=new TextEncoder();let bytes=14;
 for(const event of pending.slice(0,maximum)){const size=encoder.encode(JSON.stringify(event)).byteLength+1;if(bytes+size>byteLimit){if(!batch.length)throw new Error('Учебная запись слишком большая для сохранения');break}batch.push(event);bytes+=size}return batch;
}

export function createLearningSync(transport:Transport,catalog:Catalog,recovery?:RecoveryStore){
 let confirmed:LearningEvent[]=[];let pending:LearningEvent[]=[];let ready=false;let task:Promise<void>|null=null;let refreshWanted=false;
 let conflicts:LearningConflict[]=[];
 let timer:ReturnType<typeof setTimeout>|undefined;let sending=new Set<string>();let hydrated=false;let locked=false;let recoveryBlocked=false;let recoveryWarning='';
 let state:SyncState={snapshot:emptySnapshot(),status:'loading',error:'',hasPending:false,recoveryWarning:'',conflicts:[]};const listeners=new Set<()=>void>();
 const persist=()=>{
  if(!recovery||!hydrated||locked||recoveryBlocked)return;
  try{recovery.write({confirmed,pending,conflicts});recoveryWarning=''}catch{recoveryWarning='Локальная копия восстановления недоступна. Несохранённые ответы остаются в этой вкладке: дождись связи с сервером или экспортируй прогресс.'}
 };
 const publish=(status:SyncState['status']=state.status,error=state.error)=>{
  persist();state={snapshot:reduceEvents([...confirmed,...pending],catalog),status,error,hasPending:pending.length>0,recoveryWarning,conflicts};listeners.forEach(f=>f());
 };
 const hydrate=()=>{
  if(hydrated)return;hydrated=true;if(!recovery)return;
  try{
   const cached=recovery.read();if(!cached)return;
   const accumulator=createAccumulator(catalog,cached.confirmed);const seen=new Set(cached.confirmed.map(e=>e.id));const restored:LearningEvent[]=[];
   for(const raw of cached.pending){if(seen.has(raw.id))continue;const event=validateEvent(raw,catalog,accumulator.snapshot);restored.push(event);seen.add(event.id);accumulator.append(event)}
   confirmed=cached.confirmed;pending=restored;conflicts=cached.conflicts??[];
  }catch{recoveryBlocked=true;recoveryWarning='Не удалось прочитать локальную копию восстановления. Она оставлена без изменений; история загружается с сервера. Новые несохранённые ответы остаются в этой вкладке до подтверждения.'}
 };
 const reconcilePending=()=>{
  const accumulator=createAccumulator(catalog,confirmed);const seen=new Set(confirmed.map(e=>e.id));const accepted:LearningEvent[]=[];
  for(const raw of pending){if(seen.has(raw.id))continue;try{const event=validateEvent(raw,catalog,accumulator.snapshot);accepted.push(event);seen.add(event.id);accumulator.append(event)}catch(e){if(!conflicts.some(c=>c.event.id===raw.id))conflicts=[...conflicts,{event:raw,reason:e instanceof Error?e.message:'Запись конфликтует с сохранённой историей'}]}}
  pending=accepted;
 };
 const run=():Promise<void>=>{
  if(timer){clearTimeout(timer);timer=undefined}if(locked)return Promise.resolve();if(task)return task;
  hydrate();
  task=(async()=>{
   try{
    do{
     if(!ready||refreshWanted){
      refreshWanted=false;publish(!ready&&state.status==='loading'&&!pending.length?'loading':'saving','');
      confirmed=await transport.load();if(locked)return;ready=true;
      reconcilePending();publish('saving','');
     }
     while(pending.length){
      publish('saving','');const batch=selectLearningBatch(pending);sending=new Set(batch.map(e=>e.id));
      try{const server=await transport.save(batch);if(locked)return;confirmed=server;pending=pending.filter(e=>!sending.has(e.id));publish('saving','')}finally{sending.clear()}
     }
    }while(refreshWanted);
    publish('saved','');
   }catch(e){
    const err=e as Error&{status?:number;code?:string};
    if(err.code==='ACCOUNT_CHANGED'||(err.status===401&&recovery)){
     // Keep the old account's disk copy, but never display or send it under a new identity.
     locked=true;if(recovery){confirmed=[];pending=[];conflicts=[]}ready=false;refreshWanted=false;
     publish('signin','Аккаунт изменился или вход завершён. Перезагрузи страницу; несохранённая копия привязана к прежнему аккаунту.');
    }else{ready=false;publish(err.status===401?'signin':'error',err.message||'Не удалось сохранить. Не закрывай вкладку до подтверждения.')}
   }
  })().finally(()=>{task=null});
  return task;
 };
 const coalesce=(e:LearningEvent)=>e.type==='exam'&&e.payload.action==='answer'?'exam-answer:'+e.payload.sessionId+':'+e.payload.itemId:e.type==='study'&&e.payload.action==='draft'?'study-draft:'+e.payload.chapterId+':'+e.payload.skill+':'+e.payload.scenario:e.type==='writing'&&e.payload.action==='draft'?'writing:'+e.payload.taskId+':'+(e.payload.scenario??'main'):e.type==='draft'?'draft:'+e.payload.key:e.type==='production'?'production:'+e.payload.lessonId:e.type==='note'?'note:'+e.payload.wordId:e.type==='cursor'?'cursor:'+e.payload.lessonId:e.type==='preference'?'preference:'+Object.keys(e.payload).sort().join(','):null;
 const send=(type:LearningEvent['type'],payload:Record<string,unknown>)=>{
  if(locked)throw new Error('Перезагрузи страницу: эта вкладка привязана к прежнему аккаунту.');
  const e=validateEvent({id:Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),type,payload,at:new Date().toISOString()},catalog,state.snapshot);
  const key=coalesce(e);if(key)pending=pending.filter(old=>sending.has(old.id)||coalesce(old)!==key);pending.push(e);
  publish(state.status==='signin'?'signin':'saving',state.status==='signin'?state.error:'');
  if(key){if(timer)clearTimeout(timer);timer=setTimeout(()=>void run(),450)}else void run();return e;
 };
 return {
  getState:()=>state,subscribe:(f:()=>void)=>{listeners.add(f);return()=>{listeners.delete(f)}},initialize:()=>run(),retry:()=>run(),send,
  refresh:()=>{if(locked||!ready||pending.length)return Promise.resolve();refreshWanted=true;return run()},
  restore:async(events:unknown[])=>{
   if(events.length>100000)throw new Error('В файле больше 100 000 записей');await run();if(state.status!=='saved')throw new Error(state.error);
   const seen=new Set(confirmed.map(e=>e.id));const fresh:LearningEvent[]=[];const accumulator=createAccumulator(catalog,confirmed);
   for(const raw of events){const source=raw as LearningEvent;if(seen.has(source?.id))continue;const e=validateEvent(source,catalog,accumulator.snapshot);fresh.push(e);seen.add(e.id);accumulator.append(e)}
   pending.push(...fresh);publish('saving','');await run();if(state.status!=='saved')throw new Error(state.error);
  },
 };
}
