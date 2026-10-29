# Course depth integration

Working tree: `/workspace/sites/romana-militari`, existing `build/romanian-course` branch. No commits, pushes, publication, database/authentication changes or dependency changes.

## Engineering changes

- `app/components/CurriculumView.tsx`: collapsible full-program module cards, per-lesson direct theory/practice links, checks/dialogues, module-route entry, searchable title/rule/goal/Romanian examples/ID. Cards collapsed by default; search opens relevant matches. Native details and descriptive link labels support keyboard/screen-reader use.
- `app/components/RouteView.tsx`: full program is the default Учиться view; visible switch preserves focused module path. Global/level counts come from catalogs. Icons cycle safely; check/dialogue numbers derive lesson count. Today shows distinct attempted questions without an arbitrary daily completion target. Repeat queue is directly accessible. Weekly rhythm and 60/75/90 time breakdown reuse `sessionPlan` and saved minutes preference; external listening is identified.
- `app/learning-app.css`: responsive curriculum/search/actions/rhythm styling. Existing mobile practice remains intact.
- `lib/course/curriculum.ts`: actual catalog counts and accent-insensitive curriculum search.
- `lib/course/depth.ts`, `data.ts`, `support.ts`: merge all four authored catalogs into level/module/lesson/checkpoint/mission/dictionary exports and explicit teaching. Existing foundation objects/IDs/answers remain unchanged; supplementary banks stay outside core completion. Module IDs have their own namespace: mandated module `A1.10` can coexist with legacy lesson `A1.10`.
- `lib/course/version.ts`: course version 1.5.0; regression coverage explicitly replays stored 1.4.0 events and accepts them on import.
- `ProgressView.tsx`, `ReferenceView.tsx`: replace fixed 96/24 counts with actual catalog denominators.
- `scripts/validate-depth.mjs`: per-level author checks (`--level A1`) and strict all-four release validation. Checks identity/ownership, IDs/prerequisites, format mix, choices, order token construction, readings, explanation/example/sheet/preparation floors, dictionary stress/forms/examples/ownership, dialogue translations/branching/reachability/termination/three-turn success, duplicate exact lesson/item detection. A second duplicate gate ignores prompt/ID/hint/tag wrappers and flags repeated choice/read/order substance, including copies of base items; common gap answer words are exempt. Romanian fields require Latin and no Cyrillic; dictionary English also requires Latin and no Cyrillic. Thresholds are a structural floor, not language certification or semantic review.
- `scripts/validate-content.mjs`, `scripts/validate-teaching.mjs`: expanded release gates and combined catalog counts.
- `tests/depth-catalog.test.ts`: complete/reachable curriculum; all base assets and answer semantics preserved; old history replay/duplicate safety; new progress entry and next-module recommendation; new grading/teaching/owners; bank exclusion; validator positive/negative cases.

## Verification ledger

- Full test suite: **79 passed, 0 failed**. Output: `/workspace/scratch/838bd61425ba/depth/tests-final.txt`.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit` passed, exit 0.
- `node scripts/validate-content.mjs`: passed; 4 levels, 192 lessons, 48 modules, 48 checkpoints, 2,304 core objective items, 882 dictionary entries, 96 mission variants.
- `node scripts/validate-teaching.mjs`: passed; 48 missions prepared, 1,140 translated mission occurrences, 120 explicit lesson supports (48 A1 plus 72 new A2–B2), no missing mission translations or synthetic listening tasks.
- `node scripts/validate-depth.mjs`: passed all-four release structure; 96 new lessons, 1,344 new core questions, 440 new dictionary entries. New reading lengths by level: A1 44–55 words, A2 71–89, B1 112–128, B2 151–175.
- Existing `validate-life.mjs` and `validate-practice.mjs` passed: 16 life units, 256 life questions, 40 exam questions, 32 extra pilot questions; all 328 supplementary questions remain outside core completion.
- Direct exported-catalog query: **2,632 total objective items = 2,304 core + 328 supplementary**. Counts are measured; no planned/placeholder rows are included.
- Existing 74 tests also passed before and after the course-version bump. Modified-file ESLint passed before root requested no further lint work.

## Content review and remaining release work

Independent B1 semantic review is recorded in `/workspace/scratch/838bd61425ba/depth/B1-review.md`; findings were sent to the B1 author for correction. Root owns final semantic freeze across all four levels, desktop/mobile preview QA, production build and publication. No build, additional server, commits, pushes or publication were performed by this agent.

Structural gates do not establish native-level correctness, prove every possible grammatical answer is accepted, or certify CEFR. Existing saved progress remains compatible; new imported answers are checked under the current course version as before. Open speech/writing remains self-check practice. Listening is explicitly directed to external material, with no TTS substitution or automatic oral grading.
