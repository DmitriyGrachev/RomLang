import {test} from 'node:test';
import assert from 'node:assert/strict';
import {recordingKey,validateRecording,MAX_RECORDING_BYTES} from '../lib/course/recordings.ts';
test('recording objects are scoped to user and validated chapter/id with no traversal',()=>{
 assert.notEqual(recordingKey('user-a','G.A1.01','abc'),recordingKey('user-b','G.A1.01','abc'));
 assert.throws(()=>recordingKey('user-a','../../other','abc'));
 assert.throws(()=>recordingKey('user-a','G.A1.01','../abc'));
});
test('recording uploads require allowed MIME, matching audio container and bounded size',()=>{
 assert.equal(validateRecording({type:'audio/webm;codecs=opus',size:100},new Uint8Array([0x1a,0x45,0xdf,0xa3])),true);
 assert.throws(()=>validateRecording({type:'audio/webm',size:100},new TextEncoder().encode('<html>')));
 assert.throws(()=>validateRecording({type:'text/html',size:100},new Uint8Array([0x1a,0x45,0xdf,0xa3])));
 assert.throws(()=>validateRecording({type:'audio/webm',size:MAX_RECORDING_BYTES+1},new Uint8Array([0x1a,0x45,0xdf,0xa3])));
});
