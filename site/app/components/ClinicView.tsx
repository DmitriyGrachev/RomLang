'use client';
import {useState} from 'react';
import {ArrowRight,BookOpen,RotateCcw,X} from 'lucide-react';
import {asLesson,exerciseMap,exerciseOwner,moduleFor,practiceTopics} from '../../lib/course/data';
import {academyMap} from '../../lib/course/academy';
import {errorGroups,targetedBankIds} from '../../lib/course/clinic';
import {roundResults} from '../../lib/course/round';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';
import Exercise from './Exercise';

type Choice={kind:'pilot'|'errors';ownerId:string};
type Stage='choose'|'prep'|'round'|'end';

export default function ClinicView({learning,navigate}:{learning:Learning;navigate:Navigate}){
 const s=learning.snapshot;
 const [choice,setChoice]=useState<Choice|null>(null);
 const [stage,setStage]=useState<Stage>('choose');
 const [batch,setBatch]=useState<string[]>([]);
 const [index,setIndex]=useState(0);
 const [baseline,setBaseline]=useState<Record<string,number>>({});
 const [startXp,setStartXp]=useState(0);
 const groups=errorGroups(s,[...exerciseMap.values()],exerciseOwner,new Date());
 const pilot=choice?.kind==='pilot'?practiceTopics.find(t=>t.id===choice.ownerId):undefined;
 const errorTopic=choice?.kind==='errors'?practiceTopics.find(t=>t.id===choice.ownerId):undefined;
 const preparedTopic=pilot||errorTopic;
 const lesson=choice?asLesson(choice.ownerId):undefined;
 const group=choice?.kind==='errors'?groups.find(g=>g.ownerId===choice.ownerId):undefined;
 const academy=choice?academyMap.get(choice.ownerId):undefined;
 const title=preparedTopic?.title||academy?.title||lesson?.shortTitle||choice?.ownerId||'';
 const errorBatch=group?(errorTopic?targetedBankIds(group.exerciseIds,exerciseMap,errorTopic.exercises):group.exerciseIds):[];
 const prepBatch=pilot?pilot.exercises.map(e=>e.id):errorTopic?errorBatch:group?.exerciseIds||[];
 const select=(next:Choice)=>{setChoice(next);setStage('prep')};
 const start=(ids:string[])=>{
  const frozen=[...ids];setBatch(frozen);setBaseline(Object.fromEntries(frozen.map(id=>[id,s.attempts[id]?.length??0])));
  setStartXp(s.xp);setIndex(0);setStage(frozen.length?'round':'choose');
 };
 const next=()=>{if(index+1>=batch.length)setStage('end');else setIndex(index+1)};
 const item=stage==='round'?exerciseMap.get(batch[index]):undefined;
 const results=roundResults(batch,baseline,s);
 const ownerId=item?exerciseOwner.get(item.id):choice?.ownerId;
 const mod=ownerId?moduleFor(ownerId):undefined;
 return <section className="practice-page clinic-page">
  {stage==='choose'?<><header className="practice-intro-header"><button className="practice-exit" aria-label="К тренировке" onClick={()=>navigate('training')}><X size={24}/></button><p className="study-context">Личная практика</p><h1>Работа над ошибками</h1><p>Выбери тему. Подбор ниже основан на твоих последних ответах, а не на оценке уровня.</p></header>
   {groups.length?<div className="clinic-section"><h2>По недавним ошибкам</h2><p>Сначала темы с большим числом заданий, где последний ответ неверный; повторы внутри них тоже учитываются.</p><div className="clinic-options">{groups.map(g=>{const l=asLesson(g.ownerId);return <button key={g.ownerId} className="clinic-option" onClick={()=>select({kind:'errors',ownerId:g.ownerId})}><span><strong>{l?.shortTitle||academyMap.get(g.ownerId)?.title||g.ownerId}</strong><small>{g.exerciseIds.length} заданий с последним неверным ответом · {g.failures} неверных ответов за 30 дней</small></span><ArrowRight size={19}/></button>})}</div></div>:<div className="clinic-section clinic-empty"><p>Недавних незакрытых ошибок пока нет. Можно потренировать любую из четырёх тем.</p></div>}
   <div className="clinic-section"><h2>Новые задания по темам A1.1</h2><p>Сначала разберём правило, примеры и все слова, которые встретятся в новых заданиях.</p><div className="clinic-options">{practiceTopics.map(t=><button key={t.id} className="clinic-option" onClick={()=>select({kind:'pilot',ownerId:t.id})}><span><strong>{t.title}</strong><small>{t.exercises.length} новых заданий · {t.id}</small></span><ArrowRight size={19}/></button>)}</div></div></>:null}
  {stage==='prep'?<div className="clinic-prep"><button className="text-button" onClick={()=>setStage('choose')}>← К выбору темы</button><p className="study-context">{choice?.kind==='pilot'?'Новые задания':errorTopic?'Дополнительная практика':'Твои последние ошибки'}</p><h1>{title}</h1><div className="clinic-rule"><h2>Вспомни правило</h2><p>{preparedTopic?.explanation||lesson?.core||academy?.sections[0]?.body.join(' ')}{academy?<button className="text-button" onClick={()=>navigate('academy',academy.id)}>Открыть подробный разбор<ArrowRight size={17}/></button>:null}</p>{!preparedTopic&&lesson?<button className="text-button" onClick={()=>lesson.id.startsWith('CHECK.')?navigate('reference','module:'+moduleFor(lesson.id)?.id):navigate('theory',lesson.id)}>Открыть подробный разбор<ArrowRight size={17}/></button>:null}</div>
   {preparedTopic?<><div className="clinic-prep-block"><h2>Примеры с переводом</h2>{preparedTopic.examples.map((e,i)=><div className="clinic-example" key={i}><strong lang="ro">{e.ro}</strong><span>{e.ru}</span></div>)}</div><div className="clinic-prep-block"><h2>Слова и выражения для заданий</h2><div className="clinic-words">{preparedTopic.words.map((w,i)=><div key={i}><strong lang="ro">{w.ro}</strong><span>{w.ru}</span></div>)}</div></div>{errorTopic?<p>Подборка дополнительных заданий учитывает теги недавних ошибок этой темы.</p>:null}</>:<div className="clinic-prep-block"><h2>Примеры</h2>{(lesson?.examples||academy?.sections[0]?.examples)?.slice(0,3).map((e,i)=><div className="clinic-example" key={i}><strong lang="ro">{e.ro}</strong><span>{e.ru}</span></div>)}<p>В подходе будут только задания этой темы, где последний ответ пока неверный.</p></div>}
   <button className="button green" onClick={()=>start(prepBatch)}>Начать · {prepBatch.length}<ArrowRight size={18}/></button></div>:null}
  {stage==='round'&&item?<><header className="practice-chrome"><button className="practice-exit" aria-label="Выйти из подхода" onClick={()=>navigate('training')}><X size={26}/></button><div className="practice-meter" role="progressbar" aria-label="Прогресс подхода" aria-valuemin={0} aria-valuemax={batch.length} aria-valuenow={index}><span style={{width:index/batch.length*100+'%'}}/></div><span className="practice-count">{index} / {batch.length}</span>{mod?<button className="practice-reference" aria-label="Открыть конспект" onClick={()=>{learning.send('assist',{key:item.id});navigate('reference','module:'+mod.id)}}><BookOpen size={20}/><span>Конспект</span></button>:null}</header><p className="practice-topic">{errorTopic?'Дополнительная практика':title}</p><Exercise key={item.id+'-'+index} item={item} learning={learning} onNext={next} nextLabel={index===batch.length-1?'К итогам':'Дальше'}/></>:null}
  {stage==='end'?<div className="practice-finished clinic-finished"><span className="finished-mark"><RotateCcw size={28}/></span><p className="study-context">{title}</p><h1>Подход завершён</h1><p>Ответил на {results.answered} из {batch.length} заданий. Верных последних ответов: {results.correct}.</p>{results.retried?<p>Заданий с повтором: {results.retried}.</p>:null}<p className="practice-xp">За подход: {s.xp-startXp} XP · Всего: {s.xp} XP</p><p>Этот подход не отмечает урок завершённым.</p><div className="practice-complete-actions"><button className="button green" onClick={()=>start(batch)}>Повторить подход<ArrowRight size={18}/></button><button className="button outline" onClick={()=>setStage('choose')}>Выбрать другую тему</button><button className="text-button" onClick={()=>navigate('training')}>К тренировке</button></div></div>:null}
 </section>;
}
