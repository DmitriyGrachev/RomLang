# Life/B2 integration — Task 6

Implemented against `docs/briefs/life-content-schema.md` and the 2026-10-28 expansion spec/plan. Content remains owned by its authors; this task did not modify original or new content assets.

## Data and compatibility

- Added content types and exports: `lifeUnits`, `lifeUnitMap`, `theoryExtensions`, `coverageAudit`, `examB2`, `lifeExerciseMap`, `examExerciseMap`.
- All 256 life + 40 exam objective items register in the graded catalog and `practiceExerciseMap`. New owners resolve to real anchor lessons. Catalog has 1,288 objective items; bank map has 328 (32 existing + 296 new).
- Original 960 core completion exercise IDs and original four A1.1 practice topics remain unchanged. No new `finish` calls, learner event types, DB migrations, or dependencies. Version source is `1.4.0`; only current-version test assertion changed. Existing adjudicated history replay remains frozen.
- Production JSON imports use standard import attributes, allowing catalog integration tests to execute the actual production maps directly under Node.

## Learning and navigation

Life view provides level/domain choices, goals, prerequisite links, substantial full theory, translated preparation, errors and recall table before the 16-item round. Transfer appears only after round results; it offers read/copy/model/checklist self-practice, without an unsaved draft input or automatic writing grade.

Shared objective round helper freezes IDs and attempt baselines, resumes at the first unattempted item, handles out-of-order history, validates session metadata, and advances past already checked answers after refresh. Replay uses current attempt counts as a fresh baseline; prior run outcomes do not inflate the new results. Results report answered/correct/retried/assisted counts. Existing exercise assistance and history rules remain in force.

Life and Exam views stay mounted while visiting reference pages, preserving the active exercise and feedback on browser Back. Session storage contains only versioned UI round metadata; attempt history remains the existing learner-record source. If storage is unavailable, history-based resume remains available. Life direct unit links and B2 direct reading/grammar links include unknown-ID fallbacks. After a Life refresh, reopen the round from preparation to restore it.

TheoryView keeps the small initial rule stage. Full supplement sections appear in detailed theory; the visual CheatSheet/Reference use the compact decision guide, table and pitfalls with source links. Reference links to the full detailed theory. Training, Reference and route expose entry links. Rounds reuse the current tactile practice styling and focused layout.

Exam view includes original reading rounds, contextual grammar/lexis, full writing models with plans/annotations/rubrics and fresh transfer prompts, speaking tasks and a readiness matrix. Official-source links provide the external listening/check boundary. There is no fabricated audio player or B2-pass claim based on grammar score/XP.

## Verification evidence

At handoff, before subsequent independent review/content edits:

- `node --experimental-strip-types --test tests/*.test.ts`: **69/69 passed**.
- `./node_modules/.bin/tsc --noEmit --pretty false`: **passed**.
- `node scripts/validate-life.mjs`: **passed**, 16 life units, 296 new objective items, 46 supplements, 96 lesson audits, 4 writing models and 4 speaking tasks.
- `node scripts/validate-content.mjs`: **passed**, original 96 lessons/960 exercises/442 dictionary entries.
- `node scripts/validate-teaching.mjs`: **passed**, 24 A1 supports/24 prepared missions, 564 translated mission occurrences, no synthetic audio tasks.
- `npm run build`: **passed**. Vite emitted its large-client-chunk advisory; no build failure.

Helper tests were run RED→GREEN, including refresh recovery from a checked answer. Real catalog tests cover owner/catalog registration, exclusion from core completion, unseen-bank fresh gating, attempted due/errors, inability to finish an anchor from bank work, and replay/refresh score isolation. Malformed/foreign IDs and invalid baseline metadata are rejected.

## Review boundary and remaining work

Root owns final independent code/language review, fresh desktop/390px browser QA, final verification after the last author changes, packaging and private publication. No browser preview, authentication bypass, production learner writes, Site calls or commits were made in this task.

Validator checks counts, IDs/assigned anchors, prerequisites, translations/support structure, Russian explanation lengths, reading/model lengths, choices and accepted order buildability, source domains and reference resolution. It reports choice-position distributions and unmatched Latin answer surfaces against visible unit preparation and preceding course/support material. Surface matching cannot establish Romanian morphology, ambiguity, novelty or CEFR appropriateness; structural checks are not native linguistic certification.

At the last structural pass, B1.SERVICE had `intrării/principale` surface warnings (author notified), and B2 life units had several inflected forms/chunks to inspect in the lexical preparation. The exact current list is emitted by `scripts/validate-life.mjs`; root should rerun it after author fixes. Native listening and independent assessment of spontaneous speaking/writing remain outside this internal objective bank.

Rulings: use session UI metadata plus existing attempts rather than invent learner events; retain full explanations in detailed theory and compact recall content in sheets; keep surface lexical findings as explicit review aids rather than false automated linguistic verdicts.

## Follow-up code-review fixes

The three P2 findings in `life-code-review.md` were fixed with observed RED→GREEN regressions. Whole-round baseline reconciliation now handles UI metadata ahead of saved history (including finished cursors) and is shared by normal Next and refresh. Route entry/started status now use explicit original core exercise IDs rather than a lesson prefix, so bank-only activity preserves the anchor's initial theory entry. Full regression suite is now **72/72 passed**, and TypeScript **passed**. Independent scoped rereview and final browser/content/build verification remain with root. The preview was not restarted and no JSON was edited by this follow-up.

## Desktop QA UI refinement

Active Exam banks now render only a small return link and the focused objective bank; the title, scope, readiness navigation and disclaimer remain on selection pages. Explicit bank start/replay/Next actions and the Life preparation-to-round action scroll to the top, so a long reading or preparation page does not leave the next question below the viewport. Restore/reference Back does not invoke that scroll action, and CourseApp's retained mounts were unchanged. Existing regression tests **72/72 passed** and TypeScript **passed** after this UI-only change; root owns fresh rendered QA. No content/catalog change, preview restart or commit was made.

Mobile readiness QA identified page-level overflow from the table's 680px minimum width. A CSS-only patch constrains Life/Exam pages and table wrappers to their parent width, permits their study containers to shrink, and keeps horizontal scrolling inside the table wrapper. Root/mobile QA will measure the rendered page again; no TypeScript, JSON or catalog source changed in this patch.
