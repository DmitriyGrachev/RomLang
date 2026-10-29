import a1 from '../../content/depth-A1.json' with {type:'json'};
import a2 from '../../content/depth-A2.json' with {type:'json'};
import b1 from '../../content/depth-B1.json' with {type:'json'};
import b2 from '../../content/depth-B2.json' with {type:'json'};
import type {LevelContent,Module} from './types.ts';
import type {LessonTeaching,MissionTeaching} from './support.ts';

export type DepthContent=LevelContent&{modules:Module[];lessonTeaching:LessonTeaching[];missionTeaching:MissionTeaching[]};
export const depthContent=[a1,a2,b1,b2] as unknown as DepthContent[];
