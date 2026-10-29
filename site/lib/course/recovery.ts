import type {LearningEvent} from './types.ts';

export type LearningConflict={event:LearningEvent;reason:string};
export type RecoveryData={confirmed:LearningEvent[];pending:LearningEvent[];conflicts?:LearningConflict[]};
export type RecoveryStore={read:()=>RecoveryData|null;write:(data:RecoveryData)=>void};
type DeviceStorage=Pick<Storage,'getItem'|'setItem'>;

// This is a device recovery copy. D1 remains the authoritative cross-device record.
// The caller supplies the account verified by the server for this page, never a last-used account.
export function createBrowserRecovery(storage:DeviceStorage,accountScope:string):RecoveryStore{
 if(!/^[a-f0-9]{64}$/.test(accountScope))throw new Error('Некорректный ключ восстановления');
 const key='romana-course-recovery-v1:'+accountScope;
 return {
  read(){
   const raw=storage.getItem(key);if(!raw)return null;
   const data=JSON.parse(raw);
   if(data.version!==1||data.accountScope!==accountScope||!Array.isArray(data.confirmed)||!Array.isArray(data.pending)||data.confirmed.length+data.pending.length>100000)throw new Error('Не удалось прочитать локальную копию');
   if(data.conflicts!==undefined&&(!Array.isArray(data.conflicts)||data.conflicts.some((c:LearningConflict)=>!c?.event?.id||typeof c.reason!=='string')))throw new Error('Не удалось прочитать локальные конфликты');
   return {confirmed:data.confirmed,pending:data.pending,conflicts:data.conflicts??[]};
  },
  write(data){storage.setItem(key,JSON.stringify({version:1,accountScope,...data}))},
 };
}
