import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot,reduceEvents,validateEvent} from '../lib/course/records.ts';
import {createLearningSync} from '../lib/course/sync.ts';
import {examPapers,examPaperRegistry,examProfile,examProfileRegistry} from '../lib/course/exams.ts';
import type {LearningEvent} from '../lib/course/types.ts';
const catalog={exercises:new Map(),lessonIds:new Set<string>(),wordIds:new Set<string>(),missions:new Map(),lessonExercises:new Map(),examPapers:examPaperRegistry,examProfile,examProfiles:examProfileRegistry};
const paper=examPapers[0];const at='2026-10-25T12:00:00.000Z';
function event(id:string,payload:Record<string,unknown>):LearningEvent{return {id,type:'exam',at,payload}}
test('serialized exam start and answers restore by registered version and keep completed scores unchanged',async()=>{
 let saved:LearningEvent[]=[];const sync=createLearningSync({load:async()=>saved,save:async batch=>{saved.push(...batch);return saved}},catalog);await sync.initialize();
 const start=validateEvent(event('start',{action:'start',sessionId:'mock-one',paperId:paper.id,paperVersion:paper.version,mode:'learning'}),catalog,emptySnapshot());
 const s=reduceEvents([start],catalog);const item=paper.listening[0].items[0];const answer=validateEvent(event('answer',{action:'answer',sessionId:'mock-one',itemId:item.id,answer:item.answers[0]}),catalog,s);
 const before=reduceEvents([start,answer],catalog);const submit=validateEvent(event('submit',{action:'submit-part',sessionId:'mock-one',part:'listening'}),catalog,before);
 const exported=JSON.parse(JSON.stringify([start,answer,submit]));await sync.restore(exported);await sync.restore(exported);
 const restored=sync.getState().snapshot.exams['mock-one'];assert.equal(saved.length,3);assert.equal(restored.answers[item.id],item.answers[0]);assert.equal(restored.results.listening?.score,1);assert.equal(restored.partIndex,1);assert.equal(restored.paper.version,paper.version);assert.equal(restored.profile.version,examProfile.version);
});
test('answer autosave coalesces within an item without losing another item or session start',async()=>{
 let saved:LearningEvent[]=[];const sync=createLearningSync({load:async()=>saved,save:async batch=>{saved.push(...batch);return saved}},catalog);await sync.initialize();
 sync.send('exam',{action:'start',sessionId:'mock-two',paperId:paper.id,paperVersion:paper.version,mode:'learning'});await sync.retry();
 const [one,two]=paper.listening[0].items;
 sync.send('exam',{action:'answer',sessionId:'mock-two',itemId:one.id,answer:'first'});sync.send('exam',{action:'answer',sessionId:'mock-two',itemId:one.id,answer:'final'});sync.send('exam',{action:'answer',sessionId:'mock-two',itemId:two.id,answer:'other'});await sync.retry();
 assert.equal(saved.filter(e=>e.payload.action==='answer').length,2);assert.equal(sync.getState().snapshot.exams['mock-two'].answers[one.id],'final');assert.equal(sync.getState().snapshot.exams['mock-two'].answers[two.id],'other');
});
