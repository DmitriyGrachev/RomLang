import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const depth=['A1','A2','B1','B2'].map(l=>read('content/depth-'+l+'.json'));
const source=['A1','A2','B1','B2'].map((l,i)=>{const base=read('content/'+l+'.json');return {...base,lessons:[...base.lessons,...depth[i].lessons],checkpoints:[...base.checkpoints,...depth[i].checkpoints],missions:[...base.missions,...depth[i].missions]}});
const a1=read('content/A1-support.json');const support=[...a1.missions,...['A2','B1','B2'].flatMap(l=>read('content/'+l+'-mission-support.json').missions),...depth.flatMap(level=>level.missionTeaching)];
const lessonSupport=[...a1.lessons,...depth.flatMap(level=>level.lessonTeaching)];
assert.equal(a1.lessons.length,24);let count=0;
for(const level of source){for(const mission of level.missions){const prepared=support.find(s=>s.missionId===mission.id);assert.ok(prepared,`Missing preparation ${mission.id}`);const meanings=new Map(prepared.phrases.map(p=>[p.ro,p]));for(const v of mission.variants)for(const n of v.nodes)for(const text of [n.ro,...n.options.map(o=>o.text)]){const phrase=meanings.get(text);assert.ok(phrase?.ru?.trim(),`No meaning before dialogue: ${mission.id}: ${text}`);count++}}
 for(const l of [...level.lessons,...level.checkpoints])for(const e of l.exercises){assert.notEqual(e.type,'listen',`Audio-only item ${e.id}`);if(e.type==='read'){assert.ok(e.text?.trim());assert.equal(e.skill,'reading')}}}
for(const lesson of source[0].lessons)assert.ok(lessonSupport.some(s=>s.lessonId===lesson.id&&s.words.length&&s.phrases.every(p=>p.ru)),`No explicit A1 teaching ${lesson.id}`);
const first=a1.lessons.find(s=>s.lessonId==='A1.01');assert.ok(first.words.some(w=>w.ro==='țară'&&w.ru==='страна'),'Country must be taught before first spelling question');
const introduction=a1.lessons.find(s=>s.lessonId==='A1.04');const all=introduction.phrases.map(p=>p.ro).join(' ');for(const phrase of ['Cum vă numiți?','Mă numesc Dima','Îmi pare bine','Dumneavoastră?','Sunt din Ucraina'])assert.ok(all.includes(phrase),`Missing introduction teaching ${phrase}`);
const mission=source[0].missions.find(m=>m.id==='MISSION.A1.1');const options=mission.variants.flatMap(v=>v.nodes.flatMap(n=>n.options.map(o=>o.text)));assert.ok(options.some(t=>t.includes('Sunt din Ucraina')));assert.ok(!options.some(t=>t.includes('Rusia')),'Do not assign Russian origin to this learner');
console.log(JSON.stringify({a1LessonSupports:lessonSupport.filter(lesson=>lesson.lessonId.startsWith('A1.')).length,explicitLessonSupports:lessonSupport.length,preparedMissions:support.length,translatedMissionOccurrences:count,unknownMissionPhrases:0,syntheticAudioTasks:0}));
