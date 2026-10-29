import type {Snapshot} from './types.ts';

export type ReviewMode='due'|'errors'|'fresh';
export function reviewSources(s:Snapshot,items:{id:string;tag:string}[],now:Date){
 const known=new Set(items.map(e=>e.id));
 const failedTags=new Set(Object.values(s.attempts).filter(attempts=>attempts.some(a=>!a.correct)).map(attempts=>attempts[0]?.tag));
 const due=Object.keys(s.reviews).filter(id=>known.has(id)&&Date.parse(s.reviews[id].due)<=now.getTime()).sort((a,b)=>Date.parse(s.reviews[a].due)-Date.parse(s.reviews[b].due));
 const errors=Object.entries(s.attempts).filter(([id,attempts])=>known.has(id)&&attempts.length>0&&!attempts.at(-1)?.correct).map(([id])=>id);
 const fresh=items.filter(e=>!s.attempts[e.id]?.length&&failedTags.has(e.tag)).map(e=>e.id);
 return {due,errors,fresh};
}

export function roundResults(ids:string[],baseline:Record<string,number>,s:Snapshot){
 let answered=0,correct=0,retried=0,assisted=0;
 for(const id of ids){
  const attempts=(s.attempts[id]||[]).slice(baseline[id]??0);
  if(!attempts.length)continue;
  answered++;
  if(attempts.at(-1)?.correct)correct++;
  if(attempts.length>1)retried++;
  if(attempts.some(a=>a.assisted))assisted++;
 }
 return {answered,correct,retried,assisted};
}
