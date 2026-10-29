# A1 content author report

Completed `content/academy/A1.json`: all 16 required units, in the topic brief's order, with all 80 goals retained verbatim. Only A1 content and this report were changed. No app edits or commits.

## Counts

| Component | Total |
| --- | ---: |
| Units | 16 |
| Theory sections | 48 |
| Romanian/Russian theory examples | 96 |
| Corrected pitfalls | 48 |
| Contextual word/phrase cards | 192 |
| Original Romanian readings | 32 |
| Reading glossary phrases | 128 |
| Reading comprehension questions | 96 |
| Practice exercises | 128 |
| Checkpoint exercises | 64 |
| Writing tasks and full models | 16 |
| Writing annotations | 48 |
| Writing rubric criteria | 64 |
| Revision focus items | 48 |

Each unit has 3 theory sections, 2 translated examples per section, 3 pitfalls, 12 cards, 2 readings with 4 glosses and 3 questions each, 8 practice exercises, 4 checkpoints, and 1 writing task. Every practice set has at least 3 non-choice responses. Each writing task has 3 plan steps, 3 annotations, 4 rubric criteria, 3 revision targets and a changed transfer prompt.

## Measured limits

Theory counts below include only Cyrillic Russian word sequences, excluding Romanian paradigm examples embedded in the explanations. Readings/models use whitespace-delimited words.

| Unit | Russian theory words | Reading 1 / 2 | Model |
| --- | ---: | ---: | ---: |
| ACA.A1.01 | 214 | 67 / 70 | 36 |
| ACA.A1.02 | 186 | 69 / 69 | 37 |
| ACA.A1.03 | 198 | 65 / 68 | 38 |
| ACA.A1.04 | 208 | 69 / 71 | 37 |
| ACA.A1.05 | 218 | 69 / 69 | 39 |
| ACA.A1.06 | 187 | 71 / 68 | 39 |
| ACA.A1.07 | 214 | 71 / 70 | 39 |
| ACA.A1.08 | 198 | 69 / 71 | 38 |
| ACA.A1.09 | 209 | 70 / 71 | 37 |
| ACA.A1.10 | 201 | 74 / 70 | 38 |
| ACA.A1.11 | 218 | 72 / 69 | 39 |
| ACA.A1.12 | 205 | 71 / 69 | 40 |
| ACA.A1.13 | 227 | 71 / 70 | 39 |
| ACA.A1.14 | 215 | 71 / 67 | 39 |
| ACA.A1.15 | 204 | 70 / 68 | 40 |
| ACA.A1.16 | 226 | 69 / 71 | 41 |

## Validation performed

Python parsed the final JSON and asserted all required array sizes and fields, sequential unit IDs, preceding-unit prerequisites, 5 goals per unit, reading/question IDs, writing IDs, unique exercise IDs, theory minimum, 65–110-word readings, and 30–60-word models. All passed.

Every word card contains its Romanian headword in `answers`, inflection/form information, and an original translated contextual example. Every reading question uses `type: read`, `skill: reading`, a finite accepted answer, text-specific explanation, and the full reading text. Exercise/checkpoint choice answers are unique members of their option sets; correct positions vary (17 first, 31 second, 16 third). All order exercises have precisely the tokens needed for their grammatical accepted answer; authored token arrays remain shuffled as the current UI does not shuffle them. Written gap answers are single forms/phrases with a constrained prompt, not open-ended auto-marked compositions. No listening or speaking exercises were introduced.

Manual pass checked forms and distinctions including `sunt în` (current location) versus `locuiesc în` (residence), `doare/dor`, `place/plac`, noun/adjective agreement, `pot + infinitive` versus `vreau să`, and perfect-compus auxiliaries. A mixed-script glossary typo was corrected. Price and change computations were checked in shopping readings and exercises.

## Pedagogical limitations and concerns

All texts, scenarios, examples and tasks are original. Source IDs are alignment references (`cefr`, `ubb-description`, `rolang`, `myro`), not copied source content or claims of external review. No browsing or textbook copying was used.

This is a text-only A1 curriculum. It cannot establish pronunciation, listening, speaking, fluency or external certification readiness. The final unit is an introduction to a small set of perfect-compus and future forms, not mastery of the tense systems. Paradigm forms beyond the main productive targets appear for recognition. Some readings intentionally contain a small amount of new contextual vocabulary with a four-item glossary; they are not fully vocabulary-controlled graded readers. New irregular forms are glossed where needed.

Writing tasks require human/self assessment with their rubrics; models are examples, not uniquely acceptable submissions. Automatically checked questions constrain the wording to keep accepted answer sets finite. Medical scenarios teach state-reporting, booking and clarification only, with no diagnosis or treatment advice. Transport, lodging and contact details are fictional; they are language examples rather than real schedules or service information. No blocking unresolved structural issue remains; a qualified Romanian teacher's review remains desirable before representing this as a formally approved course.

## Independent review correction round 1

Addressed all five findings from `docs/briefs/academy-A1-review.md`:

- `ACA.A1.06.e3`: prompt now specifies “I wake up at six”; options and key retained. Explanation distinguishes “they wake up” and “you wake me up” rather than implying either distractor is ungrammatical.
- `ACA.A1.01.check.e3`: explicit Russian origin cue now constrains the preposition to `din`.
- `ACA.A1.05.check.e3`: added subject `Baia`, making third-person `are` uniquely required; explanation now refers to the visible subject.
- `ACA.A1.04`: spatial theory now distinguishes two individually named landmarks joined with `și` from a plural group such as `între scaune`. Updated Russian-only theory count is **221**; the earlier count table's 208 describes the prereview version.
- `ACA.A1.07.e6`: prompt explicitly requests the taught indefinite article `niște`, distinguishing it from lexical quantity alternatives.
- `ACA.A1.16.e7`: accepts both `dar` and `însă`; explanation acknowledges the valid synonym while identifying the unit's productive target.

Parsed final JSON and reran A1 structure/count, goal/prerequisite/ID, reading/model length, minimum Russian-theory length, finite choice uniqueness and order-token multiset validation: all passed. Specific assertions confirm every corrected prompt/key/theory phrase. Compared against `/tmp/academy-A1-pre-review-fix.json`: exactly 10 fields across these six locations changed; all IDs and unrelated content were preserved. No other files or app code changed and no commits made.
