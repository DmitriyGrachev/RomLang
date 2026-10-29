export const theoryVisualKinds = ['sentence', 'flow', 'comparison', 'decision', 'timeline', 'relations'] as const;
export type TheoryVisualKind = typeof theoryVisualKinds[number];
export const theoryVisualTones = ['actor', 'action', 'object', 'receiver', 'time', 'link', 'neutral'] as const;
export type TheoryVisualTone = typeof theoryVisualTones[number];
export type TheoryVisualSection = 'meaning' | 'formation' | 'usage' | 'contrasts' | 'limits' | 'interference' | 'depth';

export type TheoryVisualNode = {
  id: string;
  label: string;
  text: string;
  lang: 'ro' | 'ru';
  note: string;
  tone: TheoryVisualTone;
  /** Timeline position, 0–100. It describes this example, not a grammatical rule. */
  at?: number;
  /** End of a timeline interval. Omit for an event/point. */
  end?: number;
};
export type TheoryVisualLink = {from: string; to: string; label: string};
export type TheoryVisualFrame = {
  id: string;
  label: string;
  caption: string;
  nodes: TheoryVisualNode[];
  links: TheoryVisualLink[];
  axis?: {start: string; end: string};
  explanation: string;
};
export type TheoryVisual = {
  id: string;
  chapterId: string;
  kind: TheoryVisualKind;
  section: TheoryVisualSection;
  title: string;
  intro: string;
  frames: TheoryVisualFrame[];
  takeaway: string;
  caution: string;
  sourceIds: string[];
};
