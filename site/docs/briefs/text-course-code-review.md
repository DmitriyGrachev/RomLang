# Text-course code review

Reviewed 2026-10-28 against `cards-persistence-brief.md`, `2026-10-28-text-course-design.md`, the implementation report, `/tmp/text-course-code-review.diff`, and the current integration files.

## Verdicts

- **Specification: approved for the reviewed implementation scope after fix round 1.** The persistence/schema contracts, separate card mode, text-only scope, writing revisions, and academy integration are present. Both originally reported P2 findings are addressed.
- **Code quality: approved for the reviewed scope after fix round 1.** No critical/P1 finding identified, and no new important breakage found in the fix diff. Original findings below are retained as historical review evidence.
- Content authors are still filling academy JSON. Partial counts/content completeness are intentionally outside this verdict, and publication remains blocked until root's content and browser gates pass.

## Important findings

### P2 — Opening an exam writing model does not mark model exposure

**Fix-round verdict: ADDRESSED.**

**Location:** `app/components/ExamView.tsx:16`; downstream labels at `app/components/WritingStudio.tsx:18-20`.

The exam writing tab retains its own “Полный образец и разбор” disclosure and copy button. That disclosure has no `onToggle` or writing event. Only the WritingEditor model disclosure records `modelViewed`. Consequently, reading or copying the same model in ExamView leaves the writing record unexposed and revisions can be labeled “без открытия образца”. This undermines the promised transparent model-exposure evidence.

**Reproduction:** For an EXAM writing task without prior exposure, open B2 → Письмо → “Полный образец и разбор”; read/copy the model; follow “Открыть письменную мастерскую”; type and save a revision. The studio still says “Образец не открывался” and the revision says “без открытия образца”. This follows directly from the handlers; browser reproduction remains with root.

**Required correction:** Record a writing draft with `modelViewed:true` whenever this alternate model surface opens (preserving any existing draft, criteria, and revisions), or make WritingEditor the sole model surface. Add coverage for exposure through the exam entry point, not only the editor.

### P2 — Deleting a custom card on the final selection page can produce a false empty deck

**Fix-round verdict: ADDRESSED.**

**Location:** `app/components/CardsView.tsx:36`, `:67`, `:75-76`.

The training selection slices the pool using `offset`, but deleting a card resets only `managePage`. If the deletion reduces the pool below the current offset, `available` becomes empty. When the remaining pool has at most 12 cards, the entire pagination control also disappears, so the user cannot return to the first page through pagination. The remaining cards are saved correctly but the UI reports that the custom deck has none.

**Reproduction:** Create 13 custom cards; select the custom deck; click “Следующие” to set offset to 12; open custom-card management and delete any one card. There are now 12 matching cards, `pool.slice(12,24)` is empty, and `pool.length>12` is false. The deck shows “Нет своих карточек по этим фильтрам” without previous/start controls. A filter change recovers it.

**Required correction:** Clamp/reset the selection offset when the matching pool shrinks, including after deletion or an edit that removes the card from a search result. Preserve a truthful empty state and a reachable previous page.

## Reviewed paths without additional important findings

- Custom IDs/text bounds/active-card cap and ownership checks; checked custom recall discards supplied grades; Romanian/Russian edits clear both SRS directions and current attempt summaries while retaining events; example-only edits preserve memory; active catalogs exclude deleted cards.
- Writing task/rubric validation, nonempty explicit revisions, sticky exposure in validation and replay, last-30 revision retention, and draft coalescing. In-flight drafts are retained, revisions do not coalesce, and replacements carry forward sticky exposure. Existing event types keep their previous validation behavior and new snapshot fields default empty.
- Academy navigation has invalid-ID and empty-search states. Practice and checkpoint banks remain separate from unseen generic review until attempted. Academy reading questions receive their passage in `academy.ts`; Exercise displays it in generic Review/Clinic, while the dedicated reading tab avoids duplicating the already visible passage. Review links academy items back to their unit.
- Completion/profile language distinguishes attempted work, first independent accuracy, and self-review from CEFR certification. Reviewed active UI adds no required audio, pronunciation, recording, or spoken-answer step. Historical spoken production data remains readable.

## Evidence and limits

This was a focused source/task review, not a linguistic-content or browser review. Root supplied successful evidence for 93 tests and TypeScript; unchanged suites were not rerun. A read-only catalog probe confirmed all four existing B2 reading banks attach text to every question. No implementation files, commits, or subagents were created by this review; this report is the only written file.

## Scoped re-review — fix round 1

Reviewed `/tmp/text-course-review-fixes.diff`, the current affected files, and the appended implementation reports. Scope was the two original findings and breakage introduced by those corrections only.

- **Writing-model exposure: ADDRESSED.** `app/components/ExamView.tsx:16` no longer renders model text, annotations, or model-copy controls. Task-specific links still open the registered task in WritingStudio, and task previews/plans/rubrics remain available. The sole in-app model surface is the existing WritingEditor disclosure, which records sticky exposure. Removing the bypass fixes the original evidence gap without mutating drafts during navigation.
- **Shrinking-deck pagination: ADDRESSED.** `lib/course/cards.ts:25-28` clamps to the last populated page; `app/components/CardsView.tsx:36-38` applies that effective offset synchronously to the slice and then synchronizes state. `:78` also derives labels, disabled states, and navigation from the effective offset. The 13→12 deletion now immediately shows the surviving 12 cards on page 1; filtered-result edits and refreshes use the same length-based correction. Due decks still use offset 0. The new regression in `tests/cards.test.ts:85-96` exercises actual custom-card deletion plus empty, later-page, and valid-offset boundaries.
- **New important breakage in these corrections: none found.** No expansion of the original review scope or browser review was performed.

Verification evidence supplied by root/implementers: cards **8/8**, full suite **95/95**, writing persistence **3/3**, and TypeScript checks passed. These unchanged checks were not repeated during re-review. Root retains publication/content-completeness and browser gates; this code verdict does not certify those separate gates.
