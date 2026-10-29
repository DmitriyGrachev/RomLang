# A1 life content handoff — 28 October 2026

## Delivered

- `content/life-A1.json`: four original fictional situations, anchored at A1.22 (shop), A1.21 (café), A1.20 (street) and A1.04 (neighbor). Each has full Russian preparation, translated words/chunks and phrases, six translated examples, three diagnosed errors, a visual rule sheet, sixteen objective items and an end-only guided transfer task.
- Each set has four choice, four gap, four order and four reading questions. IDs are `anchor.e501` through `anchor.e516` and do not change existing lesson/exercise IDs. Choice answers were placed deterministically across positions: 11 first, 11 second, 10 third overall. The four original Romanian reading passages are 71, 77, 79 and 77 words, respectively, and are reused only for distinct comprehension questions in each unit.
- Seven theory supplements for A1.04, .12, .13, .19, .20, .21 and .22. Each has three sections, at least six translated examples, three pitfalls, three decision steps and four table rows. Twenty-four concrete lesson audit records identify the existing lesson's coverage and the new action or preserved boundary; exactly the seven supplemented records are `expanded`.

## Counts and checks

| Unit | Core + detail Russian words (Cyrillic tokens) | Translated words/chunks | Phrases | Reading Romanian words |
| --- | ---: | ---: | ---: | ---: |
| SHOP | 276 | 30 | 9 | 71 |
| CAFE | 265 | 35 | 9 | 77 |
| STREET | 275 | 35 | 9 | 79 |
| NEIGHBOR | 274 | 34 | 9 | 77 |

Supplement Russian explanation counts: A1.04 219; A1.12 219; A1.13 208; A1.19 214; A1.20 215; A1.21 205; A1.22 231. These count section bodies only, excluding examples, decision guide and pitfalls.

A Python structural check verified JSON parsing; exactly 4 units, 64 unique anchored items, 7 supplements and 24 unique audits; 4/4/4/4 type distribution in every unit; minimum preparation counts; 45+ word reading; 200+ word supplement bodies; unique folded-diacritic choice options; answer membership; and all accepted order variants using the same token multiset. Two genuinely reversible order variants were added to the accepted answers. Existing A1 source was used for prerequisites, forms, support phrases and dictionary entries. No old file was edited.

## Editorial boundaries and review points

- Shop availability, café orders and street routes are fictional. No live prices, schedules, legal/medical guidance, audio playback or automatic speaking assessment is claimed. Transfer remains a suggested self-practice response at the end.
- Reading glossaries introduce narrative recognition forms before the objective items; these are not required as new active verb paradigms. Earlier A1 lessons supply common function words and forms. The editor should still check naturalness and the reading glossaries against the visible lesson-preparation UI.
- The theory additions are instructional references, not proof of CEFR attainment. A native-language review and the integrated app validator/browser checks remain separate handoff steps.

## Independent editorial follow-up

The follow-up review corrected a misleading spatial error: `Intrarea este la stânga` is valid for location, so both the life-unit mistake and A1.20 supplement pitfall now use a genuinely incomplete phrase, `Intrarea este stânga`, and explain that both `în stânga` and `la stânga` can locate something. Examples that gave away the exact shop, café, street and neighbor reading facts were changed to different items, directions, people or places. The café’s fourth reading question now asks who first requested the menu, a detail not supplied by preparation. All 64 generic hints were replaced with item-specific cues that do not state the answer. Structural checks and `node scripts/validate-life.mjs` were rerun after these edits; the validator reports all 16 life units and 46 supplements across levels, and no A1 lexical-surface exceptions. Its stated limit is that naturalness, ambiguity and level appropriateness still require language review.
