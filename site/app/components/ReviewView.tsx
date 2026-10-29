'use client';
import {useState} from 'react';
import {ArrowRight,BookOpen,RotateCcw,X} from 'lucide-react';
import {exerciseMap,exerciseOwner,lessons,moduleFor,practiceExerciseMap} from '../../lib/course/data';
import {academyMap} from '../../lib/course/academy';
import {reviewSources,roundResults,type ReviewMode} from '../../lib/course/round';
import {reviewableExercises} from '../../lib/course/clinic';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';
import Exercise from './Exercise';
const labels:Record<ReviewMode,string>={due:'На сегодня',errors:'Ошибки',fresh:'Новые задания'};
export default function ReviewView({learning,navigate}:{learning:Learning;navigate:Navigate}){
 const s=learning.snapshot;const [mode,setMode]=useState<ReviewMode>('due');const [stage,setStage]=useState<'intro'|'round'|'end'>('intro');
 const [batch,setBatch]=useState<string[]>([]);const [index,setIndex]=useState(0);const [baseline,setBaseline]=useState<Record<string,number>>({});const [startXp,setStartXp]=useState(0);
 const sources=reviewSources(s,reviewableExercises(s,[...exerciseMap.values()],new Set(practiceExerciseMap.keys())),new Date());
 const start=(ids:string[])=>{setBatch([...ids]);setBaseline(Object.fromEntries(ids.map(id=>[id,s.attempts[id]?.length??0])));setStartXp(s.xp);setIndex(0);setStage(ids.length?'round':'intro')};
 const item=stage==='round'?exerciseMap.get(batch[index]):undefined;
 const ownerId=item?exerciseOwner.get(item.id):undefined;
 const owner=ownerId?lessons.find(l=>l.id===ownerId):undefined;
 const mod=ownerId?moduleFor(ownerId):undefined;
 const academy=ownerId?academyMap.get(ownerId):undefined;
 const results=roundResults(batch,baseline,s);
 return <section className="practice-page review-page">
  {stage==='round'&&item?<><header className="practice-chrome"><button className="practice-exit" aria-label="Выйти из повторения" onClick={()=>navigate('training')}><X size={26}/></button><div className="practice-meter" role="progressbar" aria-label="Прогресс повторения" aria-valuemin={0} aria-valuemax={batch.length} aria-valuenow={index}><span style={{width:index/batch.length*100+'%'}}/></div><span className="practice-count">{index} / {batch.length}</span>{mod?<button className="practice-reference" aria-label="Открыть конспект" onClick={()=>{learning.send('assist',{key:item.id});navigate('reference','module:'+mod.id)}}><BookOpen size={20}/><span>Конспект</span></button>:academy?<button className="practice-reference" onClick={()=>{learning.send('assist',{key:item.id});navigate('academy',academy.id)}}><BookOpen size={20}/><span>Разбор темы</span></button>:null}</header><p className="practice-topic">{labels[mode]} · {owner?.shortTitle||mod?.title||academy?.title||'Повторение'}</p><Exercise key={item.id+'-'+index} item={item} learning={learning} onNext={()=>{if(index+1>=batch.length)setStage('end');else setIndex(index+1)}} nextLabel={index+1===batch.length?'К итогам':'Дальше'}/></>:stage==='end'?<div className="practice-finished review-finished"><span className="finished-mark"><RotateCcw size={28}/></span><p className="study-context">{labels[mode]}</p><h1>Подход завершён</h1><p>Ответил на {results.answered} из {batch.length} заданий. Верных последних ответов: {results.correct}.</p>{results.retried?<p>Заданий с повтором: {results.retried}.</p>:null}<p className="practice-xp">За подход: {s.xp-startXp} XP · Всего: {s.xp} XP</p><div className="practice-complete-actions"><button className="button green" onClick={()=>start(batch)}>Повторить этот подход<ArrowRight size={18}/></button><button className="button outline" onClick={()=>setStage('intro')}>Другие задания</button><button className="text-button" onClick={()=>navigate('training')}>К тренировке</button></div></div>:<><header className="practice-intro-header"><button className="practice-exit" aria-label="К тренировке" onClick={()=>navigate('training')}><X size={24}/></button><p className="study-context">Тренировка</p><h1>Повторение</h1><p>Выбери задания для короткого подхода. Подбор фиксируется при старте.</p></header><div className="review-sources">{(['due','errors','fresh'] as const).map(v=><button key={v} className={'review-source '+(mode===v?'selected':'')} onClick={()=>setMode(v)} aria-pressed={mode===v}><strong>{labels[v]}</strong><span>{sources[v].length} заданий</span></button>)}</div>{sources[mode].length?<button className="button green review-start" onClick={()=>start(sources[mode])}>Начать · {sources[mode].length}<ArrowRight size={18}/></button>:<div className="review-empty"><p>В этой подборке пока нет заданий.</p><button className="text-button" onClick={()=>navigate('training')}>К тренировке<ArrowRight size={17}/></button></div>}</>}
 </section>
}
