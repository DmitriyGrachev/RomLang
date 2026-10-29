# Text course execution ledger

Baseline aadfd051ce0c67623a4539a4282356a0fb25a470. Existing Sites checkout is clean on build/romanian-course. 79 baseline tests pass. Source helper opened same checkout. Public access preserved.
Ruling: direct implementation is authorized by user's explicit request to expand all researched points; no further design approval required.
Ruling: preserve existing visual language, no redesign/image concept necessary.
Ruling: separate authoring files permit parallel level authors; cards agent alone edits events/types while root integrates catalog/UI.
Ruling: full listening/speaking CEFR readiness is outside scope; explicit written skill profile instead.

Implemented: academy catalog, 6-part topic UI, reading library, writing studio, profile, legacy navigation integration. Cards/persistence authored and 30 focused tests pass; root 12 focused tests pass. All new IDs preserve old history.
Content in progress: A1 author, A2 author, B1 author, B2 split1–11/12–22 on disjoint JSON; merge before final checks.
Ruling: long text questions must carry their source in global review; academy.ts attaches passage, and inline reading view hides duplicate. Generic reading explanations sent back to authors for correction.
Ruling: legacy audio/speaking adaptation has separate file ownership from root and event agent.

Verification:93 fulltestsandtsc passed with partialauthoredcontent; finalcountsvalidationpending. DesktopUI observed, openreadinginputfixed (read with nochoices), answerfeedback Odesa passed; writingrevision appended. Cards customcreation+typedrecall+SRSdate+roundfinish verified in guestpreview.
MobileQA: local-only public/_qa-responsive.html frames390/320, browserbodywidth375/305 matches scrollwidth, nohorizontaloverflow. Academyreadingfieldandcardreveal/againobserved; writingfieldobserved. Remove QA HTML beforepackaging.
Authlimit:previewuserissignedout; browseronlyoptimisticgueststate. Durable replay/restore/coalescing testedpuretransport; no claim ofauthenticatedE2E persistence. Preview initiallyreturnedloaderror thenrecovered; consoleEOFcausedconcurrentJSONauthorwrite, nonefinal.
TaskreviewacceptedP2findings:ExamViewmodelviewnottracked;customCarddeleteoffsetstale. Awaitingfreeagent fororiginalimplementerfixesandscopedre-review.

Taskcode:fixround1/5 complete(2addressed,0open) reviewer text_course_code_review approved. Fullsuite95+tsc passed percardsfixauthor.
Content: A1final16 reviewed; fivefindings sent originalauthor forfixround1. A2final18 fullyspecificexplanations, reviewer academy_a2_review active. B1first10final reviewer academy_b1_review active; B1second11–20authoractive. B2first11draftsunderproofread, second12–22nearlycomplete; rootmustmergeparts.
BrowserQA report docs/briefs/text-course-browser-qa.md.

A1content complete:16units; independentreviewallitems/readings/models, fivefindingsfixedacrosssixlocations; scopedre-reviewapproved,0open. A2reviewfoundkeyfairness/readingmisalignmentissues awaitingfullreport. B1first10reviewfoundrules/key/model-taskissues awaitingfullreport.

A2 fixround1/5 dispatchedR00–R11 (finitekeys,missingcheckpointcontext,accuracy,concretealltransferprompts). B1first10 fixround1/5dispatched10gaps+4teaching/modelissues. Backups /tmp/academy-A2-pre-review-fix.json and /tmp/academy-B1-pre-review-fix.json forscopedreviewdiff. B2first11finalvalidated, reportpending; needindependentB2review.

B1first10fixround2/5complete:presenttensecueson08.e3/10.check.e2 closedresidualunder-keyedfuturevariants; independentreviewapprovedallfindings. A2fixround2/5complete:presentcue06.check.e1 + typo; reviewPASSallR00–R13closed. A1/A2/B1first10 arenowfinalreviewed.
All76unitsauthored: A1.json16;A2.json18;B1.json10+B1-part2.json10;B2.json11+B2-part2.json11. B1part2reviewactive, B2all22reviewactive(lastpart2finalwritemustbeused). Sourcecredentialsinit_1expired; refreshONLYbeforepackaging.

Independent baseline compatibility audit:18legacyJSONfiles,4392IDsand4621answers/choices/tokensfields,0violations. Reporttext-course-compatibility-audit.json.
B2reviewfinal sevenP2groups+fiveprecisionpoints; splitfixround1dispatched originalauthors01–11and12–22, allchoice/read/checkdistractorsbeingupgraded, first11rubricstask-specific. B1part2reviewfinal; fixround1originalauthoraddresses4gapambiguities, alldistractorquality, sourceinputsunit15, modelconstraints12/19,gloss13. Rootmustcreatefixdiffsagainst/tmp backupsandscopedre-reviewbeforemerge.

B1part2 fixround1 review PASS all findings closed. B1 final20 merged, no duplicate part file. Latestcode full96tests and tsc pass. Delayed-control metric uses practice preceding first control, with regression test.

T1 complete:all76units independently reviewed, all Important findings fixed, allB2groups+fivepointsclosed. B2final22 merged; two exact nonblocking copyedits applied at integration. TemporaryQAHTML removed.

Final whole-branch review:3 Important (transfer context; control theory assistance; card exposure across navigation),2 Minor (B2.21 domain; cards plural). Accepted, single consolidated fix wave dispatched. No Critical issues. Authenticated E2E remains unavailable, no certification claim; no second exhaustive language pass necessary after level reviews.

Final consolidated fixwave complete: I1–I3/M1–M2 plus local legacy-memory/default and written-evidence regressions fixed.107tests+types+allcontentaudits pass. Frozen browser checks confirm transfer context, control assisted evidence and card exposure across navigation. Scoped re-review pending.

Scoped final re-review: I1/I2/M1/M2 closed; I3 persistent exposure closed with one minor submission-clock residual. Ruling: apply reviewer exact minimal correction at final integration—recompute wordIsAssisted with Date.now in both submit directions of CardsView/WordTrainer, leaving render clock only for display. This prevents the cached minute-boundary false assistance; no new feature or second broad fix wave.

T5 review and validation complete. Ruling: finish through existing authorized Sites publication flow instead of a new git merge/PR approval menu; existingpublicaudience preserved, helper owns exact source commit/push/package. No branch/workspace deletion.
