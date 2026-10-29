import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {catalog,courseVersion,checkpoints,dictionary,exerciseMap,exerciseOwner,lessonMap,lessons,levels,missions,modules,moduleFor,practiceExerciseMap} from '../lib/course/data.ts';
import {curriculumCounts,russianCount,searchCurriculum} from '../lib/course/curriculum.ts';
import {lessonEntryPage,nextOpenModuleIndex} from '../lib/course/activity.ts';
import {emptySnapshot,reduceEvents,validateEvent} from '../lib/course/records.ts';
import {teachingForLesson,teachingForMission} from '../lib/course/support.ts';
import {validateDepth} from '../scripts/validate-depth.mjs';
import type {LevelContent,Module} from '../lib/course/types.ts';

const read=(path:string)=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const baseLevels=['A1','A2','B1','B2'].map(level=>read(`content/${level}.json`)) as LevelContent[];
const depths=['A1','A2','B1','B2'].map(level=>read(`content/depth-${level}.json`));
const baseModules=read('docs/romanian-curriculum.json').modules as Module[];

test('complete authored catalog exposes 192 lessons with separate checks/dialogues and searchable module ownership',()=>{
 assert.deepEqual(curriculumCounts(modules,lessons,checkpoints,missions),{modules:48,lessons:192,checkpoints:48,missions:48});
 for(const level of levels){
  assert.deepEqual(curriculumCounts(modules,lessons,checkpoints,missions,level.level),{modules:12,lessons:48,checkpoints:12,missions:12});
  const result=searchCurriculum(modules,lessonMap,level.level,'');
  assert.equal(result.length,12);assert.deepEqual(result.flatMap(item=>item.lessons.map(lesson=>lesson.id)),level.lessons.map(lesson=>lesson.id));
  for(const lesson of level.lessons){assert.equal(moduleFor(lesson.id)?.level,level.level);assert.ok(searchCurriculum(modules,lessonMap,level.level,lesson.id).some(item=>item.lessons.some(meta=>meta.id===lesson.id)))}
 }
 assert.equal(searchCurriculum(modules,lessonMap,'A1','impossible-search-value-12345').length,0);
 const mod=modules.find(item=>item.id==='A1.7')!;
 assert.equal(searchCurriculum(modules,lessonMap,'A1',mod.title).find(item=>item.module.id===mod.id)?.lessons.length,4);
});

test('existing IDs, authored answers, owners and persisted histories survive the expansion unchanged',()=>{
 for(const base of baseLevels){
  for(const lesson of base.lessons){assert.deepEqual(lessonMap.get(lesson.id),lesson);assert.equal(moduleFor(lesson.id)?.id,baseModules.find(module=>module.lessons.some(item=>item.id===lesson.id))?.id)}
  for(const owner of [...base.lessons,...base.checkpoints])for(const exercise of owner.exercises){assert.deepEqual(exerciseMap.get(exercise.id),exercise);assert.equal(exerciseOwner.get(exercise.id),owner.id)}
  for(const word of base.dictionary)assert.deepEqual(dictionary.find(item=>item.id===word.id),word);
  for(const mission of base.missions)assert.deepEqual(missions.find(item=>item.id===mission.id),mission);
 }
 const item=baseLevels[0].lessons[0].exercises[0];const at='2026-10-27T12:00:00Z';
 const validated=validateEvent({id:'old-answer',type:'attempt',at,payload:{exerciseId:item.id,answer:item.answers[0]}},catalog,emptySnapshot());
 const old={...validated,payload:{...validated.payload,courseVersion:'1.4.0'}};
 const history=reduceEvents([old],catalog);
 const reimported=validateEvent(old,catalog,emptySnapshot());assert.equal(reimported.id,old.id);assert.equal((reimported.payload.result as {correct:boolean}).correct,true);
 const fresh=lessonMap.get('A1.25')!;const added=validateEvent({id:'new-answer',type:'attempt',at,payload:{exerciseId:fresh.exercises[0].id,answer:fresh.exercises[0].answers[0]}},catalog,history);
 const restored=reduceEvents([old,added,old],catalog);
 assert.equal(old.payload.courseVersion,'1.4.0');assert.equal(added.payload.courseVersion,courseVersion);assert.ok(restored.events.some(event=>event.id===old.id&&event.payload.courseVersion==='1.4.0'));
 assert.deepEqual(restored.attempts[item.id],history.attempts[item.id]);assert.equal(restored.attempts[fresh.exercises[0].id].length,1);
 assert.equal(lessonEntryPage('A1.25',history.attempts,history.completed,catalog.lessonExercises.get('A1.25')!),'theory');
 assert.equal(lessonEntryPage('A1.25',restored.attempts,restored.completed,catalog.lessonExercises.get('A1.25')!),'lesson');
 const a1=modules.filter(module=>module.level==='A1');
 const completed=Object.fromEntries(a1.slice(0,6).flatMap(module=>[...module.lessons.map(lesson=>lesson.id),module.checkpoint_id]).map(id=>[id,at]));
 const events=missions.filter(mission=>a1.slice(0,6).some(module=>module.id===mission.moduleId)).map(mission=>({id:mission.id,type:'mission' as const,at,payload:{missionId:mission.id,mode:'independent'}}));
 assert.equal(nextOpenModuleIndex(a1,completed,Object.fromEntries(missions.map(mission=>[mission.moduleId,mission.id])),{},()=>false,events),6);
});

test('new lessons participate in grading, review, core completion and explicit teaching while banks stay separate',()=>{
 for(const depth of depths){
  for(const lesson of depth.lessons){
   assert.deepEqual(teachingForLesson(lesson,[]),depth.lessonTeaching.find((item:{lessonId:string})=>item.lessonId===lesson.id));
   assert.deepEqual(catalog.lessonExercises.get(lesson.id),lesson.exercises.map((item:{id:string})=>item.id));
   for(const item of lesson.exercises){assert.equal(exerciseOwner.get(item.id),lesson.id);assert.ok(catalog.exercises.has(item.id));assert.equal(practiceExerciseMap.has(item.id),false);const event=validateEvent({id:item.id,type:'attempt',at:'2026-10-27T12:00:00Z',payload:{exerciseId:item.id,answer:item.answers[0]}},catalog,emptySnapshot());assert.equal((event.payload.result as {correct:boolean}).correct,true)}
  }
  for(const mission of depth.missions){assert.ok(catalog.missions.has(mission.id));assert.deepEqual(teachingForMission(mission),depth.missionTeaching.find((item:{missionId:string})=>item.missionId===mission.id))}
 }
 const coreIds=new Set([...catalog.lessonExercises.values()].flat());for(const id of practiceExerciseMap.keys())assert.equal(coreIds.has(id),false);
});

test('depth structural validator accepts release assets and detects ownership, choice, ordering and preparation regressions',()=>{
 const result=validateDepth(depths,baseLevels,baseModules);assert.deepEqual(result.errors,[]);assert.equal(result.counts.newLessons,96);assert.equal(result.counts.newExercises,1344);
 const broken=structuredClone(depths);const lesson=broken[0].lessons[0];
 lesson.exercises.find((item:{type:string})=>item.type==='choice').answers=['answer absent from choices'];
 lesson.exercises.find((item:{type:string})=>item.type==='order').tokens=['no','buildable','sentence'];
 lesson.exercises.find((item:{type:string})=>item.type==='gap').answers=['слово'];broken[0].dictionary[0].en='перемена';
 broken[0].dictionary[0].moduleId='A1.1';broken[0].missionTeaching[0].phrases=[];
 const copied=structuredClone(depths[0].lessons[1].exercises.find((item:{type:string})=>item.type==='choice'));
 broken[0].checkpoints[0].exercises[0]={...copied,id:broken[0].checkpoints[0].exercises[0].id,prompt:'Новая формулировка того же вопроса'};
 for(const node of broken[0].missions[0].variants[0].nodes)for(const option of node.options)option.next=node.options[0].next;
 const messages=validateDepth(broken,baseLevels,baseModules).errors.join('\n');
 for(const expected of ['Answer outside choices','Unbuildable order','Dictionary owner','Unprepared dialogue line','Invalid/unprepared dialogue option','Repeated quiz substance','Need real dialogue branch destinations','Expected Romanian answer script','Expected English dictionary script'])assert.ok(messages.includes(expected),expected);
});

test('Russian course counts use natural endings at teen and twenty boundaries',()=>{for(const [count,expected] of [[0,'0 уроков'],[1,'1 урок'],[2,'2 урока'],[4,'4 урока'],[5,'5 уроков'],[11,'11 уроков'],[21,'21 урок'],[24,'24 урока'],[48,'48 уроков'],[192,'192 урока']] as const)assert.equal(russianCount(count,['урок','урока','уроков']),expected)});
