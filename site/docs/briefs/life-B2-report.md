# B2 everyday-life content report

## Delivered

`content/life-B2.json` contains four original B2 units anchored to existing lessons, with no changes to `content/B2.json` or the 96-lesson curriculum:

| Unit | Anchor | Setting and transfer | Reading length |
| --- | --- | --- | ---: |
| `LIFE.B2.CONSUMER` | `B2.14` | Shop/café disagreement; confirmed facts, unknown cause, formal follow-up and a different register for a friend | 241 Romanian words |
| `LIFE.B2.NEIGHBOR` | `B2.17` | Shared courtyard; two affected groups, access objection, trial and a precise meeting summary | 248 Romanian words |
| `LIFE.B2.TRAVEL` | `B2.09` | Competing fictional routes; conditional connection, confirmed versus tentative information and relay to a companion | 257 Romanian words |
| `LIFE.B2.DISCUSSION` | `B2.12` | Public work/media discussion; bounded claim, evidence limit, relevant counterargument and relay to an absent colleague | 258 Romanian words |

Each unit supplies 16 objective items with IDs `anchor.e501`–`e516`: four choices, four gaps, four word-order tasks and four reading questions. The four reading questions in a unit share its original multi-paragraph passage, targeting inference, stance, condition, evidence or accurate relay. There are 64 unique new items total. Every unit has at least 250 Russian words of core/detail explanation (308, 274, 266, 283 respectively), six translated examples, three corrected pitfalls, a sheet with at least five rows and three notes, at least 16 translated words/chunks (17 in Consumer), eight useful translated phrases (nine in Consumer), and a guided end transfer. All cases, times, businesses, conditions and routes are explicitly fictional.

The practice reinforces the existing grammar and pragmatic sequence: `B2.14` register and formal requests, `B2.17` urban argument and response, `B2.09` cause/purpose/condition/result, and `B2.12` proportionate argument with evidence limits. Recurring B1 prerequisites are named per unit. Key answer chunks appear in explanation, sheet, word list or phrase list before the items. Multiple plausible word orders are included as accepted answers where the given token set allows them. Choice distractors remain in the same domain and test unsupported assumptions or subtle shifts in claim strength; correct positions rotate across the set. The transfer models are 177, 175, 175 and 243 Romanian words respectively; the Consumer written portion is 160 words and Travel comparison 144 words before their separate oral relay lines.

Independent review fixes clarified the confirmed-seat context of `B2.09.e504`, removed a second valid distortion from `B2.09.e515`, explicitly constrained the intended conditional/example/data meanings in `B2.17.e507` and `B2.12.e505–e506`, and added accepted natural token orders to `B2.14.e511–e512` and `B2.17.e510`.

## Validation

Parsed the JSON and checked four units, the exact four-per-type count, every anchored sequential ID, 64 unique IDs, choice membership and folded-diacritic uniqueness, order token multisets for every accepted variant, minimum Russian theory count, vocabulary/phrase/example/sheet counts, and all B2 reading passages above 180 Romanian words. All assertions passed. Existing content and answers were not edited. The asset awaits independent Romanian language and UI integration review.

## Limits

The end transfer is guided self-practice. These objective items and sample responses do not automatically grade free writing or speech, provide natural audio, or certify a B2 level. No official ILR test passage, item or answer key was included in the new training content.
