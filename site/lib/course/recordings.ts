export const MAX_RECORDING_BYTES=5*1024*1024;
export function recordingKey(userId:string,chapterId:string,recordingId:string){
 if(!userId||!/^(G\.(A0|A1|A2|B1|B2)\.\d{2}|EX\.B2\.(P1|R1|R2))$/.test(chapterId)||!/^[a-zA-Z0-9_-]{1,80}$/.test(recordingId))throw new Error('Некорректный адрес записи');
 return `recordings/${encodeURIComponent(userId)}/${chapterId}/${recordingId}`;
}
export function validateRecording(file:{type:string;size:number},prefix:Uint8Array){
 if(file.size<4||file.size>MAX_RECORDING_BYTES)throw new Error('Запись должна быть не больше 5 МБ');
 const mime=file.type.split(';')[0].trim();
 const text=(start:number,end:number)=>String.fromCharCode(...prefix.slice(start,end));
 const webm=prefix[0]===0x1a&&prefix[1]===0x45&&prefix[2]===0xdf&&prefix[3]===0xa3;
 const ogg=text(0,4)==='OggS';const mp4=text(4,8)==='ftyp';
 if(!((mime==='audio/webm'&&webm)||(mime==='audio/ogg'&&ogg)||(['audio/mp4','audio/x-m4a'].includes(mime)&&mp4)))throw new Error('Поддерживаются аудиозаписи WebM, Ogg и MP4');
 return true;
}
