# Adaptive word UI implementation

## Delivered
- `WordTrainer.tsx`: due, current-level, and saved-word pools; separately selectable RO→RU recognition self-rating and A1.1 RU→RO typed recall; six-word preparation with translations/examples before a round; constrained prompts, shared `grade` feedback, missing-diacritic correction, canonical form and authored note; missed/revealed words return later, subsequent same-round attempts marked assisted. Every answer, including typed reveal (`answer:''`, `assisted:true`), goes through `Learning.send('wordReview', ...)`; no XP logic or learner localStorage.
- Visible save status in practice uses existing sync status and the app's sign-in/error banner. The completion copy reports actual first-try and attempted counts without claiming CEFR mastery.
- `DictionaryView.tsx`: preserved search, filters, bookmarks and notes; added per-mode real due date, count and recent checked/self-assessed history, spelling and assistance markers.
- `ProgressView.tsx`: per-mode real due counts, attempts, unassisted correct count, latest recorded answer, and links to practice and dictionary. Export explanation includes word history, whose schedules are replayed from events.
- `app/word-memory.css`: responsive white/emerald preparation, typed response, history and progress surfaces. Layout import is handled by clinic owner.

## Verification
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec eslint app/components/WordTrainer.tsx app/components/DictionaryView.tsx app/components/ProgressView.tsx`: passed.
- `git diff --check` for assigned components: passed.
- Reviewer-found preparation bypass corrected: selecting “Посмотреть слова” now enters preparation; only “Начать проверку” enters the drill. The return action is labeled “Выбрать подборку”. Re-ran TypeScript, targeted ESLint and diff check after correction.
- Reviewer follow-up: due decks now always draw from the earliest remaining records, with a per-visit checked cursor for helped answers that remain due. Initial preparation shows only words with no recorded attempt; a fully known deck starts the check without preparation. An explicit restart shows all cards and flags their immediate answers as assisted. Recent failed or assisted attempts in the same direction also flag immediate re-entry for 24 hours. Dictionary and progress due clocks refresh each minute and upon returning to the tab. The saved-word tab counts only entries eligible for its direction.
- `tests/word-ui.test.ts`: three pure-helper tests cover the 14→8→2 shrinking due pool, unseen-only initial preparation versus explicit full restart, and assistance after failures/reveals/restarts. These pass with TypeScript, targeted ESLint, and `git diff --check`.
- Local exposure from full preparation and abandoned recognition reveals expires after 24 hours, allowing a later due check without stale assistance. A helped due word already checked in this visit is skipped by “Другая подборка” while its real due count remains visible. The UI distinguishes an answer just recorded with assistance from a *next* assisted attempt after a miss.
- Confirmed core validation accepts empty assisted recall for reveal and grades curated answers through the same `grade` function. Read four of the 18 new constrained recall prompts against the UI.

## Remaining QA / limits
- Desktop and 390px browser flows and authenticated refresh/persistence require integrated QA by root; no signed-in session was used here. Client sync displays pending/error/sign-in honestly and will reconcile with server adjudication.
- Typed recall is intentionally limited to 18 authored A1.1 words. A2–B2 remain available for recognition but carry no typed recall prompts. The due pool contains only previously recorded, currently due words in the selected mode.
