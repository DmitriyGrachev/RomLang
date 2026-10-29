# B2 content author report: units 01–11

## Scope

Authored `content/academy/B2.json`, containing `ACA.B2.01` through `ACA.B2.11` in the assigned topic order. This report covers those 11 units only; units 12–22 are being authored separately for the root agent to merge. No app code, shared types, other levels, or dependencies were changed. No commits were made.

Each unit retains the five topic outcomes, with the following explicit adaptation to the requested written format in unit 06:

| Original outcome | Delivered outcome |
| --- | --- |
| Вступить в обсуждение | Вступить в письменное обсуждение |
| Удержать и передать слово | Удержать тему и передать ход другому участнику письменно |

The other discussion, interview, clarification and mediation outcomes are realised through original forum messages, written interviews, correspondence and written agreements. There are no audio, listening or speaking exercises, recordings, or mandatory oral tasks.

## Counts

| Component | Count |
| --- | ---: |
| Units | 11 |
| Substantive theory sections | 33 |
| Romanian/Russian theory example pairs | 66 |
| Explained pitfalls | 33 |
| Contextual vocabulary/phrase cards | 132 |
| Original readings | 22 |
| Reading glossary pairs | 88 |
| Reading comprehension questions | 66 |
| Main practice exercises | 88 |
| Non-choice main practice exercises | 44 |
| Checkpoint exercises | 44 |
| Writing tasks and complete models | 11 |
| Unique graded exercise IDs across all banks | 198 |

Each unit has 3 theory sections, 3 pitfalls, 12 cards, 2 readings with 4 glossary phrases and 3 questions each, 8 practice exercises, 4 checkpoint exercises, and one writing task with four plan steps, three annotations, four rubric criteria and three revision targets. Main practice mixes choices, three gaps and a sentence order task. Checkpoints use separate facts or contexts and do not depend on completing a reading.

## Word-limit verification

Russian explanation counts below count Cyrillic words in section bodies only: embedded Romanian forms and the Romanian/Russian example pairs are excluded. Reading and model counts use whitespace-delimited words consistently with the editorial brief. No reading falls close enough to the maximum to create tokenisation concerns.

| Unit | Russian explanation words | Reading 1 words | Reading 2 words | Writing model words |
| --- | ---: | ---: | ---: | ---: |
| ACA.B2.01 | 202 | 335 | 324 | 193 |
| ACA.B2.02 | 197 | 343 | 345 | 203 |
| ACA.B2.03 | 203 | 325 | 342 | 200 |
| ACA.B2.04 | 214 | 322 | 323 | 195 |
| ACA.B2.05 | 223 | 339 | 335 | 192 |
| ACA.B2.06 | 215 | 342 | 343 | 200 |
| ACA.B2.07 | 219 | 322 | 332 | 196 |
| ACA.B2.08 | 218 | 324 | 323 | 199 |
| ACA.B2.09 | 219 | 338 | 334 | 186 |
| ACA.B2.10 | 219 | 321 | 335 | 195 |
| ACA.B2.11 | 197 | 329 | 326 | 199 |

## Validation performed

JSON parsing and a purpose-built read-only structural validator passed after the final edits. Checks covered sequential IDs and prerequisites; required section/card/reading/exercise counts; five outcomes per unit; Russian explanatory word minimum; both reading lengths; model target ranges; writing plan/annotation/rubric/revision counts; card answers containing the displayed Romanian entry; all exercise answer arrays; accepted answers appearing in unique choice options; no listening skill values; and exact token multisets for sentence-order answers. Romanian reading texts were checked for accidentally retained Cyrillic text.

Every gap was reviewed for otherwise valid alternatives. Prompts now specify the intended lemma, tense, meaning or construction where a free gap could admit another grammatical completion. Examples include conditional perfect versus future anterior, the expected-event construction with `a urma`, the next-day ordinal, the viewpoint phrase, and specific causal/adversative links. Correct choice positions vary.

Readings vary by genre within each unit: analysis, letters, case reconstructions, a literary fragment, written interview, forum exchange, minutes and a personal comparison note. Questions include inference, source limitations, cohesion, paragraph function and communicative purpose as well as textual detail. Writing models are complete original texts with arguments, concrete examples, qualifications and genre-appropriate openings and endings.

## Pedagogical limitations and review points

- This contribution develops and samples B2 reading, written interaction, grammar and writing. It does not establish a learner's overall CEFR level; external qualified assessment is separate from these self-check exercises.
- The objective banks intentionally constrain answers. They test recognition and controlled production; writing rubrics support reflection but require human feedback for reliable assessment of argument quality and register.
- The explanation of `perfect simplu` prioritises recognition in narrative and notes regional spoken use without prescribing one regional norm. Productive neutral retelling is supported through `perfect compus`.
- All people, projects, prices, routes and organisational conditions are fictional. Service complaints and neighbour mediation teach wording and attribution, without asserting real consumer rights, building requirements or binding professional procedures.
- `cefr`, `ubb-program` and `ecl` are alignment references selected from the researched brief. No browsing or copying of textbook passages was performed; all prose and exercises are original.
- An independent Romanian pedagogical/native-language copyedit remains useful before claiming institutionally reviewed material. No such external review is claimed here.

## Review fixes, round 1/5 — first half only

Applied the first-half findings from `docs/briefs/academy-B2-review.md` to units 01–11. Pre-edit backup: `/tmp/academy-B2-pre-review-fix.json`. Units 12–22 and their separate part file were not edited.

- **R1:** `ACA.B2.02.r1.e3` now asks why the report distinguishes timely delivery from failure to transmit information. It no longer incorrectly refers to the final paragraph. The original key and explanation remain applicable.
- **R4:** `ACA.B2.09.write.model` now identifies two prior uninformative responses: transfer to the warehouse and a general procedural answer. The unavailable-set branch explicitly accepts an equivalent set of cards, with dimensions and quantity confirmed before dispatch. It no longer asks the provider to invent the acceptable alternative.
- **R5:** Replaced all **44 rubric descriptions** across the **11 writing tasks** with unique, observable checks for the actual tasks. Unit 04 separately assesses sender/recipient/owner, both sides of relative possessive agreement, clitic combinations and the next action. Unit 09 separately assesses the two-answer chronology, promised/received contents, the unanswered question and an explicit acceptable alternative. The other units likewise use task-specific checks.
- **R6:** Audited **all 132 choice/read/check items** in this half. Changed distractors in **129 items**, replacing **254 distractor options**. The three unchanged pairs were already plausible alternatives: the two other named recipients in `04.r1.e1`, and concrete competing travel details in `10.r1.e2` and `10.r2.e1`. New distractors use nearby tense, case, scope, source, procedural-stage or discourse-function errors. **37 prompts** were changed, including the R1 reference fix, so grammatical alternatives do not create competing correct answers. **12 explanations** were aligned with the revised distinctions.
- **Lower-priority 1:** `ACA.B2.10.r2` now keeps the confirmed morning museum visit and treats the workshop as conditional. The competing approach is waiting for the workshop slot before fixing the afternoon plan; the former implausible direct-to-workshop morning alternative is removed.
- **Lower-priority 3:** `ACA.B2.05.write.model` now offers two actual alternatives: a Friday working version followed by a complete Monday version, or a short fully checked Friday document followed by a separate Monday supplement.

### Post-fix assertions and bounds

The structural/content validator passed again after the final edits. Counts remain 11 units, 22 readings, 132 cards, 88 practice items, 44 checkpoints, 66 reading questions and 11 writing tasks. No exercise IDs, reading IDs, prerequisite IDs, accepted-answer arrays or correct-choice positions changed. All 132 choice banks have three unique options and contain the original key; options within each bank use a consistent language. Sentence-order token checks and finite gap restrictions remain intact.

Targeted assertions confirmed the corrected R1 prompt, both prior responses in model 09, its concrete equivalent-set alternative, both distinct alternatives in model 05, the conditional workshop opening, removal of the direct-to-workshop wording and 44 distinct rubric descriptions. Full reading/model bounds passed: readings **321–355 words**, models **189–203 words** after this pass. Specifically, model 05 is **193 words**, model 09 **189 words**, and reading `10.r2` **355 words**. Russian explanatory counts and the other unchanged content limits still pass.

This is a focused editorial correction, not a new external proficiency certification or independent native-speaker review. No commits were made.
