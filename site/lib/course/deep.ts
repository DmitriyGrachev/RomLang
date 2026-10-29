import a0 from '../../content/deep/A0.json' with {type:'json'};
import a1 from '../../content/deep/A1.json' with {type:'json'};
import a2 from '../../content/deep/A2.json' with {type:'json'};
import b1 from '../../content/deep/B1.json' with {type:'json'};
import b2 from '../../content/deep/B2.json' with {type:'json'};
import type {DeepChapter,StudyLevel} from './deep-types.ts';
export const studyLevels:StudyLevel[]=['A0','A1','A2','B1','B2'];
export const deepChapters=[...a0,...a1,...a2,...b1,...b2] as unknown as DeepChapter[];
export const deepChapterMap=new Map(deepChapters.map(c=>[c.id,c]));
export const deepExerciseMap=new Map(deepChapters.flatMap(c=>c.exercises.map(e=>[e.id,e] as const)));
export const deepCounts={chapters:deepChapters.length,objectives:deepChapters.reduce((n,c)=>n+c.objectives.length,0),practice:deepChapters.reduce((n,c)=>n+c.exercises.filter(e=>e.mode==='practice').length,0),control:deepChapters.reduce((n,c)=>n+c.exercises.filter(e=>e.mode==='control').length,0),retention:deepChapters.reduce((n,c)=>n+c.exercises.filter(e=>e.mode==='retention').length,0),audioScripts:deepChapters.length*2};
export const deepSources:Record<string,{title:string;url:string;use:string}>={
 'ubb-description':{title:'UBB · Descrierea minimală A1–B2',url:'https://video.elearning.ubbcluj.ro/wp-content/uploads/2016/09/Descrierea-minimala-a-limbii-romane-12-IULIE-2016.pdf',use:'Сверка грамматики и языковых функций.'},
 cefr:{title:'Совет Европы · CEFR',url:'https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale',use:'Ориентир по речевым умениям.'},
 doom:{title:'DOOM 3 · нормативные формы',url:'https://doom.lingv.ro/',use:'Орфография, произношение и грамматические формы.'},
 roexam:{title:'RoExam · формат и образцы B2',url:'https://roexam.com/model-de-examen-b2/',use:'Официальные образцы, аудио и ключи для внешней проверки.'},
 'ubb-a1a2':{title:'UBB · Manual RLS A1–A2',url:'https://libraria.ubbcluj.ro/produs/manual-de-limba-romana-ca-limba-straina-rls-a1-a2/',use:'Учебник и ссылка на аудиоматериалы издателя.'},
 'ubb-b1':{title:'UBB · Manual RLS B1',url:'https://libraria.ubbcluj.ro/produs/manual-de-limba-straina-ca-limba-straina-nivelul-b1/',use:'Комплексный курс и аудиоматериалы издателя.'},
 'ubb-b2':{title:'UBB · Manual RLS B2',url:'https://libraria.ubbcluj.ro/produs/manual-de-limba-romana-ca-limba-straina-nivelul-b2/',use:'Комплексный курс и аудиоматериалы издателя.'},
 myro:{title:'România e acasă · учебные аудио',url:'https://www.romaniaeacasa.ro/resurse-educationale/',use:'Материалы повседневного общения и записи по урокам.'},
 'romanian-ukrainian':{title:'Română pentru ucraineni · A1–B1',url:'https://romanapentruucraineni.ro/',use:'Опора на украинский: материалы A1–A2 и B1. Условия получения и доступа указаны у автора.'},
 'essential-grammar':{title:'Romanian: An Essential Grammar · на английском',url:'https://www.routledge.com/Romanian-An-Essential-Grammar/Gonczol/p/book/9781315363776',use:'Дополнительный разбор грамматики, примеры и упражнения. Книга для начального и среднего этапа.'},
};
