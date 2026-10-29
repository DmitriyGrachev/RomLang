# Expanded course browser QA

2026-10-28, managed preview http://terminal.local:4173/, cloud browser. Internal QA only.

- Desktop: main route shows expansion entry; program opens; unit theory and six section tabs render. A1 reading question with typed answer Odesa grades correctly and displays specific evidence.
- Writing: typed Romanian draft, saved explicit revision, portfolio count increased to1; word count and model-exposure label visible. Server status correctly remains sign-in-required in guest session.
- Cards: customcard fereastră/окно created in gueststate; customdeck selects it; typed correct recall producescheckedfeedback andnextdaydue; roundfinishes. No realuserrecords used.
- Mobile: same app rendered in390px and320px iframe viewports in temporary local QA HTML. Appbody375/305px (scrollbarincluded) equals scrollWidth; nohorizontaloverflow. Program/tabs/readinginput, fullcardtranslation+forms+example, remember/againbuttons, writingtextarea andbottomnavigation inspected. Againqueuescardandadvances.
- Temporary HMR resets occurred while authors updated JSON; no inference of production state loss. Testing resumed on fresh observed UI. A transient preview load error recovered after content became valid; no infrastructure workaround used.
- Durable server persistence under the user's signed-in identity was not exercised in this guest preview. Validation/replay/import/draftcoalescing are covered by automated tests. Do not claim authenticated end-to-end persistence was browser verified.
- Temporary public/_qa-responsive.html must be removed before packaging. Browser previewtabs are QA, notuserdeliverables.

Final integrated browser check: cards show1794; route banner76sections/152texts; full B2 catalog22sections/44texts including B2.12–22 reachable. Stale B2.21 domain label and card plural copy reported to final reviewer for consolidated fixes. No production account mutations.

Final frozen-source fix QA PASS: B2.21 transfer prompt+draft+revision scenario label survived WritingEditor unmount via Words tab; main-specific Ada rubric replaced by applicable transfer criteria. Unseen B2.21 control -> Words -> return -> correct rezervă resulted in profile0/1 independent. Cards: reveal nume without rating -> leave route -> Cards recall -> correct nume displayed Попытка с подсказкой, recall due next day; recognition schedule remained untouched. Final rendered counts1794карточки and B2.21 written domain correct. HMR legacy-memory missing-map crash observed during development, patched with regression; clean reload frozen-source no such error. Signed-out browser limits remain; no authenticated data changes.
