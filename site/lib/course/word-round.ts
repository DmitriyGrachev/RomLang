export type DeckSource='level'|'saved';
export type Round={pending:string[];attempts:number;misses:number;firstTry:number;missedIds:string[]};

export function chooseWordDeck<T extends {id:string;moduleId:string}>(words:T[],level:string,savedIds:string[],source:DeckSource,offset=0):T[]{
 const saved=new Set(savedIds);
 const pool=words.filter(word=>source==='saved'?saved.has(word.id):word.moduleId.startsWith(level+'.'));
 if(!pool.length)return [];
 const start=((offset%pool.length)+pool.length)%pool.length;
 return [...pool.slice(start),...pool.slice(0,start)].slice(0,6);
}

export function startWordRound(ids:string[]):Round{
 return {pending:[...ids],attempts:0,misses:0,firstTry:0,missedIds:[]};
}

export function rateWord(round:Round,recalled:boolean):Round{
 if(!round.pending.length)return round;
 const [head,...rest]=round.pending;
 const missedIds=recalled||round.missedIds.includes(head)?round.missedIds:[...round.missedIds,head];
 return {
  pending:recalled?rest:[...rest,head],
  attempts:round.attempts+1,
  misses:round.misses+(recalled?0:1),
  firstTry:round.firstTry+(recalled&&!round.missedIds.includes(head)?1:0),
  missedIds,
 };
}
