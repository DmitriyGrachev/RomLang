import test from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot,createAccumulator,validateEvent,reduceEvents} from '../lib/course/records.ts';
import {createLearningSync} from '../lib/course/sync.ts';
import type {Catalog} from '../lib/course/records.ts';
import type {LearningEvent} from '../lib/course/types.ts';
const taskId='ACA.A1.01.write';
const catalog:Catalog={exercises:new Map(),lessonIds:new Set(),wordIds:new Set(),missions:new Map(),lessonExercises:new Map(),writingTasks:new Map([[taskId,3]])};
const event=(id:string,payload:Record<string,unknown>):LearningEvent=>({id,type:'writing',at:'2026-10-25T12:00:00.000Z',payload:{taskId,action:'draft',text:'Eu sunt Ana.',criteria:[],modelViewed:false,...payload}});

test('writing validates registered tasks, bounded text, action and unique rubric indices',()=>{
 for(const payload of [{taskId:'unknown'},{text:'x'.repeat(20001)},{text:123},{criteria:[-1]},{criteria:[3]},{criteria:[1.2]},{criteria:['1']},{criteria:[0,0]},{criteria:null},{action:'other'},{action:'revision',text:'  '},{modelViewed:'yes'}])assert.throws(()=>validateEvent(event('bad',payload),catalog,emptySnapshot()));
 assert.doesNotThrow(()=>validateEvent(event('max',{text:'x'.repeat(20000),criteria:[0,2]}),catalog,emptySnapshot()));
});

test('drafts replace latest writing, model exposure stays sticky and revisions replay in order capped at 30',()=>{
 const acc=createAccumulator(catalog);const send=(id:string,payload:Record<string,unknown>)=>acc.append(validateEvent(event(id,payload),catalog,acc.snapshot));
 send('view',{modelViewed:true});send('draft',{text:'nou',criteria:[1]});assert.equal(acc.snapshot.writing[taskId].modelViewed,true);assert.equal(acc.snapshot.writing[taskId].revisions.length,0);
 for(let i=0;i<32;i++)send('revision.'+i,{action:'revision',text:'Version '+i,criteria:[0,2]});
 const record=acc.snapshot.writing[taskId];assert.equal(record.text,'Version 31');assert.deepEqual(record.criteria,[0,2]);assert.equal(record.modelViewed,true);assert.equal(record.revisions.length,30);assert.equal(record.revisions[0].id,'revision.2');assert.equal(record.revisions[29].at,'2026-10-25T12:00:00.000Z');assert.equal(record.revisions[0].modelViewed,true);
 const replay=reduceEvents([...acc.snapshot.events,acc.snapshot.events[2]],catalog);assert.deepEqual(replay.writing,acc.snapshot.writing);
});

test('sync coalesces only unsent writing drafts and preserves every revision through reload and restore',async()=>{
 let saved:LearningEvent[]=[];const batches:LearningEvent[][]=[];
 const transport={load:async()=>saved,save:async(batch:LearningEvent[])=>{batches.push(batch);saved=[...saved,...batch];return saved}};
 const sync=createLearningSync(transport,catalog);await sync.initialize();
 sync.send('writing',event('a',{text:'a',modelViewed:true}).payload);sync.send('writing',event('b',{text:'ab'}).payload);
 assert.equal(sync.getState().snapshot.writing[taskId].text,'ab');assert.equal(sync.getState().snapshot.events.length,1);assert.equal(sync.getState().snapshot.writing[taskId].modelViewed,true);
 sync.send('writing',event('c',{action:'revision',text:'first'}).payload);sync.send('writing',event('d',{action:'revision',text:'second'}).payload);await sync.retry();
 assert.equal(saved.filter(e=>e.type==='writing'&&e.payload.action==='draft').length,1);assert.equal(saved.filter(e=>e.payload.action==='revision').length,2);
 const reload=createLearningSync(transport,catalog);await reload.initialize();assert.equal(reload.getState().snapshot.writing[taskId].revisions.length,2);
 const exported=reload.getState().snapshot.events;saved=[];const restored=createLearningSync(transport,catalog);await restored.initialize();await restored.restore([...exported,exported[0]]);assert.deepEqual(restored.getState().snapshot.writing,reload.getState().snapshot.writing);assert.ok(batches.length);
});
