import type {Snapshot,WritingScenario,WritingTask} from './types.ts';
import type {AcademyUnit} from './academy-types.ts';

export function writingChecks(text:string,target:[number,number]){
 const words=text.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)??[];
 const lower=text.toLocaleLowerCase('ro');
 const connectors=['deoarece','pentru că','totuși','în schimb','prin urmare','de exemplu','în primul rând','pe de altă parte','de aceea','deși','în concluzie','așadar'].filter(x=>lower.includes(x));
 const frequency=new Map<string,number>();
 words.forEach(w=>{const k=w.toLocaleLowerCase('ro');if(k.length>4)frequency.set(k,(frequency.get(k)??0)+1)});
 return {words:words.length,inRange:words.length>=target[0]&&words.length<=target[1],paragraphs:text.trim()?text.trim().split(/\n\s*\n/).length:0,connectors,repeated:[...frequency].filter(([,n])=>n>=4).sort((a,b)=>b[1]-a[1]).slice(0,5)};
}

export function hasWritingDraft(record?:{text:string;drafts?:Partial<Record<WritingScenario,{text:string}>>}):boolean{
 return !!record?.text.trim()||Object.values(record?.drafts??{}).some(draft=>!!draft?.text.trim());
}

export function unitEvidence(unit:AcademyUnit,s:Snapshot){
 const practice=[...unit.readings.flatMap(r=>r.questions),...unit.exercises];
 const checkpoints=unit.checkpoint;
 const attempted=practice.filter(e=>s.attempts[e.id]?.length).length;
 const checkTried=checkpoints.filter(e=>s.attempts[e.id]?.length).length;
 const firstIndependent=checkpoints.filter(e=>{const a=s.attempts[e.id]?.[0];return a?.correct&&!a.assisted&&!a.spelling}).length;
 const writing=s.writing?.[unit.writing.id];
 const written=hasWritingDraft(writing);
 const revised=(writing?.revisions.length??0)>1;
 const completed=attempted===practice.length&&checkTried===checkpoints.length&&written;
 // Evidence is per unseen item. A later retry never erases the initial result.
 const practiceTimes=practice.flatMap(e=>(s.attempts[e.id]??[]).map(a=>Date.parse(a.at)));
 const delayed=checkpoints.filter(e=>{const a=s.attempts[e.id]?.[0];if(!a?.correct||a.assisted||a.spelling)return false;const at=Date.parse(a.at);const before=practiceTimes.filter(t=>t<=at);const last=before.length?Math.max(...before):0;return last>0&&at-last>=86400000}).length;
 return {attempted,total:practice.length,checkTried,checkTotal:checkpoints.length,firstIndependent,written,revised,completed,delayed};
}

// Transfer self-review follows its own prompt; source-specific facts belong only to the original rubric.
export const transferWritingRubric=[
 {criterion:'Новая задача',description:'Проверь, что текст отвечает новой ситуации: адресат, цель и все запрошенные пункты взяты из её условия.'},
 {criterion:'Содержание и связность',description:'Сверь факты и позиции с источниками новой ситуации, если они даны. Раздели идеи на абзацы и обозначь связи между ними.'},
 {criterion:'Редактура',description:'Проверь подходящий регистр, формы слов и написание. Устрани пропуски и повторы, которые мешают смыслу.'},
];
export function writingWorkspace(task:WritingTask&{revisionFocus?:string[]},scenario:WritingScenario){
 return scenario==='main'?{prompt:task.prompt,plan:task.plan,rubric:task.rubric,revisionFocus:task.revisionFocus??[]}:{prompt:task.transferPrompt,plan:['Выдели адресата, цель и все пункты нового условия.','Подбери факты и аргументы именно для новой ситуации.','Составь текст, затем сверь его с новым условием и отредактируй.'],rubric:transferWritingRubric,revisionFocus:['Сверь ответ с новой ситуацией, а не с условиями первого задания.','Проверь точность передачи источников, если они указаны в новом условии.']};
}
export function unansweredCheckpointSupport(ids:string[],s:Snapshot,tab:string):string[]{
 if(!['theory','words','practice','writing'].includes(tab))return [];
 return ids.filter(id=>s.checkpointExposures?.[id]&&!s.attempts[id]?.length&&!s.assistance[id]);
}
