# Adaptive practice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Persistent word memory plus personal error practice and a curated first-module practice bank.
**Architecture:** Extend existing event log and catalog, preserve core completion contracts, reuse focused UI.
**Tech Stack:** Existing React/TypeScript/Vinext/D1, no new dependencies.
**Spec:** docs/superpowers/specs/2026-10-28-adaptive-practice.md

## Global Constraints
Same private Site/project/audience; no audio/paidAI/schema migration; preserve old IDs/results and module-only production. courseVersion1.3.0. Root handles repository helper/push/publish. Disjoint writers, no agent commits/subagents.

## Review Focus
Forged word correctness and unknownword/mode; duplicate/early practice inflating schedule; historical import/replay; bank items accidentally completing lessons or bypassing prep; clinic/referenceBack/mobile save state.

### Task1: Word event and catalog domain
Owner core agent. Files types.ts,records.ts,data.ts,new version.ts,word-memory.ts, relevant new tests and version assertions. Catalog imports Task2 content. Optional engine grader signature narrowing only if necessary.
- [ ] Write failing validation/reducer/schedule tests.
- [ ] Implement spec contracts and version metadata, preserve historical grade and XP logic.
- [ ] Integrate new bank in catalog/exerciseOwner, original lessonExercises unchanged.
- [ ] Test new word events through createLearningSync restore/retry/reload mock transport, old histories, duplicate IDs and mixed direction schedules.
- [ ] Report checks and interfaces in docs/briefs/adaptive-core-report.md.

### Task2: Authored A1.1 bank
Owner content agent. Files content/practice-a1.1.json,new scripts/validate-practice.mjs only. Read original A1 first4 lessons/support/dictionary.
- [ ] Author32fresh contextual exercises, lexical prep and short correction explanation by topic.
- [ ] Author18well-constrained recall prompts and accepted variants.
- [ ] Validate structure, answer/token reachability, known owners, no duplicate core questions, noaudio and complete translations.
- [ ] Report in docs/briefs/adaptive-content-report.md; independent language review follows.

### Task3: Word training UI
Owner word UI agent. Files WordTrainer.tsx,DictionaryView.tsx,ProgressView.tsx,new app/word-memory.css; optional word UI helper/test. Reuse core APIs from spec; do not edit core/catalog.
- [ ] Add preparation, due/level/saved selection and recognition/curated recall modes.
- [ ] Emit wordReview through Learning.send and present honest stored history by mode, source/evidence and save status.
- [ ] Reveal-before-selfrate; typed grade/reveal/retry with same-round assistance and missing-diacritic correction; noXP.
- [ ] Preserve dictionary filters/bookmarks/notes; history survives server replay/export restore.
- [ ] Report docs/briefs/adaptive-word-ui-report.md.

### Task4: Error clinic and navigation
Owner clinic agent. Files new ClinicView.tsx,lib/course/clinic.ts,tests/clinic.test.ts,app/clinic.css; TrainingView.tsx,CourseApp.tsx,ReviewView.tsx,app/layout.tsx. No ownership overlap with word UI.
- [ ] Implement ranked evidence-based error grouping (TDD), explanation/prep/round/result for new pilot or existing failed exercises.
- [ ] Wire page clinic, keep round mounted across referenceBack; focus style reused; do not send finish.
- [ ] Review sources: unseen bank excluded from fresh, known bank due/errors retained. Reference uses exerciseOwner.
- [ ] Update hub truthful worddue/clinic links and layout imports both new CSS files.
- [ ] Report docs/briefs/adaptive-clinic-report.md.

### Task5: Review, QA and release
Root orchestration; independent weaker reviewers/testers.
- [ ] Independent linguistic/content and code/state reviews; scoped fixes through owners.
- [ ] Tests/typecheck/content+teaching+practice audits; browser desktop/mobile and real save-state checks.
- [ ] Remove temporary harness, update ledger, Sites build/source package/publish.
