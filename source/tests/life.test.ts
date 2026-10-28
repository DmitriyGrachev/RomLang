import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot} from '../lib/course/records.ts';
import {bankOwners,firstUnattempted,restoreBankRound,startBankRound,advanceBankRound} from '../lib/course/life.ts';
const exercises=[{id:'A1.22.e501'},{id:'A1.22.e502'},{id:'A1.22.e503'}];
test('banks resolve to real lesson anchors without becoming core completion items',()=>{
 const owners=bankOwners([{anchorLessonId:'A1.22',exercises}]);
 assert.equal(owners.get(exercises[0].id),'A1.22');
 const core=['A1.22.e1','A1.22.e2'];
 assert.deepEqual(core.filter(id=>owners.has(id)),[]);
});
test('resume chooses first unattempted regardless of correctness and detects finished banks',()=>{
 const s=emptySnapshot();s.attempts[exercises[0].id]=[{} as never];
 assert.equal(firstUnattempted(exercises.map(e=>e.id),s),1);
 for(const e of exercises)s.attempts[e.id]=[{} as never];
 assert.equal(firstUnattempted(exercises.map(e=>e.id),s),3);
});
test('round freezes IDs and baseline, advances, and validates refresh resume metadata',()=>{
 const s=emptySnapshot();const ids=exercises.map(e=>e.id);const r=startBankRound('LIFE.A1.SHOP',ids,s,false);
 ids.reverse();assert.equal(r.ids[0],exercises[0].id);assert.equal(r.baseline[r.ids[0]],0);
 assert.equal(advanceBankRound(r,{...s,attempts:{[r.ids[0]]:[{} as never]}}).index,1);
 assert.deepEqual(restoreBankRound(JSON.stringify(r),'LIFE.A1.SHOP',exercises.map(e=>e.id),s),r);
 assert.equal(restoreBankRound(JSON.stringify({...r,ids:['foreign']}),'LIFE.A1.SHOP',exercises.map(e=>e.id),s),undefined);
 assert.equal(restoreBankRound('{broken','LIFE.A1.SHOP',exercises.map(e=>e.id),s),undefined);
});
test('replay starts at zero with current attempts as baseline; history resume uses all attempts',()=>{
 const s=emptySnapshot();s.attempts[exercises[0].id]=[{} as never,{} as never];
 const resume=startBankRound('bank',exercises.map(e=>e.id),s,true);
 assert.equal(resume.index,1);assert.equal(resume.baseline[exercises[0].id],0);
 const replay=startBankRound('bank',exercises.map(e=>e.id),s,false);
 assert.equal(replay.index,0);assert.equal(replay.baseline[exercises[0].id],2);
});
test('out-of-order history resumes the earliest missing item',()=>{
 const s=emptySnapshot();s.attempts[exercises[2].id]=[{} as never];
 assert.equal(firstUnattempted(exercises.map(e=>e.id),s),0);
 s.attempts[exercises[0].id]=[{} as never];
 assert.equal(firstUnattempted(exercises.map(e=>e.id),s),1);
});
test('refresh rejects future, negative, or missing baselines and a different bank',()=>{
 const s=emptySnapshot();const ids=exercises.map(e=>e.id);const r=startBankRound('bank',ids,s,false);
 for(const baseline of [{},Object.fromEntries(ids.map(id=>[id,-1])),Object.fromEntries(ids.map(id=>[id,1]))])assert.equal(restoreBankRound(JSON.stringify({...r,baseline}),'bank',ids,s),undefined);
 assert.equal(restoreBankRound(JSON.stringify(r),'other',ids,s),undefined);
});
test('refresh resumes after checked answers without making a new attempt or losing run baseline',()=>{
 const s=emptySnapshot();const ids=exercises.map(e=>e.id);const r=startBankRound('bank',ids,s,false);
 s.attempts[ids[0]]=[{} as never];
 const restored=restoreBankRound(JSON.stringify(r),'bank',ids,s)!;
 assert.equal(restored.index,1);assert.equal(restored.finished,false);assert.equal(restored.baseline[ids[0]],0);
 for(const id of ids)s.attempts[id]=[{} as never];
 assert.equal(restoreBankRound(JSON.stringify(r),'bank',ids,s)?.finished,true);
});
test('refresh rewinds metadata ahead of saved history, including finished metadata',()=>{
 const s=emptySnapshot();const ids=exercises.map(e=>e.id);const r=startBankRound('bank',ids,s,false);
 for(const cursor of [{index:1,finished:false},{index:ids.length,finished:true}]){
  const restored=restoreBankRound(JSON.stringify({...r,...cursor}),'bank',ids,s)!;
  assert.equal(restored.index,0);assert.equal(restored.finished,false);
 }
 s.attempts[ids[1]]=[{} as never];
 const missingEarlier=restoreBankRound(JSON.stringify({...r,index:2}),'bank',ids,s)!;
 assert.equal(missingEarlier.index,0);
 s.attempts[ids[0]]=[{} as never];
 const missingLast=restoreBankRound(JSON.stringify({...r,index:ids.length,finished:true}),'bank',ids,s)!;
 assert.equal(missingLast.index,2);assert.equal(missingLast.finished,false);
});
test('normal Next and refresh skip out-of-order history while replay still asks every item',()=>{
 const s=emptySnapshot();const ids=exercises.map(e=>e.id);s.attempts[ids[1]]=[{} as never];
 const resumed=startBankRound('bank',ids,s,true);assert.equal(resumed.index,0);
 s.attempts[ids[0]]=[{} as never];
 const next=advanceBankRound(resumed,s);
 assert.equal(next.index,2);assert.equal(next.finished,false);
 assert.deepEqual(next,restoreBankRound(JSON.stringify(resumed),'bank',ids,s));
 s.attempts[ids[2]]=[{} as never];
 assert.equal(advanceBankRound(next,s).finished,true);
 const replay=startBankRound('bank',ids,s,false);s.attempts[ids[0]].push({} as never);
 const replayNext=advanceBankRound(replay,s);
 assert.equal(replayNext.index,1);assert.equal(replayNext.finished,false);
 s.attempts[ids[1]].push({} as never);assert.equal(advanceBankRound(replayNext,s).index,2);
});
