# Course depth release QA — 2026-10-28

## Final catalog
192 lessons (48 per level), 48 modules/checkpoints/missions, 96 mission variants, 882 dictionary cards. 2,304 main objective items plus 328 separate practice/life/exam items = 2,632 total. The expansion adds 96 lessons, 1,344 items and 440 contextual dictionary cards; cards are not a distinct-lemma count. Existing assets and stored answer semantics remain unchanged.

## Verification
- 79/79 automated tests passed, including old IDs/answers/history, 1.4.0 replay, new content grading/owners/review/completion, and negative validator cases.
- TypeScript noEmit passed; content, teaching, depth, life and practice validators passed; git diff --check passed. A mistyped ancillary validator filename was corrected before running the actual life/practice checks.
- Independent content review covered each new level, with findings resolved. B2 has a separate 114-card stress review and 22 applied stress-display corrections. Reports are in docs/qa/course-depth/.
- Managed Chrome preview: full overview shows 12 modules/48 lessons per level; search A1.25, A1.7 and B2.48; theory/preparation/sheet links; correct and wrong choice feedback, retry, gap, shuffled order and reading exercised on A1.25; detailed B2.48 theory; B2.12 mission preparation and guided start render correctly. Mission graph termination/branching/preparation validated across all variants.
- Responsive iframe widths 320/390/430: body widths 305/375/415 including desktop scrollbars, no page horizontal overflow, 12 module cards each. Expanded 320px module links are 44px tall; sheet table scrolls within its wrapper. Screenshot docs/qa/course-depth-mobile.jpg. Temporary harness removed before packaging.
- No app-origin console errors observed in final browser log check; extension-only messages excluded.

## Limits
Browser used signed-out preview; new authenticated production saves and actual phone/laptop account handoff were not exercised. Sync/replay are covered by automated tests. Physical mobile keyboards/Safari were not tested. Open writing and speech are self-check; authentic listening remains linked external material, with no TTS. This release does not certify CEFR. Some controlled distractors are easy; B1 lesson writing models reuse lesson reading passages and are not additional independent texts. Language review is not a native teacher certification.

## Frozen content SHA-256
- A1: `e606d8e522a58d60a00fdfafbcc92b2bfd9e44d7c0825b783ff23465fb525727`
- A2: `bf6e2020db37235d0c640812abc566e680438fe63199f918e7db8e2aca108a17`
- B1: `5b2cd5f7d1e30864273aca8f6efb39f34660a48af4c0dd9c8f572b291a116770`
- B2: `2655961f176eea92a5f89f1ab57a5751643733c1ded45e649dec64cb327d66f3`
