# Independent B1 content review — units 01–10

Reviewed `ACA.B1.01`–`ACA.B1.10` in `content/academy/B1.json` against the content brief and B1 author report. Scope excludes units 11–20. This is a linguistic and pedagogical review: every practice item, checkpoint item and pitfall was read; both readings, their comprehension questions and the writing model were read in each unit. `lib/course/engine.ts` was inspected to establish how answer alternatives are graded. No content was changed and no count/length tests were rerun.

## Final verdict after correction round 2

**All findings from this review of units 01–10 are addressed.** The round-1 corrections close eight gap findings and all four teaching/model issues; round 2 closes the two residual gap findings below. No new learner-harming breakage was found in either correction diff. No further correction is requested within this review's scope.

Reviewed `/tmp/academy-B1-round2.diff` and the appended author report, limited to these two exercise objects. The reported actual-grader checks (two present forms accepted, six future forms rejected) were read, not rerun.

| Item | Final status | Reason |
|---|---|---|
| `ACA.B1.08.e3` | Addressed | Explicit `prezent`, supplied `a putea` and `noi` determine `putem`; hint and explanation preserve the distinction between grammatical future alternatives and the requested present form. |
| `ACA.B1.10.check.e2` | Addressed | Explicit `prezent`, supplied `a evita` and `noi` determine `evităm`; hint and explanation correctly explain why future forms do not meet this instruction. |

This closes the independent review of the first ten units. It does not certify units 11–20 or untested speaking/listening competence. Historical findings and correction-round evidence follow.

## Correction round 1 — scoped re-review (historical)

Reviewed `/tmp/academy-B1-review-fix.diff` and the appended correction-round author report. This pass examines the first-ten-unit changes only. The reported real-grader checks and structural/length checks were read, not rerun.

**Round-1 verdict, superseded by round 2: eight flagged gap items and all four teaching/model findings were addressed. Two gap items were partially addressed and needed an explicit present-tense cue to close the original ambiguity.** No additional learner-harming breakage was found in the changed theory, examples, pitfall or writing model.

| Original location/finding | Round-1 status | Evidence / remaining action |
|---|---|---|
| `ACA.B1.01.e1` | Addressed | Prompt explicitly requests imperfect and an already ongoing discussion. |
| `ACA.B1.02.e3` | Addressed | Prompt supplies `a dura` and requests its participle. |
| `ACA.B1.04.check.e2` | Addressed | Prompt explicitly requests present tense, `noi`. |
| `ACA.B1.05.e2` | Addressed | Russian cue specifies “в котором”; explanation distinguishes `lângă care`. |
| `ACA.B1.07.e1` | Addressed | All four cited direction/destination alternatives are accepted; theory explains their use. |
| `ACA.B1.07.e3` | Addressed | Both `unde` and `la care` are accepted and prepared. |
| `ACA.B1.08.e3` | Partially addressed | `vom putea` now accepted, but ordinary `o să putem` remains a valid rejected completion of the unrestricted prompt. Use the present-tense cue specified below. |
| `ACA.B1.09.e3` | Addressed | The four cited causal conjunctions are accepted; explanation matches. |
| `ACA.B1.10.e3` | Addressed | Both `numai` and `doar` are accepted. |
| `ACA.B1.10.check.e2` | Partially addressed | `vom evita` now accepted, but ordinary `o să evităm` remains a valid rejected completion of the unrestricted prompt. Use the present-tense cue specified below. |
| Unit 07 `pe lângă` mapping | Addressed | Theory correctly contrasts `prin parc` / `pe lângă parc`, with two bilingual preparatory examples. |
| Unit 02 conjunctiv pitfall | Addressed | Genuine `învață` → `învețe` contrast, prepared in the theory and a complete bilingual example. |
| Unit 05 object-relative clitic rule | Addressed | Required construction is stated for the finite relatives taught; `îl/o` distinction and feminine example are provided. |
| Unit 07 writing transfer | Addressed | Model now gives tram, transfer at the second stop opposite the pharmacy, then bus toward the centre; annotation identifies it. |

### Round-1 remaining fixes (resolved in round 2)

These are residual instances of the original finite-answer problem, not a request to support every conceivable paraphrase. Restricting the requested tense is the smallest complete repair:

- `ACA.B1.08.e3.prompt`: `Заполните глаголом a putea в настоящем времени, noi: Dacă drumul se deschide, ___ merge la lac.` Key `putem`. Align the explanation with this explicit tense requirement.
- `ACA.B1.10.check.e2.prompt`: `Заполните глаголом a evita в настоящем времени, noi: Dacă alegem plata integrală, ___ taxa lunară.` Key `evităm`. Align the explanation with this explicit tense requirement.

The current two-key arrays solve the particular literary-future examples cited initially but leave the ordinary `o să` future open. The same sentences with `o să putem` / `o să evităm` are grammatical and express exactly the intended real-condition consequence. Present-tense instructions avoid that remaining grading ambiguity without changing the language lesson.

## Initial verdict and findings (historical; statuses above supersede these)

**Needs targeted corrections before learner release.** The main blockers are valid Romanian being rejected by answer keys and an incorrect Russian explanation of a Romanian preposition. There is also a misleading grammar pitfall, an incomplete relative-clause rule, and a writing model that omits a required communicative action.

The assigned units broadly teach their five goals through explanation, readings and writing. The sampled comprehension evidence supports the supplied reading keys; no reading question was found to depend on an absent event or an invented fact. Romanian narration and correspondence are generally intelligible and usable. This does not remove the specific defects below. The earlier structural/length results are taken from the author report, not independently recertified here. The complete B1 level remains outside this review's scope.

## Prioritized findings

### P1 — Open gaps reject ordinary correct alternatives

`grade()` accepts only normalized strings in `answers`; it does not infer synonymous expressions or other grammatical forms. The prompts below do not restrict the learner to the single keyed answer. These are therefore actual grading defects, including in checkpoints, rather than merely alternate editorial preferences.

| Item ID | Current key and valid excluded answer | Exact repair suggestion |
|---|---|---|
| `ACA.B1.07.e1` | `Merg ___ gară, dar încă nu am ajuns.` accepts only `spre`. `la`, `către` and `înspre` also make grammatical sentences. The unfinished journey does not exclude a destination introduced by `la`. | Change prompt to `Вставьте изученный предлог spre («в сторону»): Merg ___ gară, dar încă nu am ajuns.` if testing recall; otherwise accept `spre`, `înspre`, `către`, `la`. Do not explain that `la` is impossible with motion. |
| `ACA.B1.09.e3` | `___ lipsește o piesă, nu pot monta raftul. (поскольку)` accepts only `Deoarece`; `Fiindcă`, `Pentru că` and `Întrucât` express the same relation. | Accept these four alternatives, or explicitly ask for the conjunction `deoarece` as a form-recall task. |
| `ACA.B1.10.e3` | `Reducerea este valabilă ___ pentru clienți noi. (только)` accepts only `numai`; `doar` is equally correct. | Set `answers` to `["numai", "doar"]`. |
| `ACA.B1.04.check.e2` | `Dacă mutăm cutiile, ___ intrarea. (a elibera, noi)` accepts only `eliberăm`; `vom elibera` is also a normal real-condition consequence. | Add `настоящее время` to the instruction, or accept `vom elibera` too. |
| `ACA.B1.08.e3` | `Dacă drumul se deschide, ___ merge la lac. (noi, a putea)` accepts only `putem`; `vom putea` is correct. The unit's own second reading uses `Dacă drumul se redeschide ... vom putea vizita`. | Add `prezent` to the requested form, or also accept `vom putea`. |
| `ACA.B1.10.check.e2` | `Dacă alegem plata integrală, ___ taxa lunară. (a evita, noi)` accepts only `evităm`; `vom evita` is equally compatible. Unit 10 theory explicitly allows present or future consequences. | Add `prezent` to the requested form, or also accept `vom evita`. |
| `ACA.B1.01.e1` | `Când am ajuns, vecinii ___ (a discuta).` keys `discutau`, but the prompt alone does not say the discussion was already in progress. `au discutat` can describe an event after/at arrival. | Change to `Заполните imperfect, чтобы описать уже происходившее обсуждение: Când am ajuns, vecinii ___ (a discuta).` |
| `ACA.B1.02.e3` | `Adaptarea a ___ trei luni.` has no supplied lemma; the key `durat` is not the only possible completion (for example, `necesitat`). | Change to `Вставьте причастие a dura: Adaptarea a ___ trei luni.` |
| `ACA.B1.05.e2` | `Zona ___ care lucrez este liniștită.` keys `în`, but `lângă` gives the different, perfectly grammatical meaning “the area near which I work.” | Add the intended meaning: `Район, в котором я работаю: Zona ___ care lucrez este liniștită.` |
| `ACA.B1.07.e3` | `Stația ___ schimb tramvaiul este aproape.` keys only `unde`; `la care` can also introduce this location. | Accept `unde` and `la care`, or specify `одним относительным наречием места`. |

The repairs should preserve the distinction between controlled form recall and a meaning-based grammar question. Giving a complete answer in the prompt is suitable only when that task is explicitly presented as recall; for application, prefer a supplied lemma/tense/meaning or finite alternatives.

### P1 — Unit 07 teaches the wrong meaning of `pe lângă`

**Location:** `ACA.B1.07`, section “Пересадка и направление”.

The sequence `через, вдоль и напротив требуют pe lângă, de-a lungul, vizavi de` maps Russian “через” onto `pe lângă`. The latter means beside/past/near, not through. A learner following it can give the wrong route.

**Replace that sentence with:** `Не заменяйте все предлоги одним la: prin parc — через парк, pe lângă parc — мимо парка, de-a lungul parcului — вдоль парка, vizavi de parc — напротив парка.` Add the contrasted `prin`/`pe lângă` examples to preparation before testing either meaning. Retain the other examples if useful.

### P2 — Unit 02's second pitfall does not demonstrate its claimed error

**Location:** `ACA.B1.02.pitfalls[1]`.

`Ca să învăț indicativ.` is replaced by `Ca să învăț mai bine.` with a claim about needing conjunctiv. Both have the same correctly formed `să învăț`; changing its complement cannot demonstrate the mood distinction. Moreover, indicative is something one can learn, and both strings are subordinate fragments. The correction encourages the learner to reject a grammatical verb form for an unrelated reason.

**Replace the whole pitfall with:**

- wrong: `El vine la curs ca să învață mai bine.`
- right: `El vine la curs ca să învețe mai bine.`
- why: `После ca să требуется conjunctiv: для a învăța в третьем лице învață меняется на să învețe.`

Prepare the third-person contrast in the theory examples as well. Alternatively use `ca să învăț` versus an explicitly missing `să` if new third-person morphology is not intended here.

### P2 — Relative-object clitic rule leaves a required form apparently optional

**Location:** `ACA.B1.05`, section “Относительное предложение”; relevant practice `ACA.B1.05.e1`, `ACA.B1.05.check.e2`, later `ACA.B1.09.check.e2`.

The rule says direct-object `pe care` is accompanied by `часто местоименное удвоение`. In the finite relative constructions actually taught here (`apartamentul pe care îl vizitez`, `camera pe care o vizitez`), the clitic is required in standard Romanian. “Often” invites the ungrammatical `apartamentul pe care vizitez` and does not prepare the learner to distinguish `îl` from `o`.

**Replace this part with:** `В изучаемых относительных предложениях с личным глаголом прямое дополнение оформляется pe care и соответствующим безударным местоимением: apartamentul pe care îl vizitez; camera pe care o vizitez. Îl относится к мужскому/среднему роду единственного числа, o — к женскому.` Keep the separate `în care`/`cu care` examples to show that this is not a rule to add an accusative clitic to every occurrence of `care`.

### P2 — Unit 07 writing model omits the required transfer

**Location:** `ACA.B1.07.write`.

The prompt explicitly requires `пересадка`, and explaining a journey with transfers is one of the unit goals. The model takes one bus and then walks; no change of vehicle occurs. A learner imitating the complete model would omit an assessed part of the task.

**Repair:** replace the route paragraph with a complete two-leg route, for example: `De la gară mergi spre bibliotecă și ia tramvaiul spre Parcul Nou. Cobori la a doua stație, vizavi de farmacie. Acolo iei autobuzul spre centru și cobori la prima stație. Traversezi la semafor și mergi de-a lungul parcului până la intrarea albastră.` Rebalance surrounding wording to retain the required model length, and have one annotation identify the transfer location and direction. This is a model-content change, not a reason to remove the goal.

## Preparatory coverage and acceptance

The principal preparation gaps are the clitic distinction in unit 05 and the false preposition mapping in unit 07; the unit 02 replacement above needs an example before its third-person form is used. The unit 08 future consequence is already demonstrated by its own reading, making its rejection in practice particularly confusing.

After these targeted repairs, reread the changed prompts with the answer grader's finite-match behavior in mind. Confirm that each alleged “wrong” pitfall changes an actual language error while preserving the intended message. Recheck only changed structural/length constraints when integrating the corrections. This review makes no claim about units 11–20 or full B1 certification.
