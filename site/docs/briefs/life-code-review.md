# Independent Life/B2 code and state review

Reviewed 2026-10-28 against the expansion spec and integration report. This is a code/state review of the working tree, not linguistic approval. Content authors were still editing JSON during review. No application source, content, database, browser session, or production learning records were changed by this review.

## Findings

### P2 — Restored round trusts a cursor that can be ahead of saved history — RESOLVED

**Location:** `lib/course/life.ts:15–16`; caller writes cursor immediately at `app/components/LifeView.tsx:20,28`.

`restoreBankRound` only scans forward from the stored index. It never checks that the items before that index have attempts after their frozen baseline. A stored `finished: true` is returned without checking any attempt evidence. The session cursor therefore overrides server history when UI metadata was saved before an asynchronous attempt POST completed.

**Reproduction:** Start a bank with empty history; answer an item and click Next while its save is pending or failed; force reload despite the existing unsaved-work warning, or interrupt the browser. After loading server history without that attempt, reopen the bank. The saved index skips the missing answer. A finished cursor can similarly show “Подход завершён” with fewer than all answers. A direct helper reproduction with three IDs, all baselines zero, empty snapshot, and stored index 1 returns index 1; stored index 3/finished true returns finished true with zero attempts. No sessionStorage tampering is needed for the interrupted-save case.

**Fix:** Reconcile the complete frozen round with available attempt history. Restore to the earliest item whose attempt count does not exceed its baseline, including when metadata says the round is finished; infer finished only when all items have evidence. Keep the existing invalid-baseline rejection. Add tests for metadata ahead of server, a missing earlier item, and a stored-finished round with missing attempts. This does not recover an unsaved answer, but correctly makes it answerable again.

### P2 — History resume re-asks already answered later items until refresh — RESOLVED

**Location:** `lib/course/life.ts:9`; `app/components/LifeView.tsx:28`.

History resume starts at the earliest unanswered item, but Next increments exactly one slot without skipping later items already answered after the round baseline. This disagrees with refresh restoration, which does skip those items.

**Reproduction:** Have an attempt only for item 2 (possible through generic due/error practice, or another session). Open the bank without stored round metadata and choose “Продолжить с первого задания без ответа”. Answer item 1 and click Next. Item 2 is asked again. Refresh at that point and reopen the same bank: restoration advances to item 3. The helper reproduction produced next index 1 versus restored index 2 from the same history and baseline.

**Fix:** Make navigation and restoration share a baseline-aware next-unanswered selector. It should skip evidence after the frozen baseline, so a deliberate new replay still includes every item. Test out-of-order history through multiple Next actions, not only the initial `firstUnattempted` result.

### P2 — Additional bank work marks an untouched main lesson as started — RESOLVED

**Location:** `lib/course/activity.ts:24–25`, exposed by new IDs registered at `lib/course/data.ts:31–45`; route consumers `app/components/RouteView.tsx:36,39`.

The existing `lessonEntryPage` identifies core activity by an ID prefix. New Life/Exam exercises deliberately use real lesson prefixes, so an additional exercise now matches that test even when none of the main lesson's original exercises has been attempted. This bypasses the main lesson's first-entry theory screen and gives it the route's started state.

**Reproduction:** With untouched A1.22, attempt Life SHOP item `A1.22.e501`, then open A1.22 from the main route. `lessonEntryPage('A1.22', attempts, {})` returns `lesson`; before the bank attempt it returns `theory`. No `A1.22.e1…e8` attempt is required. Equivalent behavior applies to new Exam items.

**Fix:** Determine whether a main lesson has started from its explicit core exercise IDs (`catalog.lessonExercises`, or the lesson's exercise list), rather than every lesson-prefixed ID. Preserve the existing completed-lesson behavior. Add a regression asserting that bank-only attempts leave a fresh anchor on its theory entry.

## Verified boundaries and evidence

- `node --experimental-strip-types --test tests/*.test.ts`: **69/69 passed**. Existing new tests cover owner registration, real grading, core-completion exclusion, untouched-bank generic fresh gating, attempted due/errors, frozen replay baselines, and server history ahead of the cursor. They do not cover the three findings above or mount the new React views.
- `./node_modules/.bin/tsc --noEmit --pretty false`: **passed**.
- `node scripts/validate-life.mjs`, `node scripts/validate-content.mjs`, and `node scripts/validate-teaching.mjs`: **passed**. Life validation remains a structural/domain/surface-support check; its lexical review warnings are content-review inputs, not findings in this code review.
- `git diff --exit-code` for the original four level JSON files, original practice bank, A1 support, grading/records code, word-memory/word-round code, and DB directory showed no changes. The working data still has 96 original lessons, 960 original objective items, the original 32-item bank, and 18 curated word-recall entries. Original IDs and answers remain in unchanged assets.
- A separate runtime catalog exercise submitted each new item's accepted answer twice through `validateEvent` and `reduceEvents`: **296 items / 592 attempts / 1,480 XP / zero completed lessons**. This confirms existing per-item XP deduplication with the actual new IDs. Original adjudicated-history and word-memory regressions passed in the full suite.
- Registration appends the new banks to `practiceExerciseMap` and `exerciseMap`; explicit original `lessonExercises` lists remain unchanged. `finish` still requires all original IDs. No new event type, D1 schema, dependency, or completion call was introduced. Attempted new items can enter generic due/error practice while untouched new items are filtered out.
- Static navigation review found Life/Exam stay mounted during reference navigation. Their activation effects preserve the selected bank when browser Back restores its URL, and the shared Exercise component retains answer/feedback while mounted. Unknown Life unit and Exam reading/grammar links have explicit fallbacks. Life refresh intentionally returns through preparation before reopening the stored round.
- Full theory supplements render in detailed TheoryView; compact decision guides/tables/pitfalls/source links render in CheatSheet/Reference. The small first rule stage remains unchanged. Reading question items contain the full source passage and use the existing read renderer, with the new CSS allowing complete, pre-line passage display. Writing/speaking are explicitly self/external practice without unsaved draft textareas or automatic assessment claims.

## Limits and disposition

No P0/P1 data-integrity or core-completion bypass was found in the reviewed paths. The initial review reproduced three P2 behavior regressions despite the then-green suite. All three are now resolved in the independently reviewed source snapshot below.

No browser, responsive visual, accessibility interaction, clipboard, authenticated persistence, or production publication check was performed, as requested. In particular, static mount reasoning is not an end-to-end browser Back certification. Build was not rerun by this reviewer. No claim is made about Romanian answer ambiguity, CEFR suitability, native-editor approval, external source availability, or natural listening readiness.

## Implementation remediation — 2026-10-28

All three reported P2 findings were reproduced by the integration owner with failing regression assertions before changing their production paths, then fixed:

1. **Metadata ahead of history:** `restoreBankRound` now derives its position from the earliest frozen ID whose attempt count does not exceed the run baseline. It can rewind stored indices and stored-finished metadata; finished is inferred only when every item has post-baseline evidence. Invalid IDs and impossible baselines retain their prior rejection. Test `refresh rewinds metadata ahead of saved history, including finished metadata` failed with `1 !== 0` before the fix and passed afterward. It includes empty saved history, a missing earlier answer, and a stored-finished round missing its last answer.
2. **Out-of-order Next:** `advanceBankRound` and restore now call the same baseline-aware reconciliation helper. LifeView passes the current snapshot to Next. Test `normal Next and refresh skip out-of-order history while replay still asks every item` failed with `1 !== 2` before the fix and passed afterward. It exercises multiple Next actions, verifies equality with refresh positioning, and confirms a new replay still asks items whose earlier attempts are at its fresh baseline.
3. **Core lesson entry:** `lessonEntryPage` now requires explicit core exercise IDs and checks membership in those IDs. Both RouteView entry and started-state consumers pass `catalog.lessonExercises`. Test `bank-only anchor history leaves core theory entry fresh until an explicit core item is attempted` failed with `'lesson' !== 'theory'` before the fix and passed afterward. It also preserves completed-lesson practice entry and rejects empty core-attempt arrays as activity.

Verification after these fixes: `node --experimental-strip-types --test tests/*.test.ts` **72/72 passed**; `./node_modules/.bin/tsc --noEmit --pretty false` **passed**. No JSON content, grading/records events, word-memory code, database schema, dependencies or preview process were changed. No commits were made. Root will rerun final content/build/browser checks after all author changes.

This section records implementation evidence, not an independent approval. A scoped rereview was requested through the existing reviewer, but the collaboration tool returned `agent thread limit reached` with all seven slots occupied and that reviewer absent from live agents. Root can reactivate it after the integrator finishes and frees a slot.

## Independent scoped rereview — 2026-10-28

The original reviewer subsequently reread the production fixes, their callers, and regression tests, and independently reran the full test suite and TypeScript check. **All three original P2 findings are resolved in this source snapshot. No new finding was identified within this narrow remediation scope.**

- Metadata reconciliation now searches all frozen IDs for the earliest missing post-baseline attempt, so an advanced cursor and stored-finished flag cannot skip absent server evidence. Existing malformed-ID and impossible-baseline rejection remains. The new regression covers empty history, an earlier missing answer, and a missing final answer after stored completion.
- Normal Next and restore use the same selector. LifeView passes its current learning snapshot. Out-of-order answers are skipped during history resume; a replay's fresh attempt-count baseline still requires a new attempt for every item. The regression exercises successive Next actions, equality with restore, and replay isolation.
- Core entry now checks explicit core exercise IDs. Both RouteView navigation and started-state callers supply `catalog.lessonExercises`, so Life/Exam-only history leaves the anchor fresh. The regression retains attempted-core and completed-lesson practice entry and excludes empty attempt arrays.

Independent commands: `node --experimental-strip-types --test tests/*.test.ts` **72/72 passed**, and `./node_modules/.bin/tsc --noEmit --pretty false` **passed**. This rereview did not change application source, rerun the content validators/build, or perform browser or authenticated persistence checks. The broader first-review limits remain in force.

The checkout base is commit `7c3d3f99485c5d65f13d7f68e10fbfd261596652`; remediation is uncommitted. SHA-256 identifies the exact independently reviewed files:

| File | SHA-256 |
| --- | --- |
| `lib/course/life.ts` | `4759978861f232881d0cdc567cc4faa61c84ff38e696b93b71b48e03ece73494` |
| `lib/course/activity.ts` | `0f95bef0ba3bc31b243bea3b8de00a2f3a4d518acdc3774088b52f079890d939` |
| `app/components/LifeView.tsx` | `58ca4bafc072cafd3a40e5f06a527e62ae4c67f12d90fd34e4636db9687af2b3` |
| `app/components/RouteView.tsx` | `106855a8588cafa7d80c0df2ce58be21f6f09acbd27e0efa6e486e4404b60d35` |
| `tests/life.test.ts` | `5ce50b4cb1ed1dcf76334158e0380ed97741e15acbc900fcc33d98980a72ebe9` |
| `tests/activity.test.ts` | `3a294a3619fe900cc720075bb9fc8adc8dd6fde2cba1d918b54510dd095de5a6` |
