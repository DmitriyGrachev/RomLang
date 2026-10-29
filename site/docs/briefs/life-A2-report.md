# A2 life content author report

## Scope

Added `content/life-A2.json` only. It contains four new life units anchored to distinct existing lessons: travel A2.21, shop exchange A2.17, home repair coordination A2.20, and symptom/appointment language A2.22. Each unit has 16 objective items (four each of choice, gap, order, reading), a guided transfer prompt at the end, and a fictional-scenario note. Seven theory supplements expand A2.03, .05, .12, .17, .20, .21, .22. The audit records assess all 24 original A2 lessons, with `expanded` applied exactly to those seven supplements. Original A2 lessons, dictionary, mission support, and existing answers were not changed.

I read the 24 lesson cores, details, examples, sheets, original dictionary and mission support before authoring. The additions stay within the existing A2 progression: a ready-made `aș vrea` is used as a polite formula, and `a fost anulat` is read as a known travel chunk rather than requiring learners to build passive forms. The health scene tests symptom description, onset, scheduling, and confirmation only. Store policy, travel times, and appointment details are invented; no real provider rule, medical treatment, or legal entitlement is asserted.

## Self-check

- JSON parses. Four units, 64 distinct IDs `e501`–`e516` under four distinct anchors, seven supplements, and 24 unique audit records.
- Each unit has 4 choice, 4 gap, 4 order, and 4 read items; each choice/read has three choices and exactly listed accepted answers. Correct option positions total 12 first, 10 second, 10 third.
- Core plus detail Russian word counts: travel 270, return 298, home 279, health 263 (Cyrillic-token count). Each unit has at least 16 words/chunks, eight phrases, six translated examples, three pitfalls, four sheet rows, and three notes.
- Supplement Russian explanation counts: A2.03 212, .05 207, .12 210, .17 200, .20 213, .21 221, .22 226; each has three sections, six translated examples, three pitfalls, three decision steps, and four sheet rows.
- Each of the four original Romanian passages has over 120 whitespace-separated words, exceeding the 80-word A2 minimum. Four questions per passage target distinct details or a distinction such as a proposed time versus a confirmed visit. The preparation examples use parallel details rather than restating the reading answer key. The supplements cite the official UBB Romanian level description and Council of Europe CEFR Companion Volume as reference context; language rules also remain aligned with the existing A2 course.
- Validated each order answer against its exact token multiset. Choice/read distractors have no collisions after Unicode diacritic folding. Tested key nouns, chunks, and forms are introduced in the unit's words, phrases, examples, theory, or established A2 prerequisites.

This is an author self-check of content and data shape. An independent language review and integration validator remain the next gates; objective exercise performance and guided transfer do not certify CEFR proficiency.

## Independent review follow-up

The A1/A2 editorial review found three A2 supplements that repeated exact scored reading days and hours. Replaced their examples and table cells with separate parallel schedules: A2.20 uses Wednesday at six, A2.21 Tuesday at eight, and A2.22 Wednesday at four. Clarified that Dima is the name recorded on a booking rather than an assumed surname, and changed the train exercise prompt to “отправление”. The integrated `node scripts/validate-life.mjs` check passes after these edits.
