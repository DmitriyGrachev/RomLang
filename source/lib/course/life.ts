import type {Snapshot} from './types.ts';
export type BankRound={bankId:string;ids:string[];index:number;baseline:Record<string,number>;finished:boolean};
export function bankOwners(banks:{anchorLessonId:string;exercises:{id:string}[]}[]){return new Map(banks.flatMap(bank=>bank.exercises.map(e=>[e.id,bank.anchorLessonId] as [string,string])))}
export function firstUnattempted(ids:string[],snapshot:Snapshot){const i=ids.findIndex(id=>!snapshot.attempts[id]?.length);return i<0?ids.length:i}
export function startBankRound(bankId:string,ids:string[],snapshot:Snapshot,resume:boolean):BankRound{
 const index=resume?firstUnattempted(ids,snapshot):0;
 return {bankId,ids:[...ids],index,baseline:Object.fromEntries(ids.map(id=>[id,resume?0:snapshot.attempts[id]?.length??0])),finished:index===ids.length};
}
export function advanceBankRound(round:BankRound,snapshot:Snapshot):BankRound{return reconcileBankRound(round,snapshot)}
function reconcileBankRound(round:BankRound,snapshot:Snapshot):BankRound{
 const firstMissing=round.ids.findIndex(id=>(snapshot.attempts[id]?.length??0)<=round.baseline[id]);
 const index=firstMissing<0?round.ids.length:firstMissing;
 return {...round,index,finished:index===round.ids.length};
}
export function restoreBankRound(raw:string|null,bankId:string,ids:string[],snapshot:Snapshot):BankRound|undefined{
 if(!raw)return;
 try{const r=JSON.parse(raw) as BankRound;
  if(r.bankId!==bankId||!Array.isArray(r.ids)||r.ids.length!==ids.length||new Set(r.ids).size!==ids.length||r.ids.some((id,i)=>id!==ids[i])||!Number.isInteger(r.index)||r.index<0||r.index>ids.length||r.finished!==(r.index===ids.length)||!r.baseline||typeof r.baseline!=='object')return;
  if(ids.some(id=>!Number.isInteger(r.baseline[id])||r.baseline[id]<0||r.baseline[id]>(snapshot.attempts[id]?.length??0)))return;
  return reconcileBankRound(r,snapshot);
 }catch{return}
}
