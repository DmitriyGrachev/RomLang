import test from 'node:test';
import assert from 'node:assert/strict';
import {academyUnits,academyExercises,academyWords} from '../lib/course/academy.ts';
import {catalog,exerciseOwner,wordMap,wordRecallMap,practiceExerciseMap} from '../lib/course/data.ts';
import {emptySnapshot,validateEvent,reduceEvents} from '../lib/course/records.ts';
import {reviewableExercises} from '../lib/course/clinic.ts';

test('academy items support server grading, separate banks, useful review context and all dictionary recalls',()=>{
 for(const e of academyExercises){assert.ok(catalog.exercises.has(e.id));assert.ok(practiceExerciseMap.has(e.id));assert.ok(exerciseOwner.get(e.id)?.startsWith('ACA.'));const result=validateEvent({id:'check',at:'2026-10-27T10:00:00Z',type:'attempt',payload:{exerciseId:e.id,answer:e.answers[0],result:{correct:false}}},catalog,emptySnapshot());assert.equal((result.payload.result as {correct:boolean}).correct,true)}
 for(const u of academyUnits)for(const r of u.readings)for(const e of r.questions){assert.equal(e.skill,'reading');assert.equal(catalog.exercises.get(e.id)?.text,r.text)}
 assert.equal(reviewableExercises(emptySnapshot(),academyExercises,new Set(practiceExerciseMap.keys())).length,0);
 for(const w of academyWords){assert.equal(wordMap.get(w.id),w);assert.ok(wordRecallMap.get(w.id)?.answers.includes(w.word))}
 assert.equal(wordRecallMap.size,wordMap.size);
});
test('academy writing drafts and checks coexist with historic lesson progress through replay',()=>{
 const u=academyUnits[0];assert.ok(u);const s=emptySnapshot();const exercise=u.checkpoint[0];
 const attempt=validateEvent({id:'new-control',at:'2026-10-27T10:00:00Z',type:'attempt',payload:{exerciseId:exercise.id,answer:exercise.answers[0]}},catalog,s);
 const writing=validateEvent({id:'new-writing',at:'2026-10-27T11:00:00Z',type:'writing',payload:{taskId:u.writing.id,action:'revision',text:'Un text propriu.',criteria:[0],modelViewed:false}},catalog,s);
 const history=reduceEvents([attempt,writing,attempt],catalog);assert.equal(history.events.length,2);assert.equal(history.writing[u.writing.id].revisions.length,1);assert.equal(history.attempts[exercise.id].length,1);assert.equal(Object.keys(history.completed).length,0);
 assert.throws(()=>validateEvent({id:'invalid-finish',at:'2026-10-27T12:00:00Z',type:'finish',payload:{lessonId:u.id}},catalog,history),/все задания/);
});
