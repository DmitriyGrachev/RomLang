import test from 'node:test';
import assert from 'node:assert/strict';
import {emptySnapshot,validateEvent,createAccumulator,reduceEvents} from '../lib/course/records.ts';
import type {Catalog} from '../lib/course/records.ts';
import type {LearningEvent} from '../lib/course/types.ts';
import type {CardFilters} from '../lib/course/cards.ts';
const fixed='A1.d001';
const catalog:Catalog={exercises:new Map(),lessonIds:new Set(),wordIds:new Set([fixed,'custom.reserved']),missions:new Map(),lessonExercises:new Map(),wordRecall:new Map([[fixed,{wordId:fixed,prompt:'я',answers:['eu'],note:''}]])};
const at='2026-10-25T12:00:00.000Z';
const event=(id:string,type:LearningEvent['type'],payload:Record<string,unknown>):LearningEvent=>({id,type,at,payload});
const own={action:'upsert',cardId:'custom.one',ro:'țară',ru:'страна',example:'Aceasta este țara mea.'};
function store(){const acc=createAccumulator(catalog);let n=0;return {...acc,send:(type:LearningEvent['type'],payload:Record<string,unknown>)=>{const e=validateEvent(event('e'+n++,type,payload),catalog,acc.snapshot);acc.append(e);return e}}}

test('custom cards grade typed recall on the server and use existing isolated SRS histories',()=>{
 const s=store();s.send('customCard',own);s.send('word',{wordId:own.cardId,saved:true});s.send('note',{wordId:own.cardId,text:'my note'});
 const forged=s.send('wordReview',{wordId:own.cardId,mode:'recall',answer:'wrong',result:{correct:true},correct:true});
 assert.deepEqual(forged.payload.result,{correct:false,spelling:false,canonical:'țară'});
 s.send('wordReview',{wordId:own.cardId,mode:'recognition',recalled:true});
 const correct=s.send('wordReview',{wordId:own.cardId,mode:'recall',answer:'tara'});
 assert.deepEqual(correct.payload.result,{correct:true,spelling:true,canonical:'țară'});
 assert.equal(s.snapshot.wordAttempts[own.cardId].length,3);
 assert.equal(s.snapshot.wordReviews[own.cardId+':recognition'].attempts,1);
 assert.equal(s.snapshot.wordReviews[own.cardId+':recall'].attempts,2);
 assert.deepEqual(s.snapshot.savedWords,[own.cardId]);assert.equal(s.snapshot.xp,0);
});

test('custom IDs, text limits, deletion ownership and active-card cap are enforced',()=>{
 const s=store();
 for(const cardId of ['bad','custom.','custom.bad id','custom.'+'x'.repeat(94),'custom.reserved'])assert.throws(()=>s.send('customCard',{...own,cardId}));
 for(const patch of [{ro:''},{ro:' '},{ru:''},{ro:'x'.repeat(201)},{ru:'x'.repeat(401)},{example:'x'.repeat(1001)}])assert.throws(()=>s.send('customCard',{...own,...patch}));
 assert.throws(()=>s.send('customCard',{action:'delete',cardId:'custom.missing'}));
 assert.throws(()=>s.send('customCard',{...own,action:'other'}));
 s.send('customCard',{...own,ro:'r'.repeat(200),ru:'u'.repeat(400),example:'e'.repeat(1000)});
 s.send('customCard',{action:'delete',cardId:own.cardId});assert.equal(s.snapshot.customCards[own.cardId].deleted,true);
 for(const type of ['word','wordReview','note'] as const)assert.throws(()=>s.send(type,{wordId:own.cardId,saved:true,mode:'recognition',recalled:true,text:'x'}));
 const full=emptySnapshot();for(let i=0;i<1000;i++)full.customCards['custom.'+i]={id:'custom.'+i,ro:'eu',ru:'я',example:'',deleted:false};
 assert.throws(()=>validateEvent(event('limit','customCard',own),catalog,full));
 assert.doesNotThrow(()=>validateEvent(event('edit','customCard',{...own,cardId:'custom.0'}),catalog,full));
});

test('changing card content clears prior memory while history and example-only edits remain',()=>{
 const s=store();s.send('customCard',own);s.send('wordReview',{wordId:own.cardId,mode:'recall',answer:own.ro});s.send('wordReview',{wordId:own.cardId,mode:'recognition',recalled:true});
 s.send('customCard',{...own,example:'Alt exemplu.'});assert.equal(s.snapshot.wordAttempts[own.cardId].length,2);
 s.send('customCard',{...own,ru:'государство'});
 assert.equal(s.snapshot.wordAttempts[own.cardId],undefined);assert.equal(s.snapshot.wordReviews[own.cardId+':recognition'],undefined);assert.equal(s.snapshot.wordReviews[own.cardId+':recall'],undefined);
 assert.equal(s.snapshot.events.filter(e=>e.type==='wordReview').length,2);
 s.send('wordReview',{wordId:own.cardId,mode:'recall',answer:own.ro});s.send('customCard',{...own,ro:'oraș'});assert.equal(s.snapshot.wordAttempts[own.cardId],undefined);
 const replay=reduceEvents(s.snapshot.events,catalog);assert.deepEqual(replay.customCards,s.snapshot.customCards);assert.deepEqual(replay.wordAttempts,{});
});

test('old event logs receive empty custom and writing defaults',()=>{
 const s=reduceEvents([event('old','word',{wordId:fixed,saved:true})],catalog);
 assert.deepEqual(s.customCards,{});assert.deepEqual(s.writing,{});assert.deepEqual(s.savedWords,[fixed]);
});

test('card decks combine active own cards with fixed entries and intersect due, level, topic and search',async()=>{
 const {collectCards,filterCards}=await import('../lib/course/cards.ts');
 const fixedWords=[{id:fixed,word:'țară',ru:'страна',forms:'țări',examples:[{ro:'O țară mare.',ru:'Большая страна.'}],moduleId:'A1.1'},{id:'A2.d001',word:'oraș',ru:'город',forms:'orașe',examples:[],moduleId:'A2.1'}];
 const s=emptySnapshot();s.customCards['custom.one']={id:'custom.one',ro:'tren',ru:'поезд',example:'Un tren.',deleted:false};s.customCards['custom.deleted']={id:'custom.deleted',ro:'șters',ru:'удалённый',example:'',deleted:true};
 s.savedWords=[fixed,'custom.one','custom.deleted'];s.wordReviews[fixed+':recall']={due:at,lastAt:at,streak:0,attempts:1};s.wordReviews['A2.d001:recognition']={due:at,lastAt:at,streak:0,attempts:1};
 const cards=collectCards(fixedWords,s.customCards);assert.equal(cards.length,3);
 const opts:CardFilters={deck:'all',level:'all',topic:'all',query:'',mode:'recall'};
 const select=(overrides:Partial<typeof opts>)=>filterCards(cards,s,{...opts,...overrides},Date.parse(at)).map(card=>card.id);
 assert.deepEqual(select({deck:'due'}),[fixed]);assert.deepEqual(select({deck:'saved'}),[fixed,'custom.one']);assert.deepEqual(select({deck:'custom'}),['custom.one']);
 assert.deepEqual(filterCards(cards,s,{...opts,level:'A2'},Date.parse(at)).map(c=>c.id),['A2.d001']);
 assert.deepEqual(select({topic:'personal'}),['custom.one']);assert.deepEqual(select({topic:'A1.1',query:'tara'}),[fixed]);assert.deepEqual(select({query:'горо'}),['A2.d001']);assert.deepEqual(select({query:'nothing'}),[]);
 assert.deepEqual(filterCards(cards,s,{...opts,deck:'custom',level:'A1'},Date.parse(at)),[]);
});

test('stack mistakes return later once and stop with a deferred list instead of looping',async()=>{
 const {startCardsRound,rateCard,stopCardsRound}=await import('../lib/course/cards.ts');
 let round=startCardsRound(['a','b','a']);assert.deepEqual(round.pending,['a','b']);
 round=rateCard(round,false);assert.deepEqual(round.pending,['b','a']);
 round=rateCard(round,true);assert.deepEqual(round.pending,['a']);
 round=rateCard(round,false);assert.deepEqual(round.pending,[]);assert.deepEqual(round.deferred,['a']);assert.equal(round.attempts,3);
 assert.deepEqual(rateCard(round,true),round);
 const stopped=stopCardsRound(rateCard(startCardsRound(['a','b']),false));assert.deepEqual(stopped.pending,[]);assert.deepEqual(new Set(stopped.deferred),new Set(['a','b']));
});

test('only registered or own active word IDs are accepted, including inherited object names',()=>{
 const s=store();
 for(const wordId of ['missing','toString','constructor','__proto__'])for(const type of ['word','wordReview','note'] as const)assert.throws(()=>s.send(type,{wordId,saved:true,mode:'recognition',recalled:true,text:'x'}));
});

test('selection returns to a populated page when deletion or refreshed search results shrink the deck',async()=>{
 const {clampCardOffset}=await import('../lib/course/cards.ts');
 const s=store();for(let i=0;i<13;i++)s.send('customCard',{...own,cardId:`custom.page${i}`});
 const {collectCards,filterCards}=await import('../lib/course/cards.ts');
 const filters:CardFilters={deck:'custom',level:'all',topic:'all',query:'',mode:'recognition'};
 const select=()=>filterCards(collectCards([],s.snapshot.customCards),s.snapshot,filters,Date.parse(at));
 let pool=select();const requestedOffset=12;assert.equal(pool.slice(clampCardOffset(pool.length,requestedOffset,12)).length,1);
 s.send('customCard',{action:'delete',cardId:'custom.page0'});pool=select();
 const deletionOffset=clampCardOffset(pool.length,requestedOffset,12);assert.equal(deletionOffset,0);assert.equal(pool.slice(deletionOffset,deletionOffset+12).length,12);
 assert.equal(clampCardOffset(24,24,12),12);assert.equal(clampCardOffset(13,24,12),12);assert.equal(clampCardOffset(0,12,12),0);
 assert.equal(clampCardOffset(25,12,12),12);assert.equal(clampCardOffset(25,24,12),24);
});
