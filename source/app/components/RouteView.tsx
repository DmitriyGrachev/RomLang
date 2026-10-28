'use client';
import {useState} from 'react';
import {ArrowRight,BookOpen,Check,ChevronLeft,ChevronRight,ClipboardCheck,FileText,MessageCircle,MessagesSquare,Pencil,RotateCw} from 'lucide-react';
import {modules,lessons,checkpoints,lessonMap,missions,checkpointMap,catalog} from '../../lib/course/data';
import {academyCounts} from '../../lib/course/academy';
import {canFastPass,sessionPlan} from '../../lib/course/engine';
import {curriculumCounts,russianCount} from '../../lib/course/curriculum';
import CurriculumView from './CurriculumView';
import {dailyAttemptCount,lessonEntryPage,missionCompleted,nextOpenModuleIndex,replayIntent} from '../../lib/course/activity';
import type {Level} from '../../lib/course/types';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';

const levels:Level[]=['A1','A2','B1','B2'];
export default function RouteView({learning,navigate}:{learning:Learning;navigate:Navigate}){
 const {snapshot:s,send}=learning;
 const level=s.preferences.level;
 const list=modules.filter(module=>module.level===level);
 const [view,setView]=useState<'path'|'program'>('program');
 const counts=curriculumCounts(modules,lessons,checkpoints,missions,level);
 const allCounts=curriculumCounts(modules,lessons,checkpoints,missions);
 const [opened,setOpened]=useState<string|null>(null);
 const [chosen,setChosen]=useState<string|null>(null);
 const moduleIndex=Math.max(0,list.findIndex(module=>module.id===opened));
 const missionIds=Object.fromEntries(missions.map(item=>[item.moduleId,item.id]));
 const fallbackIndex=nextOpenModuleIndex(list,s.completed,missionIds,s.missions,id=>canFastPass(id,checkpointMap.get(id)?.exercises.map(item=>item.id)||[],s),s.events);
 const currentIndex=opened&&list.some(module=>module.id===opened)?moduleIndex:fallbackIndex;
 const selected=list[currentIndex];
 const mission=missions.find(item=>item.moduleId===selected.id);
 const nodes=[...selected.lessons.map((meta,i)=>({id:meta.id,title:lessonMap.get(meta.id)?.shortTitle||meta.title,kind:'topic' as const,number:i+1,Icon:[BookOpen,MessageCircle,Pencil,BookOpen][i%4]})),
  {id:selected.checkpoint_id,title:'Проверка модуля',kind:'checkpoint' as const,number:selected.lessons.length+1,Icon:ClipboardCheck},
  {id:mission?.id||'',title:mission?.title||'Диалог',kind:'mission' as const,number:selected.lessons.length+2,Icon:MessagesSquare}];
 const defaultNode=nodes.find(node=>!isDone(node))?.id||nodes[0].id;
 const active=nodes.find(node=>node.id===chosen)||nodes.find(node=>node.id===defaultNode)!;
 const today=dailyAttemptCount(s.attempts);
 const setModule=(index:number)=>{setOpened(list[index].id);setChosen(null)};
 const enter=(node:typeof nodes[number])=>{
  if(node.kind!=='mission'&&isDone(node)){
   const items=(lessonMap.get(node.id)||checkpointMap.get(node.id))?.exercises||[];
   for(const event of replayIntent(node.id,items.map(item=>item.id)))send(event.type,event.payload);
  }
  navigate(node.kind==='topic'?lessonEntryPage(node.id,s.attempts,s.completed,catalog.lessonExercises.get(node.id)??[]):node.kind==='mission'?'mission':'lesson',node.id);
 };
 function isDone(node:typeof nodes[number]){return node.kind==='mission'?missionCompleted(node.id,s.missions,s.events):!!s.completed[node.id]}
 const isStarted=(node:typeof nodes[number])=>node.kind==='topic'&&lessonEntryPage(node.id,s.attempts,s.completed,catalog.lessonExercises.get(node.id)??[])==='lesson'&&!isDone(node);
 const action=(node:typeof nodes[number])=>node.kind==='topic'?(isDone(node)?'Повторить урок':isStarted(node)?'Продолжить':'Начать урок'):node.kind==='checkpoint'?(isDone(node)?'Повторить проверку':'Начать проверку'):(isDone(node)?'Повторить диалог':'Начать диалог');
 return <div className="learning-dashboard">
  <section className="learning-route" aria-label="Маршрут курса">
   <section className="academy-entry"><div><h2>Большая программа A1–B2</h2><p>{russianCount(academyCounts.units,['тематический раздел','тематических раздела','тематических разделов'])} · {russianCount(academyCounts.readings,['текст','текста','текстов'])} · письменная мастерская и карточки. Теория, практика и самостоятельная работа внутри курса.</p></div><button className="button green" onClick={()=>navigate('academy')}>Открыть программу<ArrowRight size={18}/></button></section><div className="route-top"><div><h1>Твой румынский, шаг за шагом</h1><p>Программа A1–B2: {russianCount(allCounts.modules,['модуль','модуля','модулей'])} и {russianCount(allCounts.lessons,['урок','урока','уроков'])}.</p></div><div className="route-levels" role="group" aria-label="Уровень курса">{levels.map(item=><button key={item} aria-pressed={item===level} className={item===level?'selected':''} onClick={()=>{send('preference',{level:item});setOpened(null);setChosen(null)}}>{item}</button>)}</div></div>
   <div className="course-program-bar"><p>{level} · {russianCount(counts.modules,['модуль','модуля','модулей'])} · {russianCount(counts.lessons,['урок','урока','уроков'])}</p><div className="course-view-toggle" role="group" aria-label="Вид программы"><button aria-pressed={view==='path'} className={view==='path'?'selected':''} onClick={()=>setView('path')}>Маршрут модуля</button><button aria-pressed={view==='program'} className={view==='program'?'selected':''} onClick={()=>setView('program')}>Вся программа</button></div></div>
   {view==='program'?<CurriculumView level={level} learning={learning} navigate={navigate} openModule={id=>{setOpened(id);setChosen(null);setView('path');window.scrollTo({top:0,behavior:'instant'})}}/>:<>
   <div className="course-module-switcher"><button aria-label="Предыдущий модуль" disabled={currentIndex===0} onClick={()=>setModule(currentIndex-1)}><ChevronLeft size={22}/></button><label><span className="sr-only">Выбрать модуль</span><select value={selected.id} onChange={event=>{setOpened(event.target.value);setChosen(null)}} aria-label="Выбрать модуль">{list.map((module,i)=><option value={module.id} key={module.id}>{i+1}. {module.title}</option>)}</select><small>{currentIndex+1} / {list.length}</small></label><button aria-label="Следующий модуль" disabled={currentIndex===list.length-1} onClick={()=>setModule(currentIndex+1)}><ChevronRight size={22}/></button></div>
   <div className="course-banner"><MessageCircle size={30}/><div><h2>{selected.title}</h2><p>{selected.outcome}</p></div></div>
   <ol className="course-path" aria-label={`Темы модуля ${selected.title}`}>
    {nodes.map((node,index)=>{const Icon=node.Icon;const done=isDone(node);return <li className={`course-step course-step-${index%6+1}${active.id===node.id?' selected':''}`} key={node.id}>
     <button className={`course-node${done?' done':''}${node.kind==='checkpoint'?' checkpoint':''}`} aria-label={`${node.number}. ${node.title}${done?', завершено':''}`} aria-pressed={active.id===node.id} onClick={()=>setChosen(node.id)}><Icon size={30} strokeWidth={2}/><span className="course-node-number">{done?<Check size={15}/>:node.number}</span></button>
     <button className="course-node-title" onClick={()=>setChosen(node.id)}>{node.title}</button>
     {active.id===node.id?<div className="course-popover"><strong>{node.title}</strong>{node.kind==='topic'?<p>{lessonMap.get(node.id)?.goal}</p>:<p>{node.kind==='checkpoint'?'Проверь изученное и напиши свой ответ.':'Подготовь фразы и пройди письменный диалог.'}</p>}<div className="course-popover-actions"><button className="button green" onClick={()=>enter(node)}>{action(node)}<ArrowRight size={18}/></button>{node.kind==='topic'?<button className="button outline" onClick={()=>navigate('theory',node.id)}><FileText size={18}/>Конспект</button>:<button className="button outline" onClick={()=>navigate('reference','module:'+selected.id)}><FileText size={18}/>Справочник</button>}</div></div>:null}
    </li>})}
   </ol>
   <div className="course-map-footer"><p>Все темы доступны в любом порядке. Вернуться к ним можно в любое время. Сейчас показан один модуль.</p><button onClick={()=>setView('program')}>Все модули и уроки <ArrowRight size={16}/></button></div>
   </>}
  </section>
  <aside className="course-side" aria-label="Практика и прогресс"><section className="course-today"><div className="course-side-heading"><h2>Практика сегодня</h2><strong>Всего {s.xp} XP</strong></div><p>{russianCount(today,['задание','задания','заданий'])} сегодня</p><p className="fine-print">Повторные ответы на одно задание считаются один раз. Выбирай объём по времени и качеству воспроизведения.</p><button className="text-button" onClick={()=>navigate('review')}>К повторению <ArrowRight size={16}/></button></section><section className="course-training"><span className="course-training-icon"><RotateCw size={28}/></span><h2>Тренировка</h2><p>Закрепляй то, что уже изучил, и пробуй новые задания.</p><button className="button green" onClick={()=>navigate('training')}>Тренироваться <ArrowRight size={18}/></button><button className="text-button" onClick={()=>navigate('review')}>Очередь повторения <ArrowRight size={16}/></button></section><section className="course-rhythm"><h2>Ритм на неделю</h2><p>3 дня — новая тема с повторением; 2 дня — закрепление и ошибки; 1 день — накопительная проверка, диалог или свой проект. Ещё один день — отдых.</p><label>Время на день<select aria-label="Время на занятие" value={s.preferences.minutes} onChange={event=>send('preference',{minutes:Number(event.target.value)})}>{([60,75,90] as const).map(minutes=><option key={minutes} value={minutes}>{minutes} минут</option>)}</select></label><dl>{sessionPlan(s.preferences.minutes).map(block=><div key={block.label}><dt>{block.label}</dt><dd>{block.minutes} мин</dd></div>)}</dl><p className="fine-print">Чтение и письмо — в полной программе курса. В дни закрепления используй время теории для знакомых тем. Темп меняй по отложенному воспроизведению.</p><button className="text-button" onClick={()=>navigate('reference')}>Материалы курса <ArrowRight size={16}/></button></section></aside>
 </div>
}
