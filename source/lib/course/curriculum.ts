import type {Checkpoint,Lesson,Mission,Module} from './types.ts';

const searchable=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase().replace(/\s+/g,' ').trim();

export function russianCount(count:number,forms:readonly [string,string,string]){
 const n=Math.abs(count);const last=n%10;const teen=n%100>=11&&n%100<=14;
 return `${count} ${forms[teen?2:last===1?0:last>=2&&last<=4?1:2]}`;
}

export function curriculumCounts(modules:Module[],lessons:Lesson[],checkpoints:Checkpoint[],missions:Mission[],level?:string){
 const selected=modules.filter(module=>!level||module.level===level);
 const ids=new Set(selected.flatMap(module=>module.lessons.map(lesson=>lesson.id)));
 const owners=new Set(selected.map(module=>module.id));
 return {modules:selected.length,lessons:lessons.filter(lesson=>ids.has(lesson.id)).length,checkpoints:checkpoints.filter(check=>owners.has(check.moduleId)).length,missions:missions.filter(mission=>owners.has(mission.moduleId)).length};
}

export function searchCurriculum(modules:Module[],lessonMap:Map<string,Lesson>,level:string,query:string){
 const q=searchable(query);
 return modules.filter(module=>module.level===level).flatMap(module=>{
  const wholeModule=!q||searchable([module.id,module.title,module.outcome,module.lexical_coverage.domains,module.lexical_coverage.seed].join(' ')).includes(q);
  const lessons=module.lessons.filter(meta=>{
   const lesson=lessonMap.get(meta.id);
   return !!lesson&&(wholeModule||searchable([meta.id,meta.title,lesson.shortTitle,lesson.goal,lesson.core,lesson.sheet.formula,...lesson.examples.map(example=>example.ro+' '+example.ru)].join(' ')).includes(q));
  });
  return lessons.length?[{module,lessons}]:[];
 });
}
