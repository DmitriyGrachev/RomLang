export class AccountScopeError extends Error{
 readonly status=409;
 readonly code='ACCOUNT_CHANGED';
 constructor(){super('Аккаунт изменился. Перезагрузи страницу перед продолжением.');this.name='AccountScopeError'}
}
export async function learningAccountScope(userId:string){
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('romana-learning-account-v1:'+userId));
 return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
export function assertLearningAccountScope(expected:unknown,actual:string){if(expected!==actual)throw new AccountScopeError()}
