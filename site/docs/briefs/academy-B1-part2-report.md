# B1 units 11–20 author report

Completed ten original units in `content/academy/B1-part2.json`, ordered ACA.B1.11–ACA.B1.20. Every unit preserves all five supplied goals and points to the preceding unit, including ACA.B1.10 as the first prerequisite.

All scenarios, reading passages, examples, questions and models are original. Job interviews, feedback, clarification and interaction are written exchanges; no audio or speaking task is required. Fictional health, news, technology and community scenarios do not make professional or real-world claims.

## Exact length checks

Russian theory counts below include Cyrillic words in section bodies only, excluding titles, examples and Roman-letter grammatical terms. Romanian text counts use whitespace-separated words.

| Unit | Russian theory | Reading 1 | Reading 2 | Writing model |
|---|---:|---:|---:|---:|
| ACA.B1.11 | 191 | 238 | 250 | 145 |
| ACA.B1.12 | 183 | 236 | 239 | 147 |
| ACA.B1.13 | 188 | 254 | 248 | 150 |
| ACA.B1.14 | 187 | 252 | 252 | 149 |
| ACA.B1.15 | 201 | 250 | 247 | 146 |
| ACA.B1.16 | 199 | 244 | 247 | 148 |
| ACA.B1.17 | 190 | 247 | 253 | 144 |
| ACA.B1.18 | 214 | 253 | 251 | 145 |
| ACA.B1.19 | 216 | 255 | 248 | 147 |
| ACA.B1.20 | 227 | 259 | 254 | 155 |

## Structural and editorial verification

- 10 units; 30 substantive theory sections, each with 2 bilingual examples; 30 corrected pitfalls.
- 120 contextual word cards, all with Romanian answer, forms and bilingual example.
- 20 readings, each 220–320 words, with 4 glossary entries and 3 understanding questions: 60 questions total. Each question uses `type: read`, `skill: reading`, choices and its full text context.
- 80 practice items, each unit with at least 3 gap/order items; 40 changed checkpoint items. All IDs unique and sequential. Choice answers are members of distinct choices. Correct choice positions vary.
- Every order item has exactly the multiset of tokens in its accepted sentence. Open gaps specify construction, lemma, tense, meaning or a target connector where alternatives could otherwise be marked wrong.
- 10 writing tasks: target [130,180], original models in range, 4-step plans, 3 annotations, 4 criteria, 3 revision focuses, changed transfer prompts.
- Source IDs are alignment references (`cefr`, `ubb-description`, `ecl`), not claims of copied source text.

Validation was run against JSON parsing, exact counts, word bounds, prerequisite order, choice membership, unique IDs, answer tokens and reading context. A targeted editorial pass fixed two short theory counts, disambiguated connector gaps, removed one mixed-language example prefix, and clarified the entrance reference in unit 19's writing model.

## Pedagogical limitations

These units train reading and controlled written interaction at B1. Automated items have finite expected answers and do not grade an unrestricted paraphrase. Writing rubrics require human or reflective use; the models are examples, not proof that a learner can independently perform the task. Unit 20 asks for an initial attempt before model comparison and a second attempt with changed facts to check transfer.


## Independent review correction, round 1 of 5

Read `docs/briefs/academy-B1-part2-review.md` and saved the pre-edit JSON to `/tmp/academy-B1-part2-pre-review-fix.json`.

Constrained the four finite gaps explicitly: ACA.B1.14.e2 (`acum`), ACA.B1.16.e6 (`încă`), ACA.B1.18.e6 and ACA.B1.19.e2 (`de aceea`). Their answer keys are unchanged.

Audited every one of the 120 items with options: 40 practice choices, 20 checkpoint choices, 60 reading questions. Replaced 233 distractor strings across 119 items; retained original correct answers and their positions throughout. All wrong options now use relevant grammatical contrasts, plausible mistaken facts from the passage, or nearby communicative purposes. Tightened 44 item prompts (including the four gaps) where nearer options required explicit facts, the intended form, or the exact communicative criterion.

Choice audit/edited IDs: ACA.B1.11.check.e3, ACA.B1.11.check.e4, ACA.B1.11.e4, ACA.B1.11.e5, ACA.B1.11.e6, ACA.B1.11.e8, ACA.B1.11.r1.e1, ACA.B1.11.r1.e2, ACA.B1.11.r1.e3, ACA.B1.11.r2.e1, ACA.B1.11.r2.e2, ACA.B1.11.r2.e3, ACA.B1.12.check.e3, ACA.B1.12.check.e4, ACA.B1.12.e4, ACA.B1.12.e5, ACA.B1.12.e7, ACA.B1.12.e8, ACA.B1.12.r1.e1, ACA.B1.12.r1.e2, ACA.B1.12.r1.e3, ACA.B1.12.r2.e1, ACA.B1.12.r2.e2, ACA.B1.12.r2.e3, ACA.B1.13.check.e2, ACA.B1.13.check.e4, ACA.B1.13.e4, ACA.B1.13.e5, ACA.B1.13.e7, ACA.B1.13.e8, ACA.B1.13.r1.e1, ACA.B1.13.r1.e2, ACA.B1.13.r1.e3, ACA.B1.13.r2.e1, ACA.B1.13.r2.e2, ACA.B1.13.r2.e3, ACA.B1.14.check.e2, ACA.B1.14.check.e4, ACA.B1.14.e4, ACA.B1.14.e5, ACA.B1.14.e7, ACA.B1.14.e8, ACA.B1.14.r1.e1, ACA.B1.14.r1.e2, ACA.B1.14.r1.e3, ACA.B1.14.r2.e1, ACA.B1.14.r2.e2, ACA.B1.14.r2.e3, ACA.B1.15.check.e2, ACA.B1.15.check.e4, ACA.B1.15.e4, ACA.B1.15.e5, ACA.B1.15.e7, ACA.B1.15.e8, ACA.B1.15.r1.e1, ACA.B1.15.r1.e2, ACA.B1.15.r1.e3, ACA.B1.15.r2.e1, ACA.B1.15.r2.e2, ACA.B1.15.r2.e3, ACA.B1.16.check.e3, ACA.B1.16.check.e4, ACA.B1.16.e4, ACA.B1.16.e5, ACA.B1.16.e7, ACA.B1.16.e8, ACA.B1.16.r1.e1, ACA.B1.16.r1.e2, ACA.B1.16.r1.e3, ACA.B1.16.r2.e1, ACA.B1.16.r2.e2, ACA.B1.16.r2.e3, ACA.B1.17.check.e3, ACA.B1.17.check.e4, ACA.B1.17.e4, ACA.B1.17.e5, ACA.B1.17.e7, ACA.B1.17.e8, ACA.B1.17.r1.e1, ACA.B1.17.r1.e2, ACA.B1.17.r1.e3, ACA.B1.17.r2.e1, ACA.B1.17.r2.e2, ACA.B1.17.r2.e3, ACA.B1.18.check.e3, ACA.B1.18.check.e4, ACA.B1.18.e4, ACA.B1.18.e5, ACA.B1.18.e7, ACA.B1.18.e8, ACA.B1.18.r1.e1, ACA.B1.18.r1.e2, ACA.B1.18.r1.e3, ACA.B1.18.r2.e1, ACA.B1.18.r2.e2, ACA.B1.18.r2.e3, ACA.B1.19.check.e3, ACA.B1.19.check.e4, ACA.B1.19.e4, ACA.B1.19.e5, ACA.B1.19.e7, ACA.B1.19.e8, ACA.B1.19.r1.e1, ACA.B1.19.r1.e2, ACA.B1.19.r1.e3, ACA.B1.19.r2.e1, ACA.B1.19.r2.e2, ACA.B1.19.r2.e3, ACA.B1.20.check.e3, ACA.B1.20.check.e4, ACA.B1.20.e4, ACA.B1.20.e5, ACA.B1.20.e7, ACA.B1.20.e8, ACA.B1.20.r1.e1, ACA.B1.20.r1.e2, ACA.B1.20.r1.e3, ACA.B1.20.r2.e1, ACA.B1.20.r2.e2, ACA.B1.20.r2.e3

Changed exercise prompt IDs: ACA.B1.11.check.e3, ACA.B1.11.check.e4, ACA.B1.11.e4, ACA.B1.11.e5, ACA.B1.11.e6, ACA.B1.11.e8, ACA.B1.12.check.e3, ACA.B1.12.check.e4, ACA.B1.12.e5, ACA.B1.12.e7, ACA.B1.12.e8, ACA.B1.13.check.e2, ACA.B1.13.e4, ACA.B1.13.e7, ACA.B1.14.check.e2, ACA.B1.14.e2, ACA.B1.14.e4, ACA.B1.14.e5, ACA.B1.14.e7, ACA.B1.14.e8, ACA.B1.15.e8, ACA.B1.16.check.e3, ACA.B1.16.e4, ACA.B1.16.e5, ACA.B1.16.e6, ACA.B1.16.e7, ACA.B1.16.e8, ACA.B1.17.check.e3, ACA.B1.17.e4, ACA.B1.17.e5, ACA.B1.17.e7, ACA.B1.17.e8, ACA.B1.18.check.e4, ACA.B1.18.e4, ACA.B1.18.e5, ACA.B1.18.e6, ACA.B1.18.e7, ACA.B1.18.e8, ACA.B1.19.check.e4, ACA.B1.19.e2, ACA.B1.19.e4, ACA.B1.19.e8, ACA.B1.20.check.e4, ACA.B1.20.e5

Writing changes: ACA.B1.12.write gives Vlad a Wednesday-noon deadline while preserving his dependency on Elena; ACA.B1.15.write supplies a compact source for both main and transfer tasks and its model now identifies Tuesdays/Thursdays; ACA.B1.19.write removes the unsupported privacy promise and adds the response method, closed main entrance and entrance sign to the supplied notes. The latter model introduces no new organizational commitment. ACA.B1.13 theory now glosses `mai potrivit decât` as «более подходящий, чем».

Post-edit validation: valid JSON; same 10 units, 180 exercise IDs, 120 cards and all expected IDs/keys; all choice lists have 3 distinct options including the unchanged key; key positions unchanged; order-token multisets unchanged; every reading question keeps its complete text. Theory remains ≥180 Cyrillic words per unit and all readings remain 220–320 words. Changed model lengths: unit 12 151, unit 15 147, unit 19 155 words, all within 130–180. No commits or other repository files changed.

Final read-through: unit 15 model now retains the planned status through `ar urma să` / `planul este ca` and does not invent a reader interview. A script confirmed every option list uses a consistent language, so distractor language cannot reveal its key.

Integration: reviewed units 11–20 merged unchanged into content/academy/B1.json; temporary B1-part2.json removed.
