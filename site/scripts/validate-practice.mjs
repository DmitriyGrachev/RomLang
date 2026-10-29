import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const practice=read('content/practice-a1.1.json');
const core=read('content/A1.json');
const support=read('content/A1-support.json');
const errors=[];
const check=(condition,message)=>{if(!condition) errors.push(message)};
const str=value=>typeof value==='string' && value.trim().length>0;
const norm=value=>String(value).normalize('NFC').toLocaleLowerCase('ro-RO').replaceAll('ş','ș').replaceAll('ţ','ț').replace(/[’‘]/gu,"'").replace(/[.,!?;:"„”«»…]/gu,'').replace(/\s+/gu,' ').trim();
const fold=value=>norm(value).normalize('NFD').replace(/\p{M}/gu,'');
const romanianTokens=value=>String(value).normalize('NFC').toLocaleLowerCase('ro-RO').match(/[a-zăâîșț]+/gu)??[];
const coreItems=[...core.lessons,...core.checkpoints].flatMap(owner=>owner.exercises??[]);
const coreIds=new Set(coreItems.map(item=>item.id));
const corePrompts=new Set(coreItems.map(item=>norm(item.prompt)));
const coreOrders=new Set(coreItems.filter(item=>item.type==='order').map(item=>`${item.id.slice(0,5)}:${(item.answers??[]).map(norm).sort().join('|')}:${(item.tokens??[]).map(norm).sort().join('|')}`));
const promptSeen=new Set();
const ids=new Set();
const validTypes=['choice','gap','order','read'];
const wordIds=new Set(core.dictionary.filter(word=>word.moduleId==='A1.1').map(word=>word.id));
const originalTags=new Map(core.lessons.slice(0,4).map(lesson=>[lesson.id,new Set(lesson.exercises.map(item=>item.tag))]));
const supportIds=new Set(support.lessons.map(lesson=>lesson.lessonId));
check(practice.moduleId==='A1.1','moduleId must be A1.1');
check(Array.isArray(practice.topics)&&practice.topics.length===4,'exactly four topics required');
for(let topicIndex=0;topicIndex<4;topicIndex++){
  const topic=practice.topics?.[topicIndex];
  const owner=`A1.${String(topicIndex+1).padStart(2,'0')}`;
  if(!topic){errors.push(`${owner}: missing topic`);continue}
  check(topic.id===owner,`${owner}: topic ID/owner mismatch`);
  check(supportIds.has(topic.id),`${owner}: no matching original lesson preparation`);
  check(str(topic.title)&&str(topic.explanation),`${owner}: missing title or Russian explanation`);
  check(/[А-Яа-яЁё]/u.test(topic.explanation??''),`${owner}: explanation needs Russian text`);
  check(Array.isArray(topic.examples)&&topic.examples.length>=3,`${owner}: at least three translated examples required`);
  for(const [i,example] of (topic.examples??[]).entries()){
    check(str(example.ro)&&str(example.ru)&&/[А-Яа-яЁё]/u.test(example.ru??''),`${owner}: example ${i+1} requires Romanian and Russian`);
  }
  check(Array.isArray(topic.words)&&topic.words.length>=10,`${owner}: full lexical preparation required`);
  for(const [i,word] of (topic.words??[]).entries()){
    check(str(word.ro)&&str(word.ru)&&/[А-Яа-яЁё]/u.test(word.ru??''),`${owner}: word/chunk ${i+1} needs Romanian and Russian`);
  }
  const prepared=new Set((topic.words??[]).flatMap(word=>romanianTokens(word.ro)));
  const exercises=topic.exercises??[];
  check(exercises.length===8,`${owner}: expected eight exercises`);
  for(const type of validTypes) check(exercises.filter(item=>item.type===type).length===2,`${owner}: expected two ${type} exercises`);
  for(const [i,item] of exercises.entries()){
    const label=item.id??`${owner}:exercise ${i+1}`;
    check(item.id===`${owner}.e${101+i}`,`${label}: sequential new ID required`);
    check(!ids.has(item.id)&&!coreIds.has(item.id),`${label}: duplicate/core ID`);ids.add(item.id);
    check(validTypes.includes(item.type),`${label}: unsupported type`);
    check(str(item.prompt)&&str(item.explanation)&&str(item.hint),`${label}: incomplete instruction/correction/hint`);
    check(/[А-Яа-яЁё]/u.test(item.explanation??''),`${label}: correction should explain in Russian`);
    check(item.skill==='grammar'||item.skill==='reading',`${label}: no audio/listening skill`);
    check(originalTags.get(owner)?.has(item.tag),`${label}: tag not from owner lesson`);
    const prompt=norm(item.prompt);
    check(!promptSeen.has(prompt)&&!corePrompts.has(prompt),`${label}: duplicate old/new prompt`);promptSeen.add(prompt);
    check(Array.isArray(item.answers)&&item.answers.length>0&&item.answers.every(str),`${label}: canonical answer required`);
    check(!('audio' in item)&&!('audioUrl' in item)&&!('source' in item),`${label}: audio not allowed`);
    if(item.type==='choice'||item.type==='read'){
      check(Array.isArray(item.choices)&&item.choices.length>=2&&item.choices.every(str),`${label}: choice options required`);
      check(new Set((item.choices??[]).map(norm)).size===(item.choices??[]).length,`${label}: duplicate options`);
      check((item.answers??[]).every(answer=>(item.choices??[]).some(choice=>norm(answer)===norm(choice))),`${label}: correct answer absent from choices`);
      for(const choice of item.choices??[]){
        const accepted=(item.answers??[]).some(answer=>norm(answer)===norm(choice));
        check(accepted||!(item.answers??[]).some(answer=>fold(answer)===fold(choice)),`${label}: distractor grades correct with missing diacritics`);
      }
    }else check(!('choices' in item),`${label}: unexpected choices`);
    if(item.type==='order'){
      check(Array.isArray(item.tokens)&&item.tokens.length>=2&&item.tokens.every(str),`${label}: order tokens required`);
      const sorted=value=>romanianTokens(value).sort().join('|');
      check((item.answers??[]).every(answer=>sorted(answer)===sorted((item.tokens??[]).join(' '))),`${label}: answer cannot be built from tokens`);
      const exactTiles=value=>String(value).normalize('NFC').toLocaleLowerCase('ro-RO').trim().split(/\s+/u).sort().join('|');
      check((item.answers??[]).every(answer=>exactTiles(answer)===exactTiles((item.tokens??[]).join(' '))),`${label}: tile punctuation differs from accepted answer`);
      const tiles=(item.tokens??[]).map(norm).sort().join('|');
      check(!(item.answers??[]).some(answer=>coreOrders.has(`${owner}:${norm(answer)}:${tiles}`)),`${label}: repeats an original order task`);
    }else check(!('tokens' in item),`${label}: unexpected tokens`);
    if(item.type==='read') check(str(item.text),`${label}: read item needs visible Romanian text`);
    else check(!('text' in item),`${label}: unexpected reading text`);
    // Answers, visible reading text, tiles and Romanian option labels must be prepared in this topic.
    const samples=[...(item.answers??[]),...(item.tokens??[]),item.text??'',...(item.choices??[])];
    for(const sample of samples){
      if(/[А-Яа-яЁё]/u.test(sample)) continue;
      for(const token of romanianTokens(sample)){
        // A1.01 asks learners to recognize deliberately misspelled alternatives.
        const orthographicDecoy=owner==='A1.01'&&item.id==='A1.01.e102'&&['casa','si','tara','tară'].includes(token);
        check(prepared.has(token)||orthographicDecoy,`${label}: unprepared Romanian token "${token}"`);
      }
    }
  }
}
check(ids.size===32,`expected 32 unique practice items; found ${ids.size}`);
check(Array.isArray(practice.wordRecall)&&practice.wordRecall.length===18,'expected 18 recall entries');
const recallIds=new Set();
for(const [i,entry] of (practice.wordRecall??[]).entries()){
  const expected=`A1.d${String(i+1).padStart(3,'0')}`;
  const label=entry.wordId??`recall ${i+1}`;
  check(label===expected&&wordIds.has(label),`${label}: missing/out-of-order A1.1 dictionary word`);
  check(!recallIds.has(label),`${label}: duplicate recall word`);recallIds.add(label);
  check(str(entry.prompt)&&str(entry.note)&&/[А-Яа-яЁё]/u.test(entry.prompt??'')&&/[А-Яа-яЁё]/u.test(entry.note??''),`${label}: needs RU form prompt and note`);
  check(Array.isArray(entry.answers)&&entry.answers.length>0&&entry.answers.every(str),`${label}: accepted answer(s) required`);
  const dictionaryWord=core.dictionary.find(word=>word.id===label)?.word;
  check((entry.answers??[]).some(answer=>norm(answer)===norm(dictionaryWord)),`${label}: dictionary headword absent from accepted answers`);
  check(new Set((entry.answers??[]).map(norm)).size===(entry.answers??[]).length,`${label}: duplicate accepted answer`);
}
check(recallIds.size===wordIds.size,`dictionary/recall coverage differs: ${recallIds.size}/${wordIds.size}`);
if(errors.length){for(const error of errors) console.error(`FAIL ${error}`);process.exitCode=1}
else console.log('Practice audit passed: 4 topics, 32 new exercises (8 each, 2 per type), 18 constrained recall entries; owners/tags, unique prompts, choices, order tiles, lexical preparation, translations and no audio checked.');
