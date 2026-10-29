import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gradeDeepAnswer,validateStudyPayload,objectiveProgress,nextStudyReview} from '../lib/course/deep-engine.ts';
import type {DeepChapter,DeepExercise,StudyEvidence} from '../lib/course/deep-types.ts';
const item:DeepExercise={id:'G.A1.01.c1',familyId:'c1',objectiveId:'G.A1.01.o1',mode:'control',kind:'gap',prompt:'Tu ___ aici.',answers:['ești'],hint:'fi',explanation:'tu'};
const chapter={id:'G.A1.01',objectives:[{id:'G.A1.01.o1',label:'Согласовать форму',skill:'grammar'}],exercises:[item,{...item,id:'G.A1.01.c2',familyId:'c2'},{...item,id:'G.A1.01.r1',familyId:'r1',mode:'retention'}],writing:{rubric:[{key:'task'}]},speaking:{rubric:[{key:'task'}]},listening:{questions:[{answers:['două']}],transferQuestions:[{answers:['trei']}]}} as unknown as DeepChapter;
const chapters=new Map([[chapter.id,chapter]]);
const evidence=(overrides:Partial<StudyEvidence>={}):StudyEvidence=>({id:'one',at:'2026-10-25T12:00:00Z',chapterId:chapter.id,chapterVersion:'3.0.0',action:'attempt',objectiveId:item.objectiveId,familyId:'c1',exerciseId:item.id,mode:'control',assisted:false,novel:true,status:'correct',skill:'grammar',...overrides});
test('new checks normalize Unicode but never award mastery for missing Romanian diacritics',()=>{
 assert.equal(gradeDeepAnswer('  EŞTI! ',item).status,'correct');
 assert.equal(gradeDeepAnswer('es\u0326ti',item).status,'correct');
 assert.equal(gradeDeepAnswer('esti',item).status,'spelling');
 assert.equal(gradeDeepAnswer('nu ești',item).status,'incorrect');
 assert.equal(gradeDeepAnswer('any opinion',{kind:'explain',answers:[]}).status,'pending');
});
test('server recomputes checked results and binds each exercise to its chapter and objective',()=>{
 const p=validateStudyPayload({chapterId:chapter.id,action:'attempt',exerciseId:item.id,answer:'suntem',status:'correct',score:99},chapters,[],'2026-10-25T12:00:00Z');
 assert.equal(p.status,'incorrect');assert.equal(p.objectiveId,item.objectiveId);assert.notEqual(p.score,99);
 assert.throws(()=>validateStudyPayload({chapterId:chapter.id,action:'attempt',exerciseId:'alien',answer:'ești'},chapters,[],'2026-10-25T12:00:00Z'));
});
test('help remains attached to the same exercise and repetitions are no longer novel',()=>{
 const at='2026-10-26T12:00:00Z';
 const p=validateStudyPayload({chapterId:chapter.id,action:'attempt',exerciseId:item.id,answer:'ești',assisted:false},chapters,[evidence({action:'help',targetId:item.id}),evidence()],at);
 assert.equal(p.assisted,true);assert.equal(p.novel,false);
});
test('viewing, self reviews and same-day repetition cannot become retained mastery',()=>{
 const h=[evidence({action:'view'}),evidence(),evidence({id:'two',familyId:'c2'}),evidence({id:'three',familyId:'r1',mode:'retention',at:'2026-10-25T13:00:00Z'})];
 const p=objectiveProgress(chapter,h)[0];assert.equal(p.independent,true);assert.equal(p.retained,false);
 assert.equal(objectiveProgress(chapter,[evidence({assisted:true}),evidence({id:'two',familyId:'c2',assisted:true})])[0].independent,false);
});
test('fresh retention evidence on another day confirms the tested objective only',()=>{
 const h=[evidence(),evidence({id:'two',familyId:'c2'}),evidence({id:'three',familyId:'r1',mode:'retention',at:'2026-10-27T12:00:00Z'})];
 assert.equal(objectiveProgress(chapter,h)[0].retained,true);
 assert.equal(nextStudyReview(chapter.id,[evidence()]),'2026-10-26T12:00:00.000Z');
 assert.equal(nextStudyReview(chapter.id,h),'2026-11-03T12:00:00.000Z');
});
test('listening uses its own answer key and an opened transcript remains assistance',()=>{
 const help=evidence({action:'help',targetId:chapter.id+'.listen.main',skill:'listening'});
 const p=validateStudyPayload({chapterId:chapter.id,action:'listening',answers:['două'],scenario:'main',score:100},chapters,[help],'2026-10-25T12:00:00Z');
 assert.equal(p.score,1);assert.equal(p.total,1);assert.equal(p.assisted,true);assert.equal(p.skill,'listening');
});
test('feedback cannot invent an external verified score or reference an unrelated submission',()=>{
 const writing=evidence({id:'work',action:'writing',skill:'writing',answer:'Un text.'});
 assert.throws(()=>validateStudyPayload({chapterId:chapter.id,action:'feedback',targetId:'work',evaluation:{source:'verified',scores:{task:4},comment:''}},chapters,[writing],'2026-10-25T12:00:00Z'));
 assert.throws(()=>validateStudyPayload({chapterId:chapter.id,action:'feedback',targetId:'absent',evaluation:{source:'self',scores:{task:4},comment:''}},chapters,[writing],'2026-10-25T12:00:00Z'));
});
test('explicit orthographic tasks preserve the case and punctuation being tested',()=>{
 assert.equal(gradeDeepAnswer('ț',{kind:'transform',answers:['Ț'],caseSensitive:true}).status,'incorrect');
 assert.equal(gradeDeepAnswer('Ț',{kind:'transform',answers:['Ț'],caseSensitive:true}).status,'correct');
 assert.equal(gradeDeepAnswer('Tu ești acasă.',{kind:'transform',answers:['Tu ești acasă?'],punctuationSensitive:true}).status,'incorrect');
 assert.equal(gradeDeepAnswer('Tu ești acasă?',{kind:'transform',answers:['Tu ești acasă?'],punctuationSensitive:true}).status,'correct');
});
test('a past error does not permanently block two later independent demonstrations',()=>{
 const h=[evidence({status:'incorrect'}),evidence({id:'two',familyId:'c2',at:'2026-10-26T12:00:00Z'}),evidence({id:'three',familyId:'r1',mode:'retention',at:'2026-10-27T12:00:00Z'})];
 assert.equal(objectiveProgress(chapter,h)[0].independent,true);
 assert.equal(objectiveProgress(chapter,h)[0].retained,true);
});
test('manual feedback keeps explained corrections separate from automatic correctness',()=>{
 const writing=evidence({id:'work',action:'writing',skill:'writing',answer:'Eu este aici.'});
 const evaluation={source:'teacher-reported',scores:{task:2},comment:'Исправь согласование',issues:[{category:'form',fragment:'Eu este',correction:'Eu sunt',why:'Первое лицо требует sunt'}]};
 const p=validateStudyPayload({chapterId:chapter.id,action:'feedback',targetId:'work',evaluation},chapters,[writing],'2026-10-25T12:00:00Z');
 assert.equal((p.evaluation as typeof evaluation).issues[0].correction,'Eu sunt');assert.equal(p.status,'submitted');
 assert.throws(()=>validateStudyPayload({chapterId:chapter.id,action:'feedback',targetId:'work',evaluation:{...evaluation,issues:[{...evaluation.issues[0],category:'verified-native'}]}},chapters,[writing],'2026-10-25T12:00:00Z'));
});
