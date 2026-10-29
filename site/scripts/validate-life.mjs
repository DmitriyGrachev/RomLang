import {readFileSync} from 'node:fs';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const levels=['A1','A2','B1','B2'];
const base=levels.map(level=>read(`content/${level}.json`));
const assets=levels.map(level=>read(`content/life-${level}.json`));
const b2=read('content/theory-B2.json');
const lessons=base.flatMap(x=>x.lessons),lessonMap=new Map(lessons.map(x=>[x.id,x]));
const oldIds=new Set([...base.flatMap(x=>[...x.lessons,...x.checkpoints]).flatMap(x=>x.exercises),...read('content/practice-a1.1.json').topics.flatMap(x=>x.exercises)].map(x=>x.id));
const errors=[],lexicalReview=[],choicePositionDistribution={},newIds=new Set(),unitIds=new Set();
const check=(ok,message)=>{if(!ok)errors.push(message)};
const text=value=>typeof value==='string'&&value.trim().length>0;
const words=value=>(String(value).match(/[\p{Script=Latin}]+(?:[-’'][\p{Script=Latin}]+)*/gu)||[]);
const ruWords=value=>(String(value).match(/[А-Яа-яЁё]+(?:[-’'][А-Яа-яЁё]+)*/gu)||[]).length;
const normalize=value=>String(value).normalize('NFC').toLocaleLowerCase('ro').replaceAll('ş','ș').replaceAll('ţ','ț').replace(/[’‘]/g,"'").replace(/[.,!?;:"„”«»…]/g,'').replace(/\s+/g,' ').trim();
const fold=value=>normalize(value).normalize('NFD').replace(/\p{M}/gu,'');
const levelIndex=id=>levels.indexOf(id.slice(0,2));
const validSource=source=>{try{const url=new URL(source.url);return text(source.title)&&url.protocol==='https:'&&['ubbcluj.ro','coe.int','ilr.ro','acad.ro','lingv.ro'].some(host=>url.hostname===host||url.hostname.endsWith('.'+host))}catch{return false}};
const sources=(items,id)=>{check(Array.isArray(items)&&items.length>0,`${id}: sources missing`);for(const item of items??[])check(validSource(item),`${id}: non-primary or invalid source ${item.url}`)};
const translated=(items,min,id)=>{check(Array.isArray(items)&&items.length>=min,`${id}: need ${min} translated items`);for(const [i,item] of (items??[]).entries())check(text(item.ro)&&text(item.ru),`${id}.${i}: Romanian and Russian required`)};
const canBuild=(answer,tokens)=>{const walk=(rest,remaining)=>{if(!rest)return remaining.length===0;return remaining.some((token,i)=>(rest===token||rest.startsWith(token+' '))&&walk(rest.slice(token.length).trim(),remaining.filter((_,j)=>i!==j)))};return walk(normalize(answer),tokens.map(normalize))};
const exercise=(item,anchor)=>{
 check(!oldIds.has(item.id)&&!newIds.has(item.id),`Duplicate/legacy ID ${item.id}`);newIds.add(item.id);
 check(lessonMap.has(anchor)&&item.id.startsWith(anchor+'.e'),`Invalid real owner ${item.id} → ${anchor}`);
 check(['choice','gap','order','read'].includes(item.type),`Unsupported format ${item.id}`);
 check(Array.isArray(item.answers)&&item.answers.length>0&&item.answers.every(text),`Empty answers ${item.id}`);
 check(text(item.prompt)&&text(item.explanation)&&text(item.hint)&&text(item.tag),`Incomplete teaching ${item.id}`);
 check(['grammar','reading'].includes(item.skill)&&(item.type!=='read'||item.skill==='reading'),`Unexpected skill ${item.id}`);
 if(['choice','read'].includes(item.type)){
  check(item.choices?.length>=3,`Need 3+ choices ${item.id}`);
  check(new Set((item.choices??[]).map(fold)).size===item.choices?.length,`Folded distractor collision ${item.id}`);
  check(item.answers?.every(answer=>item.choices?.some(choice=>normalize(choice)===normalize(answer))),`Answer not in choices ${item.id}`);
 }
 if(item.type==='order'){
  check(item.tokens?.length>=2,`Missing order tokens ${item.id}`);
  check(item.answers?.every(answer=>canBuild(answer,item.tokens??[])),`Accepted order not buildable ${item.id}`);
 }
 if(item.type==='read')check(text(item.text),`Missing full passage ${item.id}`);
};
const anchors=[['A1.22','A1.21','A1.20','A1.04'],['A2.21','A2.17','A2.20','A2.22'],['B1.17','B1.18','B1.15','B1.20'],['B2.14','B2.17','B2.09','B2.12']];
const expectedUnits=[['SHOP','CAFE','STREET','NEIGHBOR'],['TRAVEL','RETURN','HOME','HEALTH'],['TRAVEL','CAFE','NEIGHBOR','SERVICE'],['CONSUMER','NEIGHBOR','TRAVEL','DISCUSSION']];
const a1Support=read('content/A1-support.json');
for(const lesson of base[0].lessons)check(a1Support.lessons.some(x=>x.lessonId===lesson.id&&x.words?.every(w=>text(w.ro)&&text(w.ru))&&x.phrases?.every(w=>text(w.ro)&&text(w.ru))),`Existing A1 support missing ${lesson.id}`);
for(const [li,asset] of assets.entries()){
 const level=levels[li];check(asset.level===level,`${level}: level mismatch`);check(asset.units?.length===4,`${level}: need four units`);
 const usedAnchors=new Set();
 for(const unit of asset.units??[]){
  check(!unitIds.has(unit.id),`Duplicate unit ${unit.id}`);unitIds.add(unit.id);
  check(unit.level===level&&expectedUnits[li].some(name=>unit.id===`LIFE.${level}.${name}`),`Unknown unit ID/level ${unit.id}`);
  check(unit.anchorLessonId===anchors[li][expectedUnits[li].findIndex(name=>unit.id===`LIFE.${level}.${name}`)]&&!usedAnchors.has(unit.anchorLessonId),`Wrong/reused assigned anchor ${unit.id}`);usedAnchors.add(unit.anchorLessonId);
  check(text(unit.title)&&text(unit.domain)&&text(unit.goal)&&text(unit.fictionNote),`${unit.id}: title/domain/goal/fiction note required`);
  check(Array.isArray(unit.prerequisites)&&unit.prerequisites.length>0,`${unit.id}: prerequisite links required`);
  for(const id of unit.prerequisites??[])check(lessonMap.has(id)&&levelIndex(id)<=li&&(levelIndex(id)<li||Number(id.slice(3))<=Number(unit.anchorLessonId.slice(3))),`${unit.id}: future/unknown prerequisite ${id}`);
  const theory=unit.theory??{};
  check(ruWords([theory.core,...theory.detail??[]].join(' '))>=250,`${unit.id}: need 250 Russian words in core/detail`);
  check(text(theory.comparison),`${unit.id}: comparison missing`);
  translated(theory.examples,6,`${unit.id} examples`);translated(unit.words,16,`${unit.id} words`);translated(unit.phrases,8,`${unit.id} phrases`);
  check(theory.mistakes?.length>=3&&theory.mistakes.every(x=>text(x.wrong)&&text(x.right)&&text(x.why)),`${unit.id}: need three explained errors`);
  check(text(theory.sheet?.title)&&text(theory.sheet?.formula)&&theory.sheet?.rows?.length>=4&&theory.sheet.rows.every(row=>row.length>=2&&row.every(text))&&theory.sheet?.notes?.length>=3&&theory.sheet.notes.every(text),`${unit.id}: incomplete sheet`);
  check(unit.exercises?.length===16,`${unit.id}: need 16 exercises`);
  for(const type of ['choice','gap','order','read'])check(unit.exercises?.filter(x=>x.type===type).length===4,`${unit.id}: need four ${type}`);
  for(const [i,item] of (unit.exercises??[]).entries()){
   check(item.id===unit.anchorLessonId+'.e'+(501+i),`${unit.id}: nonsequential ID ${item.id}`);exercise(item,unit.anchorLessonId);
   if(item.type==='read')check(words(item.text).length>=[45,80,130,180][li],`${item.id}: passage too short (${words(item.text).length})`);
  }
  const transfer=unit.transfer??{};check(text(transfer.prompt)&&text(transfer.model)&&transfer.checklist?.length>=3&&transfer.checklist.every(text),`${unit.id}: transfer missing`);
  // Surface-form support is a review aid, not a Romanian morphological parser or level certification.
  const earlier=base.slice(0,li+1).flatMap(x=>x.lessons).filter(x=>levelIndex(x.id)<li||Number(x.id.slice(3))<=Number(unit.anchorLessonId.slice(3)));
  const prep=[...[...unit.words??[],...unit.phrases??[],...theory.examples??[]].map(x=>x.ro),theory.core,...theory.detail??[],theory.comparison,theory.sheet?.formula,...theory.sheet?.rows?.flat()??[],...theory.sheet?.notes??[],...(theory.mistakes??[]).map(x=>x.right)].join(' ');
  const dictionary=base.slice(0,li+1).flatMap(x=>x.dictionary).filter(x=>levelIndex(x.lessonId)<li||Number(x.lessonId.slice(3))<=Number(unit.anchorLessonId.slice(3)));
  const support=li===0?a1Support.lessons.filter(x=>Number(x.lessonId.slice(3))<=Number(unit.anchorLessonId.slice(3))).flatMap(x=>[...x.words,...x.phrases]).map(x=>x.ro).join(' '):'';
  const known=new Set(words([prep,support,...earlier.flatMap(x=>[...x.examples.map(e=>e.ro),...x.sheet.rows.flat()]),...dictionary.flatMap(x=>[x.word,x.forms,...x.examples.map(e=>e.ro)])].join(' ')).map(fold));
  const answerWords=new Set((unit.exercises??[]).flatMap(x=>(x.answers??[]).flatMap(words)).filter(x=>x.length>2).map(fold));
  const unknown=[...answerWords].filter(word=>!known.has(word));
  if(unknown.length)lexicalReview.push({unitId:unit.id,unmatchedAnswerSurfaces:unknown});
 }
}
const extensions=[...assets.flatMap(x=>x.theory??[]),...b2.theory??[]];
const audits=[...assets.flatMap(x=>x.audit??[]),...b2.audit??[]];
check(extensions.length===46,'Need 46 theory supplements');check(new Set(extensions.map(x=>x.lessonId)).size===46,'Duplicate theory supplement');
const expectedTheory=[['A1.04','A1.12','A1.13','A1.19','A1.20','A1.21','A1.22'],['A2.03','A2.05','A2.12','A2.17','A2.20','A2.21','A2.22'],['B1.01','B1.07','B1.09','B1.13','B1.15','B1.17','B1.18','B1.20'],base[3].lessons.map(x=>x.id)].flat();
for(const id of expectedTheory)check(extensions.some(x=>x.lessonId===id),`Missing assigned extension ${id}`);
for(const extension of extensions){
 const id=extension.lessonId;check(lessonMap.has(id)&&text(extension.title),`Invalid theory anchor ${id}`);
 check(extension.sections?.length>=3&&extension.sections.every(x=>text(x.title)&&x.body?.length&&x.body.every(text)),`${id}: incomplete theory sections`);
 check(ruWords(extension.sections?.flatMap(x=>x.body).join(' '))>=(id.startsWith('B2')?300:200),`${id}: Russian explanation too short`);
 translated(extension.sections?.flatMap(x=>x.examples)??[],6,`${id} supplement examples`);
 check(extension.pitfalls?.length>=3&&extension.pitfalls.every(x=>text(x.wrong)&&text(x.right)&&text(x.why)),`${id}: need 3 pitfalls`);
 check(extension.decisionGuide?.length>=3&&extension.decisionGuide.every(text),`${id}: need 3 decision steps`);
 check(extension.sheetRows?.length>=4&&extension.sheetRows.every(row=>row.length>=2&&row.every(text)),`${id}: need 4 sheet rows`);sources(extension.sources,id);
}
check(audits.length===96&&new Set(audits.map(x=>x.lessonId)).size===96,'Need 96 distinct lesson audits');
for(const audit of audits){check(lessonMap.has(audit.lessonId)&&['reviewed','expanded'].includes(audit.status)&&text(audit.findings)&&audit.coverage?.length>0&&audit.coverage.every(text),`Incomplete audit ${audit.lessonId}`);if(audit.status==='expanded')check(extensions.some(x=>x.lessonId===audit.lessonId),`Expanded audit needs supplement ${audit.lessonId}`)}
const exam=b2.exam??{};check(text(exam.title)&&text(exam.scopeNote),'Missing B2 scope');sources(exam.sources,'B2 exam');
check(exam.reading?.length===4,'Need four full B2 readings');
const readingAnchors=['B2.20','B2.19','B2.22','B2.17'];
for(const [i,reading] of (exam.reading??[]).entries()){
 const length=words(reading.text).length;check(length>=300&&length<=450,`${reading.id}: reading ${length} words outside 300–450`);check(text(reading.id)&&text(reading.title)&&reading.questions?.length===4,`${reading.id}: need 4 questions`);
 for(const [j,item] of (reading.questions??[]).entries()){check(item.id===readingAnchors[i]+'.e'+(701+j)&&item.type==='read',`${reading.id}: bad reading question ID/type ${item.id}`);check(item.text===reading.text,`${item.id}: full text must match source passage`);exercise(item,readingAnchors[i])}
}
check(exam.grammar?.length===24,'Need 24 grammar/lexis items');
for(const [i,item] of (exam.grammar??[]).entries()){const anchor='B2.'+String(i+1).padStart(2,'0');check(item.id===anchor+'.e901'&&['choice','gap','order'].includes(item.type),`Wrong grammar ID/type ${item.id}`);exercise(item,anchor)}
check(new Set((exam.grammar??[]).map(x=>x.type)).size===3,'Grammar needs choice/gap/order mix');
check(exam.writing?.length===4,'Need four writing tasks');
for(const task of exam.writing??[]){const length=words(task.model).length;check(text(task.id)&&text(task.title)&&text(task.prompt)&&task.targetWords?.length===2&&task.targetWords[0]>=180&&task.targetWords[1]<=260&&task.targetWords[0]<=task.targetWords[1],`${task.id}: invalid writing target`);check(length>=180&&length<=260&&length>=task.targetWords?.[0]&&length<=task.targetWords?.[1],`${task.id}: model ${length} words does not meet target`);check(task.plan?.length>=3&&task.plan.every(text)&&task.annotations?.length>=3&&task.annotations.every(text)&&text(task.transferPrompt),`${task.id}: missing plan/annotations/fresh transfer`);check(task.rubric?.length===5&&task.rubric.every(x=>text(x.criterion)&&text(x.description)),`${task.id}: need 5 rubric dimensions`)}
check(exam.speaking?.length===4,'Need four speaking tasks');
for(const task of exam.speaking??[])check(text(task.id)&&text(task.title)&&text(task.prompt)&&task.followUps?.length>=2&&task.followUps.every(text)&&task.rubric?.length>=3&&task.rubric.every(text),`${task.id}: incomplete speaking task`);
const practiceIds=new Set([...newIds,...unitIds,...(exam.reading??[]).map(x=>x.id),...(exam.writing??[]).map(x=>x.id),...(exam.speaking??[]).map(x=>x.id)]);
check(exam.readiness?.length>=4,'Need readiness across skills');
check((exam.readiness??[]).some(row=>/аудир|слуш|listen|ascult/i.test(row.skill)&&row.externalRequired),'Readiness must require external natural listening');
for(const row of exam.readiness??[]){check(text(row.skill)&&text(row.canDo)&&text(row.note)&&typeof row.externalRequired==='boolean',`Incomplete readiness ${row.skill}`);check(row.lessonIds?.length>0&&row.lessonIds.every(id=>lessonMap.has(id)),`Invalid readiness lesson references ${row.skill}`);check(Array.isArray(row.practiceIds)&&row.practiceIds.every(id=>practiceIds.has(id)),`Invalid readiness practice references ${row.skill}: ${row.practiceIds}`)}
for(const [label,items] of [...assets.map(asset=>[asset.level,asset.units.flatMap(unit=>unit.exercises)]),['exam-reading',(exam.reading??[]).flatMap(reading=>reading.questions)],['exam-grammar',exam.grammar??[]]]){
 const counts={};
 for(const item of items.filter(item=>['choice','read'].includes(item.type))){const position=item.choices?.findIndex(choice=>item.answers.some(answer=>normalize(answer)===normalize(choice)));counts[position]=(counts[position]??0)+1}
 choicePositionDistribution[label]=counts;
 check(Object.keys(counts).length>=2,`${label}: correct choices occupy only one position`);
}
check(newIds.size===296,`Need 296 new objective items, got ${newIds.size}`);
if(errors.length){console.error(errors.join('\n'));console.error(`${errors.length} life-content failures`);process.exit(1)}
console.log(JSON.stringify({lifeUnits:unitIds.size,newObjectiveItems:newIds.size,theorySupplements:extensions.length,auditedLessons:audits.length,b2WritingModels:exam.writing.length,b2SpeakingTasks:exam.speaking.length,choicePositionDistribution,lexicalSurfaceReview:lexicalReview,validationLimit:'Structural/source-domain and surface-support checks only. Romanian grammar, ambiguity, novelty and level appropriateness require independent language review.'},null,2));
