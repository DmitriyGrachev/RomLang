import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot} from '../lib/course/records.ts';
import {errorGroups,reviewableExercises,targetedBankIds} from '../lib/course/clinic.ts';
import {reviewSources} from '../lib/course/round.ts';

const item=(id:string)=>({id,tag:'form'});
const attempt=(id:string,correct:boolean,at:string)=>({exerciseId:id,answer:'x',correct,spelling:false,assisted:false,at,tag:'form',skill:'grammar'});

test('groups recent unresolved failures by owner and ranks repeated evidence before recency',()=>{
 const s=emptySnapshot();
 s.attempts={
  a:[attempt('a',false,'2026-10-23T12:00:00Z'),attempt('a',false,'2026-10-26T12:00:00Z')],
  b:[attempt('b',false,'2026-10-27T12:00:00Z')],
  c:[attempt('c',false,'2026-10-28T08:00:00Z')],
  recovered:[attempt('recovered',false,'2026-10-27T12:00:00Z'),attempt('recovered',true,'2026-10-28T09:00:00Z')],
  old:[attempt('old',false,'2026-08-01T12:00:00Z')],
  bank:[attempt('bank',false,'2026-10-28T08:00:00Z')]
 };
 const groups=errorGroups(s,[item('a'),item('b'),item('c'),item('recovered'),item('old')],new Map([['a','L1'],['b','L1'],['c','L2'],['recovered','L2'],['old','L2']]),new Date('2026-10-28T12:00:00Z'));
 assert.deepEqual(groups.map(g=>({ownerId:g.ownerId,ids:g.exerciseIds,failures:g.failures})),[
  {ownerId:'L1',ids:['a','b'],failures:3},
  {ownerId:'L2',ids:['c'],failures:1}
 ]);
});

test('recency breaks equal evidence without mixing lessons',()=>{
 const s=emptySnapshot();
 s.attempts={x:[attempt('x',false,'2026-10-25T12:00:00Z')],y:[attempt('y',false,'2026-10-27T12:00:00Z')]};
 assert.deepEqual(errorGroups(s,[item('x'),item('y')],new Map([['x','earlier'],['y','later']]),new Date('2026-10-28T12:00:00Z')).map(g=>g.ownerId),['later','earlier']);
});

test('an attempted bank failure appears under its authored source topic',()=>{
 const s=emptySnapshot();
 s.attempts={'A1.01.e101':[attempt('A1.01.e101',false,'2026-10-28T08:00:00Z')]};
 const groups=errorGroups(s,[item('A1.01.e101')],new Map([['A1.01.e101','A1.01']]),new Date('2026-10-28T12:00:00Z'));
 assert.deepEqual(groups.map(g=>({owner:g.ownerId,ids:g.exerciseIds})),[{owner:'A1.01',ids:['A1.01.e101']}]);
});

test('pilot errors select authored variants with failed tags instead of repeating old questions',()=>{
 const catalog=new Map([['A1.01.e1',item('A1.01.e1')],['A1.01.e101',item('A1.01.e101')]]);
 const bank=[item('A1.01.e101'),{id:'A1.01.e102',tag:'other'},item('A1.01.e103')];
 assert.deepEqual(targetedBankIds(['A1.01.e1'],catalog,bank),['A1.01.e101','A1.01.e103']);
});

test('bank-only pilot errors can retry the known question and matching authored variants',()=>{
 const catalog=new Map([['A1.01.e101',item('A1.01.e101')]]);
 const bank=[item('A1.01.e101'),{id:'A1.01.e102',tag:'other'},item('A1.01.e103')];
 assert.deepEqual(targetedBankIds(['A1.01.e101'],catalog,bank),['A1.01.e101','A1.01.e103']);
});

test('pilot errors fall back to the full authored topic if tags have no variant',()=>{
 const catalog=new Map([['A1.01.e1',{id:'A1.01.e1',tag:'unmatched'}]]);
 const bank=[item('A1.01.e101'),{id:'A1.01.e102',tag:'other'}];
 assert.deepEqual(targetedBankIds(['A1.01.e1'],catalog,bank),['A1.01.e101','A1.01.e102']);
});

test('generic review hides untouched bank questions while retaining attempted bank errors and due',()=>{
 const s=emptySnapshot();
 s.attempts={core:[attempt('core',false,'2026-10-27T12:00:00Z')],known:[attempt('known',false,'2026-10-27T12:00:00Z')]};
 s.reviews={known:{due:'2026-10-27T13:00:00Z',streak:0}};
 const items=[item('core'),item('unknown'),item('known')];
 const sources=reviewSources(s,reviewableExercises(s,items,new Set(['unknown','known'])),new Date('2026-10-28T12:00:00Z'));
 assert.deepEqual(sources,{due:['known'],errors:['core','known'],fresh:[]});
});
