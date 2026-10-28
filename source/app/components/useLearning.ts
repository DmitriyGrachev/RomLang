'use client';
import {useState,useEffect,useSyncExternalStore} from 'react';
import {catalog} from '../../lib/course/data';
import {createLearningSync} from '../../lib/course/sync';
import type {LearningEvent,Snapshot} from '../../lib/course/types';
async function request(method:'GET'|'POST',events?:LearningEvent[]){
 const r=await fetch('/api/learning',{method,cache:'no-store',...(method==='POST'?{headers:{'Content-Type':'application/json'},body:JSON.stringify({events})}:{})});
 const d=await r.json() as {snapshot?:Snapshot;error?:string};if(!r.ok||!d.snapshot){const e=new Error(d.error||'Нет связи. Ответы остаются в открытой вкладке; повторите сохранение.') as Error&{status:number};e.status=r.status;throw e}return d.snapshot.events;
}
export function useLearning(){
 const [sync]=useState(()=>createLearningSync({load:()=>request('GET'),save:events=>request('POST',events)},catalog));
 const state=useSyncExternalStore(sync.subscribe,sync.getState,sync.getState);
 useEffect(()=>{void sync.initialize();const warn=(e:BeforeUnloadEvent)=>{if(sync.getState().hasPending){e.preventDefault();e.returnValue=''}};const refresh=()=>{if(document.visibilityState==='visible')void sync.refresh()};window.addEventListener('beforeunload',warn);document.addEventListener('visibilitychange',refresh);return()=>{window.removeEventListener('beforeunload',warn);document.removeEventListener('visibilitychange',refresh)}},[sync]);
 return {...state,send:sync.send,retry:sync.retry,restore:sync.restore};
}
export type Learning=ReturnType<typeof useLearning>;
