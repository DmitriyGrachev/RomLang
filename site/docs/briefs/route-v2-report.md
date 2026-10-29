# Course route and shell implementation

## Files

- `app/components/CourseApp.tsx`: five destination navigation, training and word practice dispatch, focus shell, existing query and popstate behavior, persistent save and sign-in notices.
- `app/components/RouteView.tsx`: four level tabs, accessible module select and adjacent arrows, six selectable curriculum nodes per module, one action popover, theory first for unstarted topics, practice for attempted/completed topics, honest daily question count and total XP, training entry.
- `app/layout.tsx`: globals, learning, practice, study CSS imports in that order.
- `app/learning-app.css`: white/emerald shell, tactile path and responsive mobile/focus presentation.
- `lib/course/activity.ts` and `tests/activity.test.ts`: local calendar unique question count, module recommendation through checkpoint and independent dialogue, completed dialogue history after guided replay, topic entry state.

## Follow-up fixes

- Completed topic/checkpoint actions send blank draft events for their exercise IDs and cursor zero before navigating. Historical attempts, completion, and XP remain intact. Direct lesson entry and started lesson resume still use the saved cursor.
- `CourseApp` keeps exactly one `ReviewView` instance mounted after loading, hidden and inert outside `page=review`. The frozen batch, question, and feedback survive opening reference and using browser Back.
- It likewise keeps one `RouteView` instance mounted, hidden and inert on known non-route pages. Module/node selection survives theory and browser Back. Unknown page values still show the course route.
- Visual follow-up in `app/learning-app.css`: the selected node's separate title button is hidden while its named circle button and popover remain; outline buttons suppress Tailwind's resting outline and retain a visible `:focus-visible` ring.
- Mobile/focus follow-up in `app/learning-app.css`: the save-status live region is positioned in normal flow after main content, with bottom space for the mobile nav; it no longer floats over the active CTA or practice header. Sign-in/error banners are unchanged.
- Final desktop fidelity pass in `app/learning-app.css`: active popover anchors 22px after its 79px circle and caps width to the remaining row; mobile resets its left anchor so the existing wrapped card layout remains.

## Verification

- `node --experimental-strip-types --test tests/activity.test.ts`: 7 pass.
- `TZ=America/New_York node --experimental-strip-types --test tests/activity.test.ts`: 5 pass before later regressions; those cases are timezone independent.
- `npm test`: 43 pass after follow-up regression.
- `./node_modules/.bin/tsc --noEmit`: pass after final change.
- `npm run check:content`: pass, 96 lessons / 24 modules / 960 exercises.
- `npm run check:teaching`: pass, zero synthetic audio tasks or unknown mission phrases.
- `git diff --check`: pass.
- After the CSS-only follow-up, `tsc --noEmit` and `git diff --check`: pass. Updated browser screenshot remains for root QA.
- After save-status CSS fix, `git diff --check`: pass. Root to recapture mobile and focus screenshots.
- After popover anchor CSS fix, `git diff --check`: pass. Root to recapture desktop selected nodes.

## Integration concerns

- The CSS imports expect `app/practice-app.css` and `app/study-app.css` from the parallel implementers; both now exist. Browser layout and authenticated persistence are left for the root integration QA.
- Snapshot mission state is keyed by `missionId.variant`, and guided replay can replace a variant's last record. The route consults historical mission events to retain prior independent completion without altering schema.
