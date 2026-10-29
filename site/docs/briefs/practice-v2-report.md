# Focused practice and review implementation

## Behavior
- Lesson practice has an exit, accurate 0-to-total progress, a reference link, a centered prompt, tactile answer controls, and a fixed action area. The previous action appears in that footer only when available. The existing question wording and all four exercise types remain intact.
- Feedback replaces the check action state, displays the canonical answer and explanation, and offers retry on an incorrect answer. Retrying clears the draft for that question, leaves the recorded failed attempt in history, and remains assisted through the snapshot attempt/assistance flags. A learner may also continue after an incorrect attempt. Valid-answer reports retain the checked answer and context.
- Lesson completion uses recorded attempts and actual snapshot XP; a round baseline distinguishes answers made during the current page visit from historical answers. The completion route handles next theory, module checkpoint, return to map, and replay even when the lesson was completed before this visit. CHECK.* continues to use the existing ProductionPanel; normal topics never show production.
- Review lets the learner choose due, latest errors, or fresh exercises from failed tags before a round. Starting freezes the batch and attempt baseline. Finishing summarizes only attempts made in that round, with actual XP delta and a way to repeat the same batch or select another. Reference assistance remains recorded.
- The summary labels `Заданий с повтором` because the counter measures questions retried at least once, not the number of extra submissions.
- Hidden choice radio inputs give the whole answer option a visible keyboard-only focus ring; pointer selection keeps its mint selected style.

## Checks
- `node --experimental-strip-types --test tests/round.test.ts`: 2 passed (source selection and round baseline).
- `npm test`: 42 passed after the concurrent route test settled.
- `./node_modules/.bin/tsc --noEmit --pretty false`: passed after concurrent shell changes settled.
- `./node_modules/.bin/eslint app/components/LessonView.tsx app/components/Exercise.tsx app/components/ReviewView.tsx lib/course/round.ts tests/round.test.ts`: passed.
- Follow-up scoped check after the label correction: round tests 2/2, TypeScript, scoped lint, and `git diff --check` passed.

## Follow-up QA
- Rendered desktop and 390px exercise/review flows still need the root's browser QA pass, including feedback footer height, reference navigation, retry, completed lesson replay, and checkpoint production. Anonymous preview cannot prove authenticated persistence.
