# A1/A2 life content: independent editorial review

28 October 2026. Final scoped rereview of `content/life-A1.json` and `content/life-A2.json` against `docs/briefs/life-content-schema.md`, the A1/A2 source lessons, and both authors' handoff reports. This is an editorial and answer-key review, not a native-speaker certification or a UI assessment.

## Verified revision

| File | SHA-256 |
| --- | --- |
| `content/life-A1.json` | `636bad2e46523b6d1028f6e34f1c030cf866d8e2cc334928cddb247f75b5ac8a` |
| `content/life-A2.json` | `4bba47e3a773a69367994b06d00f4f004d5856ae87d17b0e96a25acd41692c95` |

## Findings and resolution

- **Resolved, reading novelty:** Shop A1.22, street A1.20, neighbor A1.04, return A2.17, travel A2.21, home A2.20, and health A2.22 preparation/supplement examples now use different facts from their scored passages. The A1.21 unit preparation and supplement both use a water correction; the reading and `A1.21.e515` use tea and milk. The A2.20 supplement now models an 8–9 visit conflict caused by accompanying a friend, with availability after two and a Wednesday-six proposal; `A2.20.e514` still requires reading Dima's 10–12 work conflict. Its translated examples agree with the revised explanation. End-only transfer models may reuse story times without exposing an earlier scored key, provided the UI preserves the contract's placement.
- **Resolved, objective items:** `A2.20.e501` explicitly names the intercom and `.e504` explicitly names Thursday; each now has one supported choice. `A2.17.e503` uses the taught explicit noun phrase instead of unintroduced `pe cea`. The revised `A2.21.e513` tests a fact from its passage, and `.e509` says “отправлении.” The reviewed reading answers and distractors correspond to their texts; no remaining scored key error or two-correct-choice prompt was found in the 128 new A1/A2 items.
- **Resolved, language and progression:** The A1.20 mistake and supplement pitfall now use incomplete `Intrarea este stânga` and acknowledge that both `în stânga` and `la stânga` can express location. A2.21 refers to the name on Dima's booking without assuming Dima is a surname. Tested gap answers and active phrases are introduced before practice. The 48 lesson-audit entries are specific to their respective lessons.
- **Low priority remaining:** The hints for `A1.20.e502`, `A1.21.e502`, and `A1.04.e507` state the decisive phrase or gap answer (`este + în dreapta`, `Меню`, `vă`). If hints are intended to guide without revealing a choice, make these three indirect. The other 61 A1 hints are specific and generally cue a contrast or place to look.

## Structural verification and limits

Each file parses with four units, 64 unique anchored items (four choice, four gap, four order, four read per unit), seven theory supplements, and 24 audits. Passage lengths and preparation/supplement counts satisfy the contract. Answer positions vary. The scenarios are fictional and keep Dima from Ukraine and living in Bucharest/Militari; A2 health practices reporting and scheduling without diagnosing or treating symptoms, and the invented shop policy is not framed as law. No audio/TTS or automatic spoken-language assessment is claimed.

`node scripts/validate-life.mjs` passed during this review: 16 life units and 46 supplements across levels, with no A1/A2 lexical-surface exceptions. Its checks cannot establish idiomatic Romanian, teaching novelty, or rendered UI ordering. The last two paragraph edits were checked directly in the files at the hashes above; their content does not change scored answers.
