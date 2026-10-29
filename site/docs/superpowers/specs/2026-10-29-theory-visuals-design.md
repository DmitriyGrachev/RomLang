# Visual explanations for Romanian theory

## Intent

The user asked to add pictures and visual explanations where language rules are taught. Add precise, readable diagrams to the existing expanded A0–B2 course. This is an implementation request; routine design choices below are the implementer's decisions.

## Approach

Use authored structured content rendered with accessible HTML/CSS and SVG. Compared with raster illustrations, this keeps Romanian spelling exact, allows responsive text and offers keyboard-accessible exploration. Compared with generic generated diagrams, each figure explains the specific chapter and gives the limits of its simplification. No external dependency or image-generation service is needed.

## Scope and behavior

- One bespoke visual for each of the 120 deep-course chapters, stored separately by level.
- Six visual forms: sentence parts, linked steps, side-by-side comparisons, decision branches, timelines, and semantic/agreement relations.
- Each has a Russian explanation, Romanian examples where useful, a takeaway, a scope limitation, and existing reference IDs.
- Where a contrast benefits from it, provide switchable authored examples. Selecting a node reveals its explanation. Controls do not affect learning scores or assessment evidence.
- Place figures after the relevant theory section. The depth layer can show the same chapter figures as a reference. The regular theory text remains fully available.
- Label roles with words and numbers as well as colors. Use real buttons with visible focus, semantic figures/captions, language attributes and accessible text equivalents for SVG.
- Work at phone widths without reducing grammar text to tiny SVG lettering. Avoid interaction-dependent access to the rule, and show all node explanations in an expandable text version and print output.
- Keep all learner data, progress protocols, and existing exercise grading intact.

## Data contract

See `lib/course/theory-visual-types.ts`. JSON arrays at `content/visuals/A0.json`, `A1.json`, `A2.json`, `B1.json`, `B2.json`. Exactly one visual per chapter: `V.A1.01` corresponds to `G.A1.01`.

Each frame has 2–6 nodes and up to 8 links. Every identifier is unique within its scope. Node labels identify their roles; `text` is the visible example; `note` explains it. `lang` is `ro` or `ru`. A timeline has an axis and every node has `at` in 0–100; optional `end` marks an interval. A decision frame has its question first, with one link from it to each result. A flow links every adjacent pair in order. A comparison has 2–3 panels. Other forms use explicit links only when semantically justified.

Do not present every sentence as a universal rule. Do not imply every preposition removes the article, that every final i is a full vowel, or that Russian aspect determines Romanian past tense. Separate real, hypothetical and counterfactual examples. Retain valid alternative constructions. Use examples from the reviewed chapter when possible.

## Validation and delivery

Validate complete coverage, references, graph structure and bounds, and render all diagrams without errors. Check keyboard-accessible controls, example changes, node explanations and print text. Run TypeScript, focused content tests and one full build. Browser QA must use the supported available browser/preview path; report an infrastructure blocker honestly if it remains unavailable.

Publish as a new GitHub branch based on `codex/b2-deep-course`, with a pull request against that branch while PR #1 remains unmerged. Preserve the exact remote base and existing local-app subtree.
