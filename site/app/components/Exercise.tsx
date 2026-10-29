'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,Check,RotateCcw} from 'lucide-react';
import type {ExerciseItem,Grade} from '../../lib/course/types';
import {grade,initialExerciseAnswer} from '../../lib/course/engine';
import type {Learning} from './useLearning';

type Props={item:ExerciseItem;learning:Learning;onNext?:()=>void;onBack?:()=>void;assisted?:boolean;nextLabel?:string;showText?:boolean};
export default function Exercise({item,learning,onNext,onBack,assisted:externalAssisted=false,nextLabel='Дальше',showText=true}:Props){
 const {snapshot:s,send}=learning;const initial=initialExerciseAnswer(item,s.drafts[item.id]||'');
 const [answer,setAnswer]=useState(initial);const [selected,setSelected]=useState<number[]>([]);const [typing,setTyping]=useState(!!initial);
 const [hint,setHint]=useState(false);const [result,setResult]=useState<Grade|null>(null);
 const [report,setReport]=useState(false);const [reportText,setReportText]=useState('');const [reported,setReported]=useState(false);
 const [checkedAnswer,setCheckedAnswer]=useState('');
 const feedback=useRef<HTMLDivElement>(null);const question=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(result||!window.matchMedia('(max-width: 760px)').matches)return;const panel=question.current;if(!panel||!panel.getClientRects().length)return;panel.focus({preventScroll:true});const bounds=panel.getBoundingClientRect();if(bounds.top<64||bounds.top>window.innerHeight/2)panel.scrollIntoView({block:'start',behavior:'instant'})},[item.id,result]);
 useEffect(()=>{if(!result||!window.matchMedia('(max-width: 760px)').matches)return;const panel=feedback.current;if(!panel)return;panel.focus({preventScroll:true});const bounds=panel.getBoundingClientRect();if(bounds.top<64||bounds.bottom>window.innerHeight)panel.scrollIntoView({block:'start',behavior:'instant'})},[result]);
 const assisted=externalAssisted||!!s.assistance[item.id]||hint||!!s.attempts[item.id]?.length;
 const change=(value:string)=>{setAnswer(value);send('draft',{key:item.id,text:value})};
 const clickToken=(i:number)=>{const next=[...selected,i];setSelected(next);change(next.map(j=>item.tokens![j]).join(' '))};
 const check=()=>{if(!answer.trim()||result)return;const g=grade(answer,item);send('attempt',{exerciseId:item.id,answer,assisted});setCheckedAnswer(answer);setResult(g)};
 const retry=()=>{setResult(null);setSelected([]);change('')};
 const submit=(e:React.FormEvent)=>{e.preventDefault();if(result){if(result.correct)onNext?.();else retry()}else check()};
 return <div className="exercise simple-exercise">
  <div className="practice-question" ref={question} tabIndex={-1}><h2 className="task-question">{item.prompt}</h2>{showText&&item.text?<blockquote className="reading-passage" lang="ro">{item.text}</blockquote>:null}</div>
  <form onSubmit={submit}>
   <fieldset className="practice-answer-fields" disabled={!!result}>
    {item.type==='order'?<><div className="sentence-builder" aria-label="Собранное предложение" aria-live="polite">{typing?<input aria-label="Ваш ответ" value={answer} onChange={e=>change(e.target.value)} autoComplete="off" spellCheck={false}/>:selected.length?selected.map((i,n)=><button type="button" className="selected-token" key={n} onClick={()=>{const v=selected.filter((_,j)=>j!==n);setSelected(v);change(v.map(j=>item.tokens![j]).join(' '))}}>{item.tokens![i]}</button>):<span>Собери предложение</span>}</div>{!typing?<div className="word-tokens">{(item.tokens||[]).map((t,i)=><button type="button" className="token" key={i} disabled={selected.includes(i)} onClick={()=>clickToken(i)}>{t}</button>)}</div>:null}<div className="input-tools"><button className="text-button" type="button" onClick={()=>{setTyping(!typing);setSelected([]);change('')}}>{typing?'Выбирать слова':'Ввести с клавиатуры'}</button>{answer?<button className="text-button" type="button" onClick={()=>{setSelected([]);change('')}}>Очистить</button>:null}</div></>:item.type==='gap'||(item.type==='read'&&!item.choices?.length)?<><input className="answer-input" aria-label="Ваш ответ" placeholder="Ответ по-румынски" value={answer} onChange={e=>change(e.target.value)} autoComplete="off" spellCheck={false}/><div className="diacritics" aria-label="Румынские буквы">{'ăâîșț'.split('').map(c=><button type="button" key={c} onClick={()=>change(answer+c)}>{c}</button>)}</div></>:<div className="answer-options">{(item.choices||[]).map((choice,i)=><label className={'answer-option '+(answer===choice?'chosen':'')} key={i}><input type="radio" name={item.id} value={choice} checked={answer===choice} onChange={()=>change(choice)}/><span className="option-letter" aria-hidden="true">{String.fromCharCode(65+i)}</span><span>{choice}</span></label>)}</div>}
   </fieldset>
   {!result?<details className="task-help" onToggle={e=>{if(e.currentTarget.open&&!hint){setHint(true);send('assist',{key:item.id})}}}><summary>Нужна подсказка?</summary><p>{item.hint}</p></details>:null}
   <div className={'practice-action-bar '+(result?'has-result '+(result.correct?'is-correct':'is-incorrect'):'')}>
    <div className="practice-action-inner">
     {result?<div className="answer-feedback" role="status" ref={feedback} tabIndex={-1}><div className="feedback-icon">{result.correct?<Check size={26}/>:<RotateCcw size={24}/>}</div><div className="feedback-copy"><strong>{result.correct?(result.spelling?'Верно! Уточним написание':'Верно!'):'Попробуй ещё раз'}</strong><p className="feedback-canonical">Правильный ответ: <b lang="ro">{result.canonical}</b></p><p>{item.explanation}</p><button type="button" className="text-button report-toggle" onClick={()=>setReport(!report)}>Мой вариант тоже подходит</button></div></div>:null}
     <div className="practice-action-buttons">{onBack?<button type="button" className="practice-back-button" onClick={onBack}>Назад</button>:<span/>}{result?<div className="feedback-actions">{!result.correct&&onNext?<button type="button" className="text-button skip-after-error" onClick={onNext}>Продолжить</button>:null}<button type="submit" className="button green task-next">{result.correct?nextLabel:'Попробовать ещё'}<ArrowRight size={18}/></button></div>:<button type="submit" className="button green" disabled={!answer.trim()}>Проверить<ArrowRight size={18}/></button>}</div>
    </div>
   </div>
  </form>
  {report?<div className="answer-report"><label>Добавь контекст или вопрос<textarea value={reportText} onChange={e=>setReportText(e.target.value)} rows={3}/></label><button className="button outline" disabled={!reportText.trim()||reported} onClick={()=>{send('report',{exerciseId:item.id,text:`${checkedAnswer}\n${reportText}`});setReported(true)}}>{reported?<><Check size={16}/>Сохранено в журнале</>:'Сохранить замечание'}</button></div>:null}
 </div>
}
