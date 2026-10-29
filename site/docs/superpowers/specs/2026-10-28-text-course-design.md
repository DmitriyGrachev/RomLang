# Romanian text course and cards

User-approved scope: implement all researched expansion points except listening/audio and speaking/pronunciation tasks. Preserve saved progress and the existing public audience. User previously requested lighter-model implementation and QA with root orchestration.

## Approach
Keep the established responsive visual system, the existing course and its stable IDs. Add a substantial text-course library with 76 authored units (A1 16, A2 18, B1 20, B2 22), five distinct goals per unit, theory, vocabulary, two readings, exercises, writing and unseen checkpoints. Use primary sources for curriculum alignment only; all lesson prose/texts/questions are original. Provide honest reading/writing/grammar/vocabulary coverage, never a full-CEFR certificate.

Separate flashcard mode with fixed course and custom cards, topic/level/due/saved filters, reveal/self-rating and checked target-form recall, persistent spaced repetition. New words have contextual examples and prepared target answers. Existing data remains readable.

Writing studio retains drafts and multiple explicit revisions, model exposure, transparent structural checks and a self-review rubric; no fabricated AI semantic score. Add a portfolio/coverage screen with evidence rather than conflating completed and mastered. Existing spoken checkboxes and suggested audio/speaking study blocks are removed from active UI without deleting historical events.

## Constraints and decisions
- No audio, speech synthesis, recording, pronunciation or required spoken answers.
- No new paid provider/API integration. Deterministic writing checks are explicitly limited and useful; free text is not certified automatically.
- Preserve D1 event persistence and progress compatibility; validate all client events server-side.
- Existing five-item mobile navigation stays usable; cards accessible as their own top-level destination and program/library/studio have clear links.
- Content counts derived from actual loaded records; not roadmap promises.
- Work in existing clean Sites-owned build/romanian-course checkout, which is separate from any user repository; source helper opens and packages it.
- Parallel authors each own one level content directory. Feature implementer owns flashcard files and record schema; root owns academy UI/data integration. This follows the user's prior delegation method and avoids overlapping edits.

## Acceptance
All 76 units fully populated and reachable. Appropriate level progression, no meaningless distractors/answer leakage in unseen controls, correct Romanian and Russian explanations. Independent review samples each level and audits all structure. Cards/custom editing/recall/due history round-trip; writing first draft/revision persist. No horizontal overflow at 320/390px; desktop keyboard flow. Unit tests, types, content validators and production build pass before publishing.
