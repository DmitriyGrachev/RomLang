import a0 from '../../content/visuals/A0.json' with {type:'json'};
import a1 from '../../content/visuals/A1.json' with {type:'json'};
import a2 from '../../content/visuals/A2.json' with {type:'json'};
import b1 from '../../content/visuals/B1.json' with {type:'json'};
import b2 from '../../content/visuals/B2.json' with {type:'json'};
import type {TheoryVisual, TheoryVisualSection} from './theory-visual-types.ts';

export const theoryVisuals = [...a0,...a1,...a2,...b1,...b2] as TheoryVisual[];
const byChapter = new Map<string, TheoryVisual[]>();
for (const visual of theoryVisuals) {
  const collection = byChapter.get(visual.chapterId) ?? [];
  collection.push(visual);
  byChapter.set(visual.chapterId, collection);
}
export function visualsForChapter(chapterId: string, section?: TheoryVisualSection): TheoryVisual[] {
  const collection = byChapter.get(chapterId) ?? [];
  return section ? collection.filter(visual => visual.section === section) : collection;
}
