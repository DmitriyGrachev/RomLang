import type {Level,ExerciseItem,Example} from './types.ts';
export type AcademyWord={ro:string;ru:string;forms:string;example:Example;answers:string[]};
export type AcademyReading={id:string;title:string;genre:string;text:string;glossary:Example[];questions:ExerciseItem[]};
export type AcademyWriting={id:string;title:string;prompt:string;targetWords:[number,number];plan:string[];model:string;annotations:string[];rubric:{criterion:string;description:string}[];revisionFocus:string[];transferPrompt:string};
export type AcademyUnit={id:string;level:Level;title:string;domain:string;goals:string[];prerequisites:string[];grammar:string;sections:{title:string;body:string[];examples:Example[]}[];pitfalls:{wrong:string;right:string;why:string}[];words:AcademyWord[];readings:AcademyReading[];exercises:ExerciseItem[];writing:AcademyWriting;checkpoint:ExerciseItem[];sourceIds:string[]};
