import v1 from '../../content/exams/v1.json' with {type:'json'};
import reserveV1 from '../../content/exams/reserve-v1.json' with {type:'json'};
import type {ExamPaper,ExamProfile} from './exam-types.ts';
export const examPapers=[...v1,...reserveV1] as unknown as ExamPaper[];
// Published versions remain in the registry so old attempts keep their original keys.
export const examPaperRegistry=new Map(examPapers.map(p=>[p.id+'@'+p.version,p]));
export const examPaperMap=new Map(examPapers.map(p=>[p.id,p]));
export const examProfile:ExamProfile={
 id:'roexam-b2',version:'2026-10-29',checkedAt:'2026-10-29',provider:'UBB–ICR / RoExam B2 — рабочий ориентир',
 parts:[{id:'listening',title:'Аудирование',minutes:30,points:20},{id:'reading',title:'Чтение',minutes:55,points:20},{id:'language',title:'Грамматика и лексика',minutes:45,points:20},{id:'writing',title:'Письмо',minutes:60,points:20},{id:'speaking',title:'Речь',minutes:20,points:20}],
 sources:[{title:'Структура, задания и рекомендованное время',url:'https://roexam.com/prezentare-examen-b2/'},{title:'Официальный образец, аудио и ключ',url:'https://roexam.com/model-de-examen-b2/'},{title:'Примеры оценки письма',url:'https://roexam.com/exemple-evaluare-scriere-b2/'},{title:'Примеры оценки устной речи',url:'https://roexam.com/exemple-evaluare-vorbire-b2/'}],
 officialPass:null,internalTarget:{total:80,component:14,papers:2},
 audioNote:'В авторских вариантах используется синтетическая озвучка. Два воспроизведения в режиме с таймером — правило этой тренировки. Условия реального экзамена, включая правила аудио и порог прохождения, нужно уточнить у выбранного центра.'
};
export const examProfileRegistry=new Map([[examProfile.version,examProfile]]);
