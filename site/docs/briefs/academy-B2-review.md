# Independent B2 linguistic and pedagogical review

Reviewed `content/academy/B2.json` (ACA.B2.01–11) and `content/academy/B2-part2.json` (ACA.B2.12–22), as present during this review. No learner-content files were edited and no commits were made.

## Verdict

The units provide substantial original reading and written argument practice. Conditional perfect, mixed conditions, relative possessives and the principal clitic combinations checked are generally correct. Reading questions usually have a defensible textual basis and include inference, cohesion and communicative purpose. Writing models generally contain an actual argument, qualification and concrete example. Transfer prompts change context and require a meaningful adaptation.

**Editorial corrections are needed before treating the content as fully compliant with the brief.** The clearest learner-facing problems are an outdated reading-question reference, residual open lexical gaps with single accepted answers, two writing-model/task mismatches, and an inaccurate Russian explanation of approximation. Generic writing rubrics and very weak distractors also limit the claimed B2 assessment value. No count/length reruns were performed; these had already been validated separately.

## Prioritized findings and exact fixes

### R1 — P2: reading question points to the wrong paragraph

**ID:** `ACA.B2.02.r1.e3`.

Prompt: «Какова цель последнего абзаца?» Key: «Уточнить вид сбоя для выбора решения». Explanation contrasts information transmission with delivery delay. This describes the preceding report paragraph. The actual final paragraph now begins `Pentru următoarea livrare, registrul va consemna...` and proposes recording movements and checking the latest entry at handover.

**Minimal fix:** replace the prompt with «Зачем в отчёте различают своевременную доставку и сбой передачи информации?» Keep the key and explanation. Alternatively, retain the current prompt and key it to prevention through recording movements and checking the log.

### R2 — P2: correct lexical alternatives can be rejected

These are semantic vocabulary prompts, rather than genuinely finite form gaps. The listed alternatives are grammatical and fit the requested meaning; a sole memorized key is insufficient unless the prompt explicitly identifies the lemma.

| ID | Current key | Valid competing completion | Recommended finite prompt |
| --- | --- | --- | --- |
| `ACA.B2.14.check.e3` | `acordul` | `consimțământul` | «Вставьте определённую форму существительного acord: Lipsa unei reacții nu dovedește ___.» |
| `ACA.B2.16.check.e3` | `ștergerea` | `eliminarea` | «Образуйте определённое существительное от a șterge: ___ istoricului.» |
| `ACA.B2.17.check.e1` | `reutilizare` | `refolosire` | «Образуйте существительное от a reutiliza: ___.» |
| `ACA.B2.19.check.e1` | `ambiguitate` | `echivoc` | «Вставьте изученное существительное, начинающееся с ambig-: ___.» |
| `ACA.B2.20.e2` | `anexă` | `atașament` | «Вставьте существительное anexă без артикля: Datele sunt în ___.» |
| `ACA.B2.20.e6` | `ciornă` | `schiță` | «Вставьте изученное слово для черновика, начинающееся с cior-: Prima versiune este o ___.» |
| `ACA.B2.20.check.e3` | `explicită` | `evidentă` | «Согласуйте explicit: Scrisoarea conține o cerere ___.» |

The form/tense/meaning restrictions added to the first half successfully close most earlier grammar gaps. In particular, `aș/ai fi`, `citiserăm/găsiseră`, `al cărei`, `ale cărui`, `i-am trimis-o` and `i l-am trimis` have appropriate keys. Avoid restoring an unrestricted synonym/conjunction gap when applying these fixes.

### R3 — P2: approximation rule gives a false directional requirement

**Location:** `ACA.B2.15.sections[0].body`, sentence beginning «Слова aproximativ, circa, aproape…».

The explanation groups all three words together and says that they almost always require knowing whether the value is above or below the reference. `Aproximativ` and `circa` mean approximately and do not themselves specify a side. `Aproape` used with quantities normally means nearly, approaching the value from below.

**Replace the sentence with:** «Aproximativ и circa обозначают приблизительное значение без указания, выше оно или ниже названного числа. Aproape перед количеством обычно означает “почти”, то есть значение немного ниже ориентира. Чтобы явно назвать сторону, используйте peste или sub.»

### R4 — P2: two models do not fully fulfill their own tasks

**`ACA.B2.12.write`:** the task asks to compare employee training and replacing the application form. The model instead compares training with buying a new application (`O aplicație nouă`, data migration, `achiziția aplicației`). That is a materially different solution and cost structure.

**Fix:** keep the task, rewrite paragraph 2 around `Înlocuirea completă a formularului` and the time needed to design, test and explain new fields; replace the final `achiziția aplicației` with `înlocuirea completă a formularului`. Preserve the limited corrective message as the compromise.

**`ACA.B2.09.write`:** the task requires a letter after two uninformative responses and a concrete acceptable alternative. The model identifies only one response (`sesizarea a fost transmisă depozitului`). Its unavailable-item branch asks the provider to invent an alternative instead of naming one acceptable to the writer.

**Fix:** add a second prior response, e.g. `Al doilea răspuns descrie procedura generală, fără să confirme disponibilitatea setului.` Replace the unavailable-item branch with `Dacă setul nu este disponibil, am accepta un set echivalent de cartonașe, cu dimensiunile și cantitatea confirmate înainte de expediere.` Keep the existing chronology and precise request, adjusting surrounding prose within the already required range.

### R5 — P2 quality/spec: most writing rubrics are generic

**Locations:** `ACA.B2.01–11.write.rubric`.

The brief requires four specific rubric criteria. The first half repeats essentially the same four generic descriptions, changing the topic label in the language criterion. This gives learners little help deciding whether their particular mediation, narrative reconstruction or formal correspondence succeeds. The final current version of units 12–22 has task-specific rubrics; an earlier snapshot of their generic rubrics was superseded during review and is not a finding here.

**Fix:** make all four criteria observable for each task. B2.04 should assess unambiguous sender/recipient/owner, both sides of relative agreement, correct clitic placement, and the precise next action. B2.09 should assess complete chronology, promised versus delivered items, the unanswered question, and an explicit acceptable alternative. Similar task-specific checks are needed in the other first-half units. The final second-half rubrics provide usable examples of the requested specificity.

### R6 — P2 quality/spec: many distractors do not require B2 understanding

Examples include `ACA.B2.02.e8` (`Mâine am plecat ieri`), `ACA.B2.03.check.e2` (`Dacă primeam ieri, mâine ieri`), `ACA.B2.13.e1` (two strings of disconnected conjunctions), `ACA.B2.14.r1.e3` (`Niciun locatar nu există`) and `ACA.B2.14.r2.e3` (one text supposedly proves the square does not exist). These conflict with the brief’s requirement for plausible distractors. Similar extreme or unrelated alternatives recur throughout both halves. Correct keys are usually clear, but success often depends on rejecting nonsense rather than interpreting the source or discriminating the target construction.

**Fix:** replace malformed strings with grammatical alternatives that change tense, scope, attribution or discourse function. For B2.13.e1, supply the thesis «Онлайн-курс доступен каждому, потому что материалы бесплатны» and use three grammatical options: the present correct digital-barrier counterargument, an additional benefit of flexible timing, and an example of immediate file delivery. Only the first is a counterargument to that thesis. For reading tasks, use an inference that the text tempts but does not license, rather than a claim that the entire location does not exist.

### R7 — P2: source-based transfer task lacks its new sources

**ID:** `ACA.B2.21.write.transferPrompt`.

The prompt asks learners to compare a written discussion about a travelling exhibition and a report about its previous stop, then respond to cancellation of one stop. Neither new source is provided, and the prompt does not tell the learner to invent them. The unit's available sources concern a mobile library. Learners cannot demonstrate source fidelity or an evidence-based synthesis for the new exhibition from the supplied inputs.

**Replace the transfer prompt with this bounded, self-contained fictional task:**

«Вымышленный сценарий. Обсуждение: “Irina: Susțineam expoziția într-un singur loc. Accept trei opriri dacă publicăm datele și anunțăm anulările. Dan: Fiecare oprire cere o zi de montare.” Отчёт: “Anul trecut am testat o singură oprire: 120 de intrări, nu persoane distincte. O zi anulată nu a fost anunțată la timp.” Новое условие: вторая остановка отменена, третью нельзя перенести. Напишите 180–240 слов: сопоставьте позиции и наблюдения, сохраните пределы прошлых данных и объясните, как изменить монтаж, расписание и уведомление посетителей.»

If a shorter authoring task is preferred, explicitly instruct learners to invent and present two short fictional sources before synthesizing them. Supplying the pair is pedagogically stronger because it permits a fidelity check.

**Related missing-input prompts:** `ACA.B2.20.write.transferPrompt` starts «Из заметок о книжном обмене…» without giving those notes; `ACA.B2.19.write.transferPrompt` asks to compare two opinions about a fictional exhibition without supplying either opinion. Give a short factual note set/opinion pair respectively, or explicitly say to invent the fictional inputs. These differ from an ordinary open creative-writing prompt because the task expressly asks to transform or compare already-existing source material.

## Lower-priority precision and coherence improvements

1. **`ACA.B2.10.r2`:** the opening proposes changing the order of visits, yet the museum is already confirmed for the morning and the workshop expects groups only after lunch. The rejected alternative of going directly to the workshop therefore lacks a credible time slot. The safest rewrite is to frame the letter as confirming the museum and making the workshop conditional: change the opening to `Propun să păstrăm muzeul dimineața și să tratăm atelierul ca opțiune condiționată.` Replace the direct-to-workshop alternative with waiting for the workshop’s uncertain slot and the resulting risk to the afternoon plan. The three comprehension keys can remain.

2. **`ACA.B2.15.write.model`, paragraph 1:** `volumul de muncă a crescut în valori absolute` overstates what the counts establish. The reading explicitly says that time per case is unknown. Replace with `numărul cererilor care necesitau clarificări a crescut în valori absolute`. This preserves the intended count/share contrast without claiming measured workload.

3. **`ACA.B2.05.write.model`:** the task promises two real alternatives; the model’s second branch merely asks which activities may move to a separate sheet. Make it an actual alternative, e.g. a short fully checked Friday document plus a separate later supplement, as distinct from the first branch’s explicitly incomplete working version.

4. **`ACA.B2.21.r2`:** polish `Această categorie nu este identică persoanelor nou înscrise` to `Această categorie nu coincide cu cea a persoanelor nou înscrise`.

5. **`ACA.B2.21.write.model`:** `preferința exclusivă pentru un punct fix` is stronger than Ada’s opening, where she explicitly says she is not against moving books. Prefer `susținerea inițială a punctului fix`.

## Material inspected and limits

Read the author brief, shared academy schema, both B2 author reports, all 22 unit goals/theory/example pairs/pitfalls, vocabulary headwords/forms and translated examples, all 44 full reading texts with all comprehension prompts/choices/keys/explanations, all main practice and checkpoint prompts/options/tokens/keys/explanations, and all 22 writing prompts/plans/full models/annotations/rubrics/revision and transfer prompts. Compact extractions avoided repeating a reading for each question.

After the second author's final write, rechecked every listed finding against the current JSON, including all final second-half rubrics/revision targets and the affected gaps, rule, models and source passages. Removed superseded rubric/revision findings for units 13–22. The model mismatch in B2.12 and other findings above remain reproducible in that final version.

No count or word-limit validator, browser, external reference lookup, content edit, commit or subagent was used. This is an independent linguistic/pedagogical desk review, not an institutional CEFR certification or a claim of external native-speaker copyediting. The report prioritizes concrete learner-impacting issues rather than exhaustive stylistic polishing.

## Superseding scoped verdict after correction round 1

**Accepted for the reviewed scope, with two nonblocking copyedit nits below.** All seven original finding groups and all five lower-priority points are resolved in the current immutable files. This verdict supersedes the outstanding-corrections verdict above; the original findings are retained as review history.

Read `/tmp/academy-B2-review-fix.diff`, both appended author reports, and the current changed fields in `B2.json` and `B2-part2.json`, using the pre-fix backups to isolate changed explanations. Reviewed revised choice/read/check prompts, alternatives and keys across the affected units, all first-half rubrics, changed source/model passages, the seven restricted gaps, and the three transfer source sets. Repeated reading-text payloads were not reread per question. No new review of unrelated content and no structural/count/length validator rerun was performed.

| Original finding | Scoped result |
| --- | --- |
| R1 — wrong paragraph reference | Closed: B2.02.r1.e3 names the report's distinction directly; its key and explanation match. |
| R2 — seven open lexical gaps | Closed: each cited gap now specifies the intended lemma, form or identifying stem. |
| R3 — directional approximation claim | Closed: the Russian rule distinguishes non-directional approximation from quantitative aproape. |
| R4 — model/task mismatches | Closed: B2.12 compares training with replacement of the form; B2.09 supplies two prior responses and its own equivalent-set alternative. |
| R5 — generic first-half rubrics | Closed: all eleven sets now use observable criteria for their actual tasks. |
| R6 — implausible distractors | Closed for this correction: replacements use nearby errors of tense, role, scope, status, evidence or discourse function; narrowed prompts preserve a single defensible key. No competing correct option or learner-harming semantic regression found. |
| R7 — missing transfer sources | Closed: B2.19 has facts and two opinions; B2.20 supplies notes, status and deadlines; B2.21 supplies a bounded discussion/report pair and cancellation constraint. |
| Lower 1 — workshop timeline | Closed: the morning museum remains confirmed; the workshop and afternoon planning are conditional. |
| Lower 2 — workload inference | Closed: B2.15 describes increased clarification-case counts rather than measured work volume. |
| Lower 3 — second alternative | Closed: B2.05 distinguishes an incomplete working version from a short fully checked document plus later supplement. |
| Lower 4 — category wording | Closed: B2.21.r2 now uses nu coincide cu cea. |
| Lower 5 — Ada's position | Closed: B2.21 model says initial support rather than exclusive preference. |

Two minor errors were introduced in changed text and can be corrected without changing any key:

- `ACA.B2.06.write.rubric[0].description`: change «Обе исходные предпочтения» to «Оба исходных предпочтения».
- `ACA.B2.20.r1.e2.choices[0]`: change `Ei confirmă efectul asupra cartierului...` to `Ele confirmă efectul asupra cartierului...`; the referent is the three `comentarii`, a neuter plural. The distractor's unsupported inference remains wrong for the intended semantic reason.

The revised material is substantially more useful for B2 discrimination: wrong answers are now usually plausible misreadings, and the writing criteria and transfer inputs support independent work. Extended writing still requires human judgment, as already acknowledged in the author reports.

Integration: all22 reviewed units merged into content/academy/B2.json; temporary part file removed. Applied reviewer exact two nonblocking copyedits: B2.06 rubric «Оба исходных предпочтения»; B2.20.r1.e2 distractor «Ele confirmă». No key changes.
