# B2 depth authoring report

File: `/workspace/sites/romana-militari/content/depth-B2.json`

## Scope and counts

- Six new modules B2.7–B2.12; 24 lessons B2.25–B2.48.
- Each lesson has four distinct theory paragraphs plus core/comparison, four translated examples and sheet rows, 12 objective items (nine language decisions and three questions on an original reading), and a five-sentence productive model. Romanian readings are 160–175 words in the current validator count, within the B2 target.
- Six checkpoints, eight items each: four new cross-topic reading questions and four earlier B2 grammar applications in each. Six coherent, single-genre 171–177-word Romanian production models, with concrete audience, 170–200-word written prompts and oral follow-up.
- Six missions, two variants each; every variant has three successful main turns and a repair branch at every main turn. Every node and option has exact translated mission preparation.
- 114 distinct dictionary entries, 19/20/19/19/19/18 by new module. Each has a stressed lemma, useful forms, English and Russian glosses, two distinct contextual bilingual examples, productive sentence, and owner lesson/module. Contextual usage entries were manually authored; verb/adjective forms and concrete nouns manually checked. No legal outcome is asserted in service-claim lessons.

## Verification and limits

`node scripts/validate-depth.mjs --level B2` passes on the current file. Every B2 lesson has three grammar items from separate new authored applications whose full answer sentences are absent from preparation; the other six language items rehearse translated examples and components. The reading questions include one inference or claim-limit question per passage; direct retrieval items now use plausible near misses tied to agent, scope, time, or status. Lesson production models were rewritten as coherent five-sentence responses, and all six checkpoints have full models. All lesson sheet formulas and production checklists are topic-specific.

A structural count does not certify B2 proficiency. The work includes no audio or evaluation of spontaneous speech. The reader passages vary among neighborhood deliberation, service correspondence, project analysis, news/data note, review, comparison, and argument; several still use a narrative frame to support interpretation. An independent full semantic/answer-key pass found no open blocker at SHA-256 53153ca39dde2e99d26b1c49c0ee4fd31f4d42caf087669384a71aeab0a33c69. A separate lexicographic stress pass supplied 22 corrections from DOOM3/DOOM2/DEX; those stress-only corrections were applied and the validator rerun. Alternative two-word gap responses are accepted explicitly. Native-speaker idiom and spoken proficiency remain outside this review.
