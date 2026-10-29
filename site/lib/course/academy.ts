import a1 from '../../content/academy/A1.json' with {type:'json'};
import a2 from '../../content/academy/A2.json' with {type:'json'};
import b1 from '../../content/academy/B1.json' with {type:'json'};
import b2 from '../../content/academy/B2.json' with {type:'json'};
import type {AcademyUnit} from './academy-types.ts';
import type {WordEntry,WordRecallItem} from './types.ts';

export const academyUnits=([...a1,...a2,...b1,...b2] as unknown as AcademyUnit[]).map(u=>({...u,readings:u.readings.map(r=>({...r,questions:r.questions.map(q=>({...q,skill:'reading' as const,text:r.text}))}))}));
export const academyMap=new Map(academyUnits.map(u=>[u.id,u]));
export const academyExercises=academyUnits.flatMap(u=>[...u.readings.flatMap(r=>r.questions),...u.exercises,...u.checkpoint]);
export const academyWords:WordEntry[]=academyUnits.flatMap(u=>u.words.map((w,i)=>({id:u.id+'.w'+(i+1),word:w.ro,ru:w.ru,en:'',stress:'',pos:'слово / выражение',forms:w.forms,examples:[w.example],productive:w.example.ro,lessonId:u.id,moduleId:u.level+'.ACA.'+u.id.split('.').at(-1)})));
export const academyRecall:WordRecallItem[]=academyUnits.flatMap(u=>u.words.map((w,i)=>({wordId:u.id+'.w'+(i+1),prompt:w.ru+' · Введите форму карточки.',answers:w.answers,note:'Проверяются формы из карточки; другие синонимы могут не приниматься.'})));
export const academyCounts={units:academyUnits.length,readings:academyUnits.reduce((n,u)=>n+u.readings.length,0),exercises:academyExercises.length,cards:academyWords.length};
export const academySources:Record<string,{title:string;url:string;use:string}>={
 'ubb-description':{title:'UBB · Descrierea minimală a limbii române, A1–B2',url:'https://video.elearning.ubbcluj.ro/wp-content/uploads/2016/09/Descrierea-minimala-a-limbii-romane-12-IULIE-2016.pdf',use:'Ориентир по языковым функциям и грамматике.'},
 cefr:{title:'Совет Европы · CEFR Companion Volume',url:'https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4',use:'Ориентир по навыкам, взаимодействию и передаче смысла.'},
 puls:{title:'Puls · румынский B1–B2',url:'https://polirom.ro/lexis/4699-puls-manual-de-limba-romana-ca-limba-straina-nivelurile-b1-b2.html',use:'Сопоставление структуры комплексного курса B1–B2 по описанию издателя.'},
 rolang:{title:'ROLANG · Manual и curriculum',url:'https://rolang.ro/levels-and-curricula',use:'Сопоставление тем и последовательности уровней.'},
 myro:{title:'MyRO · материалы для повседневной жизни',url:'https://www.romaniaeacasa.ro/resurse-educationale/',use:'Ориентир по жизненным ситуациям.'},
 ilr:{title:'Institutul Limbii Române · образцы',url:'https://www.ilr.ro/category/atestate/aplicatii-si-nivel-prag/',use:'Ориентир для независимой проверки; формат уточняется у организатора.'},
 ecl:{title:'ECL · оценка экзамена',url:'https://eclexam.eu/exam-assessment/',use:'Сопоставление принципов оценки навыков.'},
 'ubb-program':{title:'UBB · программа румынского как иностранного',url:'https://ilrle.institute.ubbcluj.ro/programe-de-studiu-dlccr/',use:'Сопоставление с университетской программой.'},
};
