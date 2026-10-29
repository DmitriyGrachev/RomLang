# A1 depth author report

Asset: `/workspace/sites/romana-militari/content/depth-A1.json`

## Scope and counts

- Six modules A1.7–A1.12 and 24 distinct lessons A1.25–A1.48.
- Each lesson has at least four translated examples, four sheet rows, three teaching notes, 12 original objective items spanning choice, gap, order and read, and a productive transfer model/checklist.
- 288 lesson objective items plus 48 cumulative checkpoint items (eight per module): 336 total. Types: 108 choice, 84 gap, 60 order, 84 read. Choice/read answers occupy positions 0/1/2 equally (64 each). Ordered tokens are shuffled and numerals are grouped with Romanian words.
- 110 contextual dictionary entries (18, 19, 19, 18, 18, 18 by module), each with stress, forms, two translated examples, productive phrase and explicit lesson owner. All appear in owner preparation.
- Six missions, each with two variants. Each variant has three successful turns plus an authored repair turn for an initial wrong choice. All node text and options, including distractors, have exact translated mission preparation.
- Russian core/detail/comparison explanations: 260–360 Russian words each after editorial expansion. Shared A1 passages: 43–55 Romanian words, three reading questions per lesson.

## Review and validation

- Ran `node scripts/validate-depth.mjs --level A1`: passes. This checks IDs, owners, prerequisites, word and passage floors, all support fields, dictionary mapping, mission paths and phrase coverage, choice constraints, unique item substances and order buildability.
- Reviewed all 72 lesson gaps for constrained targets; clarified possessive, month, room, routine and formal address prompts. Replaced quiz substances overlapping existing A1 or new checkpoints.
- Checked mission branching and explicit fictional constraints; all 12 variants offer a semantically meaningful wrong option with a repair path. No real prices, transit schedules, exchange rights or medical advice asserted.
- Spot corrected Romanian/semantic issues: age `de ani` scoped to taught 20–99, `cinema` forms no longer conflate lexemes, apartment/route vocabulary prepared, hotel and message times clarified, medical dialogues limited to language requests.

## Limitations for release review

- The structural validator is not a human native-speaker review. A separate Romanian language pass should inspect naturalness of the 12 missions, dictionary stress and two example sentences per entry, and whether every multiple-choice distractor is distinct under the exact scenario.
- The objective bank assesses reading and controlled written responses. It does not assess listening comprehension, pronunciation, or free speech, and these counts alone do not certify CEFR A1.
- Teaching passages are deliberately 43–55 words, near the lower end of the A1 target; they remain coherent short messages/scenes and serve three different reading questions each.
