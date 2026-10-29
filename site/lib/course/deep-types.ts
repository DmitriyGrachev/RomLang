export type StudyLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2';
export type StudySkill = 'grammar' | 'reading' | 'listening' | 'writing' | 'speaking';
export type DeepExample = {ro:string;ru:string;why:string};
export type DeepObjective = {id:string;label:string;skill:StudySkill};
export type DeepExercise = {
 id:string; objectiveId:string; familyId:string;
 mode:'practice'|'control'|'retention';
 kind:'choice'|'gap'|'transform'|'edit'|'explain';
 prompt:string; context?:string; answers:string[]; choices?:string[];
 caseSensitive?:boolean;punctuationSensitive?:boolean;
 explanation:string; hint:string;
};
export type StudyRubric = {key:string;label:string;description:string};
export type DeepChapter = {
 id:string;level:StudyLevel;strand:string;title:string;summary:string;
 prerequisites:string[];legacyLessonIds:string[];academyIds:string[];
 objectives:DeepObjective[];
 sections:{key:'meaning'|'formation'|'usage'|'contrasts'|'limits'|'interference'|'depth';title:string;body:string[]}[];
 forms:{title:string;headers:string[];rows:string[][];note:string}[];
 examples:DeepExample[];
 contrasts:{left:DeepExample;right:DeepExample;why:string}[];
 pitfalls:{wrong:string;right:string;why:string}[];
 selfExplanation:string[];
 exercises:DeepExercise[];
 writing:{prompt:string;transferPrompt:string;targetWords:[number,number];plan:string[];rubric:StudyRubric[]};
 speaking:{prompt:string;followUps:string[];rubric:StudyRubric[]};
 listening:{title:string;script:string;transferScript:string;questions:{prompt:string;answers:string[];explanation:string}[];transferQuestions:{prompt:string;answers:string[];explanation:string}[]};
 sourceIds:string[];
};
export type StudyIssue={category:'spelling'|'form'|'syntax'|'vocabulary'|'cohesion'|'register';fragment:string;correction:string;why:string};
export type StudyEvaluation = {source:'self'|'teacher-reported';scores:Record<string,number>;comment:string;issues?:StudyIssue[]};
export type StudyEvidence = {
 id:string;at:string;chapterId:string;chapterVersion:string;
 action:'view'|'help'|'attempt'|'draft'|'writing'|'speaking'|'listening'|'review'|'feedback';
 exerciseId?:string;objectiveId?:string;familyId?:string;mode?:string;
 answer?:string;assisted:boolean;status?:'correct'|'spelling'|'incorrect'|'pending'|'submitted';
 skill:StudySkill;score?:number;total?:number;scenario?:'main'|'transfer';
 evaluation?:StudyEvaluation;targetId?:string;novel?:boolean;recordingId?:string;
};
