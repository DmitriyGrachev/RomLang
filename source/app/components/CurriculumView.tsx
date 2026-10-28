'use client';
import {useDeferredValue,useState} from 'react';
import {ArrowRight,Check,Search} from 'lucide-react';
import {checkpoints,lessonMap,lessons,missions,modules} from '../../lib/course/data';
import {curriculumCounts,russianCount,searchCurriculum} from '../../lib/course/curriculum';
import {missionCompleted} from '../../lib/course/activity';
import type {Level} from '../../lib/course/types';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';

export default function CurriculumView({level,learning,navigate,openModule}:{level:Level;learning:Learning;navigate:Navigate;openModule:(id:string)=>void}){
 const [query,setQuery]=useState('');const q=useDeferredValue(query);
 const counts=curriculumCounts(modules,lessons,checkpoints,missions,level);
 const found=searchCurriculum(modules,lessonMap,level,q);
 const {snapshot:s}=learning;
 const link=(page:string,id:string,label:string)=><a aria-label={`${label}: ${id}${lessonMap.has(id)?' · '+lessonMap.get(id)!.shortTitle:''}`} href={'?'+new URLSearchParams({page,id})} onClick={event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(page,id)}}>{label}<ArrowRight size={15}/></a>;
 return <section className="curriculum-overview" aria-label={`Полная программа ${level}`}>
  <div className="curriculum-intro"><h2>Вся программа {level}</h2><p>{russianCount(counts.modules,['модуль','модуля','модулей'])} · {russianCount(counts.lessons,['урок','урока','уроков'])} · {russianCount(counts.checkpoints,['проверка','проверки','проверок'])} · {russianCount(counts.missions,['диалог','диалога','диалогов'])}</p><p>Раскрой модуль, чтобы увидеть каждую тему. Конспект и практика доступны сразу; порядок тем помогает опираться на изученное.</p></div>
  <label className="search-field curriculum-search"><Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Тема, правило, слово или номер урока" aria-label={`Найти тему в программе ${level}`}/></label>
  <p className="curriculum-search-status" role="status">{q.trim()?`Найдено тем: ${found.reduce((sum,item)=>sum+item.lessons.length,0)}`:`Все ${russianCount(counts.lessons,['урок','урока','уроков'])} уровня`}</p>
  <div className="curriculum-modules">{found.map(({module,lessons:metas})=>{
   const mission=missions.find(item=>item.moduleId===module.id);
   const completed=module.lessons.filter(item=>s.completed[item.id]).length;
   return <details className="curriculum-module" key={module.id} open={q.trim()?true:undefined}>
    <summary><span className="curriculum-module-number">{module.id}</span><span><strong>{module.title}</strong><small>Пройдено: {completed} / {module.lessons.length}</small></span></summary>
    <div className="curriculum-module-body"><p>{module.outcome}</p><ol>{metas.map(meta=>{const lesson=lessonMap.get(meta.id)!;return <li key={meta.id}><div><span className="curriculum-lesson-id">{meta.id}{s.completed[meta.id]?<Check size={14} aria-label="Пройдено"/>:null}</span><h3>{lesson.shortTitle}</h3><p>{lesson.goal}</p></div><div className="curriculum-lesson-links">{link('theory',meta.id,'Теория')}{link('lesson',meta.id,'Практика')}</div></li>})}</ol>
     <div className="curriculum-module-actions">{link('lesson',module.checkpoint_id,s.completed[module.checkpoint_id]?'Повторить проверку':'Проверка модуля')}{mission?link('mission',mission.id,missionCompleted(mission.id,s.missions,s.events)?'Повторить диалог':'Диалог'):null}<button onClick={()=>openModule(module.id)}>На маршрут<ArrowRight size={15}/></button></div>
    </div>
   </details>;
  })}</div>
  {!found.length?<p className="empty-state">Тем с таким запросом нет. Попробуй название правила, румынское слово или номер вроде {level}.25.</p>:null}
 </section>;
}
