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
export type Location={page:string;id?:string};
export type Navigate=(page:string,id?:string)=>void;
const navItems=[{page:'route',title:'Учиться',Icon:House},{page:'training',title:'Тренировка',Icon:Dumbbell},{page:'cards',title:'Карточки',Icon:BookOpen},{page:'reference',title:'Справочник',Icon:Library},{page:'progress',title:'Прогресс',Icon:ChartNoAxesColumnIncreasing}];
function readLocation():Location{const q=new URLSearchParams(window.location.search);return {page:q.get('page')||'route',id:q.get('id')||undefined}}
export default function CourseApp(){
 const learning=useLearning();const [loc,setLoc]=useState<Location>({page:'route'});
 useEffect(()=>{setLoc(readLocation());const pop=()=>setLoc(readLocation());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]);
 const navigate:Navigate=(page,id)=>{const query=new URLSearchParams({page});if(id)query.set('id',id);history.pushState(null,'','?'+query);setLoc({page,id});window.scrollTo({top:0,behavior:'instant'})};
 const selected=['lesson','theory','mission','academy','readings','writing'].includes(loc.page)?'route':['review','words','clinic','life','examB2'].includes(loc.page)?'training':loc.page==='dictionary'?'cards':loc.page;
 const focus=['lesson','review','words','clinic','life','examB2'].includes(loc.page);
 const showRoute=loc.page==='route'||!['theory','lesson','training','words','clinic','dictionary','reference','progress','review','mission','life','examB2','academy','readings','writing','cards'].includes(loc.page);
 return <div className={'app-shell'+(focus?' app-focus':'')}>
  <a className="skip-link" href="#main">К содержимому</a>
  <aside className="sidebar" aria-label="Навигация">
   <button className="wordmark" onClick={()=>navigate('route')}>Română</button>
   <nav>{navItems.map(({page,title,Icon})=><button key={page} className={'nav-item '+(selected===page?'active':'')} onClick={()=>navigate(page)} aria-current={selected===page?'page':undefined}><Icon size={23}/><span>{title}</span></button>)}</nav>
   <button className="profile" onClick={()=>navigate('progress')}><span className="avatar">У</span><span>Ученик</span><ArrowRight size={18}/></button>
  </aside>
  <header className="mobile-header"><button className="wordmark" onClick={()=>navigate('route')}>Română</button></header>
  <main id="main" className={'main-content '+(loc.page==='route'?'route-main':'')}>
   {learning.status==='error'||learning.status==='signin'?<div className="sync-banner" role="alert"><span>{learning.error}</span><button onClick={learning.retry}>Повторить сохранение</button></div>:null}
   {learning.status==='loading'?<div className="loading-state">Загружаем твой курс…</div>:loc.page==='academy'||loc.page==='readings'?<AcademyView key={loc.page+loc.id} id={loc.id} learning={learning} navigate={navigate} readingOnly={loc.page==='readings'}/>:loc.page==='writing'?<WritingStudio key={loc.id} id={loc.id} learning={learning} navigate={navigate}/>:loc.page==='cards'?<><CardsView learning={learning}/><button className="text-button" onClick={()=>navigate('dictionary')}>Открыть полный словарь и заметки <ArrowRight size={17}/></button></>:loc.page==='theory'?<TheoryView key={loc.id} id={loc.id||'A1.01'} navigate={navigate}/>:loc.page==='lesson'?<LessonView key={loc.id} id={loc.id||'A1.01'} learning={learning} navigate={navigate}/>:loc.page==='training'?<TrainingView learning={learning} navigate={navigate}/>:loc.page==='words'?<WordTrainer learning={learning} navigate={navigate}/>:loc.page==='dictionary'?<DictionaryView initialId={loc.id} learning={learning} navigate={navigate}/>:loc.page==='reference'?<ReferenceView id={loc.id} navigate={navigate}/>:loc.page==='progress'?<ProgressView learning={learning} navigate={navigate}/>:loc.page==='mission'?<MissionView key={loc.id} id={loc.id||'MISSION.A1.1'} learning={learning} navigate={navigate}/>:null}
   {learning.status!=='loading'?<div hidden={!showRoute} inert={!showRoute}><RouteView learning={learning} navigate={navigate}/><div className="life-entry-links"><button className="text-button" onClick={()=>navigate('life')}>Жизненные ситуации A1–B2<ArrowRight size={17}/></button><button className="text-button" onClick={()=>navigate('examB2')}>Практика и готовность к B2<ArrowRight size={17}/></button></div></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='review'} inert={loc.page!=='review'}><ReviewView learning={learning} navigate={navigate}/></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='life'} inert={loc.page!=='life'}><LifeView id={loc.page==='life'?loc.id:undefined} active={loc.page==='life'} learning={learning} navigate={navigate}/></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='examB2'} inert={loc.page!=='examB2'}><ExamView id={loc.page==='examB2'?loc.id:undefined} active={loc.page==='examB2'} learning={learning} navigate={navigate}/></div>:null}
   {learning.status!=='loading'?<div hidden={loc.page!=='clinic'} inert={loc.page!=='clinic'}><ClinicView learning={learning} navigate={navigate}/></div>:null}
  </main>
  <div className={'save-status '+learning.status} aria-live="polite">{learning.status==='saved'?<Check size={13}/>:<Cloud size={13}/>} {learning.status==='loading'?'Загружаем прогресс':learning.status==='saved'?'Прогресс сохранён на компьютере':learning.status==='saving'?'Сохраняем…':learning.status==='signin'?'Войдите для сохранения':'Есть несохранённые ответы'}</div>
  <nav className="bottom-nav" aria-label="Основная навигация">{navItems.map(({page,title,Icon})=><button className={selected===page?'active':''} aria-current={selected===page?'page':undefined} key={page} onClick={()=>navigate(page)}><Icon size={22}/><span>{title}</span></button>)}</nav>
 </div>
}
