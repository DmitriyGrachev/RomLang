# Final review fix wave

2026-10-28. Single consolidated wave for I1–I3 and M1–M2 from `text-course-final-review.md`, compared with immutable `/tmp/text-course-final-fix-base`. No commit, push, deployment, dependency addition, content-ID change, or answer-key change.

## Corrections

- **I1:** Writing events, drafts and immutable revisions carry `main`/`transfer` context. Old events default to `main`. Each scenario retains its own text and self-review marks; pending draft coalescing includes the scenario. Scenario switching restores that scenario's draft rather than relabeling the current text. Transfer work uses its own prompt, general applicable plan, self-review and revision focus. The original model remains clearly labeled as an example for the first task; exposure stays sticky. Revision restore preserves scenario, including replay, reload and export/import. Unit completion, profile totals and task-list draft evidence consider any nonempty saved scenario draft, with legacy text fallback, so opening a blank transfer does not erase a completed main draft. The active editor still displays the blank transfer accurately.
- **I2:** A validated `checkpointExposure` event records an exposed unanswered academy control item. Opening theory, vocabulary, practice or writing support emits persistent assistance for exposed unanswered items. Returning to the unit's support after navigation retains this context. Prior normal study and required source reading do not count as control assistance. Server validation already derives attempt assistance from the persistent assist history.
- **I3:** A validated timestamped `wordExposure` event persists answer exposure without creating a score or SRS review. CardsView and WordTrainer write and consume it. Recognition reveal marks recall exposure even if no self-rating follows; a later rating does not erase it. Both UI help calculation and server word-review validation apply the existing strict less-than-24-hour window. Recognition and recall schedules remain separate. Changed custom-card answer content clears current exposure alongside current memory while preserving events.
- **M1:** B2.21 domain is now `Чтение стенограммы и письменный синтез`.
- **M2:** Card counts use the existing `russianCount` helper, including 11–14 exceptions.
- **Observed integration failure:** Browser HMR retained an older in-memory snapshot without the new exposure maps. A regression reproduced the crash; checkpoint helper/UI reads and the word-exposure helper now tolerate missing maps until replay supplies defaults.

## Changed files in this wave

Application: `app/components/AcademyProfile.tsx`, `app/components/AcademyView.tsx`, `app/components/CardsView.tsx`, `app/components/WordTrainer.tsx`, `app/components/WritingStudio.tsx`.

Library: `lib/course/data.ts`, `lib/course/records.ts`, `lib/course/sync.ts`, `lib/course/types.ts`, `lib/course/word-ui.ts`, `lib/course/writing.ts`.

Content: `content/academy/B2.json` (only B2.21 domain label).

Tests and report: `tests/final-review-regressions.test.ts`, `docs/briefs/text-course-final-fix-report.md`.

## Final verification

All commands ran from `/workspace/sites/romana-militari` after the final source changes; all exited 0.

| Command | Exact result summary |
| --- | --- |
| `node --experimental-strip-types --test tests/final-review-regressions.test.ts tests/writing-records.test.ts tests/writing-checks.test.ts tests/cards.test.ts` | tests 26; pass 26; fail 0; cancelled 0; skipped 0; todo 0 |
| `node --experimental-strip-types --test tests/*.test.ts` | tests 107; pass 107; fail 0; cancelled 0; skipped 0; todo 0 |
| `node node_modules/typescript/bin/tsc --noEmit` | exit 0, no diagnostics |
| `node scripts/validate-academy.mjs` | `{"units":76,"readings":152,"cards":912,"exercises":1368,"errors":[]}` |
| `node scripts/validate-content.mjs` | `{"levels":4,"lessons":192,"modules":48,"checkpoints":48,"exercises":2304,"dictionary":882,"missionVariants":96}` |
| `node scripts/validate-teaching.mjs` | `{"a1LessonSupports":48,"explicitLessonSupports":120,"preparedMissions":48,"translatedMissionOccurrences":1140,"unknownMissionPhrases":0,"syntheticAudioTasks":0}` |
| `node scripts/validate-depth.mjs` | exit 0; levels 4; modules 48; lessons 192; newLessons 96; newExercises 1344; newWords 440; emitted readingLengths for A1.25–B2.48 |
| `git diff --check` | exit 0, no diagnostics |

The new regression file contains 11 tests covering scenario-specific drafts/revisions, sticky model exposure, legacy defaults, pending draft coalescing, reload/export/import, blank-active-scenario evidence, applicable transfer workspace, control support versus prior study/source reading, recognition reveal with and without rating, replay/expiry, due-recall streak handling, direction isolation, active custom/fixed IDs, content changes, and missing in-memory exposure fields. The full suite also retains existing history, grading, two-client sync and compatibility coverage.

## Handoff boundaries

Source is frozen for root's scoped re-review and browser QA. Production build/package and publication remain with root. This wave's automated replay/transport checks do not claim authenticated browser-to-database durability. Generic transfer self-review remains learner self-review; no semantic writing score was added.
