import {deepChapters,deepSources} from '../lib/course/deep.ts';
import {theoryVisuals} from '../lib/course/theory-visuals.ts';
import {validateTheoryVisuals} from '../lib/course/theory-visual-validation.ts';

const errors=validateTheoryVisuals(theoryVisuals,deepChapters,Object.keys(deepSources));
for(const error of errors)console.error(error);
const levels={};const kinds={};
for(const visual of theoryVisuals){
  const level=visual.chapterId.split('.')[1];
  levels[level]=(levels[level]??0)+1;
  kinds[visual.kind]=(kinds[visual.kind]??0)+1;
}
console.log(JSON.stringify({visuals:theoryVisuals.length,frames:theoryVisuals.reduce((n,v)=>n+v.frames.length,0),levels,kinds,errors:errors.length},null,2));
if(errors.length)process.exitCode=1;
