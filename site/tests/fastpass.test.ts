import {test} from 'node:test';
import assert from 'node:assert/strict';
import {canFastPass} from '../lib/course/engine.ts';
import {emptySnapshot} from '../lib/course/records.ts';
import type {Attempt} from '../lib/course/types.ts';
const ids=Array.from({length:8},(_,i)=>'CHECK.A1.1.e'+i);
function fixture(n:number){const s=emptySnapshot();s.completed['CHECK.A1.1']='now';s.productions['CHECK.A1.1']={text:'',criteria:[0,1,2],modelViewed:false,spoken:true};ids.forEach((id,i)=>s.attempts[id]=[{correct:i<n,assisted:false} as Attempt]);return s}
test('seven fresh unaided answers plus completed independent production permit the next module',()=>assert.equal(canFastPass('CHECK.A1.1',ids,fixture(7)),true));
test('six correct, help, or sample exposure cannot qualify for fast pass',()=>{assert.equal(canFastPass('CHECK.A1.1',ids,fixture(6)),false);const s=fixture(7);s.attempts[ids[0]][0].assisted=true;assert.equal(canFastPass('CHECK.A1.1',ids,s),false);const p=fixture(8);p.productions['CHECK.A1.1'].modelViewed=true;assert.equal(canFastPass('CHECK.A1.1',ids,p),false)});
