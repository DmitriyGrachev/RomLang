'use client';
import {useState,useEffect} from 'react';
import {BookOpen,ChartNoAxesColumnIncreasing,Check,Cloud,Dumbbell,House,Library,ArrowRight} from 'lucide-react';
import {useLearning} from './useLearning';
import RouteView from './RouteView';
import LessonView from './LessonView';
import TheoryView from './TheoryView';
import DictionaryView from './DictionaryView';
import ReferenceView from './ReferenceView';
import ProgressView from './ProgressView';
import ReviewView from './ReviewView';
import MissionView from './MissionView';
import TrainingView from './TrainingView';
import WordTrainer from './WordTrainer';
import ClinicView from './ClinicView';
import LifeView from './LifeView';
import ExamView from './ExamView';
import AcademyView from './AcademyView';
import WritingStudio from './WritingStudio';
import CardsView from './CardsView';
import {DeepRoute,DeepChapterView,DeepPracticeView,DeepReference,StudyProgress} from './DeepCourse';
import {ListeningStudio,SpeakingStudio,WritingPortfolio} from './StudyStudio';
import {StudyDiagnostic,StudyTraining} from './StudyDiagnostic';
import ExamLab from './ExamLab';
export type Location={page:string;id?:string};
export type Navigate=(page:string,id?:string)=>void;
const navItems=[{page:'route',title:'Учиться',Icon:House},{page:'training',title:'Тренировка',Icon:Dumbbell},{page:'cards',title:'Карточки',Icon:BookOpen},{page:'reference',title:'Справочник',Icon:Library},{page:'progress',title:'Прогресс',Icon:ChartNoAxesColumnIncreasing}];
function readLocation():Location{const q=new URLSearchParams(window.location.search);return {page:q.get('page')||'route',id:q.get('id')||undefined}}
export default function CourseApp({accountScope=null}:{accountScope?:string|null}){
 const learning=useLearning(accountScope);const [loc,setLoc]=useState<Location>({page:'route'});
 useEffect(()=>{setLoc(readLocation());const pop=()=>setLoc(readLocation());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]);
 const navigate:Navigate=(page,id)=>{const query=new URLSearchParams({page});if(id)query.set('id',id);history.pushState(null,'','?'+query);setLoc({page,id});window.scrollTo({top:0,behavior:'instant'})};
 const selected=['lesson','theory','mission','academy','readings','writing','legacy-route','deep','portfolio'].includes(loc.page)?'route':['review','words','clinic','life','examB2','exam-lab','deep-practice','listening','speaking','diagnostic'].includes(loc.page)?'training':['legacy-reference','deep-reference'].includes(loc.page)?'reference':loc.page==='dictionary'?'cards':loc.page;
 const focus=['lesson','review','words','clinic','life','examB2','deep-practice','diagnostic','exam-lab'].includes(loc.page);
 const primary=()=>{
  if(learning.status==='loading')return <div className="loading-state">Загружаем твой курс…</div>;
  switch(loc.page){
   case 'deep':return <DeepChapterView key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>;
   case 'deep-practice':return <DeepPracticeView key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>;
   case 'listening':return <ListeningStudio key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>;
   case 'speaking':return <SpeakingStudio key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>;
   case 'portfolio':return <WritingPortfolio key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>;
   case 'diagnostic':return <StudyDiagnostic learning={learning} navigate={navigate}/>;
   case 'legacy-route':return <RouteView learning={learning} navigate={navigate}/>;
   case 'academy':case 'readings':return <AcademyView key={loc.page+loc.id} id={loc.id} learning={learning} navigate={navigate} readingOnly={loc.page==='readings'}/>;
   case 'writing':return <WritingStudio key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>;
   case 'cards':return <><CardsView learning={learning}/><button className="text-button" onClick={()=>navigate('dictionary')}>Открыть полный словарь и заметки <ArrowRight size={17}/></button></>;
   case 'theory':return <TheoryView key={loc.id} id={loc.id||'A1.01'} navigate={navigate}/>;
   case 'lesson':return <LessonView key={loc.id} id={loc.id||'A1.01'} learning={learning} navigate={navigate}/>;
   case 'training':return <><StudyTraining learning={learning} navigate={navigate}/><details className="deep-legacy-panel"><summary>Тренажёры прежнего курса</summary><TrainingView learning={learning} navigate={navigate}/></details></>;
   case 'words':return <WordTrainer learning={learning} navigate={navigate}/>;
   case 'dictionary':return <DictionaryView initialId={loc.id} learning={learning} navigate={navigate}/>;
   case 'reference':return loc.id?<ReferenceView key={loc.id} id={loc.id} navigate={navigate}/>:<DeepReference navigate={navigate}/>;
   case 'legacy-reference':return <ReferenceView key={loc.id} id={loc.id} navigate={navigate}/>;
   case 'deep-reference':return <DeepReference navigate={navigate}/>;
   case 'progress':return <><StudyProgress learning={learning} navigate={navigate}/><details className="deep-legacy-panel"><summary>Прежний курс, экспорт и восстановление всей истории</summary><ProgressView learning={learning} navigate={navigate}/></details></>;
   case 'mission':return <MissionView key={loc.id} id={loc.id||'MISSION.A1.1'} learning={learning} navigate={navigate}/>;
   case 'exam-lab':return <ExamLab id={loc.id} learning={learning} navigate={navigate}/>;
   case 'review':case 'life':case 'examB2':case 'clinic':return null;
   default:return <DeepRoute learning={learning} navigate={navigate} levelId={loc.id}/>;
  }
 };
 return <div className={'app-shell'+(focus?' app-focus':'')}>
  <a className="skip-link" href="#main">К содержимому</a>
  <aside className="sidebar" aria-label="Навигация">
   <button className="wordmark" onClick={()=>navigate('route')}>Română</button>
   <nav>{navItems.map(({page,title,Icon})=><button key={page} className={'nav-item '+(selected===page?'active':'')} onClick={()=>navigate(page)} aria-current={selected===page?'page':undefined}><Icon size={23}/><span>{title}</span></button>)}</nav>
   <button className="profile" onClick={()=>navigate('progress')}><span className="avatar">Д</span><span>Дима</span><ArrowRight size={18}/></button>
  </aside>
  <header className="mobile-header"><button className="wordmark" onClick={()=>navigate('route')}>Română</button></header>
  <main id="main" className={'main-content '+(loc.page==='route'?'route-main':'')}>
   {learning.status==='error'||learning.status==='signin'?<div className="sync-banner" role="alert"><span>{learning.error}</span>{learning.status==='signin'?<a href="/signin-with-chatgpt?return_to=/" target="_top">Войти через ChatGPT <ArrowRight size={16}/></a>:<button onClick={learning.retry}>Повторить сохранение</button>}</div>:null}
   {learning.recoveryWarning?<div className="sync-banner" role="alert">{learning.recoveryWarning}</div>:null}
   {learning.conflicts.length?<div className="sync-banner" role="alert"><div><strong>{learning.conflicts.length} ответов требуют разбора.</strong><p>Сохранённая попытка изменилась в другой вкладке или на другом устройстве. Эти локальные ответы сохранены отдельно в текущей вкладке; завершённые результаты не изменены. Остальная работа синхронизируется.</p><details><summary>Посмотреть причины</summary>{learning.conflicts.map(c=><p key={c.event.id}>{String(c.event.payload.itemId??c.event.payload.exerciseId??c.event.payload.chapterId??c.event.id)}: {c.reason}</p>)}</details></div><button onClick={learning.exportConflicts}>Скачать ответы для разбора</button></div>:null}
   {primary()}
   {learning.status!=='loading'?<div hidden={loc.page!=='review'} inert={loc.page!=='review'}><ReviewView learning={learning} navigate={navigate}/></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='life'} inert={loc.page!=='life'}><LifeView id={loc.page==='life'?loc.id:undefined} active={loc.page==='life'} learning={learning} navigate={navigate}/></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='examB2'} inert={loc.page!=='examB2'}><ExamView id={loc.page==='examB2'?loc.id:undefined} active={loc.page==='examB2'} learning={learning} navigate={navigate}/></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='clinic'} inert={loc.page!=='clinic'}><ClinicView learning={learning} navigate={navigate}/></div>:null}
  </main>
  <div className={'save-status '+learning.status} aria-live="polite">{learning.status==='saved'?<Check size={13}/>:<Cloud size={13}/>} {learning.conflicts.length?'Есть ответы для разбора':learning.status==='loading'?'Загружаем прогресс':learning.status==='saved'?'Прогресс сохранён':learning.status==='saving'?'Сохраняем…':learning.status==='signin'?'Войдите для сохранения':'Есть несохранённые ответы'}</div>
  <nav className="bottom-nav" aria-label="Основная навигация">{navItems.map(({page,title,Icon})=><button className={selected===page?'active':''} aria-current={selected===page?'page':undefined} key={page} onClick={()=>navigate(page)}><Icon size={22}/><span>{title}</span></button>)}</nav>
 </div>
}
