import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readBoundedBody,BodyLimitError} from '../lib/course/request-body.ts';
test('body limit applies to actual streamed bytes without trusting content length',async()=>{
 let cancelled=false;
 const body=new ReadableStream({start(c){c.enqueue(new Uint8Array(6));c.enqueue(new Uint8Array(6))},cancel(){cancelled=true}});
 await assert.rejects(()=>readBoundedBody(new Request('https://example.test',{method:'POST',body,duplex:'half'} as RequestInit),10),BodyLimitError);
 assert.equal(cancelled,true);
});
test('a bounded multipart body remains parseable and oversized declarations reject early',async()=>{
 const form=new FormData();form.set('chapterId','G.A1.01');form.set('audio',new Blob([new Uint8Array([1,2,3,4])],{type:'audio/webm'}),'sample.webm');
 const request=new Request('https://example.test',{method:'POST',body:form});
 const bytes=await readBoundedBody(request,10000);const parsed=await new Response(bytes,{headers:{'Content-Type':request.headers.get('content-type')!}}).formData();
 assert.equal(parsed.get('chapterId'),'G.A1.01');assert.equal((parsed.get('audio') as File).size,4);
 await assert.rejects(()=>readBoundedBody(new Request('https://example.test',{method:'POST',headers:{'Content-Length':'11'},body:'x'}),10),BodyLimitError);
});
