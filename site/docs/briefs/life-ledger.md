# Life/B2 release1.4 ledger—2026-10-28
Base7c3d3f99485c5d65f13d7f68e10fbfd261596652; cleanexistingbuild/romanian-course, sourcehelperopened; ownerprivateverified. Userdirectlyauthorizesexpansion, noextraconfirmationgate. Weakermodelauthors/QA, rootorchestration.
Optionalexamtargetquestionunanswered; generalB2+ILRdefault. Sourceauditorreport scratch/b2-coverage-audit.md; severe gaps sustainedreading,fullwritingmodels,naturalreception and transfer. Noexamguarantee.
Ruling:16lifeunits+46theorysupplements+originalB2practice, all96theoryreviewed; nofinitegrammarlistcanverifyB2performance. No naturalrecordings fabricated; externalofficialaudios/checkslinked. Nooldprogressreset/newDBschema/events. Parallelcontentwritersdisjoint; integratorsolecodeowner.

## Current checkpoint

All five content assets exist. Integration has 69 passing tests and a clean typecheck; final content edits still invalidate release verification.

Independent language review found real issues and release is blocked on corrections:
- A1/A2: avoid categorical `la stânga` location prohibition; remove preparation summaries that reveal reading answers.
- B2 life: duplicate valid choices, underspecified gaps, omitted natural word-order variants, undersized transfer models.
- B2 theory: remove copied exercise-answer explanations used as prose; replace third pitfalls that incorrectly mark a true rule as wrong. Author is rewriting all 24.

Reviews remain independent/read-only; authors fix their own assets. Managed preview has not started. Final browser QA must begin from a fresh load after content corrections, because the learning catalog is captured when the app mounts.

## Release candidate

The prior checkpoint above is historical. Independent A1/A2, B1, B2, and code/state rereviews have now closed their scoped blockers. Root applied only the two final parallel-example edits and the final B1 two-week question correction, each confirmed by the relevant independent reviewer.

Final content inventory: 16 life units, 256 life objective items, 40 B2 exam objective items, 46 theory supplements, 96 lesson audits, 4 extended B2 readings, 4 full writing models, 4 speaking tasks. Original 960 objective items, 32 prior additional items, 442 dictionary entries, and word memory remain intact. Course version is 1.4.0.

Final automated checks: 72/72 tests, TypeScript, original content validator, teaching validator, life validator, and diff whitespace check pass. Original core content/answers, grading, records, word-memory source and DB are unchanged.

Fresh desktop QA completed a 16-item life round (16 correct, 1 retry, 2 assisted, 80 XP, zero core completion), reference/Back retention, a four-question B2 reading and replay (20 XP deduplicated), and full-versus-compact theory surfaces. App-filtered console warnings/errors were empty. Mobile QA found and verified repair of readiness overflow; its final report is being collected. Preview is anonymous, so authenticated persistence was not exercised through the browser. No production learning records were touched.

Observed QA led to focused active Exam rounds, top scrolling on start/Next, and contained table scrolling. Final publication remains pending build/package/deployment.

Final browser handoff: mobile report is saved in `life-mobile-qa.md`; readiness and reading page widths are 375/375 with the 680px table confined to its 343px scroll wrapper. A1 choice/gap, reference Back, B2 writing disclosure and long reading worked. The fixed footer can initially overlap the lowest visible option; normal page scrolling reveals it. No unreachable control was reported. The temporary mobile harness has been removed. Desktop proof is tracked in `docs/qa/life-v14-desktop.jpg`.

Final production build succeeded after all runtime/content changes. Only the known Vite large-chunk advisory remains. Source packaging/publication follows this checkpoint through the native Site workflow; the deployment result is reported in the conversation. Authenticated preview persistence remains outside the browser verification performed here.
