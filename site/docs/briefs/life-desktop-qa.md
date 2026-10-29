# Release 1.4 desktop QA

Managed Sites preview at `http://terminal.local:4173/`, cloud Chrome. Content was fully written before the graded runs. A fresh tab was used for the final B2 round after the small focus/scroll UI refinement. No production learning records were written.

## Observed flows

- LIFE.A1.NEIGHBOR: preparation, translated words/phrases, separate practice, all 16 items (4 choice / 4 gap / 4 order / 4 reading). Both token selection and keyboard order input worked. An intentional `în` instead of `din` was rejected, then corrected. Results: 16 answered, 16 latest correct, 1 retried, 2 assisted. Progress showed 80 XP and 0/96 completed core lessons. The assistance count correctly includes the reference visit and retry.
- Selected a radio answer, opened the source A1.04 reference, used browser Back: same question, same selected answer, same frozen bank. No per-question production task appeared; transfer and optional model appeared at the end.
- Final B2.20.reading deep link: four full-length source copies rendered with paragraph breaks. All 4 answers graded correctly. Next returned the question heading to a visible position (DOM top 346 px) on each transition. Focused active bank omitted the large selection-page hero/tabs.
- Replayed all 4 B2 reading questions: result counted only the new four answers (4 correct / 0 retried / 4 assisted), and total XP stayed 20. Core completion remained 0/96.
- B2.05 detailed theory rendered the extension sections, examples, decision guide and pitfalls. The separate cheat-sheet tab showed the decision guide/table/pitfalls and omitted the full extension prose. Source links were visible. Training exposed both new entry points; direct bank navigation worked.
- App-filtered browser warnings/errors returned an empty list. Unrelated Chrome extension metadata errors were present in unfiltered logs.

## Verification limits

Anonymous preview requests show the expected sign-in/save banner. UI state, grading, XP, and transitions were checked in memory; authenticated D1 persistence was not exercised in this browser. Existing event/history/word-memory and interrupted-save/replay reconciliation are covered by the 72-test suite, not by a claim of an authenticated browser session. Official audio, spontaneous speech, and a learner's CEFR performance require separate external evaluation.

Screenshot: `docs/qa/life-v14-desktop.jpg`.
