import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearningSync} from '../lib/course/sync.ts';
import {createBrowserRecovery} from '../lib/course/recovery.ts';
import {learningAccountScope,assertLearningAccountScope} from '../lib/course/account-scope.ts';
import {catalog} from '../lib/course/data.ts';
import {reduceEvents,validateEvent} from '../lib/course/records.ts';
import type {LearningEvent} from '../lib/course/types.ts';

function storage(){const values=new Map<string,string>();return {getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value)},removeItem:(key:string)=>{values.delete(key)}}}
function server(){let saved:LearningEvent[]=[];let online=true;let failAfterCommit=false;return {
 setOnline:(value:boolean)=>{online=value},failAfterCommit:()=>{failAfterCommit=true},events:()=>saved,
 transport:{load:async()=>{if(!online)throw new Error('offline');return saved},save:async(batch:LearningEvent[])=>{
  if(!online)throw new Error('offline');
  for(const raw of batch)if(!saved.some(e=>e.id===raw.id))saved.push(validateEvent(JSON.parse(JSON.stringify(raw)),catalog,reduceEvents(saved,catalog)));
  if(failAfterCommit){failAfterCommit=false;throw new Error('response lost')}
  return saved;
 }}
}}
const scope='a'.repeat(64);
test('authenticated offline exam answers and frozen deadline survive reload and reconciliation',async()=>{
 const disk=storage(),remote=server();const cache=()=>createBrowserRecovery(disk,scope);
 const first=createLearningSync(remote.transport,catalog,cache());await first.initialize();
 first.send('exam',{action:'start',sessionId:'offline-exam',paperId:'EX.B2.R1',paperVersion:'1.0.0',mode:'timed'});await first.retry();
 const original=first.getState().snapshot.exams['offline-exam'];const item=original.paper.listening[0].items[0];
 remote.setOnline(false);first.send('exam',{action:'answer',sessionId:original.id,itemId:item.id,answer:item.answers[0]});await first.retry();
 assert.equal(first.getState().hasPending,true);
 const reloaded=createLearningSync(remote.transport,catalog,cache());await reloaded.initialize();
 assert.equal(reloaded.getState().snapshot.exams[original.id].answers[item.id],item.answers[0]);
 assert.equal(reloaded.getState().snapshot.exams[original.id].partStartedAt,original.partStartedAt);
 remote.setOnline(true);await reloaded.retry();
 assert.equal(reloaded.getState().status,'saved');assert.equal(reloaded.getState().hasPending,false);
 assert.equal(remote.events().length,2);
});
test('a wholly offline start and submission survive reload with original event IDs',async()=>{
 const disk=storage(),remote=server();const first=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await first.initialize();remote.setOnline(false);
 const start=first.send('exam',{action:'start',sessionId:'offline-start',paperId:'EX.B2.R2',paperVersion:'1.0.0',mode:'timed'});await first.retry();
 first.send('exam',{action:'submit-part',sessionId:'offline-start',part:'listening'});await first.retry();
 const before=first.getState().snapshot.exams['offline-start'];
 const reloaded=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await reloaded.initialize();
 assert.equal(reloaded.getState().snapshot.exams['offline-start'].startedAt,start.at);
 assert.deepEqual(reloaded.getState().snapshot.exams['offline-start'].results,before.results);
 remote.setOnline(true);await reloaded.retry();assert.equal(remote.events()[0].id,start.id);assert.equal(remote.events().length,2);
});
test('server acknowledgments lost before reload do not duplicate replayed evidence',async()=>{
 const disk=storage(),remote=server();const first=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await first.initialize();remote.failAfterCommit();
 first.send('study',{chapterId:'G.A0.01',action:'view'});await first.retry();assert.equal(first.getState().hasPending,true);
 const reloaded=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await reloaded.initialize();
 assert.equal(remote.events().length,1);assert.equal(reloaded.getState().snapshot.study.length,1);assert.equal(reloaded.getState().hasPending,false);
});
test('account scopes isolate caches and reject a stale account before writes',async()=>{
 const a=await learningAccountScope('account-a'),b=await learningAccountScope('account-b');assert.notEqual(a,b);assert.throws(()=>assertLearningAccountScope(a,b),/аккаунт/i);
 const disk=storage(),remote=server();const first=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,a));await first.initialize();remote.setOnline(false);first.send('study',{chapterId:'G.A0.01',action:'view'});await first.retry();
 const second=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,b));await second.initialize();assert.equal(second.getState().snapshot.study.length,0);
 const recovered=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,a));await recovered.initialize();assert.equal(recovered.getState().snapshot.study.length,1);
});
test('logout during save locks the mounted account and preserves its private recovery',async()=>{
 const disk=storage();let reject!:(error:Error)=>void;const save=new Promise<LearningEvent[]>((_,r)=>{reject=r});
 const first=createLearningSync({load:async()=>[],save:async()=>save},catalog,createBrowserRecovery(disk,scope));await first.initialize();first.send('study',{chapterId:'G.A0.01',action:'view'});
 reject(Object.assign(new Error('Войдите снова'),{status:401}));await first.retry();
 assert.equal(first.getState().status,'signin');assert.equal(first.getState().snapshot.events.length,0);assert.throws(()=>first.send('study',{chapterId:'G.A0.01',action:'view'}),/перезагруз/i);
 const offline={load:async()=>{throw new Error('offline')},save:async()=>[]};
 const recovered=createLearningSync(offline,catalog,createBrowserRecovery(disk,scope));await recovered.initialize();assert.equal(recovered.getState().snapshot.study.length,1);
});
test('storage failure stays explicit while pending work remains in memory',async()=>{
 const remote=server();const disk={...storage(),setItem:()=>{throw new Error('QuotaExceeded')}};
 const first=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await first.initialize();remote.setOnline(false);first.send('study',{chapterId:'G.A0.01',action:'view'});await first.retry();
 assert.equal(first.getState().hasPending,true);assert.match(first.getState().recoveryWarning,/копи|вкладк/i);assert.equal(first.getState().snapshot.study.length,1);
});
test('two tabs of the same account retain separate offline queues',async()=>{
 const disk=storage(),otherDisk=storage(),remote=server();const first=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));const second=createLearningSync(remote.transport,catalog,createBrowserRecovery(otherDisk,scope));
 await first.initialize();await second.initialize();remote.setOnline(false);
 first.send('study',{chapterId:'G.A0.01',action:'view'});await first.retry();second.send('study',{chapterId:'G.A0.02',action:'view'});await second.retry();
 const reloadOne=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));const reloadTwo=createLearningSync(remote.transport,catalog,createBrowserRecovery(otherDisk,scope));
 await reloadOne.initialize();await reloadTwo.initialize();assert.equal(reloadOne.getState().snapshot.study[0].chapterId,'G.A0.01');assert.equal(reloadTwo.getState().snapshot.study[0].chapterId,'G.A0.02');
 remote.setOnline(true);await reloadOne.retry();await reloadTwo.retry();assert.equal(remote.events().length,2);
});
test('unreadable recovery bytes stay quarantined and the warning remains visible',async()=>{
 const disk=storage(),remote=server();remote.setOnline(false);const key='romana-course-recovery-v1:'+scope;disk.setItem(key,'{broken json');
 const reloaded=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await reloaded.initialize();
 assert.equal(disk.getItem(key),'{broken json');assert.match(reloaded.getState().recoveryWarning,/без изменений/);
 reloaded.send('study',{chapterId:'G.A0.01',action:'view'});await reloaded.retry();assert.equal(disk.getItem(key),'{broken json');assert.equal(reloaded.getState().hasPending,true);
});
test('one invalid pending event cannot overwrite valid unsent work in the recovery copy',async()=>{
 const disk=storage(),remote=server();const cache=createBrowserRecovery(disk,scope);const first=createLearningSync(remote.transport,catalog,cache);await first.initialize();remote.setOnline(false);first.send('study',{chapterId:'G.A0.01',action:'view'});await first.retry();
 const key='romana-course-recovery-v1:'+scope;const stored=JSON.parse(disk.getItem(key)!);stored.pending.push({id:'broken',type:'study',at:new Date().toISOString(),payload:{chapterId:'missing',action:'view'}});const raw=JSON.stringify(stored);disk.setItem(key,raw);
 const reloaded=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await reloaded.initialize();assert.equal(disk.getItem(key),raw);assert.match(reloaded.getState().recoveryWarning,/без изменений/);
});
test('conflicting offline answers are preserved for review without blocking unrelated saves',async()=>{
 const disk=storage(),remote=server();const first=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await first.initialize();
 first.send('exam',{action:'start',sessionId:'shared-exam',paperId:'EX.B2.R1',paperVersion:'1.0.0',mode:'timed'});await first.retry();
 const item=first.getState().snapshot.exams['shared-exam'].paper.listening[0].items[0];remote.setOnline(false);
 first.send('exam',{action:'answer',sessionId:'shared-exam',itemId:item.id,answer:item.answers[0]});await first.retry();
 first.send('study',{chapterId:'G.A0.01',action:'view'});await first.retry();
 remote.setOnline(true);const other=createLearningSync(remote.transport,catalog);await other.initialize();other.send('exam',{action:'submit-part',sessionId:'shared-exam',part:'listening'});await other.retry();
 const completed=other.getState().snapshot.exams['shared-exam'].results.listening;
 await first.retry();assert.equal(first.getState().status,'saved');assert.equal(first.getState().hasPending,false);assert.equal(first.getState().conflicts.length,1);assert.equal(first.getState().conflicts[0].event.payload.answer,item.answers[0]);
 assert.deepEqual(first.getState().snapshot.exams['shared-exam'].results.listening,completed);assert.equal(remote.events().filter(e=>e.type==='study').length,1);
 const reloaded=createLearningSync(remote.transport,catalog,createBrowserRecovery(disk,scope));await reloaded.initialize();assert.equal(reloaded.getState().conflicts.length,1);
});
