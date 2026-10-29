'use client';
import {useState} from 'react';
import {ArrowRight,BookOpen,Check,X} from 'lucide-react';
import {asLesson,moduleFor} from '../../lib/course/data';
import {roundResults} from '../../lib/course/round';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';
import Exercise from './Exercise';
import ProductionPanel from './ProductionPanel';
export default function LessonView({id,learning,navigate}:{id:string;learning:Learning;navigate:Navigate}){
 const lesson=asLesson(id);const {snapshot:s,send}=learning;
 const [index,setIndex]=useState(Math.min(s.cursors[id]??0,lesson?.exercises.length??0));const [error,setError]=useState('');
 const [baseline,setBaseline]=useState<Record<string,number>>(()=>Object.fromEntries((lesson?.exercises||[]).map(e=>[e.id,s.attempts[e.id]?.length??0])));
 if(!lesson)return <section className="empty-state"><h1>Тема не найдена</h1><button className="button green" onClick={()=>navigate('route')}>К маршруту</button></section>;
 const checkpoint=id.startsWith('CHECK.');const total=lesson.exercises.length;const mod=moduleFor(id)!;const atEnd=index>=total;const done=!!s.completed[id];const unfinished=lesson.exercises.findIndex(e=>!s.attempts[e.id]?.length);
 const go=(n:number)=>{send('cursor',{lessonId:id,index:n});setIndex(n);setError('')};
 const repeat=()=>{for(const e of lesson.exercises)send('draft',{key:e.id,text:''});setBaseline(Object.fromEntries(lesson.exercises.map(e=>[e.id,s.attempts[e.id]?.length??0])));go(0)};
 const finish=()=>{try{if(!s.completed[id])send('finish',{lessonId:id});setError('')}catch(e){setError((e as Error).message)}};
 const next=()=>{if(index+1===total&&!checkpoint&&unfinished<0)finish();go(index+1)};
 const help=()=>{send('assist',{key:id});navigate(checkpoint?'reference':'theory',checkpoint?'module:'+mod.id:id)};
 const metaIndex=mod.lessons.findIndex(l=>l.id===id);const nextLesson=metaIndex>=0&&metaIndex<mod.lessons.length-1?mod.lessons[metaIndex+1].id:undefined;
 const ids=lesson.exercises.map(e=>e.id);const results=roundResults(ids,baseline,s);const latestCorrect=ids.filter(e=>s.attempts[e]?.at(-1)?.correct).length;
 return <section className="practice-page lesson-practice">
  <header className="practice-chrome"><button className="practice-exit" aria-label="Выйти к маршруту" onClick={()=>navigate('route')}><X size={26}/></button><div className="practice-meter" role="progressbar" aria-label="Прогресс урока" aria-valuenow={Math.min(index,total)} aria-valuemin={0} aria-valuemax={total}><span style={{width:(total?Math.min(index,total)/total:0)*100+'%'}}/></div><span className="practice-count">{Math.min(index,total)} / {total}</span><button className="practice-reference" aria-label="Открыть конспект" onClick={help}><BookOpen size={20}/><span>Конспект</span></button></header>
  {!atEnd?<><p className="practice-topic">{checkpoint?'Проверка модуля · '+mod.title:lesson.shortTitle}</p><Exercise key={lesson.exercises[index].id} item={lesson.exercises[index]} learning={learning} assisted={!!s.assistance[id]} onNext={next} onBack={index>0?()=>go(index-1):undefined} nextLabel={index===total-1?(checkpoint?'К самостоятельной задаче':'К итогам'):'Дальше'}/></>:unfinished>=0?<div className="practice-finished"><h1>Остались задания</h1><p>Продолжи с первого задания, на которое ещё не отвечал.</p><button className="button green" onClick={()=>go(unfinished)}>Продолжить<ArrowRight size={17}/></button></div>:checkpoint?<div className="practice-completion"><ProductionPanel lesson={lesson} learning={learning} navigate={navigate}/><button className="text-button" onClick={repeat}>Повторить упражнения</button><button className="text-button" onClick={()=>navigate('route')}>К маршруту</button></div>:<div className="practice-finished practice-completion"><span className="finished-mark"><Check size={29}/></span><p className="study-context">Тема · {mod.title}</p><h1>Практика завершена</h1><p>{results.answered?`В этом подходе: ${results.correct} верных последних ответов из ${results.answered}.`:`Последние ответы: ${latestCorrect} из ${total} верных.`}</p>{results.retried?<p>Заданий с повтором: {results.retried}.</p>:null}<p className="practice-xp">Всего опыта: {s.xp} XP</p>{!done?<button className="button green" onClick={finish}>Отметить урок завершённым<Check size={17}/></button>:<div className="practice-complete-actions"><button className="button green" onClick={()=>navigate(nextLesson?'theory':'lesson',nextLesson||mod.checkpoint_id)}>{nextLesson?'Следующая тема':'Проверка модуля'}<ArrowRight size={18}/></button><button className="button outline" onClick={()=>navigate('route')}>К маршруту</button><button className="text-button" onClick={repeat}>Повторить упражнения</button></div>}</div>}
  {error?<p className="error-text" role="alert">{error}</p>:null}
 </section>
}
