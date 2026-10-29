# Language app redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Replace interactive-notes presentation with a coherent course-path and short-practice learning app.
**Architecture:** Retain Vinext/React, query routing, Learning contract and D1 event log. Three independent component areas share tokens but use separate CSS files imported in layout.
**Tech Stack:** existing React19/TypeScript/Vinext, lucide, Node tests; no new dependencies.
**Spec:** docs/superpowers/specs/2026-10-28-language-app-design.md

## Global Constraints
Preserve IDs/schema/events/history/courseVersion1.2.0; no audio; separate theory; module-only production; Ukraine; owner-private same Site. Do not modify source identity/credentials. No new dependencies. Root handles Site operations/integration/publication.

## Review Focus
- Today's duplicate retries count once per question, local calendar dates.
- Existing completed/partially completed lessons and unknown URLs remain navigable.
- Retry/hints/model exposure never erase assistance or award duplicate XP.
- Empty saved-word decks and repeated failed cards have usable exit/restart.
-390px screen fits nav, course nodes, input, footer and reference; keyboard access and reduced-motion.

### Task1: Shell and course path
Owner: route implementer. Files CourseApp.tsx, RouteView.tsx, layout.tsx, app/learning-app.css; optional lib/course/activity.ts and tests/activity.test.ts. No other agent edits these.
- [ ] Read spec/concept; define tokens and route nav mapping.
- [ ] If new activity helper, test local day uniqueness and duplicate attempts first, then implement.
- [ ] Implement course/module/level selection and active popup; preserve accessible direct entry to all lesson/checkpoint/mission IDs.
- [ ] Add training page dispatch (`TrainingView`, created by Task3); keep review direct route and dictionary nav separate. Add app-focus class for lesson/review/words.
- [ ] Import globals.css then learning-app.css, practice-app.css, study-app.css in layout. Commit only owned files after integration.

### Task2: Focused practice and review
Owner: practice implementer. Files LessonView.tsx, Exercise.tsx, ReviewView.tsx, app/practice-app.css; optional lib/course/round.ts and tests/round.test.ts. No schema/content/core reducer changes.
- [ ] Read spec and focus concept; preserve Exercise props and Learning events.
- [ ] Add focus header/progress/footer, tactile choices/tokens and useful incorrect retry; preserve keyboard, hints, valid-answer report.
- [ ] Completion summarizes real answers; next theory/checkpoint, map and replay work for old and new completions. ProductionPanel remains only for CHECK.*.
- [ ] Review has start/round/end state with correct frozen batch; no surprise replacement after answers.
- [ ] Add helper tests only for new behavioral logic; run existing tests and typecheck.

### Task3: Study/word practice
Owner: study implementer. Files TheoryView.tsx, TeachingNotes.tsx, MissionView.tsx (prep filter only), DictionaryView.tsx, new TrainingView.tsx, WordTrainer.tsx, app/study-app.css, optional lib/course/word-round.ts and tests/word-round.test.ts.
- [ ] Read spec; implement compact theory stages while keeping all explanation/words/sheet reachable.
- [ ] Teach every mission candidate phrase in preparation; retain independent/guided semantics.
- [ ] TrainingView consumes {learning,navigate}; WordTrainer same props, imported by CourseApp page=words. Six-word current-level or saved recall deck, explicit self-assessment, reveal-before-rate and retry misses.
- [ ] Dictionary adds working train action; do not remove search/bookmarks/notes.
- [ ] Test queue retry/empty selection if extracted helper; run typecheck/tests.

### Task4: QA / integration / publish
Owner root orchestration; independent weaker-model QA reviews code and rendered workflows after implementation.
- [ ] Review each owned diff and reports, resolve integration/mismatch findings through implementers.
- [ ] Browser desktop/mobile journey and concept-to-render comparisons, view_image both references/render.
- [ ] Run npm test, tsc --noEmit, both content audits, diff whitespace check, Sites build/package.
- [ ] Publish same private Site; retain native succeeded deployment and literal URL.
