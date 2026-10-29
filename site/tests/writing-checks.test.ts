import test from 'node:test';
import assert from 'node:assert/strict';
import {writingChecks,unitEvidence} from '../lib/course/writing.ts';
import {initialExerciseAnswer} from '../lib/course/engine.ts';
import {emptySnapshot} from '../lib/course/records.ts';
import type {AcademyUnit} from '../lib/course/academy-types.ts';

test('writing counts Romanian hyphenated forms and paragraphs without pretending to grade meaning',()=>{
 const r=writingChecks('Mi-a trimis o scrisoare.\n\nTotuși, n-am răspuns.',[7,9]);
 assert.equal(r.words,7);assert.equal(r.paragraphs,2);assert.equal(r.inRange,true);assert.deepEqual(r.connectors,['totuși']);
 assert.equal(writingChecks('',[1,4]).paragraphs,0);
});
test('checkpoint evidence keeps first attempt and excludes assisted or spelling-only success',()=>{
 const unit={readings:[],exercises:[],checkpoint:[{id:'c1'},{id:'c2'},{id:'c3'}],writing:{id:'w'}} as unknown as AcademyUnit;
 const s=emptySnapshot();const attempt={exerciseId:'c1',answer:'x',correct:false,spelling:false,assisted:false,at:'2026-01-01T00:00:00Z',tag:'',skill:'grammar'};
 s.attempts.c1=[attempt,{...attempt,correct:true}];s.attempts.c2=[{...attempt,correct:true,assisted:true}];s.attempts.c3=[{...attempt,correct:true,spelling:true}];
 assert.equal(unitEvidence(unit,s).firstIndependent,0);assert.equal(unitEvidence(unit,s).completed,false);
});

test('open reading answers restore while stale choice answers clear',()=>{assert.equal(initialExerciseAnswer({type:'read'},'Odesa'),'Odesa');assert.equal(initialExerciseAnswer({type:'read',choices:['a','b']},'c'),'')});

test('later practice does not erase evidence of an earlier delayed first check',()=>{
 const unit={readings:[],exercises:[{id:'p'}],checkpoint:[{id:'c'}],writing:{id:'w'}} as unknown as AcademyUnit;
 const s=emptySnapshot();const base={exerciseId:'p',answer:'x',correct:true,spelling:false,assisted:false,at:'2026-01-01T00:00:00Z',tag:'',skill:'grammar'};
 s.attempts.p=[base,{...base,at:'2026-01-04T00:00:00Z'}];s.attempts.c=[{...base,exerciseId:'c',at:'2026-01-03T00:00:00Z'}];
 assert.equal(unitEvidence(unit,s).delayed,1);
 s.attempts.p.push({...base,at:'2026-01-02T20:00:00Z'});assert.equal(unitEvidence(unit,s).delayed,0);
});
