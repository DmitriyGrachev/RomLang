# Independent A1 depth review

## Scope

Reviewed all 24 new A1 lessons (288 objective items and production models), 48 checkpoint items and six transfer models, 110 dictionary entries, 12 mission variants and their teaching support in `content/depth-A1.json`. Checked all reading answer keys against their passages, gap/order answer constraints and token assembly, choice distractor meanings, beginner preparation vocabulary, model alignment, and Romanian/Russian/English dictionary fields. The A1 author’s earlier correction to the 20–99 age `de ani` rule is present.

## Fixes applied

- Rewrote A1.46.e3 to a distinct invitation and Sunday meeting sentence, resolving a cross-level task duplicate with CHECK.A2.7.e5. The full four-level validator now passes.
- Constrained ambiguous prompts in A1.25.e9 (friend context), A1.29.e5 (introducing a new chair), and A1.36.e2/e10 (specific receipt and target verb). Replaced A1.27.e12 with three plausible, taught clothing descriptions. Replaced A1.35.e9 and A1.41.e9 with direct comprehension requests using prepared language.
- Corrected the unnatural hotel question consistently across A1.39 lesson, mission, teaching phrases, and dictionary example: `La ce oră pot intra în cameră?`. Punctuated and clarified order tasks in A1.42, A1.44, A1.47 and three checkpoints so assembled sentences are speakable.
- Made A1.25 and A1.43 production models meet their prompts (family connection; five filled form fields plus a sixth-field question). Clarified the A1.45 refusal model and A1.7 transfer model. Gave the form a fictional street address rather than only a city.
- Corrected `ochi` singular Russian gloss, Romanian weight example (`este de două kilograme`), the location translation `la cafenea`, and two awkward dictionary example contexts. Added translated preparation for `soț`, `lapte`, the updated clothing and pharmacy questions, and the fictional street address.
- Replaced several learner reading passages' editorial notes about imaginary exercises with natural actions; comprehension facts and answers remain intact.

## Verification and limits

`node scripts/validate-depth.mjs --level A1` passes: 24 new lessons, 336 new objective items including checkpoints, 110 words; reading passages 42–55 Romanian words. `node scripts/validate-depth.mjs` passes across all four levels: 48 modules, 192 lessons, 1,344 new objective items, 440 new words. The validator checks IDs, owner references, exact mission preparation, unique quiz substance, answer choices and order buildability. This review is a language/content inspection and structural check, not an external CEFR certification or audio pronunciation test. Missions offer a repair branch on their first decision; some later incorrect choices continue with negative feedback and a lower score, rather than a separate correction turn.
