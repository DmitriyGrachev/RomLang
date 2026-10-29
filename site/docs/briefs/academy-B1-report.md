# B1 author report — units 01–10

## Assigned scope

Completed `ACA.B1.01` through `ACA.B1.10` in `content/academy/B1.json`. Root explicitly divided B1 authoring after work began: another author owns units 11–20 in a separate partial file. This file therefore intentionally contains the first ten units only, in the exact topic order, with all five prescribed goals retained verbatim and sequential prerequisites.

## Delivered content

- 10 units; 30 substantive theory sections; 60 Romanian/Russian theory examples.
- 30 corrected pitfalls with Russian explanations.
- 120 contextual vocabulary cards with forms, bilingual examples and prepared answers.
- 20 original Romanian readings, each with four glossary entries and three text-based comprehension questions.
- 80 practice exercises, including at least three written gap responses per unit, plus ordering and short reading tasks.
- 40 independent checkpoint exercises using changed contexts.
- 10 writing tasks, complete original models, five-step plans, three annotations, four rubric criteria, three revision points and changed transfer prompts.
- 180 exercise items in total, counting reading comprehension, practice and checkpoints.

## Validation performed

Parsed the final JSON and checked exact unit/title/goal/prerequisite correspondence against `docs/briefs/text-course-topics.json`; verified required collection lengths, ID uniqueness, answer membership in choices, order-token multisets, prepared vocabulary answers, reading skill/type, and absence of listening skill.

Final measured ranges (whitespace word counting):

| Check | Result |
|---|---:|
| Russian explanatory theory words, counting only tokens containing Cyrillic | 192–217 per unit |
| Romanian words per reading | 228–245 |
| Romanian words per writing model | 140–153 |
| Required writing range | 130–180 |
| Duplicate exercise IDs | 0 |
| Correct choice positions, first / second / third | 37 / 36 / 37 |

Ran `node scripts/validate-academy.mjs` against the repository. The only B1 error is the expected integration-stage count message `B1: expected 20, got 10`; there are no content-validation errors for assigned units 01–10. The earlier short reading `ACA.B1.01.r1` was expanded and now passes. Errors in other levels were left to their authors.

Editorial pass replaced generic ordering explanations with sentence-specific grammatical reasons, made distractors test nearby meanings rather than unrelated nonsense, strengthened genuinely Russian theory depth beyond 180 words, and simplified incidental past-perfect narration in the opening unit. Reading questions use `type: read`, `skill: reading`, choices and specific textual-evidence explanations.

## Pedagogical limitations and concerns

- These ten units are the first half of the B1 reading/writing curriculum. Root must append units 11–20 before treating the level as complete.
- All scenarios, messages, prices and commercial conditions are original and fictional. Travel, rental and service examples teach interpretation and correspondence rather than presenting live conditions or professional advice.
- This is a text curriculum with no audio, speaking or external proficiency certification. Reading/writing progress does not establish full B1 competence in untested skills.
- The alignment references are the IDs supplied by the brief; no copyrighted textbook wording was copied and no independent browsing was performed.
- The material received structural validation and a language/editorial pass, not independent native-speaker certification. Productive writing still benefits from qualified human feedback.

No app code, shared schema, package files, other levels or git commits were changed.

## Review correction round 1 — units 01–10

Read the full independent review in `docs/briefs/academy-B1-review.md` and checked the finite-match implementation in `lib/course/engine.ts`. Saved the required pre-correction backup at `/tmp/academy-B1-pre-review-fix.json`.

Corrected all ten flagged gap items while preserving IDs:

- Added an explicit imperfect instruction to `ACA.B1.01.e1`, the lemma `a dura` to `ACA.B1.02.e3`, a present-tense requirement to `ACA.B1.04.check.e2`, and the intended Russian meaning “в котором” to `ACA.B1.05.e2`.
- Accepted `spre/către/înspre/la` in `ACA.B1.07.e1`, `unde/la care` in `ACA.B1.07.e3`, and present/future consequences in `ACA.B1.08.e3` and `ACA.B1.10.check.e2`.
- Accepted four equivalent causal conjunctions in `ACA.B1.09.e3` and both `numai/doar` in `ACA.B1.10.e3`. Explanations now account for accepted alternatives.

Corrected the unit 07 preposition mapping: `prin parc` is “через парк”, `pe lângă parc` is “мимо парка”; added two bilingual contrast examples and explained that `la` can mark a destination. Replaced unit 02’s misleading pitfall with the genuine third-person contrast `ca să învață` → `ca să învețe` and prepared it in theory and a bilingual example. Replaced “часто” in unit 05’s finite relative-object clitic rule with the required construction, explained `îl/o`, and added a feminine example. Unit 07’s writing model now includes a tram-to-bus transfer, its location and the onward direction; its annotation identifies that transfer.

Revalidated changed material and preserved constraints:

- All unit, reading, question, exercise and writing IDs unchanged; goal/prerequisite arrays unchanged.
- Unit 07 model: 150 words, within 130–180. All ten models and all twenty unchanged reading lengths remain within the brief’s ranges.
- All unit collection counts, choice-answer membership and order-token multisets pass. Theory still exceeds 180 genuinely Cyrillic explanatory tokens per unit; affected unit theory totals remain within 225–234 where expanded.
- Bilingual theory examples now total 64, after four targeted preparatory additions.
- Exercised the real `grade()` function: all 20 intended answers across the ten changed items accepted; four out-of-cue answers correctly rejected for revised tense/lemma/meaning prompts.
- Repository validator has no assigned B1 content errors; only expected integration message `B1: expected 20, got 10` remains before root appends part 2.

This round changes only the first-ten-unit B1 content and this report. It does not claim that independent review has approved the corrections; the batch is ready for scoped re-review.

## Review correction round 2 — explicit present-tense scope

Closed the residual future-form ambiguity in `ACA.B1.08.e3` and `ACA.B1.10.check.e2`. Both prompts now explicitly request present tense (`prezent`) with the supplied lemma and `noi`; their finite answer sets are solely `putem` and `evităm`. Revised hints reinforce the requested tense, and explanations distinguish a valid future construction from an answer outside this controlled present-tense task. They do not present future Romanian as ungrammatical.

Backup: `/tmp/academy-B1-pre-round2.json`. Verification against the actual `grade()` function accepted the requested present forms and rejected six future realizations across the two items because they do not meet the requested tense. A deep structural comparison proved that exactly these two exercise objects changed; IDs, choices, readings, models and all other content are unchanged, so previously validated lengths are preserved. Repository validation again reports only the pending B1 unit count before part 2 integration. Ready for scoped re-review.
