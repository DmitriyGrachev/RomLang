import type {Snapshot} from './types.ts';

export type ErrorGroup={ownerId:string;exerciseIds:string[];failures:number;lastFailedAt:string};

export function reviewableExercises<T extends {id:string}>(snapshot:Snapshot,items:T[],bankIds:Set<string>):T[]{
 return items.filter(item=>!bankIds.has(item.id)||!!snapshot.attempts[item.id]?.length);
}

export function targetedBankIds(failedIds:string[],catalog:Map<string,{tag:string}>,bank:{id:string;tag:string}[]):string[]{
 const failedTags=new Set(failedIds.flatMap(id=>{const tag=catalog.get(id)?.tag;return tag?[tag]:[]}));
 const matching=bank.filter(item=>failedTags.has(item.tag));
 return (matching.length?matching:bank).map(item=>item.id);
}

export function errorGroups(snapshot:Snapshot,items:{id:string}[],owners:Map<string,string>,now:Date):ErrorGroup[]{
 const cutoff=now.getTime()-30*24*60*60*1000;
 const groups=new Map<string,ErrorGroup>();
 for(const {id} of items){
  const ownerId=owners.get(id),attempts=snapshot.attempts[id];
  if(!ownerId||!attempts?.length||attempts.at(-1)?.correct)continue;
  const failures=attempts.filter(a=>!a.correct&&Date.parse(a.at)>=cutoff&&Date.parse(a.at)<=now.getTime());
  if(!failures.length)continue;
  const group=groups.get(ownerId)??{ownerId,exerciseIds:[],failures:0,lastFailedAt:''};
  group.exerciseIds.push(id);
  group.failures+=failures.length;
  const latest=failures.at(-1)!.at;
  if(latest>group.lastFailedAt)group.lastFailedAt=latest;
  groups.set(ownerId,group);
 }
 return [...groups.values()].sort((a,b)=>b.exerciseIds.length-a.exerciseIds.length||b.failures-a.failures||b.lastFailedAt.localeCompare(a.lastFailedAt));
}
