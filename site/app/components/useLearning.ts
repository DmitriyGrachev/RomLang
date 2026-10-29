'use client';
import {useState,useEffect,useSyncExternalStore} from 'react';
import {catalog} from '../../lib/course/data';
import {createLearningSync} from '../../lib/course/sync';
import {createBrowserRecovery} from '../../lib/course/recovery';
import {AccountScopeError} from '../../lib/course/account-scope';
import type {RecoveryStore} from '../../lib/course/recovery';
import type {LearningEvent,Snapshot} from '../../lib/course/types';

async function request(method:'GET'|'POST',expectedAccountScope:string|null,events?:LearningEvent[]){
 const r=await fetch('/api/learning',{method,cache:'no-store',...(method==='POST'?{headers:{'Content-Type':'application/json'},body:JSON.stringify({events,expectedAccountScope})}:{})});
 const d=await r.json() as {snapshot?:Snapshot;accountScope?:string;error?:string;code?:string};
 if(!r.ok||!d.snapshot){const e=new Error(d.error||'Нет связи. Повтори сохранение; не закрывай вкладку до подтверждения.') as Error&{status:number;code?:string};e.status=r.status;e.code=d.code;throw e}
 if(d.accountScope!==expectedAccountScope)throw new AccountScopeError();
 return d.snapshot.events;
}
function recoveryFor(accountScope:string|null):RecoveryStore|undefined{
 if(!accountScope||typeof window==='undefined')return;
 // sessionStorage keeps recovery across reloads and isolates even duplicated tabs.
 // Permanent cross-device history remains in D1. Browser storage access can itself throw.
 let store:RecoveryStore|undefined;
 const current=()=>store??(store=createBrowserRecovery(window.sessionStorage,accountScope));
 return {read:()=>current().read(),write:data=>current().write(data)};
}
export function useLearning(accountScope:string|null=null){
 const [sync]=useState(()=>createLearningSync({load:()=>request('GET',accountScope),save:events=>request('POST',accountScope,events)},catalog,recoveryFor(accountScope)));
 const state=useSyncExternalStore(sync.subscribe,sync.getState,sync.getState);
 useEffect(()=>{
  void sync.initialize();
  const warn=(e:BeforeUnloadEvent)=>{if(sync.getState().hasPending||sync.getState().conflicts.length){e.preventDefault();e.returnValue=''}};
  const retry=()=>void sync.retry();
  const refresh=()=>{if(document.visibilityState==='visible'){if(sync.getState().hasPending)void sync.retry();else void sync.refresh()}};
  window.addEventListener('beforeunload',warn);window.addEventListener('online',retry);document.addEventListener('visibilitychange',refresh);
  return()=>{window.removeEventListener('beforeunload',warn);window.removeEventListener('online',retry);document.removeEventListener('visibilitychange',refresh)};
 },[sync]);
 const exportConflicts=()=>{const data={format:'romana-conflicts',version:1,exportedAt:new Date().toISOString(),conflicts:sync.getState().conflicts};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='romana-conflicting-answers.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
 return {...state,send:sync.send,retry:sync.retry,restore:sync.restore,exportConflicts};
}
export type Learning=ReturnType<typeof useLearning>;
