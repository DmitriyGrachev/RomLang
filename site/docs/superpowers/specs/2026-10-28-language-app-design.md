# Română — learning app redesign

User authorizes continued implementation, asks for Duolingo/Lingualeo-like app experience, subagent analysis, weaker models for implementation/testing, root as orchestrator, and QA. This is a continuation of the same private Site, not a new product or course.

## Direction
A playful but adult-friendly original learning app. TRUE WHITE canvas, rounded sans typography, emerald actions, mint selection/feedback, gold checkpoints, tactile lower button borders, open zigzag course path. No copied branding, mascot, currency, lives, leaderboards or artificial content locks. Existing 96 lessons / 24 modules are the substance, not fake demo data.

Approaches considered: cosmetic recolor would leave the planner/article structure unchanged; complete curriculum rewrite would risk learning history and exceed the problem. Selected: preserve course/storage, redesign the learning loop and information hierarchy; add lightweight vocabulary recall practice. Builder choice under the user's instruction to continue.

Reference: docs/design/learning-map-v2.png (generated layout guide). The focus exercise concept will be stored beside it. Data-driven curriculum titles and existing exact question wording override illustrative mockup text. Auth/save notices are required even where omitted from mockups.

## Product behavior
- Five nav destinations: Учиться (route), Тренировка (training), Словарь (dictionary), Справочник (reference), Прогресс (progress). Query routing/back/forward preserved.
- Course route: title Твой румынский, шаг за шагом; short subtitle; level selector; module previous/next and select; six selectable tactile path nodes (four topics, checkpoint, dialogue). One active node popover with start/resume/repeat and reference link. All topics stay accessible. New topic primary opens theory; started topic resumes practice.
- Daily sidebar derives unique questions attempted today from snapshot attempts using local calendar dates, target eight, plus actual total XP. Do not infer skill mastery from XP. Main training CTA opens training hub. Long 60–90-minute planning detail moves out of the course first viewport (existing preferences remain on progress/settings).
- Practice is immersive: no sidebar/bottom nav; top exit, progress, optional reference. One question, tappable choices/tokens/input, subtle hint. Feedback uses success/error panels, canonical answer and explanation. Retry keeps assistance sticky and history intact. Completion shows actual lesson results, next topic and return to map/repeat; free production stays module-end only.
- Training hub starts existing scheduled review/errors/fresh exercises and a six-word recall deck. Vocabulary deck uses current-level/saved words, explicitly self-assessed; reveal then Вспомнил / Ещё раз. No synthetic audio, XP or false persistent mastery for self-ratings. Failed cards return later; show honest round results and restart.
- Theory remains separate and substantial: short initial rule/examples, words-and-phrases stage, detailed explanation/comparison available, visual sheet always reachable. No removal of prerequisites; full module words remain reachable without repeated word dumps. Mission prep includes translations for every option, not only correct replies.

## Design system
White #ffffff; ink #23332d; primary #20a66a; primary dark #168554; mint #ecfaf1; border #e5e9ed; muted #77838d; gold #f6bf44. Sans system UI with rounded character where installed; no network font dependency. Desktop rail 230px; route center +280px side rail; max readable practice 680px. Mobile bottom nav and single-column route; circles and popup must fit 390px width. Icons: existing lucide, 2px outline, consistent 20–24px chrome /30px path. Rounded 12–18px components, thick lower edge on primary buttons/choices/nodes. Motion only selection/feedback, reduced-motion supported.

## Invariants
No audio/speechSynthesis. Theory/exercises separate. Production only CHECK.*. Dima is from Ukraine, lives Bucharest/Militari. Preserve project ID, owner-private audience, course IDs, content answers, event payload semantics, D1 schema, history, historical listening scores, assistance/model exposure, XP idempotency and export/restore. No paid runtime AI or fake AI grading. Course version remains 1.2.0 because learning content contracts are unchanged.

## QA acceptance
31 baseline tests pass. Add meaningful helper regression tests for daily counts, next topic and vocabulary retry queue as implemented. Run all tests, typecheck, content/teaching audits, build. Browser QA: course selection/level/module, separate theory, all exercise types/incorrect retry/hint, completion/repeat, dictionary training/retry/empty saved set, review, prepared dialogue and direct links/back. Check desktop and390px layout, no clipping/overflow or app console errors. Preview anonymous sign-in limitation must stay honest; do not claim authenticated persistence verified.
