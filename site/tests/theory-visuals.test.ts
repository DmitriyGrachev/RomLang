import test from 'node:test';
import assert from 'node:assert/strict';
import {deepChapters, deepSources} from '../lib/course/deep.ts';
import {theoryVisuals, visualsForChapter} from '../lib/course/theory-visuals.ts';
import {validateTheoryVisuals} from '../lib/course/theory-visual-validation.ts';

test('every shipped chapter has exactly one structurally valid, sourced visual', () => {
  assert.deepEqual(validateTheoryVisuals(theoryVisuals,deepChapters,Object.keys(deepSources)),[]);
  assert.equal(theoryVisuals.length,deepChapters.length);
  for(const chapter of deepChapters) {
    const visuals=visualsForChapter(chapter.id);
    assert.equal(visuals.length,1,chapter.id);
    const visual=visuals[0];
    assert.equal(visualsForChapter(chapter.id,visual.section)[0]?.id,visual.id);
    assert.equal(visualsForChapter(chapter.id,visual.section==='meaning' ? 'depth' : 'meaning').length,0);
  }
  assert.deepEqual(visualsForChapter('does-not-exist'),[]);
});

test('the catalogue uses varied diagram forms and meaningful switchable examples', () => {
  assert.equal(new Set(theoryVisuals.map(v=>v.kind)).size,6);
  for(const visual of theoryVisuals) {
    assert.equal(new Set(visual.frames.map(f=>JSON.stringify(f.nodes.map(n=>[n.label,n.text,n.at,n.end])))).size,visual.frames.length,`${visual.id} repeats the same frame`);
  }
  assert.ok(theoryVisuals.filter(v=>v.frames.length>1).length>=20);
});
