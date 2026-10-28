import a1 from '../../content/A1.json' with {type:'json'};
import a2 from '../../content/A2.json' with {type:'json'};
import b1 from '../../content/B1.json' with {type:'json'};
import b2 from '../../content/B2.json' with {type:'json'};
import practiceA11 from '../../content/practice-a1.1.json' with {type:'json'};
import curriculum from '../../docs/romanian-curriculum.json' with {type:'json'};
import lifeA1 from '../../content/life-A1.json' with {type:'json'};
import lifeA2 from '../../content/life-A2.json' with {type:'json'};
import lifeB1 from '../../content/life-B1.json' with {type:'json'};
import lifeB2 from '../../content/life-B2.json' with {type:'json'};
import theoryB2 from '../../content/theory-B2.json' with {type:'json'};
import {bankOwners} from './life.ts';
import {depthContent} from './depth.ts';
import {academyUnits,academyExercises,academyWords,academyRecall} from './academy.ts';
import type {LevelContent,Module,Lesson,ExerciseItem,PracticeTopic,WordRecallItem,LifeContent,TheorySupplement,LessonAudit,ExamB2} from './types.ts';
export {courseVersion} from './version.ts';
const foundations=[a1,a2,b1,b2] as unknown as LevelContent[];
export const levels=foundations.map(base=>{
 const added=depthContent.find(content=>content.level===base.level)!;
 return {...base,lessons:[...base.lessons,...added.lessons],dictionary:[...base.dictionary,...added.dictionary],checkpoints:[...base.checkpoints,...added.checkpoints],missions:[...base.missions,...added.missions]};
});
export const modules=levels.flatMap(level=>[...(curriculum.modules as Module[]).filter(module=>module.level===level.level),...depthContent.find(content=>content.level===level.level)!.modules]);
export const lessons=levels.flatMap(x=>x.lessons);
export const dictionary=[...levels.flatMap(x=>x.dictionary),...academyWords];
export const checkpoints=levels.flatMap(x=>x.checkpoints);
export const missions=levels.flatMap(x=>x.missions);
export const lessonMap=new Map(lessons.map(x=>[x.id,x]));
export const wordMap=new Map(dictionary.map(x=>[x.id,x]));
export const checkpointMap=new Map(checkpoints.map(x=>[x.id,x]));
const practice=practiceA11 as {moduleId:string;topics:PracticeTopic[];wordRecall:WordRecallItem[]};
export const practiceTopics=practice.topics;
const lifeContent=[lifeA1,lifeA2,lifeB1,lifeB2] as unknown as LifeContent[];
export const lifeUnits=lifeContent.flatMap(content=>content.units);
export const lifeUnitMap=new Map(lifeUnits.map(unit=>[unit.id,unit]));
const b2Extension=theoryB2 as unknown as {theory:TheorySupplement[];audit:LessonAudit[];exam:ExamB2};
export const theoryExtensions=new Map([...lifeContent.flatMap(content=>content.theory??[]),...b2Extension.theory].map(item=>[item.lessonId,item]));
export const coverageAudit=[...lifeContent.flatMap(content=>content.audit??[]),...b2Extension.audit];
export const examB2=b2Extension.exam;
export const lifeExerciseMap=new Map<string,ExerciseItem>(lifeUnits.flatMap(unit=>unit.exercises.map(e=>[e.id,e] as [string,ExerciseItem])));
export const examExerciseMap=new Map<string,ExerciseItem>([...examB2.reading.flatMap(reading=>reading.questions),...examB2.grammar].map(e=>[e.id,e]));
export const practiceExerciseMap=new Map<string,ExerciseItem>(practiceTopics.flatMap(topic=>topic.exercises.map(e=>[e.id,e] as [string,ExerciseItem])).concat([...lifeExerciseMap,...examExerciseMap,...academyExercises.map(e=>[e.id,e] as [string,ExerciseItem])]));
export const wordRecallMap=new Map<string,WordRecallItem>([
 ...dictionary.map(w=>[w.id,{wordId:w.id,prompt:w.ru+' · Введите форму карточки; синонимы не проверяются.',answers:[w.word],note:'Точная форма карточки. Синонимы и другие формы не проверяются.'}] as [string,WordRecallItem]),
 ...practice.wordRecall.map(item=>[item.wordId,item] as [string,WordRecallItem]),
 ...academyRecall.map(item=>[item.wordId,item] as [string,WordRecallItem]),
]);
export const exerciseOwner=new Map<string,string>([
 ...[...lessons,...checkpoints].flatMap(owner=>owner.exercises.map(e=>[e.id,owner.id] as [string,string])),
 ...practiceTopics.flatMap(topic=>topic.exercises.map(e=>[e.id,topic.id] as [string,string])),
 ...bankOwners(lifeUnits),
 ...[...examExerciseMap.keys()].map(id=>[id,id.split('.e')[0]] as [string,string]),
 ...academyUnits.flatMap(u=>[...u.readings.flatMap(r=>r.questions),...u.exercises,...u.checkpoint].map(e=>[e.id,u.id] as [string,string])),
]);
export const exerciseMap=new Map<string,ExerciseItem>([
 ...[...lessons,...checkpoints].flatMap(l=>l.exercises.map(e=>[e.id,e] as [string,ExerciseItem])),
 ...practiceExerciseMap,
 ...academyExercises.map(e=>[e.id,e] as [string,ExerciseItem]),
]);
export const moduleFor=(id:string)=>modules.find(m=>m.lessons.some(l=>l.id===id)||m.checkpoint_id===id);
export const moduleForExercise=(id:string)=>moduleFor(exerciseOwner.get(id)??'');
export const catalog={checkpointIds:new Set(academyUnits.flatMap(u=>u.checkpoint.map(e=>e.id))),exercises:exerciseMap,lessonIds:new Set([...lessons,...checkpoints,...academyUnits].map(x=>x.id)),wordIds:new Set(dictionary.map(x=>x.id)),wordRecall:wordRecallMap,missions:new Map(missions.map(x=>[x.id,x])),productionCriteria:new Map([...lessons,...checkpoints].map(x=>[x.id,x.production.checklist.length])),lessonExercises:new Map([...lessons,...checkpoints].map(x=>[x.id,x.exercises.map(e=>e.id)])),writingTasks:new Map([...academyUnits.map(u=>u.writing),...examB2.writing].map(t=>[t.id,t.rubric.length]))};
export function getLesson(id:string){return lessonMap.get(id)}
export function getExercise(id:string){return exerciseMap.get(id)}
export function asLesson(id:string):Lesson|undefined{
 const l=lessonMap.get(id);if(l)return l;const check=checkpointMap.get(id);if(!check)return;
 const m=moduleFor(id)!;return {id,shortTitle:'Проверка модуля',goal:m.outcome,core:'Проверь перенос навыка на новые ситуации. Начни без справочника; открытая подсказка будет отмечена как помощь.',detail:[],comparison:'Это внутренняя проверка курса. Уровень CEFR оценивается по всем четырём навыкам.',examples:[],sheet:{title:m.title,formula:m.sheet,rows:[],notes:[]},exercises:check.exercises,production:check.production};
}
