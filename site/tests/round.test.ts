import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot} from '../lib/course/records.ts';
import {reviewSources,roundResults} from '../lib/course/round.ts';

test('review sources preserve due, latest errors, and fresh exercises from failed tags',()=>{
 const s=emptySnapshot();
 s.reviews={a:{due:'2026-10-27T12:00:00Z',streak:0},b:{due:'2026-10-29T12:00:00Z',streak:1}};
 s.attempts={a:[{exerciseId:'a',answer:'x',correct:false,spelling:false,assisted:false,at:'2026-10-26T12:00:00Z',tag:'g',skill:'grammar'}],b:[{exerciseId:'b',answer:'x',correct:false,spelling:false,assisted:false,at:'2026-10-26T12:00:00Z',tag:'g',skill:'grammar'},{exerciseId:'b',answer:'y',correct:true,spelling:false,assisted:false,at:'2026-10-27T12:00:00Z',tag:'g',skill:'grammar'}]};
 const sources=reviewSources(s,[{id:'a',tag:'g'},{id:'b',tag:'g'},{id:'c',tag:'g'},{id:'d',tag:'other'}],new Date('2026-10-28T12:00:00Z'));
 assert.deepEqual(sources,{due:['a'],errors:['a'],fresh:['c']});
});

test('round results only count attempts after the frozen baseline',()=>{
 const s=emptySnapshot();
 s.attempts={a:[{exerciseId:'a',answer:'old',correct:true,spelling:false,assisted:false,at:'2026-10-20T12:00:00Z',tag:'g',skill:'grammar'},{exerciseId:'a',answer:'wrong',correct:false,spelling:false,assisted:false,at:'2026-10-28T12:00:00Z',tag:'g',skill:'grammar'},{exerciseId:'a',answer:'retry',correct:true,spelling:false,assisted:true,at:'2026-10-28T12:01:00Z',tag:'g',skill:'grammar'}],b:[]};
 assert.deepEqual(roundResults(['a','b'],{a:1,b:0},s),{answered:1,correct:1,retried:1,assisted:1});
});
