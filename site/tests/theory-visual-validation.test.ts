import test from 'node:test';
import assert from 'node:assert/strict';
import {validateTheoryVisuals, selectedVisualFrame, selectedVisualNode} from '../lib/course/theory-visual-validation.ts';
import type {TheoryVisual} from '../lib/course/theory-visual-types.ts';

const chapters = [{id: 'G.A1.01', sections: [{key: 'formation'}]}];
const sources = ['doom'];
function fixture(): TheoryVisual {
  return {
    id: 'V.A1.01', chapterId: 'G.A1.01', kind: 'flow', section: 'formation',
    title: 'Лицо и форма', intro: 'Сначала найдите участника.',
    frames: [{id: 'main', label: 'Один участник', caption: 'Eu sunt acasă.',
      nodes: [
        {id: 'actor', label: 'Говорящий', text: 'Eu', lang: 'ro', note: 'Говорящий называет себя.', tone: 'actor'},
        {id: 'verb', label: 'Форма глагола', text: 'sunt', lang: 'ro', note: 'Форма первого лица единственного числа.', tone: 'action'},
      ], links: [{from: 'actor', to: 'verb', label: 'выбирает форму'}], explanation: 'В этом примере eu связано с sunt.'}],
    takeaway: 'Сначала определите лицо.', caution: 'Здесь показан один пример, не вся парадигма.', sourceIds: ['doom'],
  };
}

test('a complete, connected visual catalogue is accepted', () => {
  assert.deepEqual(validateTheoryVisuals([fixture()], chapters, sources), []);
});
test('missing or duplicate chapter coverage and unknown sources cannot pass', () => {
  assert.match(validateTheoryVisuals([], chapters, sources).join('\n'), /missing.*G\.A1\.01/i);
  assert.match(validateTheoryVisuals([fixture(), fixture()], chapters, sources).join('\n'), /duplicate/i);
  const v=fixture(); v.sourceIds=['not-a-source'];
  assert.match(validateTheoryVisuals([v], chapters, sources).join('\n'), /source/i);
  v.chapterId='G.A1.99';
  assert.match(validateTheoryVisuals([v], chapters, sources).join('\n'), /unknown chapter/i);
});
test('a diagram cannot connect missing nodes or silently omit a flow step', () => {
  const v=fixture(); v.frames[0].links[0].to='missing';
  assert.match(validateTheoryVisuals([v], chapters, sources).join('\n'), /node/i);
  v.frames[0].links=[];
  assert.match(validateTheoryVisuals([v], chapters, sources).join('\n'), /flow/i);
});
test('timeline intervals cannot be reversed or put outside their labelled axis', () => {
  const v=fixture(); v.kind='timeline'; const f=v.frames[0]; f.axis={start:'прошлое',end:'сейчас'};
  f.nodes[0].at=20; f.nodes[0].end=10; f.nodes[1].at=120;
  const errors=validateTheoryVisuals([v], chapters, sources).join('\n');
  assert.match(errors, /interval/i); assert.match(errors, /position/i);
  f.nodes[0].end=40; f.nodes[1].at=90;
  assert.deepEqual(validateTheoryVisuals([v], chapters, sources), []);
});
test('every decision outcome must be connected to its question', () => {
  const v=fixture(); v.kind='decision'; v.frames[0].links=[{from:'verb',to:'actor',label:'обратная связь'}];
  assert.match(validateTheoryVisuals([v], chapters, sources).join('\n'), /decision/i);
});
test('changing an example cannot resolve an old node or frame from another example', () => {
  const v=fixture(); const next=structuredClone(v.frames[0]);
  next.id='plural'; next.nodes=[{...next.nodes[0],id:'we',text:'Noi'},{...next.nodes[1],id:'are',text:'suntem'}];
  v.frames.push(next);
  assert.equal(selectedVisualFrame(v,'missing').id,'main');
  assert.equal(selectedVisualFrame(v,'plural').id,'plural');
  assert.equal(selectedVisualNode(next,'actor').id,'we');
  assert.equal(selectedVisualNode(next,'are').text,'suntem');
});
