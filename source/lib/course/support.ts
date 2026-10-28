import a1 from '../../content/A1-support.json' with {type:'json'};
import a2 from '../../content/A2-mission-support.json' with {type:'json'};
import b1 from '../../content/B1-mission-support.json' with {type:'json'};
import b2 from '../../content/B2-mission-support.json' with {type:'json'};
import type {Lesson,WordEntry,Mission} from './types.ts';
import {depthContent} from './depth.ts';
export type TeachingPhrase={ro:string;ru:string;note?:string};
export type LessonTeaching={lessonId:string;words:{ro:string;ru:string}[];phrases:TeachingPhrase[];notes:string[]};
export type MissionTeaching={missionId:string;phrases:TeachingPhrase[];notes:string[]};
const a1Teaching=a1 as {lessons:LessonTeaching[];missions:MissionTeaching[]};
const lessonTeaching=[...a1Teaching.lessons,...depthContent.flatMap(content=>content.lessonTeaching)];
const missionTeaching=[...a1Teaching.missions,...a2.missions,...b1.missions,...b2.missions,...depthContent.flatMap(content=>content.missionTeaching)] as MissionTeaching[];
export function teachingForLesson(lesson:Lesson,words:WordEntry[]):LessonTeaching{
 const custom=lessonTeaching.find(s=>s.lessonId===lesson.id);
 if(custom)return custom;
 return {lessonId:lesson.id,words:words.map(w=>({ro:w.word,ru:w.ru})),phrases:lesson.examples,notes:[]};
}
export function teachingForMission(mission:Mission):MissionTeaching{
 return missionTeaching.find(s=>s.missionId===mission.id)??{missionId:mission.id,phrases:[],notes:[]};
}
export function missionPhrase(mission:Mission,text:string){return teachingForMission(mission).phrases.find(p=>p.ro===text)}
