# Independent final A1 review

## Verdict

**Specification: met within the reviewed scope; quality: pass after correction round 1.** All five original findings are addressed at all six affected locations. The scoped rereview found no new linguistic or pedagogical breakage in the fix diff. No unresolved finding remains from this review.

Reviewed `content/academy/A1.json` against `academy-content-brief.md`, the author report and the schema. I read all practice and checkpoint questions, options/keys/explanations, all pitfalls, all reading texts and comprehension questions, all writing models, and the theory/vocabulary supporting them. Existing count/word-range validation was accepted from the author report and was not rerun. This review does not modify the course content.

## Correction round 1 rereview

Compared `/tmp/academy-A1-review-fix.diff` with the six affected locations in the current JSON and read the appended author report. Rereview was limited to the original findings and regressions introduced by those changes; unchanged counts and IDs were not retested.

| Finding | Status | Rereview evidence |
| --- | --- | --- |
| A1-01 | Addressed | `.06.e3` explicitly requests “I wake up at six”; only `Mă trezesc la șase.` matches. The explanation correctly distinguishes both other grammatical options. |
| A1-02 | Addressed | `.01.check.e3` now explicitly says “родом из Львова”, so `din` expresses the requested meaning. |
| A1-03 | Addressed | `.05.check.e3` names `Baia` as the subject, making `are` the required form. Explanation agrees with the visible subject. |
| A1-04 | Addressed | The revised spatial section distinguishes separately named landmarks joined by `și` from a plural group such as `între scaune`. Both constructions are accurately described. |
| A1-05 | Addressed | `.07.e6` now specifically asks for the taught indefinite article, selecting `niște`; `.16.e7` accepts both `dar` and `însă` and explains their suitability. |

The changes preserve the intended learning targets and introduce no audio or speaking requirement. No further correction is requested.

## Original findings (retained for audit; all addressed)

The descriptions below record the prereview problems and suggested fixes; they do not describe the corrected current content.

### A1-01 — P1 — Three correct choices in a single-answer question

**Location:** `ACA.A1.06.e3`.

The prompt is «Выберите правильное утреннее действие». All three options are grammatical morning actions: `Se trezesc la șase.` means “They wake up at six”; `Mă trezesc la șase.` means “I wake up at six”; `Mă trezești la șase.` means “You wake me up at six”. The key accepts only the second. The explanation supplies the missing first-person meaning only after answering.

**Exact fix:** change the prompt to `Выберите «Я просыпаюсь в шесть».` Retain the options/key; explain briefly that `se trezesc` refers to them and `mă trezești` to someone waking me. This makes the plausible distractors useful rather than falsely treating them as ungrammatical.

### A1-02 — P2 — Origin/location not specified in a preposition gap

**Location:** `ACA.A1.01.check.e3`.

`Напишите предлог: Sunt ___ Lviv.` accepts only `din`, but `Sunt în Lviv.` is equally correct and expresses the current location explicitly taught in this unit. There is no origin cue in the question.

**Exact fix:** use `Я родом из Львова: Sunt ___ Lviv. Напишите предлог.` Keep `din` as the sole key.

### A1-03 — P2 — Missing subject makes the verb-form key underdetermined

**Location:** `ACA.A1.05.check.e3`.

`В ванной нет окна: Nu ___ fereastră. Используйте a avea.` accepts `are`, with an explanation that the omitted subject is `baia`. The Russian existential sentence does not establish that subject: `Nu avem fereastră.` can naturally mean that we have no window in our bathroom. A checkpoint testing conjugation should identify the person rather than infer it retrospectively.

**Exact fix:** use `В ванной нет окна: Baia nu ___ fereastră. Используйте a avea.` Retain `are`.

### A1-04 — P2 — Categorical spatial rule excludes a correct construction

**Location:** `ACA.A1.04`, section «Где находится вещь»; compare the `între` word card.

The instruction `После între назовите два ориентира, соединённые și` reads as a requirement. The same unit correctly gives `Masa este între scaune.`, without two explicitly named landmarks or `și`. A learner following the rule would regard this correct pattern as invalid.

**Exact fix:** replace the instruction with `Если вы называете два ориентира отдельно, соедините их словом și: între carte și lampă. Можно также назвать группу во множественном числе: între scaune — между стульями.` Existing examples can remain.

### A1-05 — P2 — Two lexical gaps need a finite, explicit target

**Locations:** `ACA.A1.07.e6` and `ACA.A1.16.e7`.

`Некоторое количество яблок: ___ mere.` accepts only `niște`, although `câteva mere` is a valid expression for an unspecified small quantity. `Добавьте «но»: Am citit, ___ nu am răspuns.` accepts only `dar`, although `însă` also works. These are valid Romanian alternatives, even if the lesson principally teaches one form; the prompt must define the closed task or the key must accommodate them.

**Exact fixes:** for `.07.e6`, use `Вставьте изученный неопределённый артикль перед множественным числом: ___ mere.`; for `.16.e7`, retain the prompt and accept both `dar` and `însă`, with an explanation that this lesson practices `dar` and `însă` is also possible. Alternatively explicitly ask the learner to use the conjunction taught in the unit.

## Positive findings and practical limits

All five stated goals in each unit receive identifiable teaching or contextual application. The progression supports introductions, family, numbers, space, housing, routines, shopping, services, travel, health communication, delivery, neighbour interactions and a limited introduction to past/future messages. Material is substantively varied; useful recycling of time, quantities and politeness does not amount to repeated whole-lesson templates.

Romanian forms and agreement were generally sound, including `doare/dor`, `place/plac`, neuter plural agreement, `pot + infinitive`, `vreau să`, and perfect-compus auxiliaries. Russian explanations were understandable. Reading keys were supported by the texts; changed schedules, prices, routes and unavailable products required attention to meaning. The writing models were coherent and usable at this scope. No listening, pronunciation, recording or speaking performance was required: telephone/dictation scenarios are taught through text. The course remains a text-only A1 pathway, consistent with the author's stated limitations.

Correction round 1 rereview is complete for the changed prompts/keys, explanations and the revised `între` rule. Structural/count validation remains supported by the author’s reported passing checks; it was not repeated during this scoped linguistic rereview.
