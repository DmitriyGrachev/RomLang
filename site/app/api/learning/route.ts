import {NextResponse} from 'next/server';
import {eq,asc} from 'drizzle-orm';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {learningEvents} from '../../../db/schema';
import {catalog,courseVersion} from '../../../lib/course/data';
import {reduceEvents,validateEvent,createAccumulator} from '../../../lib/course/records';
import type {LearningEvent} from '../../../lib/course/types';
import {readBoundedBody,BodyLimitError} from '../../../lib/course/request-body';
import {learningAccountScope,assertLearningAccountScope,AccountScopeError} from '../../../lib/course/account-scope';
export const dynamic='force-dynamic';
const noCache={'Cache-Control':'private, no-store'};
async function read(userId:string){const rows=await getDb().select().from(learningEvents).where(eq(learningEvents.userId,userId)).orderBy(asc(learningEvents.at),asc(learningEvents.createdAt),asc(learningEvents.id));return rows.map(r=>({id:r.id,type:r.type,at:r.at,payload:JSON.parse(r.payload)} as LearningEvent))}
export async function GET(){const user=await getChatGPTUser();if(!user)return NextResponse.json({error:'Войдите через ChatGPT, чтобы сохранять прогресс.'},{status:401,headers:noCache});try{return NextResponse.json({courseVersion,accountScope:await learningAccountScope(user.userId),snapshot:reduceEvents(await read(user.userId),catalog)},{headers:noCache})}catch{return NextResponse.json({error:'Не удалось загрузить прогресс. Попробуйте ещё раз.'},{status:503,headers:noCache})}}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return NextResponse.json({error:'Войдите через ChatGPT, чтобы сохранять прогресс.'},{status:401,headers:noCache});
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Неверный источник запроса'},{status:403});
 try{
 const raw=new TextDecoder().decode(await readBoundedBody(request,6_000_000));
 const body=JSON.parse(raw);if(!Array.isArray(body.events)||body.events.length<1||body.events.length>100)throw new Error('Ожидается список событий');
 const accountScope=await learningAccountScope(user.userId);
 // Legacy clients may keep their older event protocol; all new clients and new event families bind writes to their verified account.
 if(body.expectedAccountScope!==undefined||body.events.some((e:LearningEvent)=>e?.type==='study'||e?.type==='exam'))assertLearningAccountScope(body.expectedAccountScope,accountScope);
 const existing=await read(user.userId);const seen=new Set(existing.map(e=>e.id));const accumulator=createAccumulator(catalog,existing);let state=accumulator.snapshot;const fresh:LearningEvent[]=[];
 for(const rawEvent of body.events){if(seen.has(rawEvent?.id))continue;const e=validateEvent(rawEvent,catalog,state);fresh.push(e);seen.add(e.id);accumulator.append(e);state=accumulator.snapshot}
 if(fresh.length){const db=getDb();const now=new Date().toISOString();for(let i=0;i<fresh.length;i+=50){await db.batch(fresh.slice(i,i+50).map((e,j)=>db.insert(learningEvents).values({userId:user.userId,id:e.id,type:e.type,payload:JSON.stringify(e.payload),at:e.at,createdAt:`${now}:${String(i+j).padStart(6,'0')}`}).onConflictDoNothing()) as [any,...any[]])}}
 return NextResponse.json({courseVersion,accountScope,snapshot:reduceEvents(await read(user.userId),catalog)},{headers:noCache});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Не удалось сохранить прогресс',...(e instanceof AccountScopeError?{code:e.code}:{})},{status:e instanceof BodyLimitError?413:e instanceof AccountScopeError?409:400,headers:noCache})}
}
