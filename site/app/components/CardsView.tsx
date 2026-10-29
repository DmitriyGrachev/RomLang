'use client';
import {useEffect,useMemo,useState} from 'react';
import {dictionary,modules,wordRecallMap} from '../../lib/course/data';
import {russianCount} from '../../lib/course/curriculum';
import {academyUnits} from '../../lib/course/academy';
import {clampCardOffset,collectCards,filterCards,rateCard,startCardsRound,stopCardsRound} from '../../lib/course/cards';
import type {CardFilters,CardsRound,StudyCard} from '../../lib/course/cards';
import {wordReviewKey} from '../../lib/course/word-memory';
import {wordIsAssisted} from '../../lib/course/word-ui';
import type {Grade,Level,WordReviewMode} from '../../lib/course/types';
import type {Learning} from './useLearning';

type Editor={id:string;ro:string;ru:string;example:string};
const pageSize=12;
const moduleNames=new Map([...modules.map(module=>[module.id,module.title] as [string,string]),...academyUnits.map(u=>[u.level+'.ACA.'+u.id.split('.').at(-1),u.title] as [string,string])]);
const newId=()=>`custom.${Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(16).padStart(2,'0')).join('')}`;
function dueLabel(date:string|undefined){return date?new Date(date).toLocaleDateString('ru-RU',{day:'numeric',month:'short',year:'numeric'}):'ещё нет срока'}

export default function CardsView({learning}:{learning:Learning}){
 const s=learning.snapshot;
 const [now,setNow]=useState(()=>Date.now());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60_000);return()=>clearInterval(timer)},[]);
 const [filters,setFilters]=useState<CardFilters>({deck:'all',level:'all',topic:'all',query:'',mode:'recognition'});
 const [offset,setOffset]=useState(0);
 const [round,setRound]=useState<CardsRound|null>(null);
 const [roundCards,setRoundCards]=useState<StudyCard[]>([]);
 const [revealed,setRevealed]=useState(false);
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState<(Grade&{assisted:boolean})|null>(null);
 const [editor,setEditor]=useState<Editor|null>(null);
 const [managePage,setManagePage]=useState(0);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const cards=useMemo(()=>collectCards(dictionary,s.customCards),[s.customCards]);
 const pool=useMemo(()=>filterCards(cards,s,filters,now),[cards,s,filters,now]);
 const pageOffset=filters.deck==='due'?0:clampCardOffset(pool.length,offset,pageSize);
 useEffect(()=>{if(offset!==pageOffset)setOffset(pageOffset)},[offset,pageOffset]);
 const available=pool.slice(pageOffset,pageOffset+pageSize);
 const topics=[...new Set(cards.filter(card=>filters.level==='all'||card.level===filters.level).map(card=>card.topic))];
 const own=cards.filter(card=>card.custom&&(!filters.query||[card.ro,card.ru,card.example].join(' ').toLocaleLowerCase().includes(filters.query.toLocaleLowerCase())));
 const current=round?.pending.length?roundCards.find(card=>card.id===round.pending[0]):undefined;
 const curated=current&&!current.custom?wordRecallMap.get(current.id):undefined;
 const mode=filters.mode;
 const exactTarget=!!current&&(!curated||(curated.answers.length===1&&curated.answers[0]===current.ro));
 const assisted=!!current&&wordIsAssisted(current.id,mode,new Map(),round?.missedIds??[],s.wordAttempts[current.id]??[],now,s.wordExposures);
 const busy=learning.status==='loading';
 const status=learning.status==='saved'?'Сохранено':learning.status==='saving'?'Сохраняем…':learning.status==='error'?'Ответы пока в этой вкладке. Повторите сохранение.':learning.status==='signin'?'Войдите через ChatGPT для сохранения.':'Загружаем записи…';
 const reset=()=>{setRevealed(false);setAnswer('');setFeedback(null);setError('')};
 const configure=(patch:Partial<CardFilters>)=>{setFilters(f=>({...f,...patch}));setOffset(0);setManagePage(0);setNotice('');setError('')};
 const start=(chosen=available)=>{setRoundCards(chosen);setRound(startCardsRound(chosen.map(card=>card.id)));reset();setNotice('')};
 const exposeRecall=()=>{if(current){learning.send('wordExposure',{wordId:current.id,mode:'recall'});setNow(Date.now())}};
 const advance=(correct:boolean)=>{setRound(r=>r?rateCard(r,correct):r);reset();setNow(Date.now())};
 const rateRecognition=(recalled:boolean)=>{
  if(!current||!revealed)return;
  try{learning.send('wordReview',{wordId:current.id,mode:'recognition',recalled,assisted:wordIsAssisted(current.id,mode,new Map(),round?.missedIds??[],s.wordAttempts[current.id]??[],Date.now(),s.wordExposures)});advance(recalled)}catch(e){setError((e as Error).message)}
 };
 const checkRecall=(show=false)=>{
  if(!current||feedback||(!show&&!answer.trim()))return;
  try{
   const checked=learning.send('wordReview',{wordId:current.id,mode:'recall',answer:show?'':answer.trim(),assisted:show||wordIsAssisted(current.id,mode,new Map(),round?.missedIds??[],s.wordAttempts[current.id]??[],Date.now(),s.wordExposures)}).payload;
   const result=checked.result as Grade;
   setFeedback({...result,assisted:checked.assisted===true});setRevealed(true);exposeRecall();setNow(Date.now());setError('');
  }catch(e){setError((e as Error).message)}
 };
 const saveWord=()=>{if(current)try{learning.send('word',{wordId:current.id,saved:!s.savedWords.includes(current.id)});setError('')}catch(e){setError((e as Error).message)}};
 const saveCustom=()=>{
  if(!editor)return;
  try{learning.send('customCard',{action:'upsert',cardId:editor.id||newId(),ro:editor.ro,ru:editor.ru,example:editor.example});setEditor(null);setNotice('Карточка сохранена');setError('');setManagePage(0)}catch(e){setError((e as Error).message)}
 };
 const deleteCustom=(id:string)=>{try{learning.send('customCard',{action:'delete',cardId:id});if(editor?.id===id)setEditor(null);setNotice('Карточка удалена из тренировок');setManagePage(0);setError('')}catch(e){setError((e as Error).message)}};
 const chooseAgain=()=>{setRound(null);setRoundCards([]);setOffset(0);reset()};
 return <section className="cards-view">
  <header className="cards-heading"><div><p className="study-context">Слова · личная колода</p><h1>Карточки</h1><p className="subtitle">По одной карточке за раз. Вспомните значение или проверьте письменный ответ.</p></div>{!round?<button className="button outline" disabled={busy} onClick={()=>{setEditor({id:'',ro:'',ru:'',example:''});setError('')}}>+ Своя карточка</button>:null}</header>
  {!round?<>
   <div className="cards-decks" role="group" aria-label="Колода карточек">{([['all','Все'],['due','Пора повторить'],['saved','Сохранённые'],['custom','Свои']] as const).map(([value,label])=><button key={value} aria-pressed={filters.deck===value} className={filters.deck===value?'selected':''} onClick={()=>configure(value==='custom'?{deck:value,level:'all',topic:'all'}:{deck:value})}>{label}</button>)}</div>
   <div className="cards-filters"><label>Поиск слова<input type="search" placeholder="Слово, перевод или пример" value={filters.query} onChange={e=>configure({query:e.target.value})}/></label><label>Уровень<select value={filters.level} onChange={e=>configure({level:e.target.value as Level|'all',topic:'all'})}><option value="all">Все уровни</option>{(['A1','A2','B1','B2'] as const).map(level=><option key={level}>{level}</option>)}</select></label><label>Тема / модуль<select value={filters.topic} onChange={e=>configure({topic:e.target.value})}><option value="all">Все темы</option>{topics.map(topic=><option key={topic} value={topic}>{topic==='personal'?'Личные · без уровня':`${topic} · ${moduleNames.get(topic)??'Слова модуля'}`}</option>)}</select></label></div>
   <div className="cards-mode" role="group" aria-label="Направление карточек">{([['recognition','RO → RU · самооценка'],['recall','RU → RO · письменная проверка']] as const).map(([value,label])=><button key={value} aria-pressed={mode===value} className={mode===value?'selected':''} onClick={()=>configure({mode:value as WordReviewMode})}>{label}</button>)}</div>
   <div className="cards-start">{busy?<p>Загружаем ваши карточки…</p>:available.length?<><div><strong>{russianCount(pool.length,['карточка','карточки','карточек'])} в подборке</strong><p>В подходе до {pageSize} карточек. Ошибка вернётся один раз, затем слово останется на потом.</p></div><button className="button green" onClick={()=>start()}>Начать · {available.length}</button></>:<><h2>{filters.deck==='due'?'Нет карточек с наступившим сроком':filters.deck==='saved'?'Нет сохранённых карточек по этим фильтрам':filters.deck==='custom'?'Нет своих карточек по этим фильтрам':'Ничего не найдено'}</h2><p>{filters.deck==='due'?'Срок появится после первого ответа. Для начала выберите все карточки.':filters.deck==='custom'?'Добавьте слово и перевод. Свои карточки относятся к личной теме без уровня.':'Измените поиск, тему или уровень. Сохранить слово можно на карточке.'}</p><button className="button outline" onClick={()=>configure({deck:'all',level:'all',topic:'all',query:''})}>Показать все карточки</button></>}</div>
   {pool.length>pageSize&&filters.deck!=='due'?<div className="cards-pagination"><button className="text-button" disabled={pageOffset===0} onClick={()=>setOffset(Math.max(0,pageOffset-pageSize))}>← Предыдущие</button><span>{pageOffset+1}–{Math.min(pageOffset+pageSize,pool.length)} из {pool.length}</span><button className="text-button" disabled={pageOffset+pageSize>=pool.length} onClick={()=>setOffset(pageOffset+pageSize)}>Следующие →</button></div>:null}
   <p className="cards-note">Узнавание — ваша самооценка. Письменная проверка и её сроки записываются отдельно. Это история практики, а не подтверждение владения словом или уровнем.</p>
  </>:current?<>
   <div className="cards-round-meta"><span>В очереди: {round.pending.length} · ответов: {round.attempts+(feedback?1:0)}</span><button className="text-button" onClick={()=>{setRound(r=>r?stopCardsRound(feedback?rateCard(r,feedback.correct):r):r);reset()}}>Продолжить позже</button></div>
   <progress className="cards-progress" aria-label="Прогресс подхода" value={round.ids.length-new Set(round.pending).size} max={round.ids.length}/>
   <article className={'cards-stack '+(revealed?'is-revealed':'')} aria-label="Текущая карточка">
    <div className="cards-card-top"><span>{current.custom?'Личная · без уровня':`${current.level} · ${current.topic}`}</span><button className="cards-bookmark" aria-label={s.savedWords.includes(current.id)?'Убрать карточку из сохранённых':'Сохранить карточку'} aria-pressed={s.savedWords.includes(current.id)} onClick={saveWord}>{s.savedWords.includes(current.id)?'★ Сохранено':'☆ Сохранить'}</button></div>
    <p className="study-context">{mode==='recognition'?'Вспомните перевод':'Напишите по-румынски'}</p>
    <h2 aria-live="polite" lang={mode==='recognition'?'ro':'ru'}>{mode==='recognition'?current.ro:curated?.prompt??current.ru}</h2>
    {mode==='recall'&&!feedback?<form className="cards-answer" onSubmit={e=>{e.preventDefault();checkRecall()}}><label htmlFor="cards-answer">Ответ на румынском</label><input id="cards-answer" lang="ro" maxLength={200} autoComplete="off" autoCapitalize="off" spellCheck={false} value={answer} onChange={e=>setAnswer(e.target.value)}/><p>{exactTarget?'Введите форму карточки; синонимы не проверяются':curated?.note}</p><button className="button green" disabled={!answer.trim()}>Проверить ответ</button></form>:null}
    {revealed?<div className="cards-back" aria-live="polite">{feedback?<div className={'cards-feedback '+(feedback.correct?'correct':'incorrect')} role="status"><strong>{feedback.correct?feedback.spelling?'Верно, но проверьте диакритику':'Ответ совпал':'Пока не совпало'}</strong>{answer?<p>Ваш ответ: <span lang="ro">{answer}</span></p>:null}<p>Форма ответа: <b lang="ro">{feedback.canonical}</b></p><small>{feedback.assisted?'Попытка с подсказкой':'Письменный ответ без подсказки'}</small></div>:null}<strong lang="ro">{current.ro}</strong><p>{current.ru}</p>{current.forms?<small>Формы: <span lang="ro">{current.forms}</span></small>:null}{current.example?<blockquote><span lang="ro">{current.example}</span>{current.exampleRu?<span>{current.exampleRu}</span>:null}</blockquote>:null}{mode==='recognition'?<p className="cards-note">Оцените, вспомнили ли значение до раскрытия.</p>:null}</div>:mode==='recognition'?<p className="cards-note">Сначала сформулируйте перевод для себя.</p>:null}
   </article>
   <div className="cards-actions">{mode==='recognition'?revealed?<><button className="button outline" onClick={()=>rateRecognition(false)}>Ещё раз</button><button className="button green" onClick={()=>rateRecognition(true)}>Вспомнил</button></>:<button className="button green" onClick={()=>{setRevealed(true);exposeRecall()}}>Открыть перевод</button>:feedback?<button className="button green" onClick={()=>advance(feedback.correct)}>{feedback.correct?'Следующая карточка':'Повторить позже'}</button>:<button className="button outline" onClick={()=>checkRecall(true)}>Показать ответ</button>}</div>
   <div className="cards-dates"><span>Повторить узнавание · {dueLabel(s.wordReviews[wordReviewKey(current.id,'recognition')]?.due)}</span><span>Повторить письменно · {dueLabel(s.wordReviews[wordReviewKey(current.id,'recall')]?.due)}</span></div>
   <p className="cards-note">{assisted?'После недавней ошибки или показа ответа повтор записывается с подсказкой.':'Сроки двух направлений независимы. Самооценка не заменяет письменную проверку.'}</p>
  </>:<div className="cards-finished"><p className="study-context">Подход завершён</p><h2>{round.deferred.length?'Остальное — в следующий раз':'Все карточки этого подхода пройдены'}</h2><p>Записано ответов: {round.attempts}. {round.deferred.length?`На потом: ${round.deferred.length}. Их сроки повторения остаются в истории.`:'Вернитесь к карточкам в указанную дату повторения.'}</p><div className="button-row"><button className="button green" onClick={chooseAgain}>Выбрать подборку</button>{round.deferred.length?<button className="button outline" onClick={()=>start(roundCards.filter(card=>round.deferred.includes(card.id)))}>Новый подход для оставшихся</button>:null}</div></div>}
  {editor&&!round?<form className="cards-editor" onSubmit={e=>{e.preventDefault();saveCustom()}}><h2>{editor.id?'Изменить свою карточку':'Новая карточка'}</h2><p>Изменение слова или перевода начнёт его историю повторений заново.</p><label>Слово / форма на румынском<input lang="ro" required maxLength={200} value={editor.ro} onChange={e=>setEditor({...editor,ro:e.target.value})}/></label><label>Перевод на русский<input lang="ru" required maxLength={400} value={editor.ru} onChange={e=>setEditor({...editor,ru:e.target.value})}/></label><label>Пример на румынском · необязательно<textarea lang="ro" maxLength={1000} value={editor.example} onChange={e=>setEditor({...editor,example:e.target.value})}/></label><div className="button-row"><button className="button green" disabled={!editor.ro.trim()||!editor.ru.trim()}>Сохранить карточку</button><button type="button" className="text-button" onClick={()=>{setEditor(null);setError('')}}>Отмена</button></div></form>:null}
  {!round&&own.length?<details className="cards-manage"><summary>Управление своими карточками · {own.length}</summary><ul>{own.slice(managePage*pageSize,(managePage+1)*pageSize).map(card=><li key={card.id}><div><strong lang="ro">{card.ro}</strong><span>{card.ru}</span></div><div><button className="text-button" aria-label={`Изменить карточку ${card.ro}`} onClick={()=>{setEditor({id:card.id,ro:card.ro,ru:card.ru,example:card.example});setError('')}}>Изменить</button><button className="text-button" aria-label={`Удалить карточку ${card.ro}`} onClick={()=>deleteCustom(card.id)}>Удалить</button></div></li>)}</ul>{own.length>pageSize?<div className="cards-pagination"><button className="text-button" disabled={managePage===0} onClick={()=>setManagePage(n=>Math.max(0,n-1))}>← Назад</button><span>Страница {managePage+1}</span><button className="text-button" disabled={(managePage+1)*pageSize>=own.length} onClick={()=>setManagePage(n=>n+1)}>Далее →</button></div>:null}</details>:null}
  {error?<p className="error-text" role="alert">{error}</p>:null}{notice?<p role="status" className="cards-note">{notice}</p>:null}<div className="cards-save"><span role="status">{status}</span>{learning.status==='error'||learning.status==='signin'?<button className="text-button" onClick={()=>void learning.retry()}>Повторить сохранение</button>:null}</div>
 </section>;
}
