'use client';
import {useState} from 'react';
import {ArrowRight,BookOpenCheck,RotateCw,Target} from 'lucide-react';
import {exerciseMap,exerciseOwner} from '../../lib/course/data';
import {russianCount} from '../../lib/course/curriculum';
import {academyCounts} from '../../lib/course/academy';
import {errorGroups} from '../../lib/course/clinic';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';

export default function TrainingView({learning,navigate}:{learning:Learning;navigate:Navigate}){
 const [now]=useState(()=>new Date());
 const due=Object.values(learning.snapshot.reviews).filter(x=>Date.parse(x.due)<=now.getTime()).length;
 const wordDue=Object.values(learning.snapshot.wordReviews).filter(x=>Date.parse(x.due)<=now.getTime()).length;
 const groups=errorGroups(learning.snapshot,[...exerciseMap.values()],exerciseOwner,now);
 return <section className="training-page">
  <p className="study-context">Короткая практика</p><h1>Тренировка</h1><p className="subtitle">Повтори задания курса или проверь, какие слова уже вспоминаются.</p>
  <div className="training-choices"><article className="training-choice"><div className="training-icon"><BookOpenCheck size={29}/></div><div><h2>Чтение и письменная мастерская</h2><p>{russianCount(academyCounts.readings,['текст','текста','текстов'])} с вопросами, задания A1–B2, полные образцы и сохранение собственных редакций.</p></div><div className="button-row"><button className="button green" onClick={()=>navigate('readings')}>Читать<ArrowRight size={18}/></button><button className="button outline" onClick={()=>navigate('writing')}>Писать</button></div></article><article className="training-choice"><div className="training-icon"><RotateCw size={29}/></div><div><h2>Карточки</h2><p>Слова курса и собственные карточки. Узнавание, письменный ответ и интервальные повторения.</p></div><button className="button green" onClick={()=>navigate('cards')}>Открыть карточки<ArrowRight size={18}/></button></article><article className="training-choice"><div className="training-icon"><BookOpenCheck size={29}/></div><div><h2>Язык для жизни</h2><p>Магазины, кафе, поездки и соседи: разбор, слова и новые ситуации A1–B2.</p><small>16 ситуаций · 256 заданий с подготовкой</small></div><button className="button green" onClick={()=>navigate('life')}>Выбрать ситуацию<ArrowRight size={18}/></button></article><article className="training-choice"><div className="training-icon"><Target size={29}/></div><div><h2>Готовность к B2</h2><p>Связное чтение, грамматика, письмо с черновиками и редактурой.</p><small>Внутренняя практика и отдельная внешняя проверка навыков</small></div><button className="button outline" onClick={()=>navigate('examB2')}>Открыть B2<ArrowRight size={18}/></button></article>
   <article className="training-choice"><div className="training-icon"><RotateCw size={29}/></div><div><h2>Повторение</h2><p>Задания на сегодня, ошибки и новые упражнения по знакомым темам.</p><small>{due?`На сегодня: ${due}`:'Нет заданий на сегодня — можно открыть ошибки и новые задания'}</small></div><button className="button green" onClick={()=>navigate('review')}>Открыть задания<ArrowRight size={18}/></button></article>
   <article className="training-choice"><div className="training-icon"><Target size={29}/></div><div><h2>Работа над ошибками</h2><p>Твои недавние неверные ответы по темам и четыре новых подхода A1.1 с подготовкой.</p><small>{groups.length?`${groups.length} ${groups.length===1?'тема':'темы'} с недавними ошибками`:'Недавних ошибок нет — можно выбрать новую тему'}</small></div><button className="button green" onClick={()=>navigate('clinic')}>Выбрать тему<ArrowRight size={18}/></button></article>
   <article className="training-choice"><div className="training-icon"><BookOpenCheck size={29}/></div><div><h2>Слова</h2><p>Узнавай значение или вспоминай румынскую форму. Пройденные слова можно повторить по сроку.</p><small>{wordDue?`Сейчас к повторению: ${wordDue} режимов слов`:'Сейчас нет режимов слов к повторению'} · без XP за самооценку.</small></div><button className="button green" onClick={()=>navigate('words')}>Вспомнить слова<ArrowRight size={18}/></button></article>
  </div>
 </section>
}
