import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const levels={A1:{count:16,read:[65,110],write:[30,60]},A2:{count:18,read:[120,190],write:[70,110]},B1:{count:20,read:[220,320],write:[130,180]},B2:{count:22,read:[320,480],write:[180,240]}};
const words=t=>(t.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)||[]).length;
const normalized=t=>t.normalize('NFC').toLocaleLowerCase('ro').replace(/[.,!?;:"„”«»…]/g,'').replace(/\s+/g,' ').trim();
const ids=new Set(),passages=new Set(),errors=[];let exercises=0,readings=0,cards=0,units=0;
const check=(test,message)=>{if(!test)errors.push(message)};
const sources=new Set(['ubb-description','cefr','puls','rolang','myro','ilr','ecl','ubb-program']);
for(const [level,rules] of Object.entries(levels)){
 const content=JSON.parse(fs.readFileSync(root+'content/academy/'+level+'.json','utf8'));
 check(content.length===rules.count,`${level}: expected ${rules.count}, got ${content.length}`);
 for(const [index,u] of content.entries()){
  units++;const id=`ACA.${level}.${String(index+1).padStart(2,'0')}`;check(u.id===id,`${u.id}: sequence ${id}`);check(u.level===level,`${id}: level`);
  check(JSON.stringify(u.prerequisites)===JSON.stringify(index?[`ACA.${level}.${String(index).padStart(2,'0')}`]:[]),`${id}: prerequisite sequence`);
  check(u.title&&u.grammar&&u.domain,`${id}: title/grammar/domain`);
  check(u.goals.length===5,`${id}: need 5 goals`);check(u.sections.length>=3,`${id}: 3 theory sections`);
  const theory=u.sections.flatMap(s=>s.body).join(' ');check(words(theory)>=180,`${id}: theory only ${words(theory)} words`);
  for(const section of u.sections)check(section.body.length>0&&section.examples.length>=2&&section.examples.every(x=>x.ro&&x.ru),`${id}: theory examples`);
  check(u.pitfalls.length>=3&&u.pitfalls.every(x=>x.wrong&&x.right&&x.why),`${id}: pitfalls`);
  check(u.sourceIds.length>0&&u.sourceIds.every(x=>sources.has(x)),`${id}: unknown source`);
  check(u.words.length>=12,`${id}: vocabulary`);cards+=u.words.length;
  for(const w of u.words)check(w.ro&&w.ru&&w.forms&&w.example.ro&&w.example.ru&&w.answers?.includes(w.ro),`${id}: incomplete word ${w.ro}`);
  check(u.readings.length===2,`${id}: readings`);
  for(const r of u.readings){readings++;check(!passages.has(r.text),`${r.id}: duplicate passage`);passages.add(r.text);const n=words(r.text);check(n>=rules.read[0]&&n<=rules.read[1],`${r.id}: reading ${n}, need ${rules.read}`);check(r.glossary.length>=4&&r.glossary.every(x=>x.ro&&x.ru),`${r.id}: glossary`);check(r.questions.length>=3,`${r.id}: questions`);for(const q of r.questions)check(q.skill==='reading',`${q.id}: reading skill`);}
  check(u.exercises.length>=8,`${id}: practice`);check(u.exercises.filter(x=>['gap','order'].includes(x.type)).length>=3,`${id}: needs 3 written responses`);
  check(u.checkpoint.length>=4,`${id}: checkpoints`);
  for(const e of [...u.readings.flatMap(r=>r.questions),...u.exercises,...u.checkpoint]){
   exercises++;check(!ids.has(e.id),`${e.id}: duplicate ID`);ids.add(e.id);
   check(e.id.startsWith(u.id+'.'),`${e.id}: wrong owner`);check(e.prompt&&e.explanation&&e.hint&&e.answers.length&&e.answers.every(x=>typeof x==='string'&&x.trim()),`${e.id}: incomplete exercise`);
   check(['grammar','reading'].includes(e.skill),`${e.id}: forbidden skill`);
   if(e.type==='choice'||e.type==='read'&&e.choices?.length)check(e.choices?.length>=3&&e.answers.every(a=>e.choices.includes(a))&&new Set(e.choices).size===e.choices.length,`${e.id}: invalid choice answer`);
   if(e.type==='order')check(e.tokens?.length&&e.answers.some(a=>normalized(a).split(' ').sort().join('|')===e.tokens.flatMap(t=>normalized(t).split(' ')).sort().join('|')),`${e.id}: unbuildable order`);
  }
  for(const e of u.checkpoint)check(!u.exercises.some(p=>p.prompt===e.prompt&&normalized(p.answers[0])===normalized(e.answers[0])),`${e.id}: recycled practice`);
  const w=u.writing;const n=words(w.model);check(n>=rules.write[0]&&n<=rules.write[1],`${w.id}: writing ${n}, need ${rules.write}`);check(JSON.stringify(w.targetWords)===JSON.stringify(rules.write),`${w.id}: displayed writing range`);check(w.id===u.id+'.write',`${id}: writing ID`);check(w.prompt&&w.transferPrompt&&w.plan.length>=3&&w.annotations.length>=3&&w.rubric.length>=4&&w.revisionFocus.length>=3,`${id}: incomplete writing scaffolding`);
 }
}
console.log(JSON.stringify({units,readings,cards,exercises,errors},null,2));if(errors.length)process.exitCode=1;
