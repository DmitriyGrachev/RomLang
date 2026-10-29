# Română — personal Romanian course: design for review

Feature release1.3 (2026-10-28): persistent word-review events, separate recognition/typed schedules, personal error clinic and authored A1.1 practice bank. Binding contract: `docs/superpowers/specs/2026-10-28-adaptive-practice.md`. Existing UI direction and core lesson completion remain unchanged.

Current UI design (2026-10-28): `docs/superpowers/specs/2026-10-28-language-app-design.md` supersedes older layout choices. The learner requested an app-like course path, short practice, training hub and vocabulary recall; learning content/storage contracts remain version1.2.0.

## Current revision 1.2 — direct learner feedback, 2026-10-25

This section supersedes the original proposal below wherever they conflict. The learner is Dima, from Ukraine (Dnipro), and lives in Bucharest/Militari. Russian is a known language, not his country of origin.

Remove all synthetic audio, playback controls and bundled recordings. Former listening questions are explicitly reading questions; retain historical listening scores as historical records. Natural listening and conversational practice require real speech outside these text exercises. Do not claim the Site alone assesses listening or pronunciation.

Theory and exercises have separate routes. Theory includes layered explanations, a visual sheet, and the words and translated patterns needed before practice. Exercises use one uncluttered column with one task and one main action. Independent production appears only after the module checkpoint, not after each lesson or exercise. Completed lessons can be repeated without erasing historical attempts or completion.

Every mission starts with preparation: the interlocutor's phrases and reply patterns have Russian meanings. Guided dialogue keeps translations visible; an independent repeat hides them with optional meaning help. Both variants receive this preparation. First-module teaching explicitly introduces țară and all introduction patterns, including Cum vă numiți?, Mă numesc, Îmi pare bine and Dumneavoastră?.

Stable content IDs and existing learning events are preserved. This update needs no database migration or progress reset.

Status: user approved curriculum v1.1, the dashboard/lesson visual concepts and Site implementation on 2026-10-25. Full course implemented; private publication and verification follow the implementation plan.

## Intent and confirmed requirements

Dima knows Russian and English and is a Romanian beginner living in Bucharest/Militari. He wants Romanian A1–B2 with a grammatical foundation, spontaneous communication, and the ability to continue learning independently. He has 60–90 minutes per day, six days per week. He specifically chooses a hosted website, prioritizes interactive practice, requests light game elements, and finds existing apps insufficient in theory and control of pace. He explicitly requests a dictionary and visual cheat sheets covering the theory and available for repeated reference.

## Approaches

1. Ordinary chat lessons: flexible but weak navigation and explicit repetition tracking.
2. ChatGPT Project plus voice and a journal: strong tutoring but still a conversational interface.
3. A personal hosted course website: visual curriculum, exercises, review queue, durable progress, and flexible pace; more implementation and content work. This is the approach requested in the latest user message.

## Proposed experience

Private, mobile-responsive Russian-language app with correct Romanian diacritics. Provisional name Română. Original design, no copying of Duolingo branding or artwork. Calm off-white background, forest green primary actions, terracotta accent, readable typography, understated illustration. Desktop navigation becomes a mobile bottom bar. Screens: course route, lesson, review queue, dictionary, visual grammar reference, progress/settings. Use short Russian/English comparisons when pedagogically useful, without assuming the languages map one-to-one.

Course route exposes all A1/A2/B1/B2 topics. Recommend sequential study while allowing topic access and level switching. Do not use payment gates, lives, artificial waiting, punitive streak loss, or forced timers. Offer 60- and 90-minute plans and session resume. XP and achievements reflect actual practice; retries and revisiting theory remain available.

Lesson flow: short original Russian explanation, Romanian examples with translations and productive patterns, guided exercises, independent production, context mission, summary. Theory remains accessible during practice. At least four varied exercise types per lesson, drawn from multiple-choice, gap-fill, sentence construction with keyboard alternative, short answer with accepted alternatives, matching, and branching dialogues. Every graded item has an explanation; a learner can report an unrecognized valid answer. Free writing and speech are marked self-assessed or transferred for ChatGPT feedback, not presented as automatically graded AI work.

## Curriculum and quality

Delivery target: a populated course for all four levels, not a route with empty B1/B2 shells. Proposed content scale: 24 modules (six per level), four core lessons per module, and one module checkpoint: 96 lessons plus 24 checkpoints. Each lesson has substantive Russian theory, original Romanian examples, at least eight objective items spanning multiple formats, one independent task, and one realistic mission. Checkpoints use unseen items. This is the author's course structure, not a claim of CEFR certification.

A1: sound/spelling foundations, introductions and core verbs, nominal gender/number/articles, present tense/questions/negation, everyday transactions/time/location, first connected descriptions, first productive past and future patterns.
A2: past and future, modal/subjunctive patterns, comparison, reflexives and basic object pronouns, routine arrangements/problems, connected everyday narrative.
B1: tense contrasts, genitive/dative and clitics, conditional and complex clauses, narrative and repair strategies, opinions and connected writing, interaction across unfamiliar everyday situations.
B2: complex discourse and nuance, hypothetical past and reported speech, register and collocations, argument and counterargument, authentic-content comprehension strategies, independent study and integrated tasks.

Full course completion is not equated with demonstrated B2. Assess listening, reading, writing and interaction separately. Provide clearly described external/native practice tasks and periodic reassessment. Release is an original author-developed course checked against reputable grammar/teaching references, with content correctness review and answer-bank verification. Do not claim an accredited course or a native-teacher editorial review that has not occurred. Provide an error-report path and content versions; automated structural checks alone are not linguistic validation.

The topic plan is in romanian-curriculum.json, with 24 explicit module IDs, 96 explicit immutable lesson IDs, recommended prerequisites, checkpoint IDs and cheat-sheet IDs. Its PDF is the user-facing reviewed curriculum. These IDs must survive reordering or title changes. Four language skills and pronunciation are practised from the first module; later dedicated topics deepen that work. A lesson is a topic broken into resumable microsteps and may span several sessions.

## Dictionary and visual summaries

Course dictionary and personal saved entries: search RO/RU/EN; word senses in context; part of speech; noun gender, number and articles; verb infinitive, useful forms and complements; original examples; lesson/theme/level links; personal notes and review state. Preserve canonical Romanian diacritics. Distinguish receptive recognition from independent use. Lexical entries should support phrases/collocations as well as single words. Meaning and morphology need validation; do not pretend an unconfigured AI translates arbitrary unseen words.

Each lesson has a visual cheat sheet, plus each module has a summary map: purpose, colour-coded structure, conjugation/declension tables or timeline/decision map, translated examples, key exceptions, frequent errors, useful RU/EN comparison and practice links. Complex themes may use multiple linked sheets. Content is readable on mobile and printable. Precise educational graphics are authored in HTML/SVG/PDF rather than bitmap text. Support reference during learning and record assisted versus unaided performance during assessment.

### Refinements requested in the latest review (curriculum v1.1)

Theory is layered: core rule, detailed explanation, comparison, visual reference, practice. Let the learner expand the depth and return from an error to its relevant explanation. A topic can span several resumable sessions. Default to one new grammar microstep inside a daily time budget, adjustable after fresh assessment; keep review and language skills in the session. The 75-minute example is 10 review, 15 theory, 15 construction practice, 15 listening, 15 independent speech/dialogue, 5 error review. Adapt 60/90-minute plans; reassess pace after four weeks using actual time, delayed recall and unprepared answers.

Lexical coverage is explicitly mapped for every module in romanian-plan-enrichment.json and copied into romanian-curriculum.json. It records domains, seed lemmas and two productive expressions per module. It is a coverage plan, not a claim of a completed full dictionary. Family, weather, clothes, documents, health, body and emotions have explicit first introductions and later recycling.

Dictionary entries require word/example audio and source metadata, a separately displayed stress aid, context-specific meanings with multiple original examples, and marked productive expressions. Preserve canonical spelling; the stress aid is separate (abonament / a-bo-na-MENT). Check real Romanian audio availability, label synthesis and never count text reading as listening. A system voice is insufficient as the only guaranteed path: provide hosted audio files or a separately configured synthesis fallback. An entry with required audio is ready only after its word and examples really play on target desktop and mobile devices. The current PDF defines these requirements; audio resources are implemented in the Site phase. Do not fabricate audio buttons, phoneme assessment or API access.

Gamification must include branching dialogues, repeatable missions with changed conditions, targeted new exercises by error category, fast progression after fresh tasks plus independent production, and delayed rechecks. The proposed objective fast-pass setting is 85% across 8-12 unseen tasks, explicitly a course setting, not a CEFR standard. Distinguish assisted practice, independent application, self-reported real conversations and external feedback. A self-reported real-life task is not automatically verified. XP alone does not prove mastery.

Reserve some ILR texts/audio for unseen external checks. Keep their IDs and answer keys out of training, examples and cheat sheets. Track the skills separately; no completed-level label based solely on grammar questions. Before mass-producing sheets, verify the two-page pilot for perfect compus / imperfect against sources, legibility and semantic transfer, including contexts where both forms are possible and time adverbs do not uniquely decide the answer. Later pilots cover objects, clitic clusters and conditionals using the same quality bar.

## Review and progress

Persist course-versioned lesson state, objective attempts, due-review items, achievements, daily practice and preferences in Sites D1. Authenticate through Sites' private owner access; authorize record operations with the stable signed-in user ID. Never store learner records only in browser localStorage. Device-local preferences may use it. Provide explicit export and restore. A saved attempt awards XP once; repetitions do not duplicate completion. Errors enter a review queue with adjustable 1/3/7/14/30-day intervals. A due date is a scheduling decision, not a scientific mastery guarantee. Preserve answer text and state when resuming; restarting an exercise does not erase historical progress.

## Audio and AI boundary

Browser speech synthesis can pronounce examples where a Romanian voice exists; detect availability and show an honest fallback. It is not a pronunciation assessor. Native recordings and real voice practice remain part of the broader course. Live AI conversation, arbitrary writing grading and pronunciation evaluation inside the hosted app need a separately configured runtime AI integration; a ChatGPT subscription must not be assumed to supply an API key or free API calls. The first implementation can support structured branching dialogues and transfer a contextual prompt to this ChatGPT project. User review must explicitly see this boundary before implementation.

Proposed launch decision for review: structured interactive course on the Site; real conversational voice and extended writing feedback in ChatGPT; native audio as curated externally hosted resources and voice sessions, with optional browser example pronunciation. Do not advertise complete self-contained listening or automatic speech grading at launch. If the user requires all of these inside the Site, revise this design before implementation and set up the supported AI integration.

## Proposed visual concepts

Dashboard: /workspace/scratch/838bd61425ba/generated_images/exec-4b849d5d-d384-4ab7-96ed-1d2439649a97.png

Lesson: /workspace/scratch/838bd61425ba/generated_images/exec-58d120ec-07b4-49a6-ba5f-c145d53996f2.png

These are rendered concept images, not screenshots of an implemented Site. User approved their visual direction in the latest message. A serif heading/sans-serif interface, warm off-white canvas, forest green navigation, terracotta actions and readable two-column lesson workspace define the design. Dictionary and cheat-sheet views extend this system. App text and controls will be code-native. Illustrations must be extracted or regenerated as standalone assets before use.

## Hosting and implementation constraints

Use Sites: private publication by default, URL usable on desktop/mobile after authentication. Source and runtime persist through Sites; do not promise a fixed free hosting lifetime, unlimited calls or service levels. Backend-backed Site uses the supplied Vinext starter, D1 and native ChatGPT identity. No custom password system, public audience, paid API setup, outgoing messages or external-account writes are implied. Follow Sites registration, source synchronization, validation and publishing workflow after design approval. Test progress persistence, lesson completion idempotency, review scheduling, answer normalization, keyboard/mobile flows and accessible reduced-motion behavior.

## Left to builder

Choose precise lesson titles and pedagogical ordering within the stated progression, an achievable layout matching the accepted mockups, component boundaries, schema details and deterministic normalization rules. Romanian diacritics must never be silently taught as interchangeable spellings; optionally accept omission with an explicit spelling correction. Do not introduce purported general semantic grading through string similarity. Keep theory and exercises content-driven and versioned. No unimplemented buttons, fake microphone evaluator or placeholder levels.

## Implementation authorization

User approved implementation on 2026-10-25. Launch uses structured interactive course practice and contextual copy-to-ChatGPT for free speech/writing; no paid runtime AI was requested. All course levels are populated. Embedded word/example audio uses a detected Romanian device voice or bundled clearly labelled eSpeak NG fallback.
