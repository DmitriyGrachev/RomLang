# Cards and writing persistence implementation report

Implemented the assigned brief in the owned files only. No commits or subagents.

## Delivered

- Added `CustomCard`, `WritingRecord`, event types `customCard` / `writing`, and empty snapshot defaults. Older events retain their original fixed-record behavior.
- Custom card validation enforces `custom.` IDs with event-safe characters and maximum 100 characters, catalog collision protection, bounded nonblank Romanian/Russian text, optional example, maximum 1,000 active cards, and own-card deletion. Deleted records and historical events remain, while deleted cards are excluded from the cards catalog and cannot receive new word/save/note events.
- Own-card typed answers are graded against the saved Romanian form. Client grades are discarded. Romanian or Russian content changes clear both directions' SRS state and current attempt summaries; example-only changes preserve memory. Replay produces the same result and retains historical review events.
- Writing validates registered tasks, unique in-range rubric indices, text up to 20,000 characters, boolean model exposure and nonempty revisions. Model exposure is sticky; revisions use event ID/time and retain the latest 30 entries. Only unsent writing drafts coalesce; revisions never coalesce.
- `CardsView` default signature is `{learning:Learning}`. Separate flashcard stack has all/due/saved/custom decks, independent direction, all/A1/A2/B1/B2 level filter, search and module/personal topic filter. Own cards use personal topic with no level. Dictionary fallback checks explicitly instruct users to enter the card form and do not claim to check synonyms.
- Each round selects up to 12 cards, returns a missed card once, then defers a second miss. Users can explicitly continue later or begin a new round for deferred cards. Independent recognition and recall schedules use the existing `wordReview` event and `scheduleWordPractice`; recognition is presented as self-assessment.
- Stack includes reveal, remember/again, checked typed feedback, saving, translation, forms and example. Custom card editor and paginated management support creation/edit/deletion. Empty states, accessible labels, live feedback, save retry, and narrow-screen CSS are included. No audio, pronunciation or stress labels were added.

## Verification evidence

Tests were written before persistence changes. Initial command:

`node --experimental-strip-types --test tests/cards.test.ts tests/writing-records.test.ts`

Result before implementation: 0/7 passed, with new event types unknown and snapshot fields absent. Added card-filter/stack tests failed for missing cards helper before it was created. Self-review added a failing regression test for inherited object names (`toString`, `constructor`, `__proto__`) being accepted as custom word IDs; `Object.hasOwn` now rejects them.

Latest focused command:

`node --experimental-strip-types --test tests/cards.test.ts tests/writing-records.test.ts tests/word-memory.test.ts tests/records.test.ts tests/sync.test.ts`

Result: **30 tests passed, 0 failed**. This includes custom server grading / forged results, allowed and rejected inputs, delete/reset behavior, replay/defaults, filter intersections / empty results / active custom exclusion, bounded rounds, writing validation, sticky exposure, 30-revision retention, draft coalescing, reload/restore and legacy sync/word behavior.

Full project command `npm test` was also run during concurrent integration. Result at that point: **81 passed, 3 failed (84 total)**. Failures outside owned implementation:

- `tests/depth-catalog.test.ts` could not import missing `content/academy/A1.json`.
- `tests/life-catalog.test.ts` could not import missing `content/academy/A1.json`.
- `writing counts Romanian hyphenated forms and paragraphs without pretending to grade meaning` in `tests/writing-checks.test.ts` expected 8 words but received 7.

Latest `./node_modules/.bin/tsc --noEmit` reports only missing `content/academy/A1.json` and `content/academy/B1.json` in the concurrently authored academy catalog. The initial cards-test literal typing issue was corrected before that latest check. No owned-file errors remain in that output.

`git diff --check` passed. Self-review checked the assigned requirements, event ingestion/replay, pending draft behavior, content reset rules and bounded queues.

## Root integration and remaining constraints

Root imports `app/cards.css`, wires `CardsView`, registers all fixed-card fallback entries in `catalog.wordRecall`, and registers task/rubric lengths in `catalog.writingTasks`. This task intentionally did not modify data.ts, CourseApp, or other UI. Fixed records still reject checked recall without a registered recall item, preserving the existing persistence contract.

Integrated browser QA was requested from root for 320px layout, filters, reveal/save, typed checks, custom CRUD and round exit. I did not open a browser session, so visual/responsive behavior is implemented but not independently browser-verified in this task. Root will complete integrated full-suite, build/typecheck and cross-device verification once concurrent content files exist.

## Independent review correction — shrinking deck pagination

Fixed review finding P2 (final selection page becoming falsely empty after deleting a card). `clampCardOffset` computes the last populated page; CardsView derives the visible slice, page labels and previous/next actions from the clamped offset immediately, then synchronizes the stored offset. This also covers remote refresh and edits that shrink filtered results, rather than relying only on a delete handler. The academy module labels and root's custom-deck filter reset are preserved.

Added a regression that creates 13 custom cards, opens offset 12, deletes one, and verifies the 12 surviving cards remain startable at offset 0. Additional assertions cover remote-style shrink from later pages, empty decks and preserving valid offsets. The regression failed before the helper existed, then passed after the correction.

Verification after correction:

- `node --experimental-strip-types --test tests/cards.test.ts`: **8 passed, 0 failed**.
- `./node_modules/.bin/tsc --noEmit`: **passed**, exit 0; the earlier missing concurrent content files are now present.
- `npm test`: **95 passed, 0 failed**. npm emitted its existing unknown `http-proxy` environment-config warning.
- `git diff --check`: **passed**.

Root retains integrated browser review. Only `lib/course/cards.ts`, `app/components/CardsView.tsx`, `tests/cards.test.ts` and this report changed for this correction; no commits or subagents.
