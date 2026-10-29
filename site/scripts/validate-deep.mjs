import {readFileSync,existsSync} from 'node:fs';
const load=path=>JSON.parse(readFileSync(path,'utf8'));
const expected={A0:8,A1:24,A2:28,B1:28,B2:32};
const errors=[],warnings=[];const chapters=[];const totals={};
const ensure=(ok,message)=>{if(!ok)errors.push(message)};
const words=s=>(s.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)??[]).length;
const normalize=s=>s.normalize('NFC').toLocaleLowerCase('ro').replace(/\s+/g,' ').trim();
for(const [level,count] of Object.entries(expected)){const list=load(`content/deep/${level}.json`);ensure(Array.isArray(list),`${level}: expected chapter array`);ensure(list.length===count,`${level}: ${list.length}/${count} chapters`);chapters.push(...list);totals[level]={chapters:list.length,theoryWords:0,practice:0,control:0,retention:0,audioScripts:0};}
const ids=new Set(chapters.map(c=>c.id));ensure(ids.size===chapters.length,'Duplicate chapter IDs');
const exerciseIds=new Set();const sourceIds=new Set(['cefr','doom','ubb-description','roexam','ubb-a1a2','ubb-b1','ubb-b2','myro','romanian-ukrainian','essential-grammar']);
const oldLessons=new Set(),oldAcademy=new Set();
// Four introductory A0 reading/course-navigation objectives intentionally assess
// recognising a role, a card field or an assistance condition, not producing a Romanian form.
const recognitionOnlyA0=new Set(['G.A0.01.o2','G.A0.02.o3','G.A0.08.o1','G.A0.08.o2']);
for(const level of ['A1','A2','B1','B2']){
 for(const path of [`content/${level}.json`,`content/depth-${level}.json`])if(existsSync(path))for(const l of load(path).lessons??[])oldLessons.add(l.id);
 for(const chapter of load(`content/academy/${level}.json`))oldAcademy.add(chapter.id);
}
const mappedLessons=new Set(chapters.flatMap(c=>c.legacyLessonIds));
const mappedAcademy=new Set(chapters.flatMap(c=>c.academyIds));
for(const id of oldLessons)ensure(mappedLessons.has(id),`Unmapped legacy lesson ${id}`);
for(const id of oldAcademy)ensure(mappedAcademy.has(id),`Unmapped academy chapter ${id}`);
for(const id of mappedLessons)ensure(oldLessons.has(id),`Unknown legacy cross-link ${id}`);
for(const id of mappedAcademy)ensure(oldAcademy.has(id),`Unknown academy cross-link ${id}`);
for(const c of chapters){
 const base=c.id;ensure(expected[c.level]!==undefined,`${base}: unknown level`);ensure(new RegExp(`^G\\.${c.level}\\.\\d{2}$`).test(base),`${base}: malformed ID`);
 const objectives=new Map(c.objectives.map(o=>[o.id,o]));ensure(objectives.size===3,`${base}: exactly three objectives required`);
 ensure(c.objectives.every(o=>o.label?.length>10&&['grammar','reading','listening','writing','speaking'].includes(o.skill)),`${base}: observable labelled objectives required`);
 for(const prerequisite of c.prerequisites)ensure(ids.has(prerequisite)&&prerequisite!==base,`${base}: missing/self prerequisite ${prerequisite}`);
 const keys=new Set(c.sections.map(s=>s.key));ensure(['meaning','formation','usage','contrasts','limits','interference','depth'].every(k=>keys.has(k))&&keys.size===7,`${base}: seven theory sections required`);
 ensure(c.sections.every(s=>s.title?.trim()&&s.body?.length&&s.body.every(p=>typeof p==='string'&&p.trim())),`${base}: empty theory section`);
 const wc=words(c.sections.flatMap(s=>s.body).join(' '));totals[c.level].theoryWords+=wc;ensure(wc>=350,`${base}: only ${wc} theory words`);
 const complex=c.level==='B2'&&/клитик|местоимен|падеж|относитель|услов|пассив|согласован|информацион|аргумент|дискурс|уступ|времен|регистр/i.test(c.title);if(complex)ensure(wc>=600,`${base}: complex B2 chapter needs substantive depth, currently ${wc} words`);
 ensure(c.examples?.length>=8&&c.examples.every(x=>x.ro&&x.ru&&x.why),`${base}: annotated bilingual examples`);
 ensure(c.contrasts?.length>=2&&c.contrasts.every(x=>x.left?.ro&&x.right?.ro&&x.why),`${base}: meaning contrasts`);
 ensure(c.pitfalls?.length>=4&&c.pitfalls.every(x=>x.wrong&&x.right&&x.why),`${base}: explained errors`);
 ensure(c.selfExplanation?.length>=3,`${base}: self explanation questions`);
 ensure(c.forms?.length&&c.forms.every(t=>t.headers.length>=2&&t.rows.length&&t.rows.every(r=>r.length===t.headers.length&&r.every(x=>typeof x==='string'))),`${base}: malformed form table`);
 const prompts=new Set();for(const e of c.exercises){
  ensure(!exerciseIds.has(e.id),`${base}: duplicate exercise ${e.id}`);exerciseIds.add(e.id);ensure(objectives.has(e.objectiveId),`${e.id}: unknown objective`);ensure(e.familyId&&e.familyId.length<200,`${e.id}: missing family`);
  ensure(['practice','control','retention'].includes(e.mode),`${e.id}: invalid mode`);ensure(['choice','gap','transform','edit','explain'].includes(e.kind),`${e.id}: invalid kind`);
  ensure(e.prompt&&e.explanation&&e.hint,`${e.id}: prompt, explanation and hint required`);ensure(e.kind==='explain'||(Array.isArray(e.answers)&&e.answers.length&&e.answers.every(a=>typeof a==='string'&&a.trim())),`${e.id}: empty answer key`);
  ensure(e.kind!=='choice'||(e.choices?.length>=2&&e.answers.some(a=>e.choices.includes(a))),`${e.id}: choice key is not an option`);
  if(e.caseSensitive!==undefined)ensure(typeof e.caseSensitive==='boolean',`${e.id}: invalid case flag`);if(e.punctuationSensitive!==undefined)ensure(typeof e.punctuationSensitive==='boolean',`${e.id}: invalid punctuation flag`);
  const prompt=normalize((e.context??'')+' '+e.prompt);if(prompts.has(prompt))warnings.push(`${e.id}: repeated exact prompt`);prompts.add(prompt);
  totals[c.level][e.mode]++;
 }
 const counts=Object.fromEntries(['practice','control','retention'].map(m=>[m,c.exercises.filter(e=>e.mode===m).length]));for(const [mode,min] of Object.entries(c.level==='B2'?{practice:20,control:8,retention:4}:{practice:12,control:6,retention:3}))ensure(counts[mode]>=min,`${base}: ${mode} ${counts[mode]}/${min}`);
 ensure(c.exercises.filter(e=>e.kind==='choice').length<=c.exercises.length/3,`${base}: too much recognition-only practice`);
 for(const objective of c.objectives){
  const own=c.exercises.filter(e=>e.objectiveId===objective.id);const practice=new Set(c.exercises.filter(e=>e.mode==='practice').map(e=>e.familyId));const controls=own.filter(e=>e.mode==='control'&&e.kind!=='explain'&&!practice.has(e.familyId));
  ensure(new Set(controls.map(e=>e.familyId)).size>=2,`${objective.id}: fewer than two independent control families`);
  const readingRecognition=c.level==='A0'&&objective.skill==='reading'&&recognitionOnlyA0.has(objective.id);
  ensure(readingRecognition||controls.some(e=>e.kind!=='choice'),`${objective.id}: no generated control response`);
  ensure(own.some(e=>e.mode==='practice'),`${objective.id}: no preparation`);
  const familiar=new Set(c.exercises.filter(e=>e.mode!=='retention').map(e=>e.familyId));ensure(own.some(e=>e.mode==='retention'&&e.kind!=='explain'&&!familiar.has(e.familyId)),`${objective.id}: no fresh retention context`);
 }
 const writing=c.writing;ensure(writing?.prompt&&writing.transferPrompt&&writing.prompt!==writing.transferPrompt&&writing.plan?.length>=3&&writing.rubric?.length>=4&&writing.targetWords?.length===2&&writing.targetWords[0]<writing.targetWords[1],`${base}: incomplete writing cycle`);
 ensure(c.speaking?.prompt&&c.speaking.followUps?.length>=3&&c.speaking.rubric?.length>=4,`${base}: incomplete speaking task`);
 const minAudio={A0:25,A1:50,A2:80,B1:120,B2:180}[c.level];
 for(const [script,questions] of [['script','questions'],['transferScript','transferQuestions']]){ensure(words(c.listening?.[script]??'')>=minAudio,`${base}: ${script} too short (${words(c.listening?.[script]??'')}/${minAudio})`);ensure(c.listening?.[questions]?.length>=3&&c.listening[questions].every(q=>q.prompt&&q.answers?.length&&q.explanation),`${base}: missing listening questions`);totals[c.level].audioScripts++;}
 ensure(c.listening.script!==c.listening.transferScript,`${base}: repeated listening script`);
 ensure(c.sourceIds?.length&&c.sourceIds.every(s=>sourceIds.has(s)),`${base}: unregistered source`);
}
const visiting=new Set(),visited=new Set();const map=new Map(chapters.map(c=>[c.id,c]));function visit(id){if(visiting.has(id)){errors.push(`Prerequisite cycle at ${id}`);return}if(visited.has(id)||!map.has(id))return;visiting.add(id);for(const p of map.get(id).prerequisites)visit(p);visiting.delete(id);visited.add(id)}chapters.forEach(c=>visit(c.id));
const papers=[...load('content/exams/v1.json'),...load('content/exams/reserve-v1.json')];ensure(papers.length===3,`Exam papers: ${papers.length}/3`);const examIds=new Set(),examFamilies=new Set();
for(const p of papers){for(const [part,counts] of [['listening',[8,6,6]],['reading',[6,8,6]],['language',[10,10,10,6,6,8]]]){ensure(p[part]?.length===counts.length,`${p.id}: ${part} block count`);p[part]?.forEach((b,i)=>{ensure(b.items.length===counts[i],`${p.id}.${part}.${i}: expected ${counts[i]} items`);ensure((b.text||b.script)&&b.instructions,`${b.id}: missing context/instructions`);for(const item of b.items){ensure(!examIds.has(item.id),`${item.id}: duplicate exam item`);examIds.add(item.id);ensure(!examFamilies.has(item.familyId),`${item.id}: repeated exam family`);examFamilies.add(item.familyId);ensure(item.answers?.length&&item.explanation,`${item.id}: answer/explanation missing`);ensure(item.kind!=='choice'||item.answers.some(a=>item.choices?.includes(a)),`${item.id}: option mismatch`)}})}
 ensure(p.writing.length===2&&p.speaking.length===3,`${p.id}: production counts`);for(const [i,t] of p.writing.entries()){ensure(t.targetWords[0]===[120,160][i]&&t.targetWords[1]===[140,180][i],`${t.id}: word limits`);const n=words(t.model);if(n<t.targetWords[0]||n>t.targetWords[1])warnings.push(`${t.id}: model has ${n} words for ${t.targetWords.join('–')}`)}
}
console.log(JSON.stringify({totals,chapters:chapters.length,exercises:exerciseIds.size,examPapers:papers.length,examItems:examIds.size,errors:errors.length,warnings:warnings.length},null,2));
for(const message of errors.slice(0,100))console.error('ERROR',message);for(const message of warnings.slice(0,40))console.warn('WARN',message);
if(errors.length)process.exitCode=1;
