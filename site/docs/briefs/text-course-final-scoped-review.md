# Scoped final-fix review

2026-10-28. Reviewed only closure of I1–I3 and M1–M2 in `text-course-final-review.md`, the implementation evidence in `text-course-final-fix-report.md`, and regressions local to immutable `/tmp/text-course-final-fixes.diff`. No whole-branch re-review, suite/build rerun, source change or commit. Root owns the remaining browser checks.

## Verdict

Four findings are addressed. I3's persistence defect is corrected, but its requested expiry behavior retains one **Minor** boundary defect in both entrypoints. Root's frozen browser QA passed all three primary workflows, including an assisted card result and 0/1 independent control. The bounded expiry residual remains for root's final-review-breaker adjudication; no other local defect found.

| Finding | Status | Evidence |
| --- | --- | --- |
| I1 | **ADDRESSED** | `main`/`transfer` is carried through validation, replay, scenario-specific draft coalescing, immutable revisions and revision restore. Editor prompt, plan, criteria, revision focus and portfolio label derive from that context. Transfer criteria refer to the new condition and its sources instead of the original library/Ada facts; the original model is clearly labeled and exposure remains sticky. Legacy events default to `main`. `hasWritingDraft` preserves task-list/profile/completion evidence while the other scenario is blank. Root independently confirmed B2.21 context/text/revision label after editor unmount. |
| I2 | **ADDRESSED** | Only displayed unanswered control items emit validated checkpoint exposure. Opening this unit's theory, words, practice or writing records persistent item assistance; returning through another route uses replayed exposure. Prior study and required source reading do not trigger that helper. Attempt validation consumes the assistance history, keeping such first answers out of independent/delayed evidence. Missing older in-memory exposure maps are tolerated. |
| I3 | **NOT ADDRESSED fully** | Timestamped exposure now survives navigation/replay, including recognition reveal without a rating. Both card entrypoints write/consume the same map; server validation enforces it without fabricating scores or mixing SRS directions. Custom-answer changes clear current exposure. However, cached UI help can outlive the strict 24-hour window at submission; see R1. |
| M1 | **ADDRESSED** | B2.21's domain is `Чтение стенограммы и письменный синтез`. |
| M2 | **ADDRESSED** | CardsView uses the existing `russianCount` helper for the card count. |

## R1 — Minor: cached UI assistance can extend expired exposure into a scored attempt

**Locations:** `app/components/CardsView.tsx:45,60`, `app/components/WordTrainer.tsx:43,52`, with the minute clock at CardsView `:21–22` / WordTrainer `:18–19` and preservation of client assistance in `lib/course/records.ts:61`.

Both views calculate help using a `now` state updated once per minute, then forward that cached boolean during submission. If a reveal expires between the clock tick and the submission, the UI sends `assisted:true` after the exposure has expired. Validation correctly finds no recent persisted exposure at the event timestamp, but ORs that result with the stale client flag and keeps the attempt assisted. A correct already-due recall can therefore reset its streak and receive an assisted-repeat schedule instead of recovering normal behavior. With the normal active-tab timer, the boundary window is under a minute. It does not erase exposure, create false independent evidence, lose learner text or block the primary flows.

One new read-only probe used an exposure at `2026-10-25T12:00:00Z`, UI time ten seconds before the 24-hour boundary, and submission ten seconds after it, with no mistakes or other assistance. It returned:

```json
{"uiAssisted":true,"persistedExposureAtSubmit":false,"validatedAssisted":true}
```

**Correction:** recompute submission assistance with the current timestamp inside each submit handler, retaining explicit reveal assistance and current-round mistakes. The minute clock can remain for rendering/due lists. The same applies to recognition submission where a timed preparation exposure is involved. Verify a submit that crosses the expiry boundary while the rendered clock is unchanged.

## Verification boundaries

Inspected the changed consuming UI, validator, accumulator, sync coalescing, evidence helper and new regression cases. Accepted the supplied 107 passing tests, types and content audits without redundant reruns. Existing expiry tests validate the server with a fresh timestamp and `assisted:false`; they do not cover the cached UI flag above. No authenticated browser-to-database durability claim is added.

Integration resolution: applied the reviewer-prescribed fresh Date.now assistance evaluation at all four submission sites in CardsView and WordTrainer. Rendering retains minute tick; event submission does not use cached display assistance. Covering expiry/replay tests and TypeScript rerun before packaging.
