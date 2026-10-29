# Română Interactive Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a private usable A1–B2 Romanian course matching the approved dashboard and lesson concepts.
**Architecture:** Vinext app with a content-driven React workspace, original versioned lesson data, deterministic answer grading and per-user D1 learning events. Course source is bundled, progress is server-owned; hosted synthetic Romanian audio supports browsers lacking Romanian voices.
**Tech Stack:** Vinext/React/TypeScript, Cloudflare D1, Drizzle, plain CSS, lucide icons, Node tests.
**Spec:** docs/romanian-site-design.md; docs/romanian-curriculum.json v1.1; docs/briefs/content-contract.md.

## Global Constraints
- 24 modules, 96 stable lesson IDs, 24 checkpoints, all four levels populated.
- At least eight objective items and four formats per lesson; graded items explain their answers.
- RU interface; canonical Romanian diacritics; assistance and self-assessment are explicit.
- Private Sites; native identity; per-user D1 records; no paid AI configuration.
- Layered theory, dictionary with stress and word/example audio, printable visual sheets.
- No XP duplication on retry; no grammar-only claim of B2; held-out ILR materials stay external.

## Review Focus
- Interrupted or failed network saves must retain answers and never show a false saved state.
- Missing Romanian system voice must still play bundled synthetic audio on mobile.
- Multiple tabs/retries must not duplicate XP or erase another lesson's attempts.
- Ambiguous valid Romanian answers and diacritic omission must give fair explicit feedback.
- Mobile keyboard/long Romanian phrases must remain usable and never overflow.

### Task 1: Learning content and grading engine
Files: content/{A1,A2,B1,B2}.json; lib/course/types.ts; lib/course/engine.ts; tests/engine.test.ts.
Interfaces: getLesson(id), getExercise(id), grade(answer, item)->{correct,spelling,canonical}; scheduleReview(streak,correct,now)->ISO.
- [ ] Author bounded independent content assets in parallel per level using the exact shared contract.
- [ ] Write tests for punctuation/case, diacritics with correction, genuine incorrect answers, valid alternatives, empty input, review reset and delayed scheduling; run RED.
- [ ] Implement engine; run GREEN. Validate lesson and checkpoint references, format diversity and missions.
- [ ] Commit content and engine once validation passes.

### Task 2: Durable learner records
Files: db/schema.ts; drizzle/*; app/api/learning/route.ts; lib/course/records.ts; tests/records.test.ts.
Interfaces: GET /api/learning returns lesson state, attempts, saved words, notes, mission/self-reported events, preferences; POST /api/learning accepts typed event, unique eventId, validates server-side and returns canonical snapshot.
- [ ] Write RED tests for idempotent event application, XP once, malformed restore and lesson isolation.
- [ ] Store immutable per-user events and server-validated objective outcomes. Derive state with pure reducer; authorize every request.
- [ ] Generate schema migration, build, apply local D1 migration; run GREEN tests and unauthorized route checks.
- [ ] Commit schema/API.

### Task 3: Responsive interactive workspace
Files: app/page.tsx; app/layout.tsx; app/globals.css; app/components/{CourseApp,RouteView,LessonView,Exercise,ReferenceView,DictionaryView,ProgressView,ReviewView,AudioButton,MissionView}.tsx; public/assets/*; public/audio/*.
Interfaces: components consume content types + snapshot and dispatch events via single persistence hook; course routes are shareable query parameters.
- [ ] Extract tokens/copy/component inventory from approved concepts in docs/design-system.md; make standalone matching artwork.
- [ ] Implement route map, 60/75/90-minute plan, resumable layered theory and practice, feedback, production checklist, branch missions with variants, checkpoints and test-out semantics.
- [ ] Implement dictionary search RO/RU/EN, save/notes/review, audio fallback; printable cheat sheets and deep links; skill-specific progress and export/merge restore.
- [ ] Verify core workflow in managed preview with cloud browser; mobile and keyboard; reload after save; never use browser-only persistence for records.
- [ ] Commit UI/media.

### Task 4: Verification and private publication
Files: docs/qa.md; docs/fidelity.md; scripts/validate-content.mjs.
Interfaces: native Sites source/package/publish workflow with persisted project_id.
- [ ] Run content audit, Node tests, TypeScript and build. Correct observed errors.
- [ ] Fresh branch review of content/grading/auth/persistence/UX; fix consequential findings with regression checks.
- [ ] Compare accepted concepts and fresh rendered screenshots via view_image; log at least five comparisons and intentional curriculum copy changes.
- [ ] Package exact pushed source, deploy privately, inspect terminal result and hand off literal URL with honest limitations.
