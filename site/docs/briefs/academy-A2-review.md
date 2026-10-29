# A2 independent linguistic and pedagogical review

Reviewed `content/academy/A2.json` against the content brief, schema, and author report. Read all 18 units' theory, examples, pitfalls, 144 practice items, 72 checkpoints, and all 108 reading questions against their 36 source texts; inspected every writing model and transfer prompt. This was a content review, not a repetition of the already-passing structural/count/word-limit checks. No course content was edited.

## Verdict

**Final verdict after round 2: PASS for the reviewed specification and linguistic/pedagogical scope. All findings A2-R00–A2-R13 are resolved; no open blocker or new regression was found in either fix diff.** The five communicative goals are broadly represented in each unit, the sequence is coherent for A2, and the scenarios are varied and usable. No P0 finding.

## Round 2 final verification

Read `/tmp/academy-A2-round2.diff` and the corresponding current JSON fields. `ACA.A2.06.check.e1` now explicitly requests the present tense; `poate` is the correct finite key, while `putea` is excluded by the stated tense. Its hint and explanation agree with that restriction. The Russian transfer-prompt typo is corrected to `горшок нужно переносить вдвоём`. **R12 and R13 are closed.** No new linguistic or pedagogical problem was introduced by these changes. The author reports the actual grading check accepted `poate` and rejected `putea`; this scoped content verification did not repeat that execution or the unchanged structural tests.

## Round 1 scoped re-review

Compared `/tmp/academy-A2-review-fix.diff` and the pre-fix JSON with the current A2 content, read the appended author report, and inspected all changed prompts, keys, choices, explanations, theory/pitfalls, models, and 18 transfer tasks for new content problems. Did not repeat the already-passing structural tests or reopen unchanged content.

| Original finding | Result |
| --- | --- |
| R00 participle choice | Closed: the prompt now supplies `Ea a ___ filmul` in perfect compus. |
| R01 relative gaps | Closed: both require a one-word relative adverb, and explanations acknowledge alternative constructions. |
| R02 conjunction gaps | Closed: finite banks constrain the intended causal and conclusion markers. |
| R03 necessity gap | Closed: `a trebui` and present necessity are explicit; the additional recipient/quantity cues are also sound. |
| R04 dependent checkpoint | Closed: changed prices are self-contained, and only B fits the total budget. |
| R05 onset/duration | Closed: theory and pitfall permit `De două zile` after `De când`. |
| R06 dative explanation | Closed: `вам адрес` is correctly distinguished from `ваш адрес`. |
| R07 feminine agreement | Closed: both keyed answer and choice now have `cea`. |
| R08 sauce question | Closed: asks the stated composition, without inventing a motivation. |
| R09 false-error pitfalls | Closed: replacements contain genuine agreement errors and accurate corrections. |
| R10 model fidelity | Closed: the noon deadline and already-bought tickets are restored. |
| R11 transfer tasks | Closed: all 18 now contain concrete changed contexts, participants, dates, or constraints. |

### A2-R12 — P1, closed in round 2: name the tense in the revised impersonal gap

`ACA.A2.06.check.e1` now says `Возможность пользоваться двором. Используйте a putea в безличной конструкции: Se ___ folosi curtea.` Its sole key is `poate`, but **`Se putea folosi curtea`** is also grammatical and follows the stated verb/construction restriction; the prompt has not specified present time. Exact fix: `Возможность пользоваться двором сейчас. Используйте a putea в настоящем времени в безличной конструкции: Se ___ folosi curtea.` Keep `answers: ["poate"]`. No other assessment regression was found in the changed material.

### A2-R13 — P3, closed in round 2: Russian typo in a new transfer prompt

`ACA.A2.06.write.transferPrompt`: replace `тяжёлый цветочный горшок нужен переносить вдвоём` with `тяжёлый цветочный горшок нужно переносить вдвоём`.

## Initial findings — historical record, all closed in round 1

## P1 — assessment fairness and independent answerability

### A2-R00 — participle choice does not state the construction being tested

- `ACA.A2.01.e2`: `Выберите причастие a vedea` offers both `văzut` and `văzută`. The feminine form is also a participial form; its rejection only becomes justified in the intended perfect-compus construction, which the prompt does not supply. The explanation invokes lack of agreement with a speaker absent from the actual question.
- Exact fix: `Дополните perfect compus: Ea a ___ filmul.` Retain choices `vedut / văzut / văzută` and key `văzut`; explain that the participle in this compound tense does not agree with `ea`.

### A2-R01 — open relative-clause gaps reject equivalent correct constructions

- `ACA.A2.17.e1`: `sala ___ ne întâlnim` accepts only `unde`, although **`în care`** yields the same meaning and grammatical sentence.
- `ACA.A2.17.check.e1`: `pagina ___ apar biletele` accepts only `unde`, although **`pe care`** is natural for a webpage.
- Exact fix: make both prompts explicitly request the relative adverb: `Дополните относительным наречием места (одно слово): …` This keeps the current finite key `unde`. Alternatively add the genuine alternatives above to `answers` and update the explanation to acknowledge them. Do not teach that a place noun automatically requires `unde`.

### A2-R02 — causal conjunction and conclusion-marker gaps are under-keyed

- `ACA.A2.03.check.e3`: `Я задержусь, потому что работаю: Întârzii ___ lucrez.` accepts `pentru că` / `fiindcă`; **`deoarece`** and **`căci`** also express the requested cause correctly.
- `ACA.A2.03.e6`: `Используйте «итак»` accepts only `Deci`; **`Așadar`** also fits `___ ne vedem la opt`.
- Exact fix: constrain the first with `Выберите связку из двух изученных: pentru că / fiindcă`, retaining both keys. Constrain the second with `Дополните изученной связкой deci` or convert it to a choice item. Merely adding a few synonyms would still leave the task less clearly bounded than a supplied bank.

### A2-R03 — the necessity gap never actually asks for necessity

- `ACA.A2.06.e1`: `Noi ___ să eliberăm holul.` accepts only `trebuie`. **`putem`**, **`vrem`**, and **`încercăm`** produce ordinary grammatical sentences with no conflict with the prompt.
- Exact fix: `Нам необходимо освободить коридор. Дополните формой trebuie: Noi ___ să eliberăm holul.` Alternatively ask for the present form of the explicitly supplied `a trebui`.
- Other bare gaps would also benefit from naming the target word or verb, especially `ACA.A2.02.e3` (`___ scriu părinților`) and `ACA.A2.04.e1` (`___ camere sunt?`). For the latter, add `Сколько комнат?` to distinguish `Câte` from the grammatical question `Ce camere sunt?`.

### A2-R04 — checkpoint requires the first reading and reuses its existing decision

- `ACA.A2.04.check.e2`: asks which offer from the first text suits a 280 budget, but supplies only `B. / C. / A.` and no text or offer facts. The brief requires independently answerable checkpoints with changed context. It also repeats `C`, already selected in `.r1.e1` for included utilities.
- Exact replacement: `Бюджет 280 евро вместе с коммунальными. A: 270 + 30 коммунальных; B: 275, всё включено; C: 290, всё включено. Что подходит?` Choices `A. / B. / C.`, key `B.`, explanation `275 ≤ 280; итог A — 300, C — 290.` This carries all needed evidence and changes the facts and answer.

## P2 — language accuracy and faithful comprehension

### A2-R05 — onset/duration distinction is presented as an absolute prohibition

- `ACA.A2.13.pitfalls[1]` contrasts `De când? — Două zile.` with `De când? — De luni.` and says that only `de cât timp` asks duration. In ordinary Romanian, `De când vă doare? — De două zile.` is valid: a duration can locate the onset relative to now.
- Exact fix: use `wrong: "De când vă doare? — Două zile."`, `right: "De când vă doare? — De două zile."`; reason: `В ответе о продолжающемся состоянии перед длительностью нужно de. De când допускает и исходную дату (de luni), и относительное начало (de două zile); de cât timp прямо выделяет длительность.` Add the same qualification to section 1.

### A2-R06 — explanation converts the recipient into the address's owner

- `ACA.A2.05.e8.explanation`: `vă … trimit adresa dumneavoastră` does not expand the intended dative transparently; `adresa dumneavoastră` means **your address**, rather than **the address to you**.
- Exact replacement: `Vă — краткое дательное местоимение вежливого обращения: Vă trimit adresa = Я отправляю вам адрес. Не путайте его с adresa dumneavoastră — ваш адрес.`

### A2-R07 — keyed reading choice has the wrong pronoun agreement

- `ACA.A2.14.r1.e3`: accepted choice `Dacă diferă de cel de pe aviz.` refers back to **adresa**, feminine. The source text correctly has `cea`.
- Exact fix: replace this choice and its answer with **`Dacă diferă de cea de pe aviz.`**

### A2-R08 — reading question treats a later answer as the reason for asking

- `ACA.A2.08.r1.e1` asks why the customer queried the sauce composition, with key `Sosul are smântână.` The customer learns that fact only when the waiter answers. The text never establishes her prior reason for checking (preference, intolerance, etc.).
- Exact fix: ask `Что, по словам официанта, содержится в соусе?`, retaining the key/choices. Explain that the waiter explicitly says it contains cream. Do not infer an unstated medical reason.

### A2-R09 — pitfalls include acceptable wording as though it were a language error

- `ACA.A2.09.pitfalls[2]`: `mai mic decât cealaltă geantă este aparatul` is marked wrong and rewritten to compare two appliances. Comparing an appliance with a bag can be meaningful, and the marked word order can be emphatic. The correction changes the comparison instead of correcting an error.
- Exact replacement: `wrong: "Aparatul este mai mică decât celălalt aparat."`, `right: "Aparatul este mai mic decât celălalt aparat."`; reason: `Прилагательное mic согласуется с aparatul в единственном числе.`
- `ACA.A2.15.pitfalls[1]`: `Nu am încă primit.` is a possible marked placement, not a reliable categorical error. Replace with unambiguous `Nu a primit eu răspunsul.` → `Încă nu am primit răspunsul.`, explaining auxiliary agreement with `eu`. If retaining the current pair, explicitly present it as a neutral-style preference rather than an incorrect form.

### A2-R10 — two writing models weaken required factual precision

- `ACA.A2.17.write.model` transmits the poster's deadline as `până vineri`, omitting **`la prânz`**, despite the task asking to convey the poster's registration condition. Replace with **`până vineri la prânz`**.
- `ACA.A2.18.write.model` has `Am rezervat deja biletele de tren`, while its prompt says the tickets are already **bought**. Replace with **`Am cumpărat deja biletele de tren`**. These edits preserve the intended length range without changing the task.

### A2-R11 — transfer prompts often name a skill without providing a changed task

- Examples: `.01.write.transferPrompt` promises a new timeline but provides none; `.04` says choose from three advertisements without providing advertisements; `.11` mentions a new date and budget without giving either. These are headings for a possible task, not yet concrete independent transfer tasks.
- Exact examples: `.01`: `Напишите коллеге: в 2023 году вы учились во Львове; с января по апрель 2024 работали в Черновцах; в мае переехали в Сибиу. Объясните перемену и задайте вопрос.` `.11`: `Перенесите бронь R-518 с понедельника на среду: трое гостей, две ночи, бюджет 500 леев всего. Уточните завтрак и предупредите о прибытии около 21:00.` Give similarly changed people, dates, constraints, and recipient to the remaining generic transfer prompts.

## Coverage and limits

The unit chain consistently builds on earlier material; no blocking prerequisite gap was found. Early fixed formulas with `să` and clitics are expanded later, which is workable at A2. Reading questions are otherwise predominantly grounded in explicit details, chronology, selection constraints, and a few simple inferences. All remaining practice/checkpoint keys and corrected pitfall forms reviewed were linguistically defensible under the intended grammatical reading. Distractors are often conspicuously malformed or irrelevant; replacing some with plausible near-errors would improve diagnostic value, but this is secondary to correcting unfair keys.

After the P1 and accuracy fixes, re-review the changed items and their duplicated `answers`/`choices`/explanations. Existing structural checks need only be rerun for content actually changed; this review makes no new claim about those already-passing checks.
