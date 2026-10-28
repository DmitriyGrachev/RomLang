import assert from 'node:assert/strict';
import test from 'node:test';
import {dailyAttemptCount,nextOpenModuleIndex,lessonEntryPage,missionCompleted,replayIntent} from '../lib/course/activity.ts';

test('daily count uses local calendar date and distinct question IDs across retries',()=>{
 const today=new Date(2026,9,28,12);
 const yesterday=new Date(2026,9,27,23,30);
 const tomorrow=new Date(2026,9,29,0,30);
 const attempts={
  'A1.01.1':[{at:yesterday.toISOString()},{at:today.toISOString()}],
  'A1.01.2':[{at:today.toISOString()},{at:today.toISOString()}],
  'A1.01.3':[{at:tomorrow.toISOString()}]
 };
 assert.equal(dailyAttemptCount(attempts,today),2);
});

test('next open module remains valid when every module is complete',()=>{
 const modules=[{id:'a',checkpoint_id:'ca',lessons:[{id:'l1'}]},{id:'b',checkpoint_id:'cb',lessons:[{id:'l2'}]}];
 const missionIds={a:'ma',b:'mb'};
 assert.equal(nextOpenModuleIndex(modules,{'l1':'x','ca':'x','l2':'x','cb':'x'},missionIds,{'ma.0':{at:'x',good:1,total:1,variant:0},'mb.0':{at:'x',good:1,total:1,variant:0}}),1);
 assert.equal(nextOpenModuleIndex(modules,{'l1':'x','ca':'x'},missionIds,{'ma.0':{at:'x',good:1,total:1,variant:0}}),1);
 assert.equal(nextOpenModuleIndex([],{}, {}, {}),0);
});

test('module recommendation waits for checkpoint and independent mission',()=>{
 const modules=[{id:'a',checkpoint_id:'ca',lessons:[{id:'l1'}]},{id:'b',checkpoint_id:'cb',lessons:[{id:'l2'}]}];
 const ids={a:'ma',b:'mb'};
 assert.equal(nextOpenModuleIndex(modules,{'l1':'x'},ids,{}),0);
 assert.equal(nextOpenModuleIndex(modules,{'l1':'x','ca':'x'},ids,{}),0);
 assert.equal(nextOpenModuleIndex(modules,{'l1':'x'},ids,{'ma.0':{at:'x',good:1,total:1,variant:0}},id=>id==='ca'),1);
});

test('guided mission does not mark dialogue finished, independent or legacy does',()=>{
 assert.equal(missionCompleted('ma',{'ma.0':{at:'x',good:1,total:1,variant:0,mode:'guided'}}),false);
 assert.equal(missionCompleted('ma',{'ma.0':{at:'x',good:1,total:1,variant:0,mode:'independent'}}),true);
 assert.equal(missionCompleted('ma',{'ma.1':{at:'x',good:1,total:1,variant:1}}),true);
});

test('later guided replay does not erase an earlier independent dialogue',()=>{
 const guided={'ma.0':{at:'2026-10-28T12:00:00Z',good:1,total:1,variant:0,mode:'guided'}};
 const events=[{id:'one',type:'mission' as const,at:'2026-10-27T12:00:00Z',payload:{missionId:'ma',variant:0,mode:'independent'}}];
 assert.equal(missionCompleted('ma',guided,events),true);
});

test('new lessons open theory, attempted and completed lessons open practice',()=>{
 assert.equal(lessonEntryPage('A1.01',{},{},['A1.01.1']),'theory');
 assert.equal(lessonEntryPage('A1.01',{'A1.01.1':[{at:'x'}]},{},['A1.01.1']),'lesson');
 assert.equal(lessonEntryPage('A1.01',{}, {'A1.01':'x'},['A1.01.1']),'lesson');
});

test('replay clears only exercise drafts then returns the saved cursor to question one',()=>{
 assert.deepEqual(replayIntent('CHECK.A1.1',['A1.e1','A1.e2']),[
  {type:'draft',payload:{key:'A1.e1',text:''}},
  {type:'draft',payload:{key:'A1.e2',text:''}},
  {type:'cursor',payload:{lessonId:'CHECK.A1.1',index:0}}
 ]);
});
test('bank-only anchor history leaves core theory entry fresh until an explicit core item is attempted',()=>{
 const core=['A1.22.e1','A1.22.e2'];
 const bankOnly={'A1.22.e501':[{at:'x'}],'A1.22.e901':[{at:'x'}]};
 assert.equal(lessonEntryPage('A1.22',bankOnly,{},core),'theory');
 assert.equal(lessonEntryPage('A1.22',{...bankOnly,'A1.22.e1':[{at:'x'}]}, {},core),'lesson');
 assert.equal(lessonEntryPage('A1.22',bankOnly,{'A1.22':'x'},core),'lesson');
 assert.equal(lessonEntryPage('A1.22',{'A1.22.e1':[]},{},core),'theory');
});
