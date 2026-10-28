import type {WordReviewMode,WordReviewState} from './types.ts';

const day=86400000;
const steps=[1,3,7,14,30];

export function wordReviewKey(wordId:string,mode:WordReviewMode){return `${wordId}:${mode}`}

export function scheduleWordPractice(prior:WordReviewState|undefined,correct:boolean,assisted:boolean,at:string):WordReviewState{
 const attempts=(prior?.attempts??0)+1;
 // Restoring an older event after newer work still records the attempt, without rewinding the due date.
 if(prior&&Date.parse(at)<Date.parse(prior.lastAt))return {...prior,attempts};
 if(!correct)return {due:at,streak:0,lastAt:at,attempts};
 if(assisted){
  const tomorrow=Date.parse(at)+day;
  // A helper-assisted retry cannot push an existing due date later.
  const due=prior&&Date.parse(at)<Date.parse(prior.due)?Math.min(Date.parse(prior.due),tomorrow):tomorrow;
  return {due:new Date(due).toISOString(),streak:0,lastAt:at,attempts};
 }
 if(prior&&Date.parse(at)<Date.parse(prior.due))return {...prior,lastAt:at,attempts};
 const streak=(prior?.streak??0)+1;
 const due=new Date(Date.parse(at)+steps[Math.min(streak-1,steps.length-1)]*day).toISOString();
 return {due,streak,lastAt:at,attempts};
}
