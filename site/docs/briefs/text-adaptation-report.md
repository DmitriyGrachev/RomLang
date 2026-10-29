# Legacy text-only course adaptation

Completed the content and component scope assigned in `text-adaptation-brief.md`.

## Exact changes

- Adapted **148 existing production/transfer prompts**: **98 lesson tasks**, **43 checkpoint tasks**, and **7 life-transfer tasks**. These include previously ambiguous oral prompts made explicitly written, not only prompts containing the word “audio”.
- Adapted **4 retained legacy `B2.speaking*` prompt records** to written source-based analyses. Their IDs and five-entry rubrics remain for compatibility; the speaking tab is removed. Total distinct adapted task prompts: **152**.
- Changed **289 scalar content values across 15 legacy JSON files**, including task prompts, matching criteria/models, core/detail/theory instructions, resource scope notes and readiness metadata.
- Preserved all object keys, array lengths, content IDs, answer arrays, choices, ordering tokens, exercise types and dialogue routes. A recursive before/after audit found **0 preservation violations**. Existing rubric/checklist lengths are unchanged.

## Written sources and practice

- `B1.21` now includes its complete written meeting-location source in the production prompt; its example separates unchanged day/time from changed location.
- `CHECK.B1.6` includes both an announcement and its written update, with a matching model, synthesis, clarification question and reading/writing reflection.
- `B1.17` includes an initial written appointment and correction, with a matching model and an explicitly missing address.
- `B2.16` includes a complete written exchange containing shortened forms and two genuine information gaps.
- B1/B2 integration tasks use written summaries, written objections/questions, revisions and explicit self-assessment rather than recordings, timed speech or required partners.
- A1 spelling tasks retain written phonographic/orthographic study while replacing sound-production checklist conditions with inspectable written criteria.

## Components

- `ProductionPanel`: removed spoken checkbox/state/event field; retained saved written responses, criteria, model exposure and completion behavior. Optional ChatGPT copy prompt is written feedback; completion does not require it.
- `ExamView`: removed speaking tab and audio assignment; readiness shows reading, grammar/vocabulary and writing. All four writing tasks link to the new `writing` page with their existing IDs. Reading/grammar banks remain intact; additional sources are optional and certification limits remain explicit.
- `ReferenceView`: removed listen-first directions, made external resources optional, and linked the academy, readings, writing and cards pages.
- `LifeView`: transfer work is independent writing; the UI clearly says its separate scratch answer is not saved or automatically graded.
- `MissionView`: preserved the `realLife` event and saved journal; the final journal is an optional written scenario/reflection without a required real conversation.

## Audit result

**0 required listening/speaking/recording tasks remain in this owned scope.** Written dialogues, fictional situations about calls/hearing/speech, pronunciation descriptions, dictionary examples and original objective answer choices remain where they are reading material. Optional external resource titles may still mention official audio. No oral-only assignments were intentionally left outside scope in the owned files. Navigation and other root-owned components remain the integrating agent's responsibility.

## Verification

Passed:

- `node scripts/validate-content.mjs`
- `node scripts/validate-teaching.mjs`
- `node scripts/validate-depth.mjs`
- `node --experimental-strip-types --test tests/engine.test.ts tests/history.test.ts tests/learning-flow.test.ts tests/life.test.ts` — **26 passed**.
- `node --experimental-strip-types --test tests/depth-catalog.test.ts tests/life-catalog.test.ts` — **8 passed**.
- `npx tsc --noEmit` — exit 0 after all academy source imports became available.
- `git diff --check` for the owned content/component scope — clean.

An earlier type/catalog run was temporarily blocked by then-pending academy A1/B1 source files; the subsequent runs above passed after those files arrived. No commits were made.

## Review fix: one writing-model exposure surface

Removed all four duplicate inline writing-model displays and model-copy controls from `ExamView`. The writing list retains task titles, prompts, lengths, plans, criteria, transfer prompts and existing task-specific links to `WritingStudio`. Models and annotations are now viewed only in the studio, where the existing writing event records sticky model exposure before a later revision can be labeled independent.

Verification after this fix:

- `node --experimental-strip-types --test tests/writing-records.test.ts` — **3 passed**, including sticky model exposure and revision replay.
- `npx tsc --noEmit` — exit 0.
- Source check: `ExamView` contains no `x.model`, `x.annotations`, or model-copy control.
