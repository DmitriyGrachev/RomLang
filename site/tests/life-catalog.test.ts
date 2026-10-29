import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalog,lifeUnits,lifeExerciseMap,examExerciseMap,exerciseMap,exerciseOwner,lessonMap,practiceExerciseMap,practiceTopics,theoryExtensions,coverageAudit} from '../lib/course/data.ts';
import {emptySnapshot,validateEvent,reduceEvents} from '../lib/course/records.ts';
import {reviewableExercises} from '../lib/course/clinic.ts';
import {reviewSources,roundResults} from '../lib/course/round.ts';
import {startBankRound,restoreBankRound} from '../lib/course/life.ts';
test('all life/exam items are graded with real owners but excluded from core completion',()=>{
 assert.equal(lifeUnits.length,16);assert.equal(lifeExerciseMap.size,256);assert.equal(examExerciseMap.size,40);assert.equal(practiceTopics.length,4);assert.equal(theoryExtensions.size,46);assert.equal(coverageAudit.length,96);
 const core=new Set([...catalog.lessonExercises.values()].flat());
 for(const [id,item] of [...lifeExerciseMap,...examExerciseMap]){
  assert.equal(exerciseMap.get(id),item);assert.equal(catalog.exercises.get(id),item);assert.equal(practiceExerciseMap.get(id),item);assert.ok(lessonMap.has(exerciseOwner.get(id)!));assert.equal(core.has(id),false);
  const event=validateEvent({id:'bank-attempt',type:'attempt',at:'2026-10-27T12:00:00Z',payload:{exerciseId:id,answer:item.answers[0]}},catalog,emptySnapshot());assert.equal((event.payload.result as {correct:boolean}).correct,true);
 }
 for(const [id,lesson] of lessonMap)assert.deepEqual(catalog.lessonExercises.get(id),lesson.exercises.map(e=>e.id));
});
test('generic review excludes all unseen banks, includes attempted errors and due, and cannot finish anchor from banks',()=>{
 const s=emptySnapshot();const item=lifeUnits[0].exercises[0];const at='2026-10-27T12:00:00Z';
 const bad=validateEvent({id:'bank-failure',type:'attempt',at,payload:{exerciseId:item.id,answer:'нет такого ответа'}},catalog,s);
 const tried=reduceEvents([bad],catalog);tried.reviews[item.id]={due:at,streak:0};
 const sources=reviewSources(tried,reviewableExercises(tried,[...exerciseMap.values()],new Set(practiceExerciseMap.keys())),new Date('2026-10-28T12:00:00Z'));
 assert.ok(sources.errors.includes(item.id));assert.ok(sources.due.includes(item.id));assert.equal(sources.fresh.some(id=>practiceExerciseMap.has(id)),false);
 assert.throws(()=>validateEvent({id:'invalid-finish',type:'finish',at,payload:{lessonId:lifeUnits[0].anchorLessonId}},catalog,tried),/все задания/);
});
test('replay baseline survives refresh and excludes prior run outcomes from results',()=>{
 const s=emptySnapshot();const item=lifeUnits[0].exercises[0];const ids=lifeUnits[0].exercises.map(e=>e.id);
 const event=validateEvent({id:'first-run',type:'attempt',at:'2026-10-27T12:00:00Z',payload:{exerciseId:item.id,answer:item.answers[0]}},catalog,s);const history=reduceEvents([event],catalog);
 const replay=startBankRound('bank',ids,history,false);const restored=restoreBankRound(JSON.stringify(replay),'bank',ids,history)!;
 assert.deepEqual(roundResults(restored.ids,restored.baseline,history),{answered:0,correct:0,retried:0,assisted:0});
 const second=validateEvent({id:'second-run',type:'attempt',at:'2026-10-28T12:00:00Z',payload:{exerciseId:item.id,answer:'wrong'}},catalog,history);const current=reduceEvents([event,second],catalog);
 assert.deepEqual(roundResults(restored.ids,restored.baseline,current),{answered:1,correct:0,retried:0,assisted:0});
});
