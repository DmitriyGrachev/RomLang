# Phone usability verification — 2026-10-28

Scope: responsive UI, device-use instructions, and existing cloud-sync coverage. Course content, scoring, event schema, private audience and authenticated storage remain unchanged.

## Browser evidence
- Managed preview `http://terminal.local:4173/`, Chrome through the supported CUA browser. Mobile CSS frames 320×640, 390×844 and 430×932; desktop 1363×936. These are viewport tests, not physical iOS/Android tests.
- Independent mobile QA: route/navigation, dictionary search (`cuvânt`) and word detail; B2.05 theory, B2 module summary to final dialogue action; Life A1/B2 tabs/cards/preparation and B2 reading/writing tabs. No page-width overflow or unreachable controls on these routes. Wide rule tables scroll inside their wrappers.
- Root: A1.03 choice wrong → retry → correct; gap `ești` including the on-screen `ș` button; order `Ea este profesoară`; reading choice; Next focus. Final next question has `:focus=true` and top118px. Form controls and action buttons remain in document flow on phone; save-status is sticky. At390 frame, body width/scrollwidth375/375; at320 frame305/305 (desktop scrollbars consume15px).
- Last visual polish raises bottom captions to11px (10px at<=350). At320 the five button widths are60.2px, at39074.2px; heights>=44px. No document overflow after the change. Desktop sidebar/navigation and exercise grading remained functional; action panel remains fixed on desktop.
- Help disclosure in Progress displays Safari Home Screen steps, same-account use, saved-before-switching, second-device refresh, and memory-only pending answers.
- Screenshot: `docs/qa/phone-update.jpg` shows a mobile reading choice and non-overlapping Check/Back panel.
- Fresh final desktop app-filtered console errors/warnings: none. Earlier transient missing-CSS Vite overlay and RSC connection-closed during source edits/server restart cleared with the managed preview restart; excluded from final runtime findings.

## Independent review and synchronization
- Final source review closed the mobile question-focus finding: focus always moves to the visible question; scroll remains conditional. Hidden preserved exercises do not take focus. No remaining material source findings.
- Two added unit tests use two independent clients sharing a validating in-memory server transport: saved answers, drafts and dictionary state refresh in both directions; repeated correct answers do not duplicate XP; failed save stays pending and is invisible on the other client until retry succeeds.
- Full suite before final packaging:74passed,0failed. TypeScript, content validators and diff whitespace checks passed. Final production build/checks run through the source helper after removing the temporary mobile harness.

## Limits and user guidance
- Anonymous preview returns expected401 for persistence. No production user learning data was written. Authenticated two-device browser handoff and physical software keyboards/Safari VoiceOver were not tested.
- Existing server API scopes events to the stable authenticated Site user ID. Open the same site and ChatGPT account on both devices. Wait for `Прогресс сохранён`, then open or refresh the second device. Active mounted answer fields/cursors do not live-update from other devices until remount/reload.
- Network is required; pending events only live in the open tab. No service worker, offline guarantee, PWA installation promise, synthetic audio or dependency was introduced.
