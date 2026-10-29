# Independent review: B1 units 11–20

Reviewed the immutable `content/academy/B1-part2.json` against `academy-content-brief.md` and the author report. Scope: every practice/checkpoint key, Russian theory and pitfalls, every reading answer against its passage, and every writing model/transfer task. This was an editorial review; previously validated counts and lengths were not rerun. No lesson content was changed.

## Verdict

**Needs focused editorial correction before final acceptance.** The reading answer keys are supported by their passages, and the core Romanian constructions are generally sound. No P0/P1 issue was found. The finite-answer requirement is not fully met, many distractors violate the brief’s plausibility requirement, and two writing tasks need clearer alignment between what learners receive and what the rubric assesses.

## Prioritized findings

### P2 — Valid gap completions are rejected by the finite keys

The brief requires unambiguous, finite alternatives. These are normal completions, rather than speculative paraphrases:

| Item | Current key | Also valid | Exact suggested fix |
|---|---|---|---|
| `ACA.B1.14.e2` | `acum` | `în urmă cu`: `Am schimbat programul în urmă cu două zile.` | Change prompt to `Начало в прошлом — используйте acum: Am schimbat programul ___ două zile.` |
| `ACA.B1.16.e6` | `Încă` | `Tot`: `Tot nu am primit răspuns.` means “I still have not received a reply.” | Change prompt to `Ожидание — используйте încă: ___ nu am primit răspuns.` |
| `ACA.B1.18.e6` | `aceea` | `asta`: `Plouă, de asta mutăm întâlnirea înăuntru.` | Change prompt to `Следствие — используйте de aceea: Plouă, de ___ mutăm întâlnirea înăuntru.` |
| `ACA.B1.19.e2` | `aceea` | `asta` also completes a fixed consequence expression; “устойчивую связку” does not uniquely identify `de aceea`. | Change prompt to `Следствие — используйте de aceea: Sala e mică, de ___ schimbăm locul.` |

Specifying the target expression is preferable to accepting an open-ended set of modifiers and synonyms. The other gaps give a lemma/form, a target expression, or a construction that establishes the intended answer; no further definite false-negative case was identified.

### P2 — Numerous distractors are absurd rather than plausible

This is an explicit brief requirement, not merely a preferred difficulty level. The pattern affects the assessment value of several units: learners can identify nonsense without understanding the taught distinction.

Concrete examples include `ACA.B1.11.e6` (`Îl studiez de mâine de doi ani.`), `ACA.B1.11.check.e3` (`Am verificat mâine…` / `Voi verifica ieri…`), `ACA.B1.12.e5` (`Datele lipsesc mâine ieri.`), `ACA.B1.14.check.e2` (`Merg pe jos acum de ieri mâine.`), `ACA.B1.16.check.e3` (`Încă primesc niciun nu.` / `Nu primesc de mâine ieri.`), `ACA.B1.17.e8`, `ACA.B1.17.check.e3`, and `ACA.B1.19.e4` (`Ea este aceasta și aceea.`).

Suggested replacement patterns:

- `ACA.B1.11.check.e3`: explicitly ask for the habitual past expressed with imperfect; use `Verificam cererile zilnic.` / `Verific cererile zilnic.` / `Voi verifica cererile zilnic.` Keep the current key.
- `ACA.B1.16.check.e3`: provide the fact that messages arrived before disabling the option and stopped afterwards; use `Nu mai primesc mesaje promoționale.` / `Încă primesc mesaje promoționale.` / `Nu am primit niciodată mesaje promoționale.` Keep the current key.
- `ACA.B1.17.check.e3`: keep the prompt’s present-tense requirement; use the existing correct sentence alongside grammatical past and future versions: `Ea a ajuns, a întrebat și a descoperit un indiciu.` / `Ea va ajunge, va întreba și va descoperi un indiciu.`
- `ACA.B1.19.e4`: supply the intended referent in the prompt: `Больше стал именно зал. Как устранить двусмысленность?` Then compare `Sala nouă este mare.` with `Aceasta este mare.` and `Intrarea nouă este mare.` This tests both referent preservation and explicit naming.

Review the remaining choice distractors for the same pattern. Grammatical but factually irrelevant distractors can be appropriate; malformed word salad is the problem here.

### P2 — Unit 15 asks for faithful mediation without supplying the source

`ACA.B1.15.write` asks learners to retell a fictional news item about library hours. Its rubric assesses preserved attribution, chronology, conditions and an unconfirmed date, but no library news item is supplied. The unit readings concern a cultural centre and a festival. The model invents a third source. The transfer prompt similarly refers to a “новая заметка” that is absent.

This allows practice inventing an attributed news message, but cannot establish whether the learner preserved an original message or distinguished its facts from opinions.

Exact suggested fix: include a compact fictional source directly in the main prompt, for example: `Исходная заметка: библиотека опросила читателей, затем сравнила ответы с графиком сотрудников. Со следующего месяца зал планируют открывать до 20:00 по вторникам и четвергам. Точная дата зависит от проверки системы доступа и пока неизвестна. Директор допускает дальнейшее расширение только при наличии персонала. Один читатель одобряет изменение, но просит день в выходные.` Ask the learner to retell these supplied facts. Update the model to identify the two weekdays if these are included.

For transfer, supply a different factual note: `Вымышленная заметка: перевозчик обсуждает отмену остановки у рынка. Решение не принято, дата неизвестна. Причина предложения — изменение маршрута. Один житель считает остановку важной. После обсуждения перевозчик обещает опубликовать решение.` Ask for a retelling that preserves the proposal’s status and attributes the opinion.

### P2 — Unit 12 model lacks one deadline required by its rubric

`ACA.B1.12.write`, rubric `Sarcini`: `Три исполнителя связаны с действиями и сроками.` Elena has Tuesday, the narrator has Wednesday, but Vlad only receives a predecessor condition: `După ce primește răspunsul ei, Vlad pregătește planul expoziției.` This establishes dependency, but does not give Vlad a deadline.

Exact suggested fix: replace that model sentence with `După ce primește răspunsul ei, Vlad pregătește planul expoziției până miercuri la prânz.` This keeps the dependency and demonstrates the rubric’s three assignees with deadlines. Recheck model length after editing.

### P2 — Unit 19’s rewrite model invents a privacy commitment

`ACA.B1.19.write` asks for a letter from specific notes. The model adds `Vom păstra adresa dumneavoastră doar în lista acestei activități.` The notes do not authorize this promise, and it is unrelated to the date, venue, entrance or requested confirmation. In a unit about preserving meaning, an unsupported commitment is a poor model for expanding sparse notes.

Exact suggested fix: replace it with `Vă rugăm să precizați în răspuns dacă puteți participa duminică, la ora douăsprezece, în sala numărul doi.` This repeats supplied facts without introducing a new organizational commitment. The added email response method and entrance explanation are less consequential, but should also be supplied in the notes if the intended task is strict mediation rather than creative expansion.

### P3 — Repair one Russian gloss

`ACA.B1.13`, section `Сравнение программ`: `Mai potrivit decât означает «подходящее больше, чем»` is not natural Russian and obscures the comparative construction.

Exact suggested fix: `Mai potrivit decât означает «более подходящий, чем»`.

## Coverage and non-findings

All 80 practice items and 40 checkpoint items were reviewed. Apart from the four gap constraints above, the keyed choices, inflected forms and intended ordered sentences match their prompts. Some pits are explicitly pragmatic/style problems, rather than grammatical errors; their explanations generally make that purpose clear. No definite false “wrong” example warrants a separate blocking finding. The Russian rules for passive agreement, supin, imperative clitics, relative `pe care îl`, gerund formation, duration, negative concord and source attribution are substantively usable.

All 60 reading questions were checked against the passage once, with duplicated exercise `text` fields excluded from extraction. The following anchors summarize the three questions for each reading in their question order:

| Unit | Reading 1 evidence | Reading 2 evidence |
|---|---|---|
| 11 | no exact timing measurement; asks colleague’s difficulty first; flexible start versus evening work | two preferred time slots; studying tool without project use; two weeks after hiring confirmation |
| 12 | asks for missing data; preparation gap between bookings; approval before dispatch | Radu’s chair count; delivery not confirmed; Ana checks proposed calendar changes |
| 13 | obligatory meetings conflict with availability; initial/revised portfolio; personal rather than universal suitability | logic of solution; bridge problem to proposal; colleague identifies link independently |
| 14 | Wednesday sleep field unrecorded; observations do not prove cause; work began earlier ten days ago | three ordinary days; early departure in morning; attached original supplies omitted detail |
| 15 | electrical check incomplete; expansion conditional; reactions are personal | two possible closures became all streets; concerts free; dated source permits updates |
| 16 | avoiding duplicate requests; rules checkbox distinct from advertising; final paragraph checks sequence | recommendations disabled first; manual address entry; friend frequently changes neighbourhoods |
| 17 | seeks envelope recipient; hesitant dialogue shown by detail; fast-action readers may be disappointed | intrigue versus character observation; natural dialogue agreed; no ending spoiler |
| 18 | cause unknown; poster creates no extra space; gate checked over two Mondays | Sunday room use; categories easier to maintain; data shows practical feasibility |
| 19 | booking confirmed; date/time/room moved first; room named explicitly | address correction plus Friday noon; correction/deadline missing; polite forms plus difficulty response |
| 20 | payment timing unspecified; later opening meets work hours; Friday library conflicts with Thursday group | obligatory date buried; concrete steps paraphrased; changed workshop registration tests transfer |

All ten writing models address their main task’s substantive content. Unit 12 has the deadline mismatch above; unit 15 lacks supplied source material; unit 19 adds an unsupported commitment. The remaining writing tasks/models and changed transfer prompts are concrete enough for their creative/fictional scope. Unit 20 meaningfully changes facts and requires an independent attempt before model comparison.

This review does not replace the author’s structural validation or certify unrestricted free-writing assessment. After editorial edits, rerun the existing structural/length checks only on the changed content.


## Scoped re-review after correction round 1

**Verdict: all findings above are addressed; the reviewed correction is acceptable. No new local blocking finding.** This verdict supersedes the initial “needs focused editorial correction” status for the reviewed snapshot.

Read the appended author evidence in `academy-B1-part2-report.md`, the immutable `/tmp/academy-B1-part2-review-fix.diff`, and the final changed content. Reviewed the current option sets and prompt pairs across the corrected units, including the revised reading distractors against the passage evidence already established above. This was scoped to the supplied corrections; no unrelated code or untouched teaching material was reopened, and the author’s structural/count/length checks were not rerun.

| Original finding | Re-review result |
|---|---|
| Four finite-gap ambiguities | Closed. `ACA.B1.14.e2` explicitly requires `acum`; `ACA.B1.16.e6` requires `încă`; `ACA.B1.18.e6` and `ACA.B1.19.e2` require `de aceea`. The unchanged keys are uniquely appropriate under those instructions. |
| Absurd distractors | Closed. Revised choices use relevant form contrasts, nearby communicative purposes or plausible mistaken facts. Tightened prompts establish the intended fact, tense, referent or communicative purpose where needed. No competing valid key was found in the corrected option sets. Form-error distractors remaining in agreement/clitic exercises are pertinent to those grammar targets. |
| Unit 15 missing mediation sources | Closed. Main and transfer prompts now supply distinct fictional source notes. The main model preserves the Tuesday/Thursday schedule, planned status, unknown start date, staffing condition and individually attributed reader opinion. The transfer note clearly distinguishes discussion from an approved cancellation. |
| Unit 12 missing Vlad deadline | Closed. The model now gives Vlad `până miercuri la prânz` while retaining the dependency on Elena’s answer. Three assignees now have actions and time references consistent with the rubric. |
| Unit 19 unsupported privacy promise | Closed. The promise has been removed. The revised notes also supply the closed main entrance, entrance sign and email reply method, so the model’s organizational information is grounded in the prompt. Required date, time, room, access, reply deadline and old-form prohibition are retained. |
| Unit 13 Russian comparative gloss | Closed. The text now reads `«более подходящий, чем»`. |

The unchanged reading keys remain supported after the distractor replacements. The revised choices do not introduce an alternate answer supported by their passages. No content edits or commits were made during either review; only this review report was updated.

Integration: reviewed units 11–20 merged unchanged into content/academy/B1.json; temporary B1-part2.json removed.
