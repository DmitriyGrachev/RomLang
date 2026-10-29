import {fold} from './engine.ts';
import {wordReviewKey} from './word-memory.ts';
import type {CustomCard,Level,Snapshot,WordEntry,WordReviewMode} from './types.ts';

export type StudyCard={id:string;ro:string;ru:string;forms:string;example:string;exampleRu:string;level:Level|null;topic:string;custom:boolean};
export type CardFilters={deck:'all'|'due'|'saved'|'custom';level:Level|'all';topic:string;query:string;mode:WordReviewMode};
type DictionaryCard=Pick<WordEntry,'id'|'word'|'ru'|'forms'|'examples'|'moduleId'>;
export function collectCards(words:DictionaryCard[],customCards:Record<string,CustomCard>):StudyCard[]{
 return [
  ...words.map(word=>({id:word.id,ro:word.word,ru:word.ru,forms:word.forms,example:word.examples[0]?.ro??'',exampleRu:word.examples[0]?.ru??'',level:word.moduleId.split('.')[0] as Level,topic:word.moduleId,custom:false})),
  ...Object.values(customCards).filter(card=>!card.deleted).map(card=>({id:card.id,ro:card.ro,ru:card.ru,forms:'',example:card.example,exampleRu:'',level:null,topic:'personal',custom:true})),
 ];
}
export function filterCards(cards:StudyCard[],snapshot:Snapshot,filters:CardFilters,now:number):StudyCard[]{
 const saved=new Set(snapshot.savedWords);const query=fold(filters.query);
 const selected=cards.filter(card=>{
  if(filters.deck==='saved'&&!saved.has(card.id)||filters.deck==='custom'&&!card.custom)return false;
  if(filters.level!=='all'&&card.level!==filters.level||filters.topic!=='all'&&card.topic!==filters.topic)return false;
  if(filters.deck==='due'){const review=snapshot.wordReviews[wordReviewKey(card.id,filters.mode)];if(!review||Date.parse(review.due)>now)return false;}
  return !query||fold([card.ro,card.ru,card.forms,card.example,card.exampleRu].join(' ')).includes(query);
 });
 return filters.deck==='due'?selected.sort((a,b)=>Date.parse(snapshot.wordReviews[wordReviewKey(a.id,filters.mode)].due)-Date.parse(snapshot.wordReviews[wordReviewKey(b.id,filters.mode)].due)):selected;
}
/** Keep a shrinking deck on its last populated page, including an empty deck. */
export function clampCardOffset(count:number,offset:number,pageSize:number):number{
 const lastPage=Math.max(0,Math.ceil(count/pageSize)-1)*pageSize;
 return Math.min(Math.max(0,offset),lastPage);
}
export type CardsRound={ids:string[];pending:string[];attempts:number;missedIds:string[];deferred:string[]};
export function startCardsRound(ids:string[]):CardsRound{const unique=[...new Set(ids)];return {ids:unique,pending:unique,attempts:0,missedIds:[],deferred:[]}}
/** Each miss returns once; a second miss remains due for a later round. */
export function rateCard(round:CardsRound,correct:boolean):CardsRound{
 if(!round.pending.length)return round;
 const [id,...rest]=round.pending;const alreadyMissed=round.missedIds.includes(id);
 return {...round,attempts:round.attempts+1,pending:!correct&&!alreadyMissed?[...rest,id]:rest,missedIds:!correct&&!alreadyMissed?[...round.missedIds,id]:round.missedIds,deferred:!correct&&alreadyMissed?[...round.deferred,id]:round.deferred};
}
export function stopCardsRound(round:CardsRound):CardsRound{return {...round,pending:[],deferred:[...new Set([...round.deferred,...round.pending])]}}
