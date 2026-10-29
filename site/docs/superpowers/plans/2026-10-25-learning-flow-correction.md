# Română Learning Flow Correction Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Address Dima's four concrete usability/content failures in the existing private site.
**Architecture:** Keep Vinext/D1/stableIDs. Separate theory page from practice page. Remove synthesized audio entirely; convert its comprehension items to explicitly labelled reading. Move productive speaking/writing to module checkpoint only. Add explicit vocabulary and guided mission preparation before simulation; personalize origins to Ukraine.
**Spec:** User feedback in current turn; docs/briefs/a1-scaffolding.md.

## Global Constraints
- Same Site ID/audience. Preserve all prior progress/attempts and historical outcomes.
- No sound-producing API/controls/assets at runtime. No fake listening grades for reading tasks.
- Practice contains one task, answer area, Check/Next and a discreet help link; no permanent production teaser/theory sidebar.
- Theory has meaning/form/examples, explicit lexical support, then a clear practice link.
- Independent production appears once at end of module (checkpoint), not each exercise or lesson.
- New mission vocabulary is taught with translations and a guided rehearsal; simulated conversations follow preparation.
- Dima is from Ukraine, not Russia. Existing valid progress remains accessible.

## Review Focus
- Old lesson cursors beyond8 must render a finished exercise screen rather than crash.
- Historical listening attempts retain original skill/results; new reading attempts record reading.
- Lesson completion permits finished exercises without production; module checkpoint still requires it.
- No unknown first-module words or mission response strings without accessible meaning/preparation.
- Help navigation preserves the current question and assistance accounting.

### Task1 Content support and model changes
- [ ] Write regression tests for lesson/checkpoint completion distinction and pre-existing history; observe RED.
- [ ] Add reading content type, remove TTS files/control/integration, keep attemptIDs and stored outcomes; add lexical support.
- [ ] Author A1 support assets via bounded independent content task; personalize Ukraine; validate references/coverage.

### Task2 Separate clean lesson flows
- [ ] TheoryView and single-column practice; move production to module checkpoint component.
- [ ] Explicit mission preparation → guided translated rehearsal → independent variant. Meaning available for every current option.
- [ ] Add known vocabulary to printable sheets/reference; retain dictionary notes/saves without audio.

### Task3 Verify and publish
- [ ] Node regressions, structural/prerequisite audit, TypeScript and build.
- [ ] Managed browser check first-module theory→practice→completion and prepared mission; phone width.
- [ ] Fresh focused review; fix observed failures. Source helper package and private deploy same URL.
