# Integrated candidate validation

2026-10-28; baseline aadfd051ce0c67623a4539a4282356a0fb25a470. All four final level files integrated.

- Academy audit PASS: 76 units (16/18/20/22), 152 readings, 912 word entries, 1,368 objective tasks. IDs, prerequisite sequence, sources, finite answer structure, ordering bags, original controls, Russian theory minimum and level reading/model lengths checked. No errors.
- Full node test suite PASS: 96/96, zero failures, cancellations or skips. Includes server-adjudicated cards, invalid input, custom edit/delete, two-client replay/sync, writing draft/revisions/model exposure, and history compatibility.
- TypeScript noEmit PASS. git diff --check PASS.
- Existing content/teaching/depth validators PASS; 192 legacy lessons, 48 modules, 882 legacy dictionary entries, zero synthetic audio tasks.
- Independent baseline audit: 18 legacy JSON files, 4,392 IDs and 4,621 answers/choices/tokens fields, zero compatibility violations. See text-course-compatibility-audit.json.
- Official Sites production build helper PASS through all five environments. Nonfatal Vite large-chunk warning: course catalog is bundled eagerly. No build error.
- Every new level independently edited/reviewed; findings and scoped fixes in academy-*-review.md. B2 two approved exact copyedits applied during integration.
- Desktop and 390/320 responsive flows checked with managed preview; see text-course-browser-qa.md. Temporary mobile harness removed. Browser was signed out: optimistic guest interactions only; authenticated persistence is not claimed as browser-tested.

Publication pending final whole-branch review.

Integrated runtime catalog import: exerciseMap4000, exerciseOwner4000, wordMap1794, wordRecallMap1794, legacylessonMap192.

Final release gate:107/107 full tests after consolidated fixes,26/26 focused,types/allcontentvalidators pass. Scoped review accepted main findings; exact fresh-submit-clock residual correction covered by22/22 cards/exposure regressions and final type/diff checks. Final official source-helper build/packages this exact state. Browser proof documented. Publication is the remaining native-tool step.
