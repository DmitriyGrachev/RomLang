import type {Lesson} from '../../lib/course/types';
import {dictionary,moduleFor} from '../../lib/course/data';
import {teachingForLesson} from '../../lib/course/support';
export default function TeachingNotes({lesson}:{lesson:Lesson}){
 const mod=moduleFor(lesson.id);const words=dictionary.filter(w=>w.moduleId===mod?.id);const support=teachingForLesson(lesson,words);const introduced=new Set(support.words.map(w=>w.ro));const extra=words.filter(w=>!introduced.has(w.word));
 return <section className="teaching-notes"><h2>Слова, которые понадобятся</h2><p>Сначала свяжи румынское слово с его смыслом. В упражнениях встретятся эти слова и выражения.</p><div className="teaching-word-grid">{support.words.map((w,i)=><div key={i}><strong lang="ro">{w.ro}</strong><span>{w.ru}</span></div>)}</div>{support.phrases.length?<><h2>Как понять и построить фразу</h2>{support.phrases.map((p,i)=><div className="teaching-phrase" key={i}><strong lang="ro">{p.ro}</strong><p>{p.ru}</p>{p.note?<small>{p.note}</small>:null}</div>)}</>:null}{support.notes.map((n,i)=><p className="teaching-note" key={i}>{n}</p>)}{extra.length?<details className="extra-vocabulary"><summary>Ещё слова этого модуля</summary><div className="teaching-word-grid">{extra.map(w=><div key={w.id}><strong lang="ro">{w.word}</strong><span>{w.ru}</span></div>)}</div></details>:null}</section>
}
