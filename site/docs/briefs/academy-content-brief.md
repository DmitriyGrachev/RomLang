# Content author requirements

Read lib/course/academy-types.ts. Output one `content/academy/LEVEL.json` array of AcademyUnit. Read only your own level from docs/briefs/text-course-topics.json. Every listed unit is required, in that order, all five goals retained. IDs `ACA.A1.01` etc; reading IDs `.r1/.r2`; reading question IDs `.r1.e1`..; practice IDs `.e1`..; checkpoint IDs `.check.e1`..; writing ID `.write`. Use prereqs as preceding unit ID, first empty.

Minimum for every unit:
- 3 substantive theory sections, at least 180 Russian explanatory words combined (not repetition), 2 original Romanian/Russian examples per section. Explain forms AND usage with all needed vocabulary prepared.
- 3 pitfalls with corrected Romanian and a Russian reason.
- 12 useful contextual word/phrase cards: ro, ru, forms, example ro/ru, prepared `answers` containing ro. Avoid word lists repeated across units when new vocabulary is relevant; no fabricated stress.
- 2 original reading texts, different genres/situations, each with 4 glossary phrases and 3 comprehension questions. A1 65–110 Romanian words; A2 120–190; B1 220–320; B2 320–480. Reading is in Romanian; title/prompts/explanation Russian. Questions require text understanding; avoid giving answers in preparation. B2 ask inference/cohesion/purpose as well as details.
- 8 practice ExerciseItems (choice/gap/order/read) including at least 3 non-choice written responses. Answer alternatives must be unambiguous and finite. Order `tokens` join to a grammatical accepted answer. Vary correct choice position. Distractors plausible, not absurd.
- 4 checkpoint ExerciseItems, genuinely changed facts/context, independently answerable after theory; don't merely repeat worked example.
- 1 writing task: prompt, targetWords [A1 30,60 / A2 70,110 / B1 130,180 / B2 180,240], plan (3-5 steps), full original Romanian model in range, 3 annotations, 4 specific rubric criteria, 3 revisionFocus, changed transferPrompt. No speaking/listening tasks.
- `sourceIds`: choose relevant `ubb-description`, `cefr`, `puls`, `rolang`, `myro`, `ilr`, `ecl`, `ubb-program`. These are alignment refs, not a claim of having used copyrighted text. All prose/exercises original. Don't browse or copy textbooks; sources are already researched by root.

Quality: no placeholder templates, no identical sentence with only noun swapped as whole lesson. Natural Romanian, Ukrainian learner origin when needed. All scenarios are fictional. Medical/legal/financial contexts teach language, not professional advice. Any illustration of disputed facts must be framed fictional. B2 models must be cohesive arguments with examples/qualification, not padding. All 5 goals must be taught somewhere in the unit. Prefer checked neutral vocabulary, no invented rule.

Author iteratively in small batches and validate JSON + counts/word limits as you go. You may write a temporary generator in scratch, but do not generate content by a generic repeated text template. Do not modify other levels, app code, package.json or shared schema. Do not commit (root packages all authors together). Report file docs/briefs/academy-LEVEL-report.md: unit counts, checks, pedagogical limitations. No subagents.
