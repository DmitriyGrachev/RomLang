# B2 theory and transfer author report

## Scope

Added `content/theory-B2.json` without changing the 24 core B2 lessons, their existing exercise IDs or answers. It contains 24 theory supplements and 24 concrete lesson audits, plus an original B2 transfer set. Each supplement has three sections, six translated examples, three incorrect/correct Romanian contrasts with reasons, a three-step decision guide, four sheet rows, and links to the UBB Romanian B2 description and CEFR Companion Volume. The explanations compare form, meaning, alternatives, context and limits. These are practice materials, not a finite certification syllabus.

## Programmatic counts

| Component | Verified count |
| --- | ---: |
| B2 supplement / audit records | 24 / 24 |
| Cyrillic Russian explanation words per supplement | 323–424 |
| Reading texts (Romanian whitespace words) | 321, 329, 335, 346 |
| Reading questions | 16 (four per text) |
| Grammar/lexis e901 items | 24 (22 choice, one gap, one order) |
| Writing models (Romanian whitespace words) | 225, 237, 248, 259 |
| Writing tasks / speaking tasks | 4 / 4 |
| Writing rubric dimensions | 5 per task |
| e901 keyed answer positions among choice items | 8 first, 8 second, 6 third |
| Extended-reading keyed answer positions | 4 first, 8 second, 4 third |

Reading anchors are B2.20, B2.19, B2.22 and B2.17, respectively, each with `.e701`–`.e704`. Grammar uses each lesson's `.e901`. Reading questions address stance, inference, reference and evidence. Full passages are attached to each `read` item as `text` for the existing renderer. Writing genres are formal request, complaint, residents' report and argument; each prompt has a plan, a model within its 180–260 word target, annotations, five rubric dimensions and a fresh transfer prompt. The report task provides a fictional observation sheet so the learner has the same evidence as the model.

Speaking uses the actual original reading scenarios: source checking, courtyard negotiation, mediating a shelf proposal and discussing a review. Each asks for a three to four minute contribution and new follow-up questions, with an analytic rubric. The readiness matrix references existing lesson and task IDs. All skills require an independent check; listening explicitly requires real Romanian audio, and oral interaction a real interlocutor. No audio player, TTS, speech scoring or certification promise is implied.

## Checks and source boundaries

`node scripts/validate-life.mjs` passes for structural counts, IDs and source-domain rules. `pnpm check:content` and `pnpm check:teaching` pass for the unchanged core catalogs. A separate Python count asserted all 24 supplements have at least 300 Cyrillic Russian words, the four readings are 300–450 Romanian words, and the four models are 180–260 Romanian words. These checks do not substitute for a Romanian language review of every distractor, register choice and morphological nuance.

The format and broad criteria are informed by the [CEFR Companion Volume](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4), [UBB's Romanian B2 description](https://video.elearning.ubbcluj.ro/wp-content/uploads/2016/09/Descrierea-minimala-a-limbii-romane-12-IULIE-2016.pdf), and the [Institutul Limbii Române B2 sample](https://www.ilr.ro/wp-content/uploads/ILR%20-%20Aplicatii%20Lingvistice/Exemple%20teste/nivel%20B2/nivel%20B2.pdf). For separate unseen listening and provider-specific assessment, see the [ILR examples and audio landing page](https://www.ilr.ro/category/atestate/aplicatii-si-nivel-prag/). No official passages, items or answer keys were copied into the course.
