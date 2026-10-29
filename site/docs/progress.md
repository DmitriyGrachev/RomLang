# Implementation ledger — plan: docs/superpowers/plans/2026-10-25-romanian-course.md

## Adaptive release1.3 —2026-10-28

- Persistent validated wordReview events and separate recognition/typed history/schedules, using existing D1eventtable; no migration or oldprogress reset. Selfratings and worddrills add noXP.
- Personal error clinic includes original and attempted bank failures, teaches full prep and offers matching authored variants. Added32practiceitems forA1.1 and18constrained recallentries; original960courseitems/completionrequirements unchanged.
-59tests,TypeScript,content/teaching/practiceaudits passed. Independent code/contentreviews and desktop/390pxbrowserQA passed after scopedfixes; temporaryharness removed. Authenticated production save notbrowserverified; unittransport reload/restore andimmutable replay verified. Details: `docs/briefs/adaptive-ledger.md`.

## App redesign —2026-10-28

- User authorized continuation with weaker-model subagents; details in `docs/superpowers/plans/2026-10-28-language-app.md` and `docs/briefs/redesign-ledger.md`.
- Implemented app course path, focused question/retry/result flow, stable review round, staged theory and six-word recall workout. No course IDs/events/schema or audio changes.
- Independent desktop/mobile QA and code re-review passed after navigation fixes.43 tests, TypeScript and content/teaching audits pass. Root inspected concept/render pairs, console and first/rightmost popover bounds;390×844 mobile footer/CTA fit verified. Authenticated persistence remains untested in anonymous preview. Temporary phone harness removed.

## Revision 1.2 — learner feedback

- Direct feedback overrides the original audio and combined-lesson decisions below: remove synthetic audio; separate theory/practice; simplify tasks; move independent production to module end; teach prerequisites and mission replies before testing; correct origin to Ukraine/Dnipro.
- Removed AudioButton, synthesis APIs and bundled MP3s. Converted former listening items to explicit reading without changing stable IDs. Historical adjudications and listening skill records remain unchanged.
- Added separate theory route, explicit A1 vocabulary/chunks, translations for every phrase in all 24 missions, preparation/guided/independent dialogue stages, simplified practice and review screens, and repeat controls for finished lessons/checkpoints.
- Browser QA: completed all eight A1.01 questions and repeated with blank answers; verified theory/practice separation, Ukraine introduction, translated guided dialogue and independent mode. Mobile 390×844 harness had no horizontal overflow, theory panels, production teasers or audio elements in practice. Preview is anonymous; authenticated production persistence was not browser-verified. No schema migration or learning-history reset.
- Read-only review found and verified a fix for reopening completed exercises. Automated checks and source packaging are recorded in the publishing workflow.

## Original implementation history

- 2026-10-25: user authorized site implementation; approved v1.1 and dashboard/lesson visual concepts.
- Isolated new checkout /workspace/sites/romana-militari on build/romanian-course; no existing user code modified.
- Site registered once: appgprj_6addfd70b22c8191ac32e6e094a457dc; private owner audience.
- Ruling: implement structured dialogues plus copy-to-ChatGPT practice; no paid runtime AI requested. Speech/writing remain explicitly self-assessed.
- Ruling: independent level authoring is bounded content-asset work under Sites + parallel-agents guidance; owner implements/integrates app and publishes.
- Preflight: content types feed engine/UI; immutable event payloads feed server reducer and UI; IDs use v1.1 stable IDs throughout.

- Task1 complete: 96 lessons, 960 objective items, 24 checkpoints, 442 dictionary entries, 48 terminating mission variants; structural and audio mapping audits passed.
- Task2 complete: D1 schema generated and applied locally; per-user scoping reviewed; original adjudication/content version preserved. Export import is chunked and newly imported answers are rechecked explicitly.
- Task3 complete: responsive workspace, all four exercise formats, layered theory, printable 96 sheets+24 maps, dictionary/audio, review, missions, fast pass, self-assessment, journal/export.
- Review fix wave complete: serial synchronization with recovery and race regression tests; coalesced immediate drafts; sticky assistance/model exposure; frozen review batch; cancellation-safe audio; historical adjudication; corrected next-link/token reset/criteria/preferences.
- Verification: 27 Node tests pass; TypeScript pass; content+audio audit pass; source build passed before final packaging build. Browser choice, sentence building, audio comprehension, dictionary search and two-step branching mission exercised. Mobile390×844 inspected via a temporary iframe harness; current browser1349×926. Preview-only401 is honest and does not claim saved. Native1536 screenshot attempts timed out; no external browser workaround was used. Temporary QA harnesses removed.
- Ruling: bundled eSpeak NG Romanian recordings supply a clearly labelled synthesis fallback. They do not establish natural spontaneous-speech listening or assess pronunciation; ChatGPT transfer/external resources address those tasks.
- Bounded independent editorial review corrected phonetic example/stress, listening inference, overly broad lexical gaps and alternate orders; no native-teacher validation claim.
- Task4: private source packaging/publication in progress; owner-private audience remains unchanged.
