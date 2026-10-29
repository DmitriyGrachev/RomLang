'use client';

import {useId, useState} from 'react';
import {visualsForChapter} from '../../lib/course/theory-visuals';
import {selectedVisualFrame, selectedVisualNode} from '../../lib/course/theory-visual-validation';
import type {TheoryVisual, TheoryVisualFrame, TheoryVisualNode, TheoryVisualSection, TheoryVisualTone} from '../../lib/course/theory-visual-types';

const kindNames: Record<TheoryVisual['kind'], string> = {
  sentence: 'Предложение по частям', flow: 'Связь шагов', comparison: 'Сравнение',
  decision: 'Выбор формы', timeline: 'Временная линия', relations: 'Связи между словами',
};
const colors: Record<TheoryVisualTone, string> = {
  actor: '#285c87', action: '#27694d', object: '#76538d', receiver: '#80501d',
  time: '#974554', link: '#236a69', neutral: '#546057',
};

type NodeProps = {
  node: TheoryVisualNode; index: number; selected: boolean;
  onSelect: (id: string) => void; detailId: string;
};
function NodeCard({node,index,selected,onSelect,detailId}: NodeProps) {
  return <button type="button" className={`rule-node rule-tone-${node.tone}${selected ? ' is-selected' : ''}`}
    aria-pressed={selected} aria-controls={detailId} onClick={() => onSelect(node.id)}>
    <span className="rule-node-heading"><span className="rule-node-number" aria-hidden="true">{index+1}</span><span>{node.label}</span></span>
    <strong lang={node.lang} className={node.lang==='ro' ? 'rule-romanian' : 'rule-russian'}>{node.text}</strong>
  </button>;
}

function Arrow({down=false}: {down?: boolean}) {
  return <svg className={`rule-arrow${down ? ' is-down' : ''}`} width="36" height="18" viewBox="0 0 36 18" aria-hidden="true" focusable="false">
    <path d="M2 9h29m-7-6 7 6-7 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

function Timeline({frame,selectedId,descriptionId}: {frame: TheoryVisualFrame;selectedId: string;descriptionId: string}) {
  const height = frame.nodes.length*42+18;
  return <div className="rule-timeline">
    <p className="rule-sr-only" id={descriptionId}>Положение событий на шкале: {frame.axis?.start} — {frame.axis?.end}. Номера соответствуют пояснениям ниже.</p>
    <div role="img" aria-labelledby={descriptionId} className="rule-timeline-plot" style={{height}}>
      <span className="rule-timeline-axis" aria-hidden="true"/>
      {frame.nodes.map((node,index) => {
        const at=node.at??0;const y=15+index*42;
        return <div key={node.id} aria-hidden="true" className={selectedId===node.id ? 'rule-timeline-event is-selected' : 'rule-timeline-event'}>
          <span className="rule-timeline-guide" style={{left:`${at}%`,top:y+12,height:height-y-13,borderColor:colors[node.tone]}}/>
          {node.end!==undefined && <span className="rule-timeline-range" style={{left:`${at}%`,width:`${node.end-at}%`,top:y-4,backgroundColor:colors[node.tone]}}/>}
          <span className="rule-timeline-point" style={{left:`${at}%`,top:y,backgroundColor:colors[node.tone]}}>{index+1}</span>
        </div>;
      })}
    </div>
    <div className="rule-axis-labels"><span>{frame.axis?.start}</span><span>{frame.axis?.end}</span></div>
    <p className="rule-timeline-key">Точка — положение события или ориентира. Отрезок — показанный в примере период. Масштаб условный.</p>
  </div>;
}

function FrameText({frame}: {frame: TheoryVisualFrame}) {
  const nodes=new Map(frame.nodes.map(node=>[node.id,node]));
  return <div className="rule-text-frame">
    <p><strong>{frame.label}.</strong> {frame.caption}</p>
    {frame.axis && <p>Направление шкалы: {frame.axis.start} → {frame.axis.end}.</p>}
    <ol>{frame.nodes.map(node=><li key={node.id}><strong>{node.label}: <span lang={node.lang}>{node.text}</span>.</strong> {node.note}</li>)}</ol>
    {frame.links.length>0 && <ul>{frame.links.map(link=><li key={`${link.from}-${link.to}`}><span lang={nodes.get(link.from)?.lang}>{nodes.get(link.from)?.text}</span> — {link.label} → <span lang={nodes.get(link.to)?.lang}>{nodes.get(link.to)?.text}</span>.</li>)}</ul>}
    <p>{frame.explanation}</p>
  </div>;
}

function VisualFrameView({visual,frame}: {visual: TheoryVisual;frame: TheoryVisualFrame}) {
  const [selectedId,setSelectedId]=useState(frame.nodes[0].id);
  const selected=selectedVisualNode(frame,selectedId);
  const unique=useId();const detailId=`rule-note-${unique}`;
  const card=(node: TheoryVisualNode) => <NodeCard node={node} index={frame.nodes.indexOf(node)} selected={selected.id===node.id} onSelect={setSelectedId} detailId={detailId}/>;
  const byId=new Map(frame.nodes.map(node=>[node.id,node]));
  const connection=(link: TheoryVisualFrame['links'][number]) => {
    const from=byId.get(link.from)!;const to=byId.get(link.to)!;
    return <div className="rule-relation" key={`${link.from}-${link.to}`}>
      {card(from)}<div className="rule-bridge"><span>{link.label}</span><Arrow/></div>{card(to)}
    </div>;
  };
  return <div className="rule-frame">
    <p className="rule-frame-caption">{frame.caption}</p>
    <p className="rule-interaction-hint">Выбери часть схемы, чтобы увидеть пояснение.</p>
    {visual.kind==='timeline' && <><Timeline frame={frame} selectedId={selected.id} descriptionId={`timeline-${unique}`}/><div className="rule-node-grid">{frame.nodes.map(node=><div key={node.id}>{card(node)}</div>)}</div></>}
    {visual.kind==='sentence' && <><div className="rule-sentence">{frame.nodes.map(node=><div key={node.id}>{card(node)}</div>)}</div>{frame.links.length>0 && <div className="rule-sentence-links" aria-label="Связи частей предложения">{frame.links.map(link=><p key={`${link.from}-${link.to}`}><strong>{frame.nodes.findIndex(node=>node.id===link.from)+1}</strong><span>{link.label}</span><Arrow/><strong>{frame.nodes.findIndex(node=>node.id===link.to)+1}</strong></p>)}</div>}</>}
    {visual.kind==='comparison' && <div className={`rule-comparison has-${frame.nodes.length}`}>{frame.nodes.map(node=><div key={node.id}>{card(node)}<p className="rule-comparison-note">{node.note}</p></div>)}</div>}
    {visual.kind==='relations' && <div className="rule-relations">{frame.links.map(connection)}</div>}
    {visual.kind==='flow' && <ol className="rule-flow">{frame.nodes.map((node,index)=><li key={node.id}>{card(node)}{index<frame.nodes.length-1 && <div className="rule-flow-connector"><Arrow down/><span>{frame.links.find(link=>link.from===node.id && link.to===frame.nodes[index+1].id)?.label}</span></div>}</li>)}</ol>}
    {visual.kind==='decision' && <div className="rule-decision"><div className="rule-decision-root">{card(frame.nodes[0])}</div><div className="rule-decision-branches">{frame.nodes.slice(1).map(node=><div className="rule-decision-branch" key={node.id}><div className="rule-decision-condition"><Arrow down/><span>{frame.links.find(link=>link.to===node.id)?.label}</span></div>{card(node)}</div>)}</div></div>}
    <div className={`rule-node-detail rule-tone-${selected.tone}`} id={detailId} aria-live="polite" aria-atomic="true">
      <span className="rule-detail-label">{selected.label}</span><p>{selected.note}</p>
    </div>
    <p className="rule-explanation">{frame.explanation}</p>
  </div>;
}

export function TheoryVisualFigure({visual}: {visual: TheoryVisual}) {
  const [frameId,setFrameId]=useState(visual.frames[0].id);
  const frame=selectedVisualFrame(visual,frameId);
  const titleId=useId();
  return <figure className={`theory-visual theory-visual-${visual.kind}`} aria-labelledby={titleId} data-visual-id={visual.id}>
    <figcaption className="rule-visual-header"><span className="rule-visual-kicker">Правило на схеме · {kindNames[visual.kind]}</span><h3 id={titleId}>{visual.title}</h3><p>{visual.intro}</p></figcaption>
    <div className="rule-interactive">
      {visual.frames.length>1 && <div className="rule-frame-switch" role="group" aria-label={`Примеры: ${visual.title}`}>{visual.frames.map(item=><button type="button" key={item.id} aria-pressed={item.id===frame.id} onClick={()=>setFrameId(item.id)}>{item.label}</button>)}</div>}
      <VisualFrameView key={frame.id} visual={visual} frame={frame}/>
      <details className="rule-text-version"><summary>Прочитать всю схему текстом</summary>{visual.frames.map(item=><FrameText key={item.id} frame={item}/>)}</details>
    </div>
    <div className="rule-print-version">{visual.frames.map(item=><FrameText key={item.id} frame={item}/>)}</div>
    <div className="rule-takeaway"><strong>Что запомнить</strong><p>{visual.takeaway}</p></div>
    <p className="rule-caution"><strong>Границы схемы.</strong> {visual.caution}</p>
  </figure>;
}

export function ChapterTheoryVisuals({chapterId,section}: {chapterId: string;section?: TheoryVisualSection}) {
  return <>{visualsForChapter(chapterId,section).map(visual=><TheoryVisualFigure key={visual.id} visual={visual}/>)}</>;
}
