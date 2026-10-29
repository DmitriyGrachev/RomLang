import assert from 'node:assert/strict';
import test from 'node:test';
import {selectWordWindow,preparationIds,recentWordHelp,wordIsAssisted} from '../lib/course/word-ui.ts';

const words=Array.from({length:14},(_,i)=>({id:'w'+i}));
const at='2026-10-28T12:00:00.000Z';

test('due deck always consumes the earliest remaining six after a shrinking queue',()=>{
 const first=selectWordWindow(words,'due',0).map(w=>w.id);
 assert.deepEqual(first,words.slice(0,6).map(w=>w.id));
 const eight=words.slice(6);
 assert.deepEqual(selectWordWindow(eight,'due',6).map(w=>w.id),eight.slice(0,6).map(w=>w.id));
 const two=eight.slice(6);
 assert.deepEqual(selectWordWindow(two,'due',6).map(w=>w.id),two.map(w=>w.id));
 // A helped answer may remain due; the session's checked IDs let the next deck skip it.
 assert.deepEqual(selectWordWindow(words.filter(w=>!new Set(first).has(w.id)),'due',6).map(w=>w.id),eight.slice(0,6).map(w=>w.id));
 assert.deepEqual(selectWordWindow(words,'level',6).map(w=>w.id),words.slice(6,12).map(w=>w.id));
});

test('first preparation includes unseen words only, while explicit restart can prepare the whole deck',()=>{
 const history={w1:[{mode:'recognition' as const,correct:true,assisted:false,at}]};
 assert.deepEqual(preparationIds(['w0','w1','w2'],history),['w0','w2']);
 assert.deepEqual(preparationIds(['w0','w1','w2'],history,true),['w0','w1','w2']);
 assert.deepEqual(preparationIds(['w1'],history),[]);
});

test('recent failed or assisted attempt prevents immediate unaided restart, but expires after a day',()=>{
 const failed=[{mode:'recall' as const,correct:false,assisted:false,at}];
 const assisted=[{mode:'recall' as const,correct:true,assisted:true,at}];
 const now=Date.parse(at)+60_000;
 assert.equal(recentWordHelp(failed,'recall',now),true);
 assert.equal(recentWordHelp(assisted,'recall',now),true);
 assert.equal(recentWordHelp(failed,'recognition',now),false);
 assert.equal(recentWordHelp(failed,'recall',now+86_400_001),false);
 assert.equal(recentWordHelp([{mode:'recall' as const,correct:true,assisted:false,at}],'recall',now),false);
 assert.equal(wordIsAssisted('w0','recall',new Map([['w0:recall',now]]),[],[],now),true);
 assert.equal(wordIsAssisted('w0','recognition',new Map([['w0:recall',now]]),[],[],now),false);
 assert.equal(wordIsAssisted('w0','recall',new Map(),['w0'],[],now),true);
 assert.equal(wordIsAssisted('w0','recall',new Map([['w0:recall',Date.parse(at)]]),[],[],Date.parse(at)+86_400_001),false);
});
