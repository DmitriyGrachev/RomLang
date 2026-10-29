# Substantive course depth and visible curriculum

User expects a self-directed A1–B2 course for months at60–90min/day, six days/week, not a week-long demo. Existing UI shows6modules/level, each4lessons+checkpoint+mission. Current96lessons have median178–199words of core+detail (supplements separate). The misleading navigation and real content compression both need correction.

## Authorized approach
Keep existing foundations and progress IDs. Add6substantive modules ×4lessons to EACH level, bringing12modules/48lessons per level and48modules/192lessons total. This is an authored practice expansion, not a claim that counts certify CEFR or complete listening/speaking. Root chose the scope from user's long-term requirement. Complete all new assets before publishing; no empty planned lessons, cloned shell lessons or delayed promises.

## Global constraints
- Preserve all existing lesson/exercise IDs, answer semantics, completion and stored history; no database change.
- Existing mobile UI and separate layered theory/practice remain. No TTS, audio pretending to be listening, paid AI or auto-grading of free speech.
- New lessons .25–.48, modules .7–.12, checkpoints CHECK.<level>.<7..12>, missions MISSION.<level>.<7..12>. New IDs must be unique.
- Each new lesson: coherent core, >=4 substantive detail paragraphs (aim260–450Russian words across core/detail/comparison; explain usage, contrast, word order and pitfalls as relevant), >=4 translated examples, >=4 meaningful sheet rows, >=3 notes, translated preparation lexicon and phrases, 12original objective items spanning choice/gap/order/read. Include context, unique answer constraints, explanatory feedback. Three reading questions may share one authored passage; don't reveal its answers in preparation. Readings become longer by level: A1~40–70ROwords, A2~70–110, B1~110–160, B2~160–230. Reasonable level-specific deviations okay; no filler to satisfy counts.
- Each new module:8 cumulative checkpoint questions using this module+earlier taught material, one productive transfer prompt/model/checklist;2 mission variants each>=3turns with authentic choices and translated preparation for every line/option. Alternatives must be genuinely semantically distinguishable, not arbitrary wrong grading. Examples are fictional, not current real prices/services or medical/legal advice.
- Dictionary>=18 new contextual entries/module, each realstress marker, forms,2translated examples, productive phrase, ownerlesson/module. Also per-lesson preparation includes all new words needed by tests even if not saved dictionary entries. Avoid unknown words in distractors unless explained.
- No nationality mismatch: user Ukrainian in Bucharest/Militari, knows RU/UK/EN. Use people from varied countries only when explicit fictional people; don't assume user Russian.
- Independent semantic/language review and structural/runtime validators before release. Count lessons separately from exercises/checkpoints/dialogues; derive UIcounts from data.

## Data contract
Create content/depth-<LEVEL>.json:
{level,modules:Module[],lessons:Lesson[],dictionary:WordEntry[],checkpoints:Checkpoint[],missions:Mission[],lessonTeaching:LessonTeaching[],missionTeaching:MissionTeaching[]}
Types are in lib/course/types.ts and lib/course/support.ts. Follow existing schemas exactly. LessonTeaching={lessonId,words:[{ro,ru}],phrases:[{ro,ru,note?}],notes:[string]}; MissionTeaching={missionId,phrases:[{ro,ru,note?}],notes:[string]}. Set dictionary IDs <LEVEL>.d2NNN (e.g.A1.d2001) to avoid existing IDs. Exercise IDs <lesson>.e1..e12; checkpoints ownprefix.e1..e8. Use correct regular Romanian diacritics. Sources for level breadth: UBB minimal Romanian A1–B2 and official ILR examples; original prose/tasks only.

## Engineering task
Merge new level content, modules and teaching supports into existing exported catalogs. Build a clearly visible full-program overview accessible from Учиться showing current level:12modules/48lessons +12checks +12dialogues, all module cards with expandable lessons and direct theory/practice access. Keep existing path available for focused module. Show how to use60/75/90minutes, recurrence via existing review queue, and cumulativechecks; no fake completion/self-evaluation equated to B2. Dynamic counts everywhere (Progress/Reference/route), dynamic icon/index array safe. Existing review/catalog/mission/wordtrainer functions must include new content. New content is available only when fully authored; never placeholder curriculum counted as lessons. Add structural validator and meaningful catalog regression tests for compatibility/owner/progress/newtopic preparation. Root owns publish.

## Completion ledger
- Opened ccd4a110d01722139dbc4c29513691c5ffd24c10 on build/romanian-course; private owner audience preserved.
- Source audit confirms96lessons/24modules; displayed sixnodes are a module, not a level. User concern remains valid because depth and visibility are insufficient.
