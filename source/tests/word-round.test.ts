import assert from 'node:assert/strict';
import test from 'node:test';
import {chooseWordDeck,startWordRound,rateWord} from '../lib/course/word-round.ts';

const words=[
 {id:'a',moduleId:'A1.1'}, {id:'b',moduleId:'A1.1'}, {id:'c',moduleId:'A2.1'},
 {id:'d',moduleId:'A1.2'}, {id:'e',moduleId:'A1.2'}, {id:'f',moduleId:'A1.2'}, {id:'g',moduleId:'A1.2'}, {id:'h',moduleId:'A1.2'},
];

test('current level deck has at most six words; empty saved pool stays empty',()=>{
 assert.deepEqual(chooseWordDeck(words,'A1',[],'level').map(w=>w.id),['a','b','d','e','f','g']);
 assert.deepEqual(chooseWordDeck(words,'A1',[],'saved'),[]);
 assert.deepEqual(chooseWordDeck(words,'A1',['c','a'],'saved').map(w=>w.id),['a','c']);
});

test('later deck windows rotate through the eligible pool and wrap',()=>{
 assert.deepEqual(chooseWordDeck(words,'A1',[],'level',6).map(w=>w.id),['h','a','b','d','e','f']);
 assert.deepEqual(chooseWordDeck(words,'A1',[],'level',7).map(w=>w.id),['a','b','d','e','f','g']);
});

test('missed word returns in queue and round ends only after it is recalled',()=>{
 let round=startWordRound(['a','b']);
 round=rateWord(round,false);
 assert.deepEqual(round.pending,['b','a']);
 round=rateWord(round,true);
 assert.deepEqual(round.pending,['a']);
 round=rateWord(round,true);
 assert.deepEqual(round.pending,[]);
 assert.equal(round.attempts,3);
 assert.equal(round.misses,1);
 assert.equal(round.firstTry,1);
});
