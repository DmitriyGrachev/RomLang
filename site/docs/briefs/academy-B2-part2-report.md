# B2 continuation author report: units 12–22

Authored `content/academy/B2-part2.json` only; the main B2 array was not changed. All scenarios, prose, reading passages and exercise content are original and fictional. No textbook text or web material was copied.

## Scope and counts

- 11 units, ordered ACA.B2.12–ACA.B2.22, with prerequisites pointing to the preceding B2 unit.
- Each unit: 3 substantive theory sections with 2 translated examples each; 3 corrected pitfalls; 12 contextual vocabulary cards; 2 readings of different genres; 4 glossary entries and 3 comprehension questions per reading; 8 practice items; 4 checkpoint items; 1 complete writing task.
- Total: 33 theory sections, 66 theory examples, 33 pitfalls, 132 cards, 22 readings, 88 glossary entries, 66 comprehension questions, 88 practice items, 44 checkpoint items, 11 writing models.
- Each practice set has 5 non-choice written responses (3 gaps and 2 ordering items). Checkpoints use new facts/contexts and have 2 written responses each.

Theory counts below count Cyrillic words only, excluding embedded Romanian terminology. Reading/model counts use whitespace-delimited words.

| Unit | Russian theory words | Reading words r1 / r2 | Model words |
| --- | ---: | ---: | ---: |
| ACA.B2.12 | 206 | 349 / 336 | 188 |
| ACA.B2.13 | 196 | 348 / 350 | 199 |
| ACA.B2.14 | 211 | 348 / 341 | 187 |
| ACA.B2.15 | 206 | 353 / 345 | 187 |
| ACA.B2.16 | 201 | 350 / 343 | 188 |
| ACA.B2.17 | 201 | 352 / 353 | 191 |
| ACA.B2.18 | 198 | 354 / 340 | 185 |
| ACA.B2.19 | 210 | 350 / 351 | 189 |
| ACA.B2.20 | 240 | 342 / 350 | 195 |
| ACA.B2.21 | 225 | 359 / 352 | 189 |
| ACA.B2.22 | 243 | 335 / 355 | 190 |

## Validation performed

A local Python validator parsed the output and checked all required fields, unit order, prerequisites, 5 goals per unit, 3 sections, examples, Cyrillic theory counts >=180, all reading ranges 320–480, all models 180–240, prepared word answers containing the headword, reading glossary/question counts, practice/checkpoint counts, minimum written-response count, exact ID patterns, global exercise ID uniqueness, accepted answers present among choices, and order-token multisets matching accepted grammatical sentences. Result: PASS, 11 units, 198 unique exercise IDs (reading + practice + checkpoint). Model lengths range 185–199 words; readings range 335–359 words.

Manually checked gap prompts for avoidable ambiguity: ambiguous attribution gaps now specify `potrivit`; conditional/concessive gaps specify meaning and one-word constraints; modal person is explicit; vocabulary gaps specify intended meaning or lemma. No unrestricted causal-conjunction gaps are used. Correct choice positions vary. The reading passages prepare vocabulary without revealing comprehension answers.

## Written-only adaptation and limitations

Units 12–20 retain all five supplied topic goals. Unit 21 explicitly replaces audio comprehension with reading a fictional discussion transcript, tracks changed written positions, compares transcript and report, prepares a written synthesis and answers an unexpected written follow-up. Unit 22 replaces an unfamiliar recording with an unfamiliar written dialogue and spontaneous oral discussion with a changed-condition written response. Their goal lists and theory explicitly describe these adaptations. All ExerciseItems use grammar/reading skills; none use listening. No audio playback, recording, oral production or pronunciation task is assigned.

The final units do not claim that text exercises establish listening or speaking competence, an official B2 result or a certificate. Unit 22 retains portfolio work and independent/qualified assessment as a learning-planning goal. Extended writing requires meaningful human assessment; four task-specific dimensions are provided, but automatic checks cannot assess complete argument quality.

Media, science/data, technology and ecology passages teach language and reasoning through fictional information. They avoid presenting invented observations as real empirical claims. Cultural discussion avoids nationality-based explanations. Writing tasks use new constraints and explicit transfer tasks; grammatical correctness alone is not treated as sufficient task fulfilment.

No app code, shared schemas, other level files or commits were created or modified by this author.

## Review correction round 1/5 — second half only

Applied the findings from `academy-B2-review.md` to ACA.B2.12–22. The pre-correction JSON is preserved at `/tmp/academy-B2-part2-pre-review-fix.json`. This addendum supersedes affected counts in the original table above. No first-half content, app code, other reports or commits were changed.

- R2: all seven named lexical gaps now identify the lemma or an explicit stem; no new unrestricted synonym gap was introduced.
- R3: approximation distinguishes non-directional `aproximativ`/`circa` from quantitative `aproape`, and names `peste`/`sub` for explicit direction.
- R4: B2.12 now compares training with complete replacement of the form, including design/testing/explanation, while preserving the limited explanatory-message compromise.
- R6: audited every one of the 121 choice sets (33 practice, 22 checkpoint, 66 reading). Replaced distractors in all 121 with grammatical, topical alternatives based on scope, timing, attribution, role, discourse function, unit, evidence or an unjustified inference. Narrowed semantic prompts where needed to state the target relation or scenario. Correct keys and their positions are unchanged. No reading key changed.
- R7: B2.19 transfer includes fictional factual notes and two contrasting opinions; B2.20 supplies complete book-exchange notes, deadlines and status; B2.21 includes the reviewer's bounded exhibition discussion/report pair and new cancellation condition.
- Lower-priority second-half corrections: B2.15 model describes the increase in the count of clarification cases rather than measured workload; B2.21 reading uses `nu coincide cu cea`; B2.21 model describes initial support rather than an exclusive preference.
- Approved task-specific rubrics for B2.13–22 are preserved byte-for-byte as parsed JSON values. All five goals and written-only adaptations remain unchanged.

### Verification evidence

Read-only Python checks passed: JSON parse; 11 ordered unit IDs and prerequisites; 198 globally unique exercise IDs; section/example/card/reading/practice/checkpoint counts; >=180 Cyrillic theory words per unit; reading/model bounds; synchronized repeated reading text; exactly three unique options and exactly one keyed option per choice set; unchanged accepted choice answers and positions; order-token multisets; lemma/stem restrictions for all seven R2 gaps; R3 replacement; form-vs-application model correction; count-not-workload language; B2.21 wording; concrete inputs for all three transfers; preserved approved rubrics; removed the cited nonsense options. All 121 sets also received semantic desk review: alternatives test a specified relation or evidence-supported interpretation rather than merely grammatical well-formedness.

Updated affected counts:

| Field | Words after correction |
| --- | ---: |
| ACA.B2.12.write.model | 193 |
| ACA.B2.15 Russian theory | 220 |
| ACA.B2.15.write.model | 189 |
| ACA.B2.21.r2.text | 354 |
| ACA.B2.21.write.model | 188 |

All readings remain 335–359 words; all writing models remain 185–199 words. No additional audio or oral task was introduced. These checks establish content/schema compliance; they do not constitute external certification or native-speaker assessment.

### Exact changed exercise IDs

- `ACA.B2.12.e1`, `ACA.B2.12.e5`, `ACA.B2.12.e7`, `ACA.B2.12.check.e1`, `ACA.B2.12.check.e4`, `ACA.B2.12.r1.e1`, `ACA.B2.12.r1.e2`, `ACA.B2.12.r1.e3`, `ACA.B2.12.r2.e1`, `ACA.B2.12.r2.e2`, `ACA.B2.12.r2.e3`.
- `ACA.B2.13.e1`, `ACA.B2.13.e5`, `ACA.B2.13.e7`, `ACA.B2.13.check.e2`, `ACA.B2.13.check.e4`, `ACA.B2.13.r1.e1`, `ACA.B2.13.r1.e2`, `ACA.B2.13.r1.e3`, `ACA.B2.13.r2.e1`, `ACA.B2.13.r2.e2`, `ACA.B2.13.r2.e3`.
- `ACA.B2.14.e1`, `ACA.B2.14.e5`, `ACA.B2.14.e7`, `ACA.B2.14.check.e1`, `ACA.B2.14.check.e3`, `ACA.B2.14.check.e4`, `ACA.B2.14.r1.e1`, `ACA.B2.14.r1.e2`, `ACA.B2.14.r1.e3`, `ACA.B2.14.r2.e1`, `ACA.B2.14.r2.e2`, `ACA.B2.14.r2.e3`.
- `ACA.B2.15.e1`, `ACA.B2.15.e5`, `ACA.B2.15.e7`, `ACA.B2.15.check.e2`, `ACA.B2.15.check.e4`, `ACA.B2.15.r1.e1`, `ACA.B2.15.r1.e2`, `ACA.B2.15.r1.e3`, `ACA.B2.15.r2.e1`, `ACA.B2.15.r2.e2`, `ACA.B2.15.r2.e3`.
- `ACA.B2.16.e1`, `ACA.B2.16.e5`, `ACA.B2.16.e7`, `ACA.B2.16.check.e2`, `ACA.B2.16.check.e3`, `ACA.B2.16.check.e4`, `ACA.B2.16.r1.e1`, `ACA.B2.16.r1.e2`, `ACA.B2.16.r1.e3`, `ACA.B2.16.r2.e1`, `ACA.B2.16.r2.e2`, `ACA.B2.16.r2.e3`.
- `ACA.B2.17.e1`, `ACA.B2.17.e5`, `ACA.B2.17.e7`, `ACA.B2.17.check.e1`, `ACA.B2.17.check.e2`, `ACA.B2.17.check.e4`, `ACA.B2.17.r1.e1`, `ACA.B2.17.r1.e2`, `ACA.B2.17.r1.e3`, `ACA.B2.17.r2.e1`, `ACA.B2.17.r2.e2`, `ACA.B2.17.r2.e3`.
- `ACA.B2.18.e1`, `ACA.B2.18.e5`, `ACA.B2.18.e7`, `ACA.B2.18.check.e2`, `ACA.B2.18.check.e4`, `ACA.B2.18.r1.e1`, `ACA.B2.18.r1.e2`, `ACA.B2.18.r1.e3`, `ACA.B2.18.r2.e1`, `ACA.B2.18.r2.e2`, `ACA.B2.18.r2.e3`.
- `ACA.B2.19.e1`, `ACA.B2.19.e5`, `ACA.B2.19.e7`, `ACA.B2.19.check.e1`, `ACA.B2.19.check.e2`, `ACA.B2.19.check.e4`, `ACA.B2.19.r1.e1`, `ACA.B2.19.r1.e2`, `ACA.B2.19.r1.e3`, `ACA.B2.19.r2.e1`, `ACA.B2.19.r2.e2`, `ACA.B2.19.r2.e3`.
- `ACA.B2.20.e1`, `ACA.B2.20.e2`, `ACA.B2.20.e5`, `ACA.B2.20.e6`, `ACA.B2.20.e7`, `ACA.B2.20.check.e2`, `ACA.B2.20.check.e3`, `ACA.B2.20.check.e4`, `ACA.B2.20.r1.e1`, `ACA.B2.20.r1.e2`, `ACA.B2.20.r1.e3`, `ACA.B2.20.r2.e1`, `ACA.B2.20.r2.e2`, `ACA.B2.20.r2.e3`.
- `ACA.B2.21.e1`, `ACA.B2.21.e5`, `ACA.B2.21.e7`, `ACA.B2.21.check.e2`, `ACA.B2.21.check.e4`, `ACA.B2.21.r1.e1`, `ACA.B2.21.r1.e2`, `ACA.B2.21.r1.e3`, `ACA.B2.21.r2.e1`, `ACA.B2.21.r2.e2`, `ACA.B2.21.r2.e3`.
- `ACA.B2.22.e1`, `ACA.B2.22.e5`, `ACA.B2.22.e7`, `ACA.B2.22.check.e1`, `ACA.B2.22.check.e4`, `ACA.B2.22.r1.e1`, `ACA.B2.22.r1.e2`, `ACA.B2.22.r1.e3`, `ACA.B2.22.r2.e1`, `ACA.B2.22.r2.e2`, `ACA.B2.22.r2.e3`.

### Other exact changed field paths

- `ACA.B2.12.write.model`.
- `ACA.B2.15.sections[0].body`.
- `ACA.B2.15.write.model`.
- `ACA.B2.19.write.transferPrompt`.
- `ACA.B2.20.write.transferPrompt`.
- `ACA.B2.21.write.model`.
- `ACA.B2.21.write.transferPrompt`.
- `ACA.B2.21.r2.text`.

The B2.21 reading passage is also repeated in its three reading ExerciseItem `text` fields; those synchronized copies are included in the exercise IDs above.

Integration: all22 reviewed units merged into content/academy/B2.json; temporary part file removed. Applied reviewer exact two nonblocking copyedits: B2.06 rubric «Оба исходных предпочтения»; B2.20.r1.e2 distractor «Ele confirmă». No key changes.
