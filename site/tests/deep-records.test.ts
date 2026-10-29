import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot,validateEvent,reduceEvents} from '../lib/course/records.ts';
import {createLearningSync} from '../lib/course/sync.ts';
import type {DeepChapter} from '../lib/course/deep-types.ts';
import type {LearningEvent} from '../lib/course/types.ts';
const chapter={id:'G.A1.01',objectives:[{id:'G.A1.01.o1',label:'fi',skill:'grammar'}],exercises:[{id:'G.A1.01.e1',objectiveId:'G.A1.01.o1',familyId:'one',mode:'practice',kind:'gap',answers:['sunt']}],listening:{questions:[{prompt:'Unde?',answers:['București']}],transferQuestions:[{prompt:'Unde?',answers:['Cluj']} ]}} as DeepChapter;
const catalog={exercises:new Map(),lessonIds:new Set<string>(),wordIds:new Set<string>(['word']),missions:new Map(),lessonExercises:new Map(),studyChapters:new Map([[chapter.id,chapter]])};
const event=(id:string,type:string,payload:Record<string,unknown>)=>({id,type,payload,at:'2026-10-26T12:00:00Z'}) as LearningEvent;
test('new study events coexist with legacy records and duplicate event IDs remain idempotent',()=>{
 const old=event('old','word',{wordId:'word',saved:true});
 const raw=event('new','study',{chapterId:chapter.id,action:'attempt',exerciseId:'G.A1.01.e1',answer:'sunt',status:'incorrect'});
 const checked=validateEvent(raw,catalog,emptySnapshot());
 const state=reduceEvents([old,checked,checked],catalog);
 assert.deepEqual(state.savedWords,['word']);assert.equal(state.events.length,2);assert.equal(state.study.length,1);assert.equal(state.study[0].status,'correct');
 assert.equal(state.xp,0);
});
test('export and repeated restore preserve old and new history without duplicates',async()=>{
 let saved:LearningEvent[]=[];
 const transport={load:async()=>saved,save:async(batch:LearningEvent[])=>{for(const e of batch)if(!saved.some(x=>x.id===e.id))saved.push(e);return saved;}};
 const sync=createLearningSync(transport,catalog);await sync.initialize();
 const data=[event('old','word',{wordId:'word',saved:true}),event('view','study',{chapterId:chapter.id,action:'view'})];
 await sync.restore(data);await sync.restore(data);
 assert.equal(sync.getState().snapshot.study.length,1);assert.equal(sync.getState().snapshot.events.length,2);
 saved=JSON.parse(JSON.stringify(saved));const restored=reduceEvents(saved,catalog);assert.equal(restored.study[0].chapterId,chapter.id);assert.deepEqual(restored.savedWords,['word']);
});
test('new studio drafts coalesce without losing a saved version or the transfer draft',async()=>{
 let saved:LearningEvent[]=[];const sync=createLearningSync({load:async()=>saved,save:async batch=>{saved.push(...batch);return saved}},catalog);await sync.initialize();
 sync.send('study',{chapterId:chapter.id,action:'writing',scenario:'main',answer:'Версия до правки'});await sync.retry();
 sync.send('study',{chapterId:chapter.id,action:'draft',skill:'writing',scenario:'main',answer:'P'});
 sync.send('study',{chapterId:chapter.id,action:'draft',skill:'writing',scenario:'main',answer:'Prima versiune'});
 sync.send('study',{chapterId:chapter.id,action:'draft',skill:'writing',scenario:'transfer',answer:'Un alt context'});
 await sync.retry();assert.equal(saved.filter(e=>e.payload.action==='draft').length,2);assert.equal(sync.getState().snapshot.study.find(e=>e.action==='draft'&&e.scenario==='main')?.answer,'Prima versiune');assert.equal(sync.getState().snapshot.study.find(e=>e.action==='writing')?.answer,'Версия до правки');
});
test('listening answers survive client validation, server validation and exported restore',async()=>{
 let saved:LearningEvent[]=[];
 const transport={load:async()=>saved,save:async(batch:LearningEvent[])=>{
  for(const raw of batch){const checked=validateEvent(JSON.parse(JSON.stringify(raw)),catalog,reduceEvents(saved,catalog));if(!saved.some(e=>e.id===checked.id))saved.push(checked)}
  return saved;
 }};
 const sync=createLearningSync(transport,catalog);await sync.initialize();
 sync.send('study',{chapterId:chapter.id,action:'listening',scenario:'main',answers:['București']});await sync.retry();
 assert.equal(sync.getState().status,'saved');assert.equal(saved.length,1);assert.equal(sync.getState().snapshot.study[0].score,1);
 const exportData=JSON.parse(JSON.stringify(saved));saved=[];
 const restored=createLearningSync(transport,catalog);await restored.initialize();await restored.restore(exportData);
 assert.equal(restored.getState().snapshot.study[0].score,1);assert.equal(restored.getState().snapshot.study[0].answer,'["București"]');
});
