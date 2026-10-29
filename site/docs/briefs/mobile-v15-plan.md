# Phone usability and device handoff

User request: make the existing Romanian course comfortable on a phone and explain opening it on phone and laptop. Prior user authorization covers implementation, independent QA with lighter models, and publication.

Approach: retain the responsive web application and private ChatGPT identity. Improve the small-screen layout; use browser home-screen shortcut rather than a separate native app or an offline learning engine. The owner chose the existing website; specific responsive implementation choices are delegated to us.

## Constraints
- Keep course content, grading, progress semantics, authenticated per-user storage, and existing audience intact.
- Separate theory/practice, no synthetic audio, no per-question production tasks.
- No offline guarantees. Pending unsaved work currently lives in the open tab; say so where relevant.
- No new packages. Root owns source helper, final build and publication.

## Tasks
1. Implement targeted phone layout fixes: touch targets >=44px for important controls; safe-area padding; readable input text >=16px; no page-width overflow at 320/390/430px; action feedback/buttons in normal document flow on small screens to avoid fixed-footer and keyboard overlap. Preserve desktop focus layout. Simplify redundant mobile menu if bottom navigation covers all sections. Make wide theory tables scroll locally. Add a compact device-use/help surface under Progress with same-account and saved-state instructions; root supplies platform wording. Consider manifest/home icon only if straightforward using current assets, no offline caching.
2. Independently inspect sync implementation and write meaningful two-client shared-transport tests showing saved answers/words/drafts merge, refresh and no duplicate XP. Keep behavioral changes minimal and evidence based; recommend separately if needed.
3. Browser QA on route, navigation, exercises (choice/gap/order, correct+incorrect), dictionary, theory/table, Life/B2 pages, help; use 320/390/430 CSS-pixel frames and desktop. Real iOS keyboard and authenticated cross-device browsers unavailable: state this limit.
4. Review diff, run existing tests, tsc, relevant validation and production build, package and publish private Site. Explain phone/laptop opening and save-before-switching.

## Ledger
- Source opened at d9dd9715ea62fe5a557c4b9cd84acf8dee46f316, build/romanian-course clean; owner-private confirmed.
- Existing findings: practice fixed footer can overlap lower answers; mobile search/select text is 13–14px and may trigger iOS zoom; sidebar and bottom navigation duplicate each other; broad theory module tables lack a scroll wrapper. Server progress is user-ID-bound; refresh occurs on visibilitychange. Pending events are memory-only.
