# Final whole-branch review

Reviewed 2026-10-28 against baseline `aadfd051ce0c67623a4539a4282356a0fb25a470`, immutable `/tmp/text-course-final-review.diff`, the approved design and implementation plan, execution ledger, prior code/content reviews, compatibility audit, and final validation/browser reports. HEAD remains at the baseline. This report is the only file changed by this reviewer.

## Verdict

- **Specification: substantially implemented, changes requested.** The 76-unit library, text-only learning route, cards, explicit writing revisions and evidence profile are integrated. Three workflow defects undermine transfer-writing context or the promised independence/assistance evidence.
- **Code quality: generally sound, changes requested for the findings below.** Catalog composition, server grading, event replay, legacy defaults, bounded custom input, immutable explicit revisions and separate SRS directions fit the existing architecture. No Critical issue found.
- **Readiness: not yet ready to publish.** Address I1–I3 and review the scoped changes. M1–M2 are small nonblocking copy corrections that can accompany the same fix wave.

## Important findings

### I1 — Transfer writing uses the original task's rubric and loses its task context on return

**Locations:** `app/components/WritingStudio.tsx:14–21`, `lib/course/types.ts:20`, `lib/course/records.ts:25–33`; concrete content at `content/academy/B2.json:13074` and `:13094`.

`Новая ситуация` changes only the prompt using a local `transfer` boolean. The editor continues displaying the original plan, task-specific checklist, revision focus and model, and keeps the original checked criteria. Drafts/revisions store only the shared task ID and no indication of which scenario the text answers. On unmount/re-entry the boolean resets to false while the transfer text is restored beneath the original prompt.

This is concretely wrong for ACA.B2.21: its transfer asks for a synthesis of Irina/Dan's exhibition discussion and a report with 120 entries, but the displayed checklist still requires Ada's preference, the mobile-library pilot and the original return-partner question. A correct transfer answer cannot satisfy those criteria. Saving it and leaving/returning also makes the saved answer appear to address the library task; the portfolio cannot distinguish its context.

**Correction:** make the scenario explicit in editor/draft/revision state and restore/display it with the text. Do not present original-task-specific checks/model as checks for the transfer. Provide appropriate transfer criteria or clearly separate the original example from the transfer workspace, reset or separate self-review marks, and preserve existing records with an original-scenario default. A separate registered transfer task is also a valid implementation.

**Verification needed:** use B2.21 or another source-specific transfer, save a revision, navigate away/back and replay/restore. Confirm the correct prompt/context, applicable checklist and revision label survive. Test original records and sticky model exposure remain compatible.

### I2 — Opening theory or vocabulary during an unseen academy control is not recorded as assistance

**Locations:** `app/components/AcademyView.tsx:33–41`, especially the tab handler on line 35; `app/components/Exercise.tsx:18`; `lib/course/writing.ts:21–29`.

All six academy tabs remain available during a control. Their handler only calls `setTab(k)`. A learner can read an unseen question, open `Разбор` or `Слова` to look up the rule/form, return to `Контроль` and submit the first answer. No assist event exists: the question has no prior attempt, the Exercise hint was not opened, and the derived first-independent/delayed metrics count this as an unassisted result. This differs from `ReviewView`, where the explicit theory link records assistance before navigating.

**Correction:** track the exposed, unanswered control item and record assistance when its learner opens instructional support through this unit's tabs/links. Keep normal study before beginning a control unpenalized. Preserve the assistance record across unmount/re-entry, and avoid treating the source reading required by a comprehension question as an answer hint.

**Verification needed:** start an unseen control, open its theory/vocabulary, return and answer correctly. Its first answer must be assisted and excluded from independent/delayed counts after replay. A genuinely first unassisted answer must still count normally.

### I3 — Card reveal exposure disappears when the cards screen unmounts

**Locations:** `app/components/CardsView.tsx:29`, `:45`, `:51`, `:90`; `lib/course/word-ui.ts:20–23`.

`exposeRecall()` stores the exposure timestamp only in component state. In recognition mode, opening the back of a card calls this helper without emitting a persistent exposure event. Navigate to another destination, re-open Cards, select the same card in written recall and answer immediately: `exposed` is empty again, and there may be no recall attempt history at all. Even submitting a recognition self-rating only creates recognition history; `recentWordHelp` checks the requested mode. The written answer is therefore labeled unassisted, despite the same answer being marked assisted if the learner switches modes without unmounting.

This affects evidence and can advance an already-due recall streak beyond the assisted-repeat schedule. It is not merely loss of round position.

**Correction:** retain recent card-answer exposure in learning state/history (with its timestamp and expiry), and use it consistently across navigation, reload and both relevant training entry points. Opening a back must not fabricate a recognition or recall score merely to store exposure. Keep recognition and recall SRS schedules separate.

**Verification needed:** reveal a recognition card, leave before rating, re-enter and type the correct recall answer. Repeat after a recognition self-rating and after reload/replay. These immediate recall attempts must remain assisted; an attempt after the intended exposure window must recover normal behavior.

## Minor findings

### M1 — B2.21 advertises excluded skills in its domain label

`content/academy/B2.json:12481` still has `Слушание, выступление и синтез` although its title and actual work are written synthesis/transcript reading. `AcademyView` renders this domain both in the catalog and above the unit title. Rename it to the written scope. Root independently observed the rendered inconsistency.

### M2 — Card count uses the wrong Russian plural for counts ending in 2–4

`app/components/CardsView.tsx:77` distinguishes only `1` from every other number. For example, the integrated catalog shows `1794 карточек` instead of `1794 карточки`. Reuse the existing `russianCount` helper (including 11–14 exceptions). Root independently observed this rendered text.

## Positive findings and coverage

- Reviewed all changed application/library source and new CSS, validation script and test files. Reviewed the tracked legacy content adaptation via its diff/compatibility evidence; selectively cross-checked new writing tasks and their actual consuming UI. The new catalog provides all four authored levels with readings attached to review questions and registered writing tasks.
- Unseen academy banks are excluded from generic fresh review until attempted. Ordinary repeated Exercise attempts and explicitly opened hints retain assistance through the event log. The two prior task-review defects (exam-model bypass and shrinking card-selection pagination) remain corrected.
- The main navigation stays at five destinations, with Cards top-level and dictionary/academy/readings/writing entry links intact. Invalid academy/writing IDs and empty filters have recovery states. Existing IDs and objective grading data are retained according to the supplied independent compatibility audit.
- Custom input is rendered as text; limits and ownership checks are server-side. Changed Romanian/Russian card content resets current memory state without deleting historical events. Deleted cards are excluded from active selection. Round mistakes return once and can finish or defer; due selection starts from the first remaining due card.
- Writing explicitly distinguishes deterministic structure checks from semantic assessment and self-review from certification. Model exposure is sticky and the exam's alternate untracked model surface is removed. Explicit revisions do not coalesce; drafts do. The original/transfer distinction is the remaining gap.
- The supplied 96-test/types/content-audit/build results are meaningful evidence for grading, replay, filtering, limits and compatibility. They do not exercise UI scenario selection or exposure across navigation; passing helper tests therefore do not cover I1–I3.

## Validation performed and boundaries

Did not repeat the full documented passing suites or production build. Ran one narrow read-only Node probe for the concrete assistance concerns: `wordIsAssisted` returned **true** with the current reveal map and **false** with the fresh map used after navigation, and validation of an unanswered academy checkpoint with no assist event returned `assisted:false`. The UI handlers establish why those states occur. No authenticated session, database, code, index or commit was modified.

Explicitly declined to judge:

- Authenticated browser-to-D1 durability under the user's identity: the supplied browser session was signed out. Replay/transport evidence is useful but is not authenticated end-to-end evidence.
- A second exhaustive linguistic/answer-equivalence review of every authored passage and item: level reviewers performed that work; this review sampled content for integration behavior.
- Formal CEFR attainment, educational efficacy or certification: the app correctly avoids making these claims.
- Current availability, licensing interpretation or changing rules of external reference sites: this is a local integration review, not renewed external-source research.
- Full assistive-technology certification, all browser/device combinations or measured production performance: supplied 320/390px/desktop QA and source accessibility checks support the observed flows only. The known eager-catalog chunk warning is not a newly demonstrated functional defect.

The scope and data architecture are suitable for the requested expansion. The remaining acceptance work is the three concrete workflow corrections above, a scoped re-review, and the source helper's final packaging/publishing gate.
