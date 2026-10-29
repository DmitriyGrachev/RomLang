import {test} from 'node:test';
import assert from 'node:assert/strict';
import {selectLearningBatch} from '../lib/course/sync.ts';
import type {LearningEvent} from '../lib/course/types.ts';
test('large immutable exam snapshots are batched by actual UTF-8 request size and retain order',()=>{
 const pending=Array.from({length:8},(_,i)=>({id:String(i),type:'exam',at:'2026-10-25T12:00:00Z',payload:{text:'ș'.repeat(80)}} as LearningEvent));
 const first=selectLearningBatch(pending,100,700);assert.equal(first.length,2);assert.deepEqual(first.map(e=>e.id),['0','1']);assert.ok(new TextEncoder().encode(JSON.stringify({events:first})).length<=700);
 assert.deepEqual(selectLearningBatch(pending,1,700).map(e=>e.id),['0']);
 assert.throws(()=>selectLearningBatch(pending,100,30));
});
