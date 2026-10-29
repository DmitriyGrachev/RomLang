import {theoryVisualKinds, theoryVisualTones} from './theory-visual-types.ts';
import type {TheoryVisual, TheoryVisualFrame, TheoryVisualNode} from './theory-visual-types.ts';

type ChapterReference = {id: string; sections: {key: string}[]};
const sections = new Set(['meaning','formation','usage','contrasts','limits','interference','depth']);
const nonempty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/** Structural checks only: a passing result is not linguistic or pedagogical certification. */
export function validateTheoryVisuals(visuals: readonly TheoryVisual[], chapters: readonly ChapterReference[], sourceIds: readonly string[]): string[] {
  const errors: string[] = [];
  const chapterMap = new Map(chapters.map(chapter => [chapter.id, chapter]));
  const sources = new Set(sourceIds);
  const ids = new Set<string>();
  const covered = new Set<string>();
  for (const visual of visuals) {
    const name = visual.id || '(unnamed visual)';
    const fail = (message: string) => errors.push(`${name}: ${message}`);
    if (ids.has(visual.id)) fail('duplicate visual ID');
    ids.add(visual.id);
    if (covered.has(visual.chapterId)) fail('duplicate chapter coverage');
    covered.add(visual.chapterId);
    const chapter = chapterMap.get(visual.chapterId);
    if (!chapter) fail(`unknown chapter ${visual.chapterId}`);
    if (visual.id !== visual.chapterId.replace(/^G\./, 'V.')) fail('visual ID must match chapter ID');
    if (!theoryVisualKinds.includes(visual.kind)) fail('unknown visual kind');
    if (!sections.has(visual.section) || (chapter && !chapter.sections.some(s => s.key === visual.section))) fail('unknown theory section');
    for (const field of ['title','intro','takeaway','caution'] as const) if (!nonempty(visual[field])) fail(`missing ${field}`);
    if (!Array.isArray(visual.sourceIds) || !visual.sourceIds.length) fail('missing source IDs');
    else for (const source of visual.sourceIds) if (!sources.has(source)) fail(`unknown source ${source}`);
    if (!Array.isArray(visual.frames) || !visual.frames.length || visual.frames.length > 4) {fail('expected 1–4 frames'); continue;}
    const frameIds = new Set<string>();
    for (const frame of visual.frames) {
      const where = (message: string) => fail(`${frame.id || '(unnamed frame)'}: ${message}`);
      if (!nonempty(frame.id) || frameIds.has(frame.id)) where('missing or duplicate frame ID');
      frameIds.add(frame.id);
      for (const field of ['label','caption','explanation'] as const) if (!nonempty(frame[field])) where(`missing ${field}`);
      if (!Array.isArray(frame.nodes) || frame.nodes.length < 2 || frame.nodes.length > 6) {where('expected 2–6 nodes'); continue;}
      const nodeIds = new Set<string>();
      for (const node of frame.nodes) {
        if (!nonempty(node.id) || nodeIds.has(node.id)) where('missing or duplicate node ID');
        nodeIds.add(node.id);
        for (const field of ['label','text','note'] as const) if (!nonempty(node[field])) where(`node ${node.id}: missing ${field}`);
        if (!['ro','ru'].includes(node.lang)) where(`node ${node.id}: unknown language`);
        if (!theoryVisualTones.includes(node.tone)) where(`node ${node.id}: unknown tone`);
        if (visual.kind === 'timeline') {
          if (typeof node.at !== 'number' || !Number.isFinite(node.at) || node.at < 0 || node.at > 100) where(`node ${node.id}: invalid timeline position`);
          if (node.end !== undefined && (typeof node.end !== 'number' || !Number.isFinite(node.end) || node.end < (node.at ?? 0) || node.end > 100)) where(`node ${node.id}: invalid timeline interval`);
        } else if (node.at !== undefined || node.end !== undefined) where(`node ${node.id}: positions are only valid on a timeline`);
      }
      if (!Array.isArray(frame.links) || frame.links.length > 8) {where('expected up to 8 links'); continue;}
      const links = new Set<string>();
      for (const link of frame.links) {
        if (!nodeIds.has(link.from) || !nodeIds.has(link.to)) where('link refers to an unknown node');
        if (link.from === link.to) where('self-link does not explain a relation');
        if (!nonempty(link.label)) where('link needs an explicit relation label');
        const key = `${link.from}|${link.to}`;
        if (links.has(key)) where('duplicate link');
        links.add(key);
      }
      if (visual.kind === 'flow') for (let i=1; i<frame.nodes.length; i++) {
        if (!links.has(`${frame.nodes[i-1].id}|${frame.nodes[i].id}`)) where('flow must connect each adjacent step');
      }
      if (visual.kind === 'decision') {
        const root = frame.nodes[0].id;
        if (frame.links.length !== frame.nodes.length-1 || frame.links.some(link => link.from !== root) || frame.nodes.slice(1).some(node => !links.has(`${root}|${node.id}`))) where('decision must connect its question to every outcome');
      }
      if (visual.kind === 'comparison' && frame.nodes.length > 3) where('comparison supports 2–3 panels');
      if (visual.kind === 'relations' && (!frame.links.length || frame.nodes.some(node => !frame.links.some(link => link.from === node.id || link.to === node.id)))) where('every node in a relations diagram needs a labelled connection');
      if (visual.kind === 'timeline' && (!frame.axis || !nonempty(frame.axis.start) || !nonempty(frame.axis.end))) where('timeline needs both axis labels');
    }
  }
  for (const chapter of chapters) if (!covered.has(chapter.id)) errors.push(`missing visual for ${chapter.id}`);
  return errors;
}

export function selectedVisualFrame(visual: TheoryVisual, id?: string): TheoryVisualFrame {
  const frame = visual.frames.find(item => item.id === id) ?? visual.frames[0];
  if (!frame) throw new Error(`Visual ${visual.id} has no frames`);
  return frame;
}

export function selectedVisualNode(frame: TheoryVisualFrame, id?: string): TheoryVisualNode {
  const node = frame.nodes.find(item => item.id === id) ?? frame.nodes[0];
  if (!node) throw new Error(`Frame ${frame.id} has no nodes`);
  return node;
}
