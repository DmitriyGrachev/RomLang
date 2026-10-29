# Independent B1 semantic review

Reviewed `content/depth-B1.json` without editing it. Scope: all 24 lesson explanations/comparisons, examples and objective formats; all 24 passages with 72 reading keys; all 24 production models; all six checkpoints/models; all 12 mission variants and their translated preparation; all 108 dictionary entries, forms, marked stresses, contextual examples and productive phrases. Structural validation is a separate gate.

## Findings sent to author and root

| Finding | Status |
|---|---|
| Every lesson preparation appended an incorrect combined three-phrase gloss to a word; each of the three phrases had that same combined meaning. Examples: `schimbare` = “прежде / теперь / с тех пор как”, `reparație` = “сначала / затем / пока”. | Fixed and checked: aggregate glosses removed; individual phrase meanings supplied. |
| New gap-answer vocabulary such as `locuința`/`liber` was absent from preparation. | Author added translated canonical answer preparation; checked representative corrected supports. |
| Canonical-only gaps rejected natural alternatives (`casa`/`locuința`, `precis`/`exact`/`concret`, `diferit`/`altfel`, etc.). | Author added forms or explicit constraints. |
| Free word-order tasks rejected grammatical placements of time/place adjuncts. | Fixed and checked: starts constrained and B1.27.e8 now explicitly accepts `Voi corecta în seara aceasta mesajul`; checkpoint alternatives accepted where needed. |
| Six checkpoint e6 tasks merely repeated `Până la urmă` with changing module numbers, and explicitly supplied the missing word in the prompt. | Replaced by six distinct cumulative forms; checked the replacements. |
| Several checkpoint gaps supplied neither infinitive nor uniquely constraining translation. | Infinitive/person or intended temporal meaning now specified; checked. |
| B1.33 falsely said Russian “соответствовать” and Romanian `a corespunde` require different cases, although both examples use dative. B1.41 had `causa`; B1.43 named `utile` where `utilă` was intended. B1.29 categorically excluded `totuși`; B1.42 omitted the noun construction `înainte de`. | Author corrected the theory. |
| Dictionary stress `sar-CI-nă` was wrong; several glide/syllable representations were misleading. `Legătura … durează zece minute` was translated as “there are ten minutes available”, changing duration to allowance. | Author corrected stresses and translation. The `sárcină` reading was checked against a reproduced DOOM entry. |
| MISSION.B1.10 v1 used masculine `îl` for feminine `prima versiune`; customer-service and consultation dialogue mixed formal Russian with informal Romanian. | Corrected `o`, feminine repair antecedent and formal forms verified. |
| Universal productive instruction “перескажите решение … почему выбрали его” did not fit symptom/history/news-summary lessons. | Fixed and checked: neutral summary/follow-up instruction now used across all 24 lessons. |
| Reading facts occasionally leaked through translated preparation/examples: B1.25.e12 repeats the prepared fact of meeting neighbours more often; B1.27.e10 repeats the prepared wrong-recipient fact. | Fixed and checked: author replaced affected keys, including further facts leaked by comparisons in B1.32/.39/.40. All 72 final reading keys checked against the passages; B1.34 breakfast/checkout questions now test distinct facts. Two final wording fixes distinguish a moment from an exact minute (.38.e10) and condition from time (.41.e11). |

All reading keys inspected matched their passages; I found no second correct choice in the reading options inspected. New checkpoint questions now use distinct facts rather than copied lesson choices. All mission variants have genuine repair branching and distinguish task-consistent from contradictory answers. Some wrong options are deliberately obvious/self-contradictory; they exercise task completion rather than subtle pragmatic inference.

Lesson models reuse their lesson reading passages verbatim. The texts are coherent and match the lesson themes, but this is reuse rather than a separate transfer example; root was informed. No objective grading of open speech or CEFR certification is implied.

## Source check and limits

- Official DOOM site and accent-marking guidance: https://doom.lingv.ro/ and https://doom.lingv.ro/indrumari .
- Reproduced DOOM entry used to check `sárcină`: https://radu.dexonline.ro/~radu/DEX/www/intrare/sarcin%C4%83/50197/sinteza .
- This is an independent consistency/ambiguity review, not a native-speaker certification or exhaustive lexicographic verification of all 108 stress entries. Final changed items were rechecked after the author's last atomic write. B1 is frozen from the author and reviewer sides; all 79 tests and whole-content/teaching validators passed the final snapshot.

Final reviewed B1 SHA-256: `5b2cd5f7d1e30864273aca8f6efb39f34660a48af4c0dd9c8f572b291a116770`.
