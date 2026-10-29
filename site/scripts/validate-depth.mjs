import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const text=value=>typeof value==='string'&&!!value.trim();
const norm=value=>String(value??'').normalize('NFC').toLocaleLowerCase('ro').replace(/[.,!?;:"„”«»…]/g,'').replace(/\s+/g,' ').trim();
const ruWords=value=>(String(value??'').match(/[А-Яа-яЁё]+/g)??[]).length;
const roWords=value=>(String(value??'').match(/[\p{L}]+(?:[-’'][\p{L}]+)*/gu)??[]).length;
const romanian=value=>text(value)&&/\p{Script=Latin}/u.test(value)&&!/\p{Script=Cyrillic}/u.test(value);
const translated=entry=>romanian(entry?.ro)&&text(entry?.ru);
const list=value=>Array.isArray(value)?value:[];
const substanceSignature=item=>['choice','read','order'].includes(item.type)?JSON.stringify([item.type,norm(item.text),list(item.answers).map(norm).sort(),list(item.choices).map(norm).sort(),list(item.tokens).map(norm).sort()]):undefined;

export function validateDepth(depths,bases,baseModules,requiredLevels=['A1','A2','B1','B2']){
 const errors=[];const readingLengths={};const check=(ok,message)=>{if(!ok)errors.push(message)};
 const teachingTexts=new Set();const exerciseTexts=new Map();const quizSubstances=new Map();
 const ids=new Set();const moduleIds=new Set();const add=(id,kind)=>{const namespace=kind==='module'?moduleIds:ids;check(text(id),`Missing ${kind} ID`);check(!namespace.has(id),`Duplicate ${kind} ID ${id}`);namespace.add(id)};
 const allLessons=[...bases,...depths].flatMap(level=>list(level.lessons));
 const allModules=[...baseModules,...depths.flatMap(level=>list(level.modules))];
 const lessonMap=new Map(allLessons.map(lesson=>[lesson.id,lesson]));
 const ownerMap=new Map(allModules.flatMap(module=>list(module.lessons).map(lesson=>[lesson.id,module.id])));
 for(const level of bases){for(const lesson of [...level.lessons,...level.checkpoints]){add(lesson.id,'lesson/checkpoint');for(const item of lesson.exercises){add(item.id,'exercise');const signature=substanceSignature(item);if(signature)quizSubstances.set(signature,item.id)}}for(const word of level.dictionary)add(word.id,'word');for(const mission of level.missions)add(mission.id,'mission')}
 for(const baseModule of baseModules)add(baseModule.id,'module');
 const production=(item,id)=>check(text(item?.prompt)&&romanian(item?.model)&&list(item?.checklist).length>=3&&item.checklist.every(text),`Incomplete transfer ${id}`);
 const exercise=(item,owner)=>{
  add(item.id,'exercise');const signature=JSON.stringify([item.type,norm(item.prompt),norm(item.text),list(item.answers).map(norm),list(item.choices).map(norm),list(item.tokens).map(norm)]);check(!exerciseTexts.has(signature),`Duplicate authored exercise ${item.id} and ${exerciseTexts.get(signature)}`);exerciseTexts.set(signature,item.id);const substance=substanceSignature(item);if(substance){check(!quizSubstances.has(substance),`Repeated quiz substance ${item.id} and ${quizSubstances.get(substance)} (rewriting the prompt does not create a new task)`);quizSubstances.set(substance,item.id)}check(item.id.startsWith(owner+'.e'),`Wrong exercise owner ${item.id}`);
  check(['choice','gap','order','read'].includes(item.type),`Unsupported exercise format ${item.id}`);
  check(text(item.prompt)&&list(item.answers).length>0&&item.answers.every(text)&&text(item.hint)&&text(item.explanation),`Incomplete exercise ${item.id}`);
  check(['grammar','reading'].includes(item.skill),`Unsupported or synthetic listening skill ${item.id}`);
  if(['choice','read'].includes(item.type)){
   const choices=list(item.choices).map(norm);const answers=list(item.answers).map(norm);
   check(choices.length>=3&&new Set(choices).size===choices.length,`Distinct choices ${item.id}`);
   check(answers.every(answer=>choices.includes(answer)),`Answer outside choices ${item.id}`);
   check(choices.filter(choice=>answers.includes(choice)).length===1,`Need one constrained choice answer ${item.id}`);
  }
  if(['gap','order'].includes(item.type))check(list(item.answers).every(romanian),`Expected Romanian answer script ${item.id}`);
  if(item.type==='order'){
   const tokens=list(item.tokens).map(norm);
   const build=(rest,remaining)=>!rest?remaining.length===0:remaining.some((token,i)=>token&&(rest===token||rest.startsWith(token+' '))&&build(rest.slice(token.length).trim(),remaining.filter((_,j)=>i!==j)));
   check(tokens.length>=2&&list(item.tokens).every(romanian)&&list(item.answers).some(answer=>build(norm(answer),tokens)),`Unbuildable order ${item.id}`);
  }
  if(item.type==='read')check(romanian(item.text)&&item.skill==='reading',`Unprepared reading ${item.id}`);
 };
 check(depths.length===requiredLevels.length&&requiredLevels.every(level=>depths.some(depth=>depth.level===level)),`Need authored depth catalogs: ${requiredLevels.join(', ')}`);
 check(new Set(depths.map(level=>level.level)).size===depths.length,'Duplicate depth level');
 for(const depth of depths){
  const level=depth.level;check(['A1','A2','B1','B2'].includes(level),`Unknown level ${level}`);
  for(const key of ['modules','lessons','dictionary','checkpoints','missions','lessonTeaching','missionTeaching'])check(Array.isArray(depth[key]),`${level}: missing ${key}`);
  check(list(depth.modules).length===6,`${level}: need six new modules`);check(list(depth.lessons).length===24,`${level}: need 24 new lessons`);
  check(list(depth.checkpoints).length===6&&list(depth.missions).length===6,`${level}: need six checks and six missions`);
  const supports=new Map(list(depth.lessonTeaching).map(item=>[item.lessonId,item]));
  const missionSupports=new Map(list(depth.missionTeaching).map(item=>[item.missionId,item]));
  check(supports.size===24&&list(depth.lessonTeaching).length===24,`${level}: need 24 unique lesson preparations`);
  check(missionSupports.size===6&&list(depth.missionTeaching).length===6,`${level}: need six unique mission preparations`);
  for(const lesson of list(depth.lessons)){
   add(lesson.id,'lesson');const teachingText=norm([lesson.core,...list(lesson.detail),lesson.comparison].join(' '));check(!teachingTexts.has(teachingText),`Cloned lesson explanation ${lesson.id}`);teachingTexts.add(teachingText);check(new RegExp(`^${level}\\.(?:2[5-9]|[34][0-9])$`).test(lesson.id)&&Number(lesson.id.split('.')[1])<=48,`Wrong new lesson ID ${lesson.id}`);
   check(text(lesson.shortTitle)&&text(lesson.goal)&&text(lesson.core)&&text(lesson.comparison),`Missing teaching fields ${lesson.id}`);
   check(list(lesson.detail).length>=4&&lesson.detail.every(text)&&new Set(lesson.detail.map(norm)).size===lesson.detail.length,`Need four teaching paragraphs ${lesson.id}`);
   check(ruWords([lesson.core,...list(lesson.detail),lesson.comparison].join(' '))>=220,`Thin Russian explanation ${lesson.id} (below 220 words; author target 260–450)`);
   check(list(lesson.examples).length>=4&&lesson.examples.every(translated),`Need four translated examples ${lesson.id}`);
   check(text(lesson.sheet?.title)&&text(lesson.sheet?.formula)&&list(lesson.sheet?.rows).length>=4&&lesson.sheet.rows.every(row=>list(row).length>=2&&row.every(text))&&list(lesson.sheet?.notes).length>=3&&lesson.sheet.notes.every(text),`Incomplete sheet ${lesson.id}`);
   check(list(lesson.exercises).length===12&&new Set(lesson.exercises.map(item=>item.type)).size===4,`Need 12 items across four formats ${lesson.id}`);
   for(const item of list(lesson.exercises))exercise(item,lesson.id);
   check(list(lesson.exercises).every((item,i)=>item.id===`${lesson.id}.e${i+1}`),`Sequential item IDs ${lesson.id}`);
   const readings=list(lesson.exercises).filter(item=>item.type==='read');
   check(readings.length>=1,`Need authored passage ${lesson.id}`);readingLengths[lesson.id]=[...new Set(readings.map(item=>roWords(item.text)))];
   const minimum={A1:35,A2:60,B1:95,B2:140}[level]??0;
   check(readingLengths[lesson.id].every(length=>length>=minimum),`Reading below level floor ${lesson.id}: ${readingLengths[lesson.id]}`);
   production(lesson.production,lesson.id);
   const support=supports.get(lesson.id);check(support&&list(support.words).length>=4&&support.words.every(translated)&&list(support.phrases).length>=3&&support.phrases.every(translated)&&list(support.notes).length>=3&&support.notes.every(text),`Incomplete explicit lesson preparation ${lesson.id}`);
  }
  for(const [index,module] of list(depth.modules).entries()){
   add(module.id,'module');check(module.id===`${level}.${index+7}`&&module.level===level,`Wrong module order/level ${module.id}`);
   check(text(module.title)&&text(module.outcome)&&text(module.sheet)&&text(module.vocab)&&text(module.mission)&&text(module.lexical_coverage?.domains)&&text(module.lexical_coverage?.seed)&&list(module.lexical_coverage?.patterns).length>=1,`Incomplete module ${module.id}`);
   check(list(module.lessons).length===4,`Need four module lessons ${module.id}`);
   for(const [lessonIndex,meta] of list(module.lessons).entries()){
    check(meta.id===`${level}.${String(25+index*4+lessonIndex).padStart(2,'0')}`&&lessonMap.has(meta.id),`Module lesson coverage ${module.id}: ${meta.id}`);
    check(text(meta.title)&&text(meta.cheat_sheet_id)&&Array.isArray(meta.prerequisites),`Incomplete lesson metadata ${meta.id}`);
    for(const prerequisite of list(meta.prerequisites))check(lessonMap.has(prerequisite)&&prerequisite!==meta.id&&allLessons.findIndex(lesson=>lesson.id===prerequisite)<allLessons.findIndex(lesson=>lesson.id===meta.id),`Invalid/forward prerequisite ${meta.id}: ${prerequisite}`);
   }
   const words=list(depth.dictionary).filter(word=>word.moduleId===module.id);check(words.length>=18,`Need 18 contextual words ${module.id}`);
   const checkpoint=list(depth.checkpoints).find(item=>item.moduleId===module.id);check(checkpoint?.id===`CHECK.${module.id}`&&module.checkpoint_id===checkpoint?.id,`Checkpoint owner ${module.id}`);
   const mission=list(depth.missions).find(item=>item.moduleId===module.id);check(mission?.id===`MISSION.${module.id}`,`Mission owner ${module.id}`);
  }
  for(const checkpoint of list(depth.checkpoints)){add(checkpoint.id,'checkpoint');check(list(depth.modules).some(module=>module.id===checkpoint.moduleId),`Unknown check owner ${checkpoint.id}`);check(list(checkpoint.exercises).length===8,`Need eight checkpoint items ${checkpoint.id}`);list(checkpoint.exercises).forEach((item,i)=>{check(item.id===`${checkpoint.id}.e${i+1}`,`Sequential check ID ${item.id}`);exercise(item,checkpoint.id)});production(checkpoint.production,checkpoint.id)}
  for(const word of list(depth.dictionary)){
   add(word.id,'word');check(new RegExp(`^${level}\\.d2\\d{3}$`).test(word.id),`Wrong dictionary ID ${word.id}`);
   check(romanian(word.word)&&romanian(word.productive),`Expected Romanian dictionary script ${word.id}`);
   check(romanian(word.en),`Expected English dictionary script ${word.id}`);
   check(['word','stress','ru','en','pos','forms','productive'].every(key=>text(word[key]))&&/[A-ZĂÂÎȘȚÁÉÍÓÚáéíóú\u0301]/u.test(word.stress??''),`Missing word fields/stress marker ${word.id}`);
   check(list(word.examples).length>=2&&word.examples.every(translated),`Need two translated dictionary examples ${word.id}`);
   check(list(depth.lessons).some(lesson=>lesson.id===word.lessonId)&&ownerMap.get(word.lessonId)===word.moduleId,`Dictionary owner ${word.id}`);
   const support=supports.get(word.lessonId);check(list(support?.words).some(item=>norm(item.ro)===norm(word.word)),`Word missing from owner lesson preparation ${word.id}: ${word.word}`);
  }
  for(const mission of list(depth.missions)){
   add(mission.id,'mission');check(text(mission.title)&&list(depth.modules).some(module=>module.id===mission.moduleId),`Unknown mission owner ${mission.id}`);
   check(list(mission.variants).length===2,`Need two mission variants ${mission.id}`);
   const support=missionSupports.get(mission.id);check(support&&list(support.notes).length>=1&&support.notes.every(text)&&list(support.phrases).every(translated),`Incomplete mission preparation ${mission.id}`);
   const meanings=new Map(list(support?.phrases).map(item=>[item.ro,item.ru]));
   for(const [index,variant] of list(mission.variants).entries()){
    const label=`${mission.id} variant ${index+1}`;const nodes=list(variant.nodes);const nodeMap=new Map(nodes.map(node=>[node.id,node]));
    check(text(variant.setting)&&text(variant.goal)&&nodes.length>=3&&nodeMap.size===nodes.length,`Incomplete/duplicate dialogue nodes ${label}`);
    check(nodes.some(node=>new Set(list(node.options).map(option=>option.next)).size>=2),`Need real dialogue branch destinations ${label}`);
    check(nodes.some(node=>list(node.options).some(option=>option.good===false)&&list(node.options).some(option=>option.good===true)),`Need meaningful branching choices ${label}`);
    for(const node of nodes){check(text(node.id)&&text(node.speaker)&&translated(node)&&text(meanings.get(node.ro)),`Unprepared dialogue line ${label}: ${node.id}`);check(list(node.options).length>=1&&new Set(list(node.options).map(option=>norm(option.text))).size===list(node.options).length,`Need distinct dialogue choices ${label}: ${node.id}`);check(list(node.options).some(option=>option.good),`No successful dialogue option ${label}: ${node.id}`);for(const option of list(node.options))check(romanian(option.text)&&text(option.feedback)&&typeof option.good==='boolean'&&text(meanings.get(option.text))&&(option.next==='done'||nodeMap.has(option.next)),`Invalid/unprepared dialogue option ${label}: ${option.text}`)}
    const visited=new Set();const walk=(id,path)=>{if(id==='done')return true;if(path.has(id)||!nodeMap.has(id))return false;visited.add(id);return list(nodeMap.get(id).options).every(option=>walk(option.next,new Set([...path,id])))};
    check(walk(nodes[0]?.id,new Set()),`Nonterminating dialogue ${label}`);check(visited.size===nodes.length,`Unreachable dialogue nodes ${label}`);
    const successfulPaths=(id,path=[])=>id==='done'?[path.length]:path.includes(id)||!nodeMap.has(id)?[]:list(nodeMap.get(id).options).filter(option=>option.good).flatMap(option=>successfulPaths(option.next,[...path,id]));const lengths=successfulPaths(nodes[0]?.id);check(lengths.length>0&&Math.min(...lengths)>=3,`Need three successful dialogue turns ${label}`);
   }
  }
  for(const support of list(depth.lessonTeaching))check(list(depth.lessons).some(lesson=>lesson.id===support.lessonId),`Orphan lesson support ${support.lessonId}`);
  for(const support of list(depth.missionTeaching))check(list(depth.missions).some(mission=>mission.id===support.missionId),`Orphan mission support ${support.missionId}`);
 }
 return {errors,counts:{levels:depths.length,modules:allModules.length,lessons:allLessons.length,newLessons:depths.reduce((sum,level)=>sum+list(level.lessons).length,0),newExercises:depths.reduce((sum,level)=>sum+[...list(level.lessons),...list(level.checkpoints)].reduce((n,item)=>n+list(item.exercises).length,0),0),newWords:depths.reduce((sum,level)=>sum+list(level.dictionary).length,0)},readingLengths};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{const read=path=>JSON.parse(readFileSync(path,'utf8'));const levels=['A1','A2','B1','B2'];const chosen=process.argv.includes('--level')?[process.argv[process.argv.indexOf('--level')+1]]:levels;if(chosen.some(level=>!levels.includes(level)))throw new Error('Use --level A1, A2, B1 or B2');const result=validateDepth(chosen.map(level=>read(`content/depth-${level}.json`)),levels.map(level=>read(`content/${level}.json`)),read('docs/romanian-curriculum.json').modules,chosen);if(result.errors.length){console.error(result.errors.join('\n'));console.error(`${result.errors.length} depth validation failures`);process.exitCode=1}else console.log(JSON.stringify({...result.counts,readingLengths:result.readingLengths}));}
 catch(error){console.error(`Depth catalog unavailable or invalid: ${error.message}`);process.exitCode=1}
}
