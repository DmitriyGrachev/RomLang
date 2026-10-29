import test from 'node:test';
import assert from 'node:assert/strict';
import {createAccumulator,emptySnapshot,reduceEvents,validateEvent} from '../lib/course/records.ts';
import {createLearningSync} from '../lib/course/sync.ts';
import {catalog} from '../lib/course/data.ts';
import {academyUnits} from '../lib/course/academy.ts';
import {hasWritingDraft,unitEvidence,writingWorkspace,unansweredCheckpointSupport} from '../lib/course/writing.ts';
import {hasRecentWordExposure} from '../lib/course/word-ui.ts';
import type {LearningEvent} from '../lib/course/types.ts';
const at='2026-10-25T12:00:00.000Z';
const unit=academyUnits.find(u=>u.id==='ACA.B2.21')!;
const taskId=unit.writing.id;
const raw=(id:string,type:LearningEvent['type'],payload:Record<string,unknown>,time=at):LearningEvent=>({id,type,payload,at:time});
function store(){const acc=createAccumulator(catalog);let n=0;return {...acc,send:(type:LearningEvent['type'],payload:Record<string,unknown>,time=at)=>{const e=validateEvent(raw('reg.'+n++,type,payload,time),catalog,acc.snapshot);acc.append(e);return e}}}
const draft={taskId,action:'draft',text:'Biblioteca mobilă.',criteria:[0],modelViewed:false};

test('writing scenarios preserve distinct drafts, revision context and sticky model exposure on replay',()=>{
 const s=store();s.send('writing',{...draft,modelViewed:true});s.send('writing',{...draft,scenario:'transfer',text:'Irina și Dan.',criteria:[1],action:'revision'});
 let record=s.snapshot.writing[taskId];assert.equal(record.scenario,'transfer');assert.equal(record.drafts.main!.text,draft.text);assert.equal(record.revisions[0].scenario,'transfer');assert.equal(record.modelViewed,true);
 s.send('writing',{...draft,scenario:'main'});record=s.snapshot.writing[taskId];assert.equal(record.drafts.transfer!.text,'Irina și Dan.');assert.deepEqual(record.drafts.transfer!.criteria,[1]);
 s.send('writing',{...record.revisions[0],taskId,action:'draft'});assert.equal(s.snapshot.writing[taskId].scenario,'transfer');assert.deepEqual(reduceEvents(s.snapshot.events,catalog).writing,s.snapshot.writing);
 const legacy=reduceEvents([raw('old','writing',draft)],catalog).writing[taskId];assert.equal(legacy.scenario,'main');assert.equal(legacy.drafts.main!.text,draft.text);
 assert.throws(()=>s.send('writing',{...draft,scenario:'other'}));assert.throws(()=>s.send('writing',{...draft,scenario:'transfer',criteria:[3]}));
});

test('scenario drafts survive pending coalescing, reload and export/import',async()=>{
 let saved:LearningEvent[]=[];const transport={load:async()=>saved,save:async(batch:LearningEvent[])=>{saved.push(...batch);return saved}};
 const sync=createLearningSync(transport,catalog);await sync.initialize();sync.send('writing',draft);sync.send('writing',{...draft,scenario:'transfer',text:'Expoziție.',criteria:[]});await sync.retry();
 const reload=createLearningSync(transport,catalog);await reload.initialize();assert.equal(reload.getState().snapshot.writing[taskId].drafts.main!.text,draft.text);assert.equal(reload.getState().snapshot.writing[taskId].scenario,'transfer');
 const exported=JSON.parse(JSON.stringify(saved));saved=[];const restored=createLearningSync(transport,catalog);await restored.initialize();await restored.restore(exported);assert.deepEqual(restored.getState().snapshot.writing,reload.getState().snapshot.writing);
});

test('a blank active scenario does not erase written-task evidence from another saved draft',()=>{
 const s=store();for(const e of [...unit.readings.flatMap(r=>r.questions),...unit.exercises,...unit.checkpoint])s.send('attempt',{exerciseId:e.id,answer:e.answers[0]});
 s.send('writing',draft);assert.equal(unitEvidence(unit,s.snapshot).completed,true);
 s.send('writing',{...draft,scenario:'transfer',text:'',criteria:[]});
 const replay=reduceEvents(s.snapshot.events,catalog);assert.equal(replay.writing[taskId].text,'');assert.equal(replay.writing[taskId].scenario,'transfer');
 assert.equal(hasWritingDraft(replay.writing[taskId]),true);assert.equal(unitEvidence(unit,replay).written,true);assert.equal(unitEvidence(unit,replay).completed,true);
 assert.equal(hasWritingDraft({text:'Original legacy draft'}),true);assert.equal(hasWritingDraft({text:'',drafts:{main:{text:' '},transfer:{text:''}}}),false);
});

test('unanswered control exposure survives routes and support assists only the exposed item',()=>{
 const s=store();const [first,second]=unit.checkpoint;
 s.send('checkpointExposure',{exerciseId:first.id});assert.equal(reduceEvents(s.snapshot.events,catalog).checkpointExposures[first.id],at);assert.equal(s.snapshot.assistance[first.id],undefined);
 s.send('assist',{key:first.id});s.send('attempt',{exerciseId:first.id,answer:first.answers[0],assisted:false});s.send('attempt',{exerciseId:second.id,answer:second.answers[0]});
 const replay=reduceEvents(s.snapshot.events,catalog);assert.equal(replay.attempts[first.id][0].assisted,true);assert.equal(replay.attempts[second.id][0].assisted,false);assert.equal(unitEvidence(unit,replay).firstIndependent,1);assert.equal(unitEvidence(unit,replay).delayed,0);
 assert.deepEqual(emptySnapshot().checkpointExposures,{});assert.throws(()=>s.send('checkpointExposure',{exerciseId:unit.exercises[0].id}));
});

for(const rated of [false,true])test(`recognition reveal ${rated?'with':'without'} rating persists recall help without a fake score`,()=>{
 const s=store();const wordId='A1.d001';const answer=catalog.wordRecall.get(wordId)!.answers[0];
 s.send('wordExposure',{wordId,mode:'recall'});if(rated)s.send('wordReview',{wordId,mode:'recognition',recalled:true});
 const replay=reduceEvents(JSON.parse(JSON.stringify(s.snapshot.events)),catalog);assert.equal(replay.wordAttempts[wordId]?.length??0,rated?1:0);assert.equal(replay.wordReviews[wordId+':recall'],undefined);
 const checked=validateEvent(raw('recall','wordReview',{wordId,mode:'recall',answer,assisted:false},'2026-10-25T12:01:00Z'),catalog,replay);assert.equal(checked.payload.assisted,true);
 const expired=validateEvent(raw('expired','wordReview',{wordId,mode:'recall',answer,assisted:false},'2026-10-26T12:00:00Z'),catalog,replay);assert.equal(expired.payload.assisted,false);
 if(rated)assert.equal(replay.wordAttempts[wordId][0].assisted,false);
});

test('word exposures validate fixed and active custom IDs, expire independently and reset on changed content',()=>{
 const s=store();s.send('customCard',{cardId:'custom.exposure',action:'upsert',ro:'tren',ru:'поезд'});s.send('wordExposure',{wordId:'custom.exposure',mode:'recall'});
 assert.equal(s.send('wordReview',{wordId:'custom.exposure',mode:'recall',answer:'tren'}).payload.assisted,true);
 s.send('customCard',{cardId:'custom.exposure',action:'upsert',ro:'tren',ru:'состав'});assert.equal(s.snapshot.wordExposures['custom.exposure:recall'],undefined);
 for(const wordId of ['unknown','constructor','__proto__'])assert.throws(()=>s.send('wordExposure',{wordId,mode:'recall'}));assert.throws(()=>s.send('wordExposure',{wordId:'A1.d001',mode:'bad'}));
 s.send('customCard',{cardId:'custom.exposure',action:'delete'});assert.throws(()=>s.send('wordExposure',{wordId:'custom.exposure',mode:'recall'}));assert.deepEqual(reduceEvents([],catalog).wordExposures,{});
});


test('transfer workspace uses its own prompt and applicable self-review, with the original example separate',()=>{
 const main=writingWorkspace(unit.writing,'main');const transfer=writingWorkspace(unit.writing,'transfer');
 assert.equal(main.prompt,unit.writing.prompt);assert.deepEqual(main.rubric,unit.writing.rubric);assert.equal(transfer.prompt,unit.writing.transferPrompt);assert.notDeepEqual(transfer.rubric,main.rubric);assert.notDeepEqual(transfer.plan,main.plan);assert.notDeepEqual(transfer.revisionFocus,main.revisionFocus);
 assert.doesNotMatch(JSON.stringify(transfer.rubric),/Ada|библиотек|мобильн/);
});

test('support selection leaves prior study and required source reading unassisted, then survives route replay',()=>{
 const s=store();const ids=unit.checkpoint.map(e=>e.id);for(const tab of ['theory','words','practice','writing'])assert.deepEqual(unansweredCheckpointSupport(ids,s.snapshot,tab),[]);
 s.send('checkpointExposure',{exerciseId:ids[0]});const replay=reduceEvents(s.snapshot.events,catalog);
 for(const tab of ['reading','control'])assert.deepEqual(unansweredCheckpointSupport(ids,replay,tab),[]);
 for(const tab of ['theory','words','practice','writing'])assert.deepEqual(unansweredCheckpointSupport(ids,replay,tab),[ids[0]]);
 s.send('attempt',{exerciseId:ids[0],answer:unit.checkpoint[0].answers[0]});assert.deepEqual(unansweredCheckpointSupport(ids,s.snapshot,'words'),[]);
});

test('exposure helpers tolerate older in-memory snapshots until event replay supplies defaults',()=>{
 const legacy=emptySnapshot();delete (legacy as Partial<typeof legacy>).checkpointExposures;
 assert.deepEqual(unansweredCheckpointSupport(unit.checkpoint.map(e=>e.id),legacy,'theory'),[]);
 assert.equal(hasRecentWordExposure('A1.d001','recall',undefined,Date.parse(at)),false);
});

test('persisted exposure prevents an already-due recall streak advancing and keeps recognition schedule isolated',()=>{
 const s=store();const wordId='A1.d001';const answer=catalog.wordRecall.get(wordId)!.answers[0];
 for(const time of ['2026-09-01T12:00:00Z','2026-09-02T12:00:00Z','2026-09-05T12:00:00Z'])s.send('wordReview',{wordId,mode:'recall',answer},time);
 assert.equal(s.snapshot.wordReviews[wordId+':recall'].streak,3);
 s.send('wordReview',{wordId,mode:'recognition',recalled:true});const recognition={...s.snapshot.wordReviews[wordId+':recognition']};s.send('wordExposure',{wordId,mode:'recall'});
 s.send('wordReview',{wordId,mode:'recall',answer},'2026-10-25T12:01:00Z');
 assert.equal(s.snapshot.wordReviews[wordId+':recall'].streak,0);assert.equal(s.snapshot.wordReviews[wordId+':recall'].due,'2026-10-26T12:01:00.000Z');assert.deepEqual(s.snapshot.wordReviews[wordId+':recognition'],recognition);
 assert.deepEqual(reduceEvents(s.snapshot.events,catalog).wordReviews,s.snapshot.wordReviews);
});
