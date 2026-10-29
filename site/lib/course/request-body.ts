export class BodyLimitError extends Error {constructor(){super('Запрос слишком большой');this.name='BodyLimitError'}}
export async function readBoundedBody(request:Request,limit:number):Promise<Uint8Array<ArrayBuffer>>{
 if(Number(request.headers.get('content-length'))>limit)throw new BodyLimitError();
 if(!request.body)return new Uint8Array(0);
 const reader=request.body.getReader();const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new BodyLimitError()}chunks.push(value)}}finally{reader.releaseLock()}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}return bytes;
}
