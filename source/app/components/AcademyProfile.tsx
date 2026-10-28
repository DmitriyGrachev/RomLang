'use client';
import {academyUnits} from '../../lib/course/academy';
import {hasWritingDraft,unitEvidence} from '../../lib/course/writing';
import type {Learning} from './useLearning';
import type {Navigate} from './CourseApp';

export default function AcademyProfile({learning,navigate}:{learning:Learning;navigate:Navigate}){
 const s=learning.snapshot;const evidence=academyUnits.map(u=>({level:u.level,...unitEvidence(u,s)}));
 const written=Object.values(s.writing).filter(hasWritingDraft).length;
 const revisions=Object.values(s.writing).reduce((n,w)=>n+w.revisions.length,0);
 return <section className="academy-profile"><h2>Профиль расширенной программы</h2><p>«Выполнено» означает, что ты ответил на задания и написал текст. Самостоятельность, точность и редактура учитываются отдельно.</p><div className="academy-skill-cards"><article><strong>{evidence.filter(e=>e.completed).length} / {academyUnits.length}</strong>тем выполнено</article><article><strong>{written}</strong>письменных черновиков · {revisions} сохранённых редакций</article><article><strong>{evidence.reduce((n,e)=>n+e.firstIndependent,0)} / {evidence.reduce((n,e)=>n+e.checkTried,0)}</strong>первых ответов контроля верны без помощи и ошибок написания</article></div><div className="skill-table"><table><thead><tr><th>Уровень</th><th>Практика</th><th>Контроль без помощи</th><th>Собственный текст</th></tr></thead><tbody>{['A1','A2','B1','B2'].map(l=>{const a=evidence.filter(e=>e.level===l);return <tr key={l}><td>{l}</td><td>{a.reduce((n,e)=>n+e.attempted,0)} / {a.reduce((n,e)=>n+e.total,0)}</td><td>{a.reduce((n,e)=>n+e.firstIndependent,0)} / {a.reduce((n,e)=>n+e.checkTotal,0)}</td><td>{a.filter(e=>e.written).length} / {a.length}</td></tr>})}</tbody></table></div><p>Из первых контрольных ответов {evidence.reduce((n,e)=>n+e.delayed,0)} выполнены верно без помощи после перерыва не менее суток с последнего ответа в практике темы.</p><p className="fine-print">Письмо оценивается по твоей рубрике, а не автоматически по CEFR. Курс не проверяет аудирование и устную речь. Эти показатели не подтверждают полный B2.</p><div className="button-row"><button className="button green" onClick={()=>navigate('academy')}>Продолжить программу</button><button className="button outline" onClick={()=>navigate('writing')}>Портфолио текстов</button></div></section>;
}
