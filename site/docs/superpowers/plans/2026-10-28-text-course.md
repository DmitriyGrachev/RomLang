# Expanded Romanian text course Implementation Plan

> For agentic workers: use subagent-driven-development; root owns integration and publishing.

**Goal:** Deliver the complete researched written course expansion and a dedicated flashcard mode.
**Architecture:** Add original academy units to the existing catalog/event model and responsive navigation; separate content, cards and writing UI.
**Tech Stack:** Existing React/TypeScript/Vinext, JSON content, D1 event records; no new dependencies.
**Spec:** docs/superpowers/specs/2026-10-28-text-course-design.md

## Global Constraints
No audio or spoken tasks. Preserve prior IDs/progress and audience. Original content aligned to cited sources. No invented B2 certification or semantic writing scores. Use current CSS system and phone layout.

## Review Focus
- Existing history/import remains valid with expanded catalog and custom cards.
- Assistance and retries never become independent mastery by navigating away.
- Custom cards and writing text render as text and survive refresh/two-client sync.
- Empty filters, invalid IDs, edited/deleted cards and long Russian/Romanian content are handled.
- Newly authored practice has unambiguous answers and plausible distractors; controls do not disclose keys.

## Tasks
- [x] T1 Content: four disjoint level authoring tasks using docs/briefs/text-course-topics.json and academy-content-brief.md. Output content/academy/{level}.json, AcademyUnit[] schema. Independent language/structure review before completion.
- [x] T2 Cards: dedicated view and pure helper; custom card persistence/validation, checked recall, fixed-card SRS and filtered decks; tests for invalid input, revisions and replay. Root wires navigation and CSS imports.
- [x] T3 Catalog/course UI: lib/course/academy.ts and app/components/AcademyView.tsx, theory/readings/practice/checkpoint modes; catalog integration with stable IDs and progress. Test source coverage, meaningful answer equivalence and bank ownership.
- [x] T4 Writing/portfolio: writing helper and studio, revisions saved through validated events, evidence profile; test min-word feedback, comparison, assisted flags and replay. Remove active spoken/audio UI, update schedules without deleting old history.
- [x] T5 Independent review: content, persistence and UI QA; fix findings, run suite/types/audits/build; package and publish via Sites to existing URL.

## Validation
Baseline: 79 node tests pass. New tests should first demonstrate missing behavior where applicable. Full commands: node --experimental-strip-types --test tests/*.test.ts; npx tsc --noEmit; existing check:content/check:teaching/check:depth; new academy audit. Browser QA with Sites-managed preview desktop and 390px (and 320px overflow). Preserve signed-in save limits honestly if not available.
