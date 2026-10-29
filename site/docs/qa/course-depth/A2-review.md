# Independent A2 catalog review

Reviewed `/workspace/sites/romana-militari/content/depth-A2.json` directly, after the original author stopped. Scope: all 24 lesson cores, detail paragraphs, comparisons, examples, exercise keys, preparation supports and production models; 48 checkpoint items and six productive checkpoint models; 108 dictionary entries with two translated examples each; 12 mission variants, all node lines, options and translations.

## Corrections

- Fixed specific language and semantic errors: A2.29 theory falsely said the photographed refrigerator was included; A2.36 used unnatural `Să repetați, vă rog`; A2.42 example gave Wednesday at ten despite the after-five scenario; A2.46 contained Spanish `martes`; A2.26 mixed Kyiv/Kiev spelling. Fixed A2.25 and A2.29 prompt meanings so the keyed responses answer the actual question.
- Corrected the A2.10 checkpoint key: a broken hotel key is `Cheia camerei 18 nu funcționează`, not necessarily a door that will not open. Constrained two checkpoint gaps and 21 order prompts where another natural arrangement could otherwise be marked wrong.
- Reviewed all 108 dictionary entries and their two contextual examples. Corrected stress on `bucur`, `verifica`, imperative `amestecă` and participle `uitat`; corrected English/Russian glosses on `aprinde`, `ieftină`, `ieri`, `rar`, `aceea`; replaced an identical repeated address example and an incomplete cabinet location. Romanian dictionary/orthographic evidence: [DEX bucur](https://www.dex.ro/bucura), [DEX verifica](https://dexonline.ro/definitie/verifica), [DEX amesteca](https://www.dex.ro/amesteca), [DEX roșie](https://dexonline.ro/definitie/roșie). `roșii` retains its correct initial stress.
- Fixed a mission about a lost umbrella so it comes from a previous trip, not the train that had just been cancelled. Replaced a nonsensical symptom distractor with a grammatical but contextually wrong option. Split an awkward joined question about form fields. Clarified the bus departure question.
- All 12 mission variants now have two valid, differently worded or chosen responses at both later turns, while their initial wrong option still follows an authored repair path. Every added option has an exact Russian preparation translation. One repair node per variant remains a single guided correction by design.
- Replaced all 24 cloned generic productive prompts/checklists with topic-specific transfer situations and criteria. Added a direct, contextually placed question to each model that had lacked the requested clarification. Six checkpoint models now include the requested short message with a concrete question. Fixed the A2.34 model so the dish choice follows an explicit ingredient answer.
- Added distinct grammar and decision notes to explanations that were near the floor. All 24 core/detail/comparison texts now span 260–313 Russian words. Balanced keyed choice/read positions: 72 first, 72 middle, 72 last.

## Verification

`node scripts/validate-depth.mjs --level A2` passes after final edits: 6 modules, 24 lessons, 336 objective items including 48 checkpoints, 108 dictionary entries, all support references and mission paths. A2 reading passages are 71–89 Romanian words. No old A2 or other level source was modified by this review.

## Residual limits

The exercise bank tests controlled reading and written response; it does not assess listening or spontaneous speech. The final product still needs an ordinary runtime/build check after integration. A native Romanian instructor could make optional stylistic changes, but the reviewed examples and decisions have no known remaining structural or semantic blocker.
