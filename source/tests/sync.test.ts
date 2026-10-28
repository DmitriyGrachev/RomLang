import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLearningSync} from '../lib/course/sync.ts';
import {reduceEvents,validateEvent} from '../lib/course/records.ts';
import type {Catalog} from '../lib/course/records.ts';
import type {LearningEvent,ExerciseItem} from '../lib/course/types.ts';
const item:ExerciseItem={id:'A1.03.e1',type:'gap',prompt:'Eu ___ Dima',answers:['sunt'],explanation:'fi',hint:'fi',tag:'a-fi',skill:'grammar'};
const otherItem:ExerciseItem={...item,id:'A1.03.e2',prompt:'Tu ___ aici',answers:['ești']};
const catalog:Catalog={exercises:new Map([[item.id,item],[otherItem.id,otherItem]]),lessonIds:new Set(['A1.03']),wordIds:new Set(['A1.d001','A1.d002']),missions:new Map(),lessonExercises:new Map([['A1.03',[item.id,otherItem.id]]])};
const ev=(id:string,type:LearningEvent['type'],payload:Record<string,unknown>):LearningEvent=>({id,type,payload,at:'2026-10-25T12:00:00.000Z'});
const deferred=<T>()=>{let resolve!:(x:T)=>void;let reject!:(e:Error)=>void;const promise=new Promise<T>((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
function sharedServer(){
 const events:LearningEvent[]=[];
 let failNextSave=false;
 const transport=()=>({
  load:async()=>[...events],
  save:async(batch:LearningEvent[])=>{
   if(failNextSave){failNextSave=false;throw new Error('offline')}
   for(const raw of batch){
    if(events.some(e=>e.id===raw.id))continue;
    events.push(validateEvent(raw,catalog,reduceEvents(events,catalog)));
   }
   return [...events];
  }
 });
 return {transport,failOnce:()=>{failNextSave=true}};
}
test('failed initial load retries loading before saving pending work',async()=>{let first=true;let saved:LearningEvent[]=[];const old=ev('old','word',{wordId:'A1.d001',saved:true});const store=createLearningSync({load:async()=>{if(first){first=false;throw new Error('offline')}return [old,...saved]},save:async e=>{saved.push(...e);return [old,...saved]}},catalog);await store.initialize();assert.equal(store.getState().status,'error');store.send('attempt',{exerciseId:item.id,answer:'sunt'});await store.retry();assert.equal(store.getState().snapshot.savedWords[0],'A1.d001');assert.equal(store.getState().snapshot.xp,5);assert.equal(store.getState().status,'saved');assert.equal(store.getState().hasPending,false)});
test('draft enters recoverable memory immediately and latest text survives navigation',async()=>{const store=createLearningSync({load:async()=>[],save:async e=>e},catalog);await store.initialize();store.send('draft',{key:item.id,text:'s'});store.send('draft',{key:item.id,text:'sunt'});assert.equal(store.getState().hasPending,true);assert.equal(store.getState().snapshot.drafts[item.id],'sunt');await store.retry();assert.equal(store.getState().snapshot.drafts[item.id],'sunt')});
test('refresh and saving are serialized so stale GET cannot roll back acknowledged work',async()=>{const slow=deferred<LearningEvent[]>();let loads=0;let saved:LearningEvent[]=[];const store=createLearningSync({load:async()=>++loads===1?[]:slow.promise,save:async e=>{saved.push(...e);return saved}},catalog);await store.initialize();const refresh=store.refresh();store.send('attempt',{exerciseId:item.id,answer:'sunt'});slow.resolve([]);await refresh;await store.retry();assert.equal(store.getState().snapshot.xp,5);assert.equal(store.getState().snapshot.events.length,1);assert.equal(store.getState().status,'saved')});
test('restoring after failed POST flushes pending work and never falsely marks it saved',async()=>{let fail=true;let saved:LearningEvent[]=[];const store=createLearningSync({load:async()=>saved,save:async e=>{if(fail)throw new Error('offline');for(const x of e)if(!saved.some(y=>y.id===x.id))saved.push(x);return saved}},catalog);await store.initialize();store.send('attempt',{exerciseId:item.id,answer:'sunt'});await store.retry();assert.equal(store.getState().hasPending,true);fail=false;await store.restore([ev('word','word',{wordId:'A1.d001',saved:true})]);assert.equal(store.getState().hasPending,false);assert.equal(store.getState().status,'saved');assert.equal(store.getState().snapshot.xp,5);assert.equal(store.getState().snapshot.savedWords.length,1)});
test('retrying an idle store does not stall the next save',async()=>{let saved:LearningEvent[]=[];const store=createLearningSync({load:async()=>saved,save:async e=>{saved.push(...e);return saved}},catalog);await store.initialize();await store.retry();store.send('attempt',{exerciseId:item.id,answer:'sunt'});await store.retry();assert.equal(store.getState().snapshot.xp,5);assert.equal(store.getState().hasPending,false)});
test('preview in an insecure context works without crypto.randomUUID',async()=>{const descriptor=Object.getOwnPropertyDescriptor(crypto,'randomUUID');Object.defineProperty(crypto,'randomUUID',{value:undefined,configurable:true});try{const store=createLearningSync({load:async()=>[],save:async e=>e},catalog);await store.initialize();const e=store.send('attempt',{exerciseId:item.id,answer:'sunt'});await store.retry();assert.match(e.id,/^[a-f0-9]{32}$/);assert.equal(store.getState().snapshot.xp,5)}finally{if(descriptor)Object.defineProperty(crypto,'randomUUID',descriptor);else delete (crypto as any).randomUUID}});
test('two clients exchange saved answers, drafts and words through refresh without duplicate XP',async()=>{
 const server=sharedServer();
 const laptop=createLearningSync(server.transport(),catalog);
 const phone=createLearningSync(server.transport(),catalog);
 await Promise.all([laptop.initialize(),phone.initialize()]);

 laptop.send('attempt',{exerciseId:item.id,answer:'sunt'});
 laptop.send('draft',{key:otherItem.id,text:'eș'});
 laptop.send('word',{wordId:'A1.d001',saved:true});
 await laptop.retry();
 assert.equal(laptop.getState().hasPending,false);
 await phone.refresh();
 assert.equal(phone.getState().snapshot.attempts[item.id][0].answer,'sunt');
 assert.equal(phone.getState().snapshot.drafts[otherItem.id],'eș');
 assert.deepEqual(phone.getState().snapshot.savedWords,['A1.d001']);
 assert.equal(phone.getState().snapshot.xp,5);

 phone.send('attempt',{exerciseId:item.id,answer:'sunt'});
 phone.send('attempt',{exerciseId:otherItem.id,answer:'ești'});
 phone.send('draft',{key:item.id,text:'s'});
 phone.send('word',{wordId:'A1.d002',saved:true});
 await phone.retry();
 await laptop.refresh();
 const state=laptop.getState();
 assert.equal(state.snapshot.attempts[item.id].length,2);
 assert.equal(state.snapshot.attempts[otherItem.id][0].answer,'ești');
 assert.equal(state.snapshot.drafts[item.id],'s');
 assert.deepEqual(state.snapshot.savedWords,['A1.d001','A1.d002']);
 assert.equal(state.snapshot.xp,10);
 assert.equal(state.hasPending,false);
 assert.equal(state.status,'saved');
});
test('failed save remains pending and invisible to the other client until retry succeeds',async()=>{
 const server=sharedServer();
 const laptop=createLearningSync(server.transport(),catalog);
 const phone=createLearningSync(server.transport(),catalog);
 await Promise.all([laptop.initialize(),phone.initialize()]);
 server.failOnce();
 laptop.send('attempt',{exerciseId:item.id,answer:'sunt'});
 await laptop.retry();
 assert.equal(laptop.getState().status,'error');
 assert.equal(laptop.getState().hasPending,true);
 assert.equal(laptop.getState().snapshot.xp,5);
 await phone.refresh();
 assert.equal(phone.getState().snapshot.xp,0);
 assert.equal(phone.getState().snapshot.events.length,0);
 await laptop.retry();
 assert.equal(laptop.getState().status,'saved');
 assert.equal(laptop.getState().hasPending,false);
 await phone.refresh();
 assert.equal(phone.getState().snapshot.xp,5);
});
