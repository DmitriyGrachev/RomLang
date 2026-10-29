# Romanian Theory Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add accurate, interactive visual explanations throughout all 120 A0–B2 theory chapters.

**Architecture:** Authored per-level JSON figures, a typed catalogue with validation, and one reusable React renderer supporting six layouts. Embed figures at the matching chapter sections and keep diagram exploration separate from learning evidence.

**Tech Stack:** Existing React 19 / TypeScript / Vinext; HTML, CSS and SVG; Node's built-in tests. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-29-theory-visuals-design.md`

## Global Constraints

- One bespoke visual for each of the 120 deep-course chapters, stored separately by level.
- Label roles with words and numbers as well as colors.
- Keep all learner data, progress protocols, and existing exercise grading intact.
- No external dependency or image-generation service is needed.

## Review Focus

- Incorrect arrow direction or timeline coordinates must not reverse the grammatical meaning.
- Switching examples or chapters must not retain a selected node from the previous frame.
- Long Romanian forms and Russian notes must remain readable on a phone.
- Keyboard and screen-reader users must reach all explanations; print output includes every node note.
- Every chapter and source reference must resolve, including the depth-only theory view.

### Task 1: Author and validate the catalogue

**Files:** `content/visuals/{A0,A1,A2,B1,B2}.json`, `lib/course/theory-visual-types.ts`, `lib/course/theory-visuals.ts`, `lib/course/theory-visual-validation.ts`, `tests/theory-visuals.test.ts`, `tests/theory-visual-validation.test.ts`.

**Interfaces:** Authors consume the types and chapter JSON. The catalogue exports `theoryVisuals` and `visualsForChapter(chapterId, section?)`. The validation module exports `validateTheoryVisuals(visuals, chapters, sourceIds)`, `selectedVisualFrame(visual, frameId)` and `selectedVisualNode(frame, nodeId)`.

- [x] Write meaningful checks for missing/duplicate chapter coverage, invalid graph references, decision roots, reversed timeline bounds and unknown source IDs; demonstrate failures before implementation.
- [x] Independently author foundational, intermediate and advanced figure banks using the same contract.
- [x] Implement the catalogue and validator; ensure tests pass with all 120 authored figures.

### Task 2: Render and integrate figures

**Files:** `app/components/TheoryVisual.tsx`, `app/theory-visuals.css`, `app/components/DeepCourse.tsx`, `app/layout.tsx`.

**Interfaces:** `ChapterTheoryVisuals({chapterId, section?})` and `TheoryVisualFigure({visual})` consume catalogue types. Props keyed by visual/frame IDs keep selection local and reset appropriately.

- [x] Implement sentence, flow, comparison, decision, timeline and relation layouts with accessible controls and full text equivalents.
- [x] Add responsive styles and print expansion; integrate figures after the matching theory section and into the depth view.
- [x] Server-render all 224 frames and the 120 figures together; check unique IDs, ARIA targets, content and React warnings.
- [ ] Verify desktop/mobile layout and real example/node interaction in a browser. Blocked: the supported browser connection requires the originating extension context, which is unavailable in this session. Server rendering does not replace this check.

### Task 3: Review and publish

**Files:** Release documentation and the exact implementation files above.

- [x] Review content and UI independently; address confirmed defects.
- [x] Run focused tests, TypeScript, content validation and production build. Browser inspection remains separately blocked above.
- [x] Compare the current GitHub base tree before adding changed blobs; preserve unrelated files.
- [ ] Publish `codex/theory-visuals` and create a PR with coverage, verification and remaining limitations.

The publication checkbox reflects this pre-publication source snapshot. GitHub branch/PR metadata and the completion report are the delivery record; publication is not evidence of live Sites deployment.
