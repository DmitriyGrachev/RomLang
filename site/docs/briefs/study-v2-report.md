# Task 3 · Study and word training

## Behavior
- Theory opens with a short rule and two translated examples, then a words-and-phrases stage. Full lesson detail, Russian/English comparison, all examples, and the visual sheet are separate reachable tabs. The complete module vocabulary stays inside an expandable section of teaching notes, and the sheet does not repeat the visible list in this view.
- Mission preparation lists the translated utterance and **every** candidate response for the selected situation. Guided and independent dialogue behavior and events are unchanged.
- Training hub links to the existing exercise review and a six-word, self-rated recall round. A missed word returns to the queue until recalled. Reveal is required before rating. The end screen reports first-try words, misses, and total ratings, with replay, an alternate pool window when it contains a new word, and exit. Restart is also available mid-round. Saved-word empty state offers level words and dictionary. Ratings send no events and add no XP.
- Dictionary search, bookmark, notes, and lesson links remain; a training action opens word practice.

## Checks
- `node --experimental-strip-types --test tests/word-round.test.ts`: 3 passed, including retry and empty/rotating pools.
- `npm test`: 41 passed.
- `npm run check:content`: 96 lessons, 442 words, 960 exercises.
- `npm run check:teaching`: 564 translated mission utterance occurrences; zero unknown phrases.
- `git diff --check`: passed.
- `tsc --noEmit`: passed after the concurrent route/activity typing changes were reconciled.

## Integration notes
- CourseApp must dispatch `training` to `TrainingView` and `words` to `WordTrainer`, both with `{learning,navigate}`. Layout must import `app/study-app.css` after the shared stylesheet.
- Browser QA of the rendered stages, recall round, and 390px layout remains with integration owner.
