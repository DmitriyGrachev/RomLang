import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot,reduceEvents,validateEvent} from '../lib/course/records.ts';
import {scheduleWordPractice,wordReviewKey} from '../lib/course/word-memory.ts';
import {createLearningSync} from '../lib/course/sync.ts';
import type {Catalog} from '../lib/course/records.ts';
import type {LearningEvent} from '../lib/course/types.ts';

const id='A1.d001';
const catalog:Catalog={exercises:new Map(),lessonIds:new Set(),wordIds:new Set([id,'A1.d002']),missions:new Map(),lessonExercises:new Map(),wordRecall:new Map([[id,{wordId:id,prompt:'Переведи: я (личное местоимение)',answers:['eu'],note:'Местоимение.'}]])};
const at='2026-10-28T12:00:00.000Z';
const event=(eid:string,payload:Record<string,unknown>,date=at):LearningEvent=>({id:eid,type:'wordReview',at:date,payload});
const ingest=(eid:string,payload:Record<string,unknown>,date=at)=>validateEvent(event(eid,payload,date),catalog,emptySnapshot());

test('recognition requires a boolean and curated recall requires a bounded answer',()=>{
 assert.throws(()=>ingest('a',{wordId:id,mode:'recognition',recalled:'true'}),/вспомнил|оценк/i);
 assert.throws(()=>ingest('a',{wordId:id,mode:'recall',answer:''}),/ответ/i);
 const revealed=ingest('reveal',{wordId:id,mode:'recall',answer:'',assisted:true});
 assert.deepEqual(revealed.payload.result,{correct:false,spelling:false,canonical:'eu'});
 assert.throws(()=>ingest('a',{wordId:id,mode:'recall',answer:'a'.repeat(201)}),/текст|ответ/i);
 assert.throws(()=>ingest('a',{wordId:'A1.d002',mode:'recall',answer:'eu'}),/слово|воспроизведен/i);
 assert.throws(()=>ingest('a',{wordId:'unknown',mode:'recognition',recalled:true}),/слово/i);
 assert.throws(()=>ingest('a',{wordId:id,mode:'other',recalled:true}),/режим/i);
});

test('client result, source and correct cannot forge checked recall; missing diacritics preserve canonical',()=>{
 const e=ingest('a',{wordId:id,mode:'recall',answer:'greșit',result:{correct:true},source:'self',correct:true});
 assert.deepEqual(e.payload.result,{correct:false,spelling:false,canonical:'eu'});
 assert.equal(e.payload.source,'checked');
 const self=ingest('b',{wordId:id,mode:'recognition',recalled:false,result:{correct:true},source:'checked',correct:true});
 assert.equal((self.payload.result as {correct:boolean}).correct,false);
 assert.equal(self.payload.source,'self');
 const accented={...catalog,wordRecall:new Map([[id,{wordId:id,prompt:'Как сказать «страна»?',answers:['țară'],note:''}]])};
 const typo=validateEvent(event('c',{wordId:id,mode:'recall',answer:'tara'}),accented,emptySnapshot());
 assert.deepEqual(typo.payload.result,{correct:true,spelling:true,canonical:'țară'});
});

test('review schedules are isolated by direction and duplicate events have no effect or XP',()=>{
 const recognition=ingest('a',{wordId:id,mode:'recognition',recalled:true});
 const recall=ingest('b',{wordId:id,mode:'recall',answer:'wrong'});
 const s=reduceEvents([recognition,recognition,recall],catalog);
 assert.equal(wordReviewKey(id,'recognition'),id+':recognition');
 assert.equal(s.wordAttempts[id].length,2);
 assert.equal(s.wordAttempts[id][0].source,'self');
 assert.equal(s.wordAttempts[id][1].source,'checked');
 assert.equal(s.wordReviews[id+':recognition'].due,'2026-10-29T12:00:00.000Z');
 assert.equal(s.wordReviews[id+':recall'].due,at);
 assert.equal(s.wordReviews[id+':recognition'].attempts,1);
 assert.equal(s.xp,0);
});

test('failure, assistance, early and due success follow bounded spaced stages',()=>{
 const first=scheduleWordPractice(undefined,true,false,at);
 assert.deepEqual(first,{due:'2026-10-29T12:00:00.000Z',streak:1,lastAt:at,attempts:1});
 const early=scheduleWordPractice(first,true,false,'2026-10-28T13:00:00.000Z');
 assert.equal(early.streak,1);
 assert.equal(early.due,first.due);
 assert.equal(early.attempts,2);
 const due=scheduleWordPractice(early,true,false,first.due);
 assert.equal(due.streak,2);
 assert.equal(due.due,'2026-11-01T12:00:00.000Z');
 const assisted=scheduleWordPractice(due,true,true,'2026-10-30T12:00:00.000Z');
 assert.equal(assisted.streak,0);
 assert.equal(assisted.due,'2026-10-31T12:00:00.000Z');
 const failure=scheduleWordPractice(assisted,false,false,'2026-10-30T13:00:00.000Z');
 assert.equal(failure.streak,0);
 assert.equal(failure.due,'2026-10-30T13:00:00.000Z');
 const stale=scheduleWordPractice(due,false,false,'2026-10-28T12:00:00.000Z');
 assert.equal(stale.due,due.due);
 assert.equal(stale.lastAt,due.lastAt);
 assert.equal(stale.attempts,due.attempts+1);
 let cap:ReturnType<typeof scheduleWordPractice>|undefined;
 for(let i=0;i<8;i++)cap=scheduleWordPractice(cap,true,false,cap?.due??at);
 assert.ok(cap);
 assert.equal(cap.streak,8);
 assert.equal(Date.parse(cap.due)-Date.parse(cap.lastAt),30*86400000);
});

test('old histories start with empty word defaults and checked grades replay unchanged',()=>{
 const old={id:'old',type:'attempt' as const,at,payload:{exerciseId:'unknown',answer:'sunt',result:{correct:true,spelling:false,canonical:'sunt'},courseVersion:'1.1.0'}};
 const s=reduceEvents([old],catalog);
 assert.deepEqual(s.wordAttempts,{});
 assert.deepEqual(s.wordReviews,{});
 const checked=ingest('a',{wordId:id,mode:'recall',answer:'eu'});
 const revised={...catalog,wordRecall:new Map([[id,{wordId:id,prompt:'revised',answers:['este'],note:''}]])};
 const replay=reduceEvents([checked],revised);
 assert.equal(replay.wordAttempts[id][0].correct,true);
 assert.equal(replay.wordAttempts[id][0].canonical,'eu');
});

test('sync reload and export/restore preserve reviewed history with duplicate-safe IDs',async()=>{
 let events:LearningEvent[]=[];
 const transport={load:async()=>events,save:async(batch:LearningEvent[])=>{for(const e of batch)if(!events.some(x=>x.id===e.id))events.push(e);return events}};
 const first=createLearningSync(transport,catalog);
 await first.initialize();
 const self=first.send('wordReview',{wordId:id,mode:'recognition',recalled:true});
 first.send('wordReview',{wordId:id,mode:'recall',answer:'eu'});
 await first.retry();
 const exported=first.getState().snapshot.events;
 assert.equal(exported.length,2);
 const reload=createLearningSync(transport,catalog);
 await reload.initialize();
 assert.equal(reload.getState().snapshot.wordAttempts[id].length,2);
 events=[];
 const restored=createLearningSync(transport,catalog);
 await restored.initialize();
 await restored.restore([...exported,exported[0]]);
 assert.equal(restored.getState().snapshot.wordAttempts[id].length,2);
 assert.equal(restored.getState().snapshot.xp,0);
 assert.equal(restored.getState().snapshot.events[0].id,self.id);
});
