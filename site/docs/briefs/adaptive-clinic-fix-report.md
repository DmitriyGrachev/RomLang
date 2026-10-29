# Adaptive clinic follow-up

- Clinic and training error groups now receive the full exercise catalog. An attempted, unresolved A1.1 bank failure therefore appears under its authored topic through `exerciseOwner`; untouched bank items do not appear because `errorGroups` requires an attempt.
- A1.1 personal-error preparation now uses that topic's authored rule, examples, and full word list, then selects additional bank questions matching failed-item tags. If there is no tag match, it uses the full topic bank. This lets a bank failure retry its known question alongside matching variants. The UI labels this honestly as “Дополнительная практика.”
- Other lesson error groups retain their failed core exercises and current theory preparation. Explicit selection of all four A1.1 topics, frozen batches and baselines, answer/reference Back behavior, and the no-finish contract are unchanged.
- Added helper coverage for bank-only failure grouping, tag-matched selection, bank retry with variants, and topic-wide fallback.

Checks: `npm test` (59/59), `npx tsc --noEmit`, scoped ESLint on the four clinic files, and `git diff --check` all pass.
