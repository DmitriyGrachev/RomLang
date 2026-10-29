import {NextResponse} from 'next/server';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {deepChapterMap} from '../../../lib/course/deep';
import {examPaperMap} from '../../../lib/course/exams';
import {recordingKey,validateRecording,MAX_RECORDING_BYTES} from '../../../lib/course/recordings';
import {readBoundedBody,BodyLimitError} from '../../../lib/course/request-body';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const bucket=()=>{const b=(env as unknown as {BUCKET?:R2Bucket}).BUCKET;if(!b)throw new Error('Хранилище записей временно недоступно. Скачайте запись на устройство.');return b};
const fail=(error:string,status=400)=>NextResponse.json({error},{status,headers});
function validScope(id:string){return deepChapterMap.has(id)||examPaperMap.has(id)}
function chapterFrom(request:Request){const id=new URL(request.url).searchParams.get('chapterId')??'';if(!validScope(id))throw new Error('Неизвестная глава или пробник');return id}
function sameOrigin(request:Request){const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin}
export async function GET(request:Request){
 const user=await getChatGPTUser();if(!user)return fail('Войдите через ChatGPT для доступа к своим записям.',401);
 try{const chapterId=chapterFrom(request);const id=new URL(request.url).searchParams.get('id');const b=bucket();
  if(id){const object=await b.get(recordingKey(user.userId,chapterId,id));if(!object)return fail('Запись удалена или не найдена.',404);return new Response(object.body,{headers:{...headers,'Content-Type':object.httpMetadata?.contentType??'audio/webm','Content-Length':String(object.size),'Content-Security-Policy':"default-src 'none'"}})}
  const list=await b.list({prefix:recordingKey(user.userId,chapterId,'prefix').replace(/prefix$/,''),limit:100});
  return NextResponse.json({recordings:list.objects.map(o=>({id:o.key.split('/').at(-1),chapterId,size:o.size,createdAt:o.uploaded.toISOString(),mime:o.httpMetadata?.contentType??'audio/webm'})),truncated:list.truncated},{headers});
 }catch(e){return fail(e instanceof Error?e.message:'Не удалось загрузить записи',503)}
}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return fail('Войдите через ChatGPT для сохранения записи.',401);
 if(!sameOrigin(request))return fail('Неверный источник запроса',403);
 if(Number(request.headers.get('content-length'))>MAX_RECORDING_BYTES+10000)return fail('Запись слишком большая',413);
 try{const body=await readBoundedBody(request,MAX_RECORDING_BYTES+10000);const form=await new Response(body,{headers:{'Content-Type':request.headers.get('content-type')??''}}).formData();const chapterId=String(form.get('chapterId')??'');if(!validScope(chapterId))throw new Error('Неизвестная глава или пробник');
  const file=form.get('audio');if(!(file instanceof File))throw new Error('Прикрепите аудиозапись');
  if(file.size>MAX_RECORDING_BYTES)return fail('Запись должна быть не больше 5 МБ',413);
  const bytes=await file.arrayBuffer();validateRecording(file,new Uint8Array(bytes,0,Math.min(16,bytes.byteLength)));
  const b=bucket();const prefix=`recordings/${encodeURIComponent(user.userId)}/`;const current=await b.list({prefix,limit:100});
  if(current.truncated||current.objects.length>=100)return fail('Сохранено 100 записей. Скачайте и удалите ненужные, чтобы добавить новые.',409);
  const id=crypto.randomUUID();const key=recordingKey(user.userId,chapterId,id);
  await b.put(key,bytes,{httpMetadata:{contentType:file.type},customMetadata:{chapterId,createdAt:new Date().toISOString()}});
  return NextResponse.json({id,chapterId,mime:file.type,size:file.size},{headers});
 }catch(e){return fail(e instanceof Error?e.message:'Не удалось сохранить запись',e instanceof BodyLimitError?413:400)}
}
export async function DELETE(request:Request){
 const user=await getChatGPTUser();if(!user)return fail('Войдите через ChatGPT.',401);if(!sameOrigin(request))return fail('Неверный источник запроса',403);
 try{const chapterId=chapterFrom(request);const id=new URL(request.url).searchParams.get('id')??'';await bucket().delete(recordingKey(user.userId,chapterId,id));return NextResponse.json({deleted:true},{headers})}catch(e){return fail(e instanceof Error?e.message:'Не удалось удалить запись')}
}
