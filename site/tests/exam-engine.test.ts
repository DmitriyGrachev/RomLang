import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateExamPayload,applyExamEvent,examRemaining,examScores,examReadiness} from '../lib/course/exam-engine.ts';
import type {ExamPaper,ExamSession,ExamProfile} from '../lib/course/exam-types.ts';
const at='2026-10-20T09:00:00.000Z';
const block={id:'l',title:'Audio',instructions:'Listen',script:'Text',items:[{id:'l1',familyId:'reserve-one',kind:'gap' as const,prompt:'?',answers:['școală'],explanation:'Form'}]};
const paper:ExamPaper={id:'EX.B2.R1',version:'1.0.0',kind:'reserve',title:'Test',listening:[block],reading:[{...block,id:'r',items:[{...block.items[0],id:'r1'}]}],language:[{...block,id:'g',items:[{...block.items[0],id:'g1'}]}],writing:[{id:'w1',title:'Email',prompt:'Write',targetWords:[120,140],model:'Model',annotations:[]},{id:'w2',title:'Essay',prompt:'Write',targetWords:[160,180],model:'Model',annotations:[]}],speaking:[{id:'s1',title:'Talk',prompt:'Discuss',followUps:[]}]};
const profile:ExamProfile={id:'roexam-b2',version:'2026-10-29',checkedAt:'2026-10-29',provider:'RoExam',parts:[{id:'listening',title:'Listening',minutes:30,points:20},{id:'reading',title:'Reading',minutes:55,points:20},{id:'language',title:'Language',minutes:45,points:20},{id:'writing',title:'Writing',minutes:60,points:20},{id:'speaking',title:'Speaking',minutes:20,points:20}],sources:[],officialPass:null,internalTarget:{total:80,component:14,papers:2},audioNote:'Synthetic'};
const papers=new Map([[paper.id+'@'+paper.version,paper]]);
function setup(){const sessions:Record<string,ExamSession>={};const send=(payload:Record<string,unknown>,date=at)=>{const p=validateExamPayload(payload,papers,profile,sessions,date);applyExamEvent(sessions,{id:'event-'+Math.random(),at:date,payload:p});return p};send({action:'start',sessionId:'session-one',paperId:paper.id,paperVersion:paper.version,mode:'timed'});return {sessions,send}}
test('exam start captures server catalog, immutable profile and novelty across restarts',()=>{
 const {sessions,send}=setup();assert.equal(sessions['session-one'].paper.title,'Test');assert.equal(sessions['session-one'].novel,true);
 send({action:'start',sessionId:'session-two',paperId:paper.id,paperVersion:paper.version,mode:'timed',paper:{title:'Forged'}});
 assert.equal(sessions['session-two'].novel,false);assert.throws(()=>send({action:'start',sessionId:'session-one',paperId:paper.id,paperVersion:paper.version,mode:'timed'}));
 const before=sessions['session-one'].paper.title;paper.title='Changed catalog';assert.equal(sessions['session-one'].paper.title,before);paper.title=before;
});
test('answers remain scoped to active part, timer survives reload and expired answers reject',()=>{
 const {sessions,send}=setup();send({action:'answer',sessionId:'session-one',itemId:'l1',answer:'școală'});
 assert.throws(()=>send({action:'answer',sessionId:'session-one',itemId:'r1',answer:'școală'}));
 const reloaded=JSON.parse(JSON.stringify(sessions['session-one']));assert.equal(examRemaining(reloaded,Date.parse(at)+60_000),29*60);
 assert.throws(()=>send({action:'answer',sessionId:'session-one',itemId:'l1',answer:'școală'},'2026-10-20T09:31:00.000Z'));
 send({action:'submit-part',sessionId:'session-one',part:'listening'},'2026-10-20T09:31:00.000Z');
 assert.equal(sessions['session-one'].results.listening?.score,20);assert.equal(sessions['session-one'].answers.l1,'școală');
 assert.equal(examRemaining(sessions['session-one'],Date.parse('2026-10-20T09:31:00.000Z')),54*60);
 assert.throws(()=>send({action:'answer',sessionId:'session-one',itemId:'l1',answer:'other'},'2026-10-20T09:31:01.000Z'));
});
test('readiness needs two unfamiliar papers on different days and both reported teacher reviews',()=>{
 const {sessions,send}=setup();send({action:'listen',sessionId:'session-one',blockId:'l'});
 for(const [part,item] of [['listening','l1'],['reading','r1'],['language','g1']] as const){send({action:'answer',sessionId:'session-one',itemId:item,answer:'școală'});send({action:'submit-part',sessionId:'session-one',part})}
 for(const itemId of ['w1','w2'])send({action:'answer',sessionId:'session-one',itemId,answer:'Un text original pentru analiză.'});send({action:'submit-part',sessionId:'session-one',part:'writing'});
 send({action:'answer',sessionId:'session-one',itemId:'s1',answer:'Am discutat cu un interlocutor.'});send({action:'submit-part',sessionId:'session-one',part:'speaking'});
 const writing=Object.fromEntries(['w1','w2'].flatMap(t=>['communication','complexity','organization','accuracy'].map(c=>[t+'.'+c,2.5])));
 const speaking=Object.fromEntries(['interaction','production'].flatMap(s=>['communication','complexity','fluency','accuracy'].map(c=>[s+'.'+c,2.5])));
 send({action:'review',sessionId:'session-one',part:'writing',source:'self',scores:writing,comment:'Self review'});send({action:'review',sessionId:'session-one',part:'speaking',source:'self',scores:speaking,comment:'Self review'});
 assert.equal(examScores(sessions['session-one']).total,100);assert.equal(examReadiness(Object.values(sessions)).eligible.length,0);
 send({action:'review',sessionId:'session-one',part:'writing',source:'teacher-reported',scores:writing,comment:'Reported review'});send({action:'review',sessionId:'session-one',part:'speaking',source:'teacher-reported',scores:speaking,comment:'Reported review'});
 const first=sessions['session-one'];assert.equal(examReadiness([first]).met,false);
 const second=structuredClone(first);second.id='two';second.paper.id='EX.B2.R2';assert.equal(examReadiness([first,second]).met,false);
 second.startedAt='2026-10-22T09:00:00.000Z';assert.equal(examReadiness([first,second]).met,true);second.novel=false;assert.equal(examReadiness([first,second]).met,false);
});
test('grading is recomputed, exact diacritics required and incomplete production stays pending',()=>{
 const {sessions,send}=setup();send({action:'answer',sessionId:'session-one',itemId:'l1',answer:'scoala',score:20});send({action:'submit-part',sessionId:'session-one',part:'listening'});
 assert.equal(sessions['session-one'].results.listening?.score,0);assert.equal(examScores(sessions['session-one']).total,null);
 assert.throws(()=>send({action:'review',sessionId:'session-one',part:'writing',source:'verified-teacher',scores:{},comment:''}));
});
test('timed replay limit and assistance are persistent, used paper cannot be new reserve',()=>{
 const {sessions,send}=setup();send({action:'listen',sessionId:'session-one',blockId:'l'});send({action:'listen',sessionId:'session-one',blockId:'l'});assert.throws(()=>send({action:'listen',sessionId:'session-one',blockId:'l'}));
 send({action:'help',sessionId:'session-one'});assert.equal(sessions['session-one'].assisted,true);
 assert.equal(examReadiness(Object.values(sessions)).eligible.length,0);
});
