# Romanian Life Content — Mobile QA

## Environment

- Managed preview: `http://terminal.local:4173/` using the temporary mobile harness `http://terminal.local:4173/__qa_life_mobile.html`.
- Mobile frame: 390 × 844 CSS pixels; the app content area measured 375 px wide inside the harness.
- Route used: life situations (`?page=life`), A1 unit `LIFE.A1.SHOP`, and B2 readiness/reading/writing routes.
- Browser path: CUA cloud browser `cdp`, tab 10. No source files were changed.
- The expected signed-out banner appeared throughout; no sign-in was attempted.

## Results

- **Life level tabs:** A1, A2, B1, and B2 each selected and showed level-specific cards. Cards and descriptions wrapped inside the mobile frame.
- **A1 preparation:** The first unit displayed the preparation text, translated examples, vocabulary, ready phrases, and a four-row reference table. The 375 px document had no horizontal overflow (`clientWidth=375`, `scrollWidth=375`); the table itself fit its 303 px wrapper (`scrollWidth=301`).
- **A1 practice:** Multiple choice and gap entry rendered and responded. The Romanian answer `în` was accepted for `Plătesc ___ numerar.`; `albastră` was accepted for `o fustă ___`. After checking item 1 and moving to item 2, the question and answer choices returned to the top of the viewport. The header showed only the compact return link, progress, title, and reference control; the former large hero/tabs were absent.
- **Reference/back:** Opened A1.22 from item 2, then used browser Back. The app returned to item 2 with progress still at 1/16.
- **B2 reading:** Opened `Un anunț și trei interpretări`; the original Romanian passage and its first question rendered in the 390 × 844 harness. The answer choices were reachable by scrolling. Page width remained 375/375.
- **B2 writing:** The writing tab showed 180–260-word prompts, plans, five self-check criteria, and collapsed model disclosures. Expanding the first model displayed the sample text and analysis. Page width remained 375/375.
- **B2 readiness width:** After the CSS update, the 375 px document stayed at 375 px wide. The 680 px readiness table now sits inside a 343 px horizontal-scroll wrapper (`overflow-x:auto`), so it no longer expands the page.

## Findings and limitations

- At the initial top position in the active A1 practice view, the fixed “Проверить” footer partially covered the bottom of the third answer card. The page remained vertically scrollable, and moving to the next item reset the view to the top.
- During author edits, one transient Vite overlay reported `[plugin:builtin:vite-json] EOF while parsing a value at line 1 column 0`. After authors confirmed the content was stable, one fresh reload cleared the overlay and the app loaded normally. This matched the concurrent JSON rewrite window.
- Console logs were not exposed through the assigned CUA surface, so console health was not independently verified.
- Screenshot evidence was captured in the CUA browser output. The browser runtime's `cloud-shared-files` documentation was not available from this CUA session; the separate Browser tool returned “Browser access requires the originating browser context.” Therefore `/home/oai/share/life-mobile-qa.png` could not be written from this session.
- Order-format interaction was not exercised on mobile. Desktop QA covered the complete A1 bank in the parent session.
