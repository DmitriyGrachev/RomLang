'use client';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Printer} from 'lucide-react';
import {lessonMap,moduleFor} from '../../lib/course/data';
import type {Navigate} from './CourseApp';
import CheatSheet,{TheoryExtension} from './CheatSheet';
import TeachingNotes from './TeachingNotes';

type Stage='rule'|'words'|'details'|'sheet';
const stages:{key:Stage;label:string}[]=[{key:'rule',label:'1 · Правило'},{key:'words',label:'2 · Слова и фразы'},{key:'details',label:'Подробный разбор'},{key:'sheet',label:'Шпаргалка'}];
export default function TheoryView({id,navigate}:{id:string;navigate:Navigate}){
 const lesson=lessonMap.get(id);const [stage,setStage]=useState<Stage>('rule');
 if(!lesson)return <section className="empty-state"><h1>Выбери тему</h1><button className="button green" onClick={()=>navigate('route')}>К маршруту</button></section>;
 const mod=moduleFor(id)!;
 return <section className="theory-page"><button className="text-button back" onClick={()=>navigate('route')}><ArrowLeft size={18}/>К темам модуля</button><div className="study-heading"><div><p className="study-context">{mod.id} · Изучение темы</p><h1>{lesson.shortTitle}</h1><p className="study-goal">{lesson.goal}</p></div><button className="button green" onClick={()=>navigate('lesson',id)}>К упражнениям<ArrowRight size={18}/></button></div>
  <div className="study-tabs" role="group" aria-label="Разделы темы">{stages.map(({key,label})=><button key={key} aria-pressed={stage===key} className={stage===key?'selected':''} onClick={()=>setStage(key)}>{label}</button>)}</div>
  <article className="theory-article print-area">
   {stage==='rule'?<div className="study-stage"><p className="study-kicker">Шаг 1 · главное</p><h2>Суть правила</h2><p className="theory-core">{lesson.core}</p><div className="study-formula" lang="ro">{lesson.sheet.formula}</div><h2>Посмотри на примеры</h2>{lesson.examples.slice(0,2).map((x,i)=><div className="example" key={i}><strong lang="ro">{x.ro}</strong><span>{x.ru}</span></div>)}<p className="study-next-hint">Дальше — слова и конструкции, которые встретятся в упражнениях.</p><button className="button green" onClick={()=>setStage('words')}>Слова и фразы<ArrowRight size={18}/></button></div>:null}
   {stage==='words'?<div className="study-stage"><p className="study-kicker">Шаг 2 · лексика</p><TeachingNotes lesson={lesson}/><div className="study-stage-actions"><button className="button green" onClick={()=>navigate('lesson',id)}>Попробовать упражнения<ArrowRight size={18}/></button><button className="button outline" onClick={()=>setStage('details')}>Подробный разбор</button></div></div>:null}
   {stage==='details'?<div className="study-stage"><p className="study-kicker">Если хочется разобраться глубже</p><h2>Разберём подробнее</h2>{lesson.detail.map((p,i)=><p key={i}>{p}</p>)}<h2>Сравнение с русским и английским</h2><p>{lesson.comparison}</p><h2>Все примеры</h2>{lesson.examples.map((x,i)=><div className="example" key={i}><strong lang="ro">{x.ro}</strong><span>{x.ru}</span></div>)}<TheoryExtension lessonId={lesson.id}/><h3>На что обратить внимание</h3>{lesson.sheet.notes.map((p,i)=><p key={i}>{p}</p>)}<button className="button outline" onClick={()=>setStage('sheet')}>Открыть шпаргалку<ArrowRight size={17}/></button></div>:null}
   {stage==='sheet'?<div className="study-stage"><button className="text-button print-control" onClick={()=>window.print()}><Printer size={16}/>Распечатать</button><CheatSheet lesson={lesson} printable/></div>:null}
  </article><footer className="theory-footer"><p>К подробному объяснению и шпаргалке можно вернуться в любой момент.</p><button className="button green" onClick={()=>navigate('lesson',id)}>Перейти к упражнениям<ArrowRight size={18}/></button></footer>
 </section>
}
