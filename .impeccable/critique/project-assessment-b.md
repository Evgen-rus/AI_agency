# Assessment B — detector and browser evidence

Independent assessment of `src/RevenueApp.tsx` (primary, concept A) and `src/App.tsx` (concept C). No earlier assessment, verdict, or Assessment A findings were read. Browser inspected published URLs on 2026-10-14. This is technical and interaction evidence, not a full accessibility certification.

## Deterministic scan

Exactly one invocation: `.agents/skills/impeccable/scripts/impeccable.cmd detect --json src/RevenueApp.tsx src/App.tsx`.

Exit 0. Full JSON persisted in `project-detector.json`: `[]`.

| Scope | Findings | Rule names / locations | False positives |
| --- | ---: | --- | --- |
| src/RevenueApp.tsx | 0 | none | none |
| src/App.tsx | 0 | none | none |

`.impeccable/critique/ignore.md` was absent. Clean detector output does not establish usability or accessibility; measured browser issues below remain relevant.

## Browser method and reproducible viewport

Fresh native Codex in-app browser tabs for both routes, screenshots through its documented screenshot API, supported read-only DOM/computed-style evaluation and locator click/fill/press. Actual Revenue viewport verified at 1242×900 desktop and 390×844 mobile. C desktop verified at 1242×900 and mobile at 390×844. Both mobile content widths were 375 CSS pixels with a 15px scrollbar; scrollWidth equalled clientWidth, so no horizontal page overflow observed. Both desktop content widths were 1227px and scrollWidth equalled clientWidth.

Creating a new C tab reset the viewport to 1280×720; that initial capture was not treated as mobile evidence. A subsequent explicit override and `innerWidth` verification produced the final C mobile capture. Browser viewport override reset at the end; both own tabs closed.

Evidence files: `b-revenue-desktop.png`, `b-revenue-mobile.png`, `b-revenue-form.png`, `b-c-desktop.png`, `b-c-mobile.png`, `b-c-form.png`, `b-c-mobile-metrics.json`.

## Measured findings

- **P2 — Revenue desktop typography is unusually small in the most explanatory widget.** At actual 1242px, table headers and cells, recommendation explanatory copy: 9.71px; demo label and stage labels: 10.52px; readiness explanations: 10.52px; navigation: 11.32px. The main hero is clear, but the evidence/recommendation widget demands substantially more visual effort. Relevant CSS: `src/revenue.css:92`, `:171`, `:186`, `:211`, `:283`, `:294`, `:362`. Suggested direction: give supporting text a legible minimum rather than scaling every unit proportionally.
- **P2 — Small mobile navigation and some secondary targets.** Revenue mobile: Решения 57.95×15.20px, Подход 46.84×15.20px, Концепция AI Agency 112.59×12px; header CTA 136.59×42px, discussion secondary action 157.79×42px. C mobile: Продукты 93.06×16.80px, Внедрения 78.34×16.80px; secondary text links 36.80px high. Stage buttons are 54px high, and major CTAs/form controls are comfortably sized. The link/button boxes fall short of the skill's 44×44 touch comfort target. This is a measured comfort concern, not an assertion that every target violates WCAG 2.2 AA: spacing exceptions and effective targets were not fully audited.
- **P1 for a public lead-generation flow, intentional prototype limitation otherwise — discussion cannot turn into contact.** Both “Обсудить задачу” routes end at a demonstration draft. Successful preparation echoes the task and explicitly says it was not sent and a contact method will be added after agreement. There is no real contact/booking alternative in inspected page content. This is honestly disclosed, so it is not a broken submission, but a public visitor cannot complete the promised conversation from the site. Must preserve honest readiness and obtain authorization before adding any submission.
- **P3 — Mobile journey depth.** Revenue places the full console and readiness before product selection; C places large two-column product artwork before detail. Both mobile screenshots show a long vertical path to the form. This is observed composition, not a measured abandonment claim.

## Interaction evidence

Revenue: changing Сделка → Спрос updates pressed state, table status/risk, recommendation and selected product detail. “Показать шаг” becomes “Свернуть шаг” and aria-expanded=true; the revealed next action retains the explicit “CRM actions are not performed” notice. Empty form submission displays an alert with minimum 10-character guidance. Filling a synthetic 41-character task and preparing displays the same text plus the not-sent draft notice.

C: selecting AI-звонилка updates detail to “Узнайте, у кого есть потребность.” and moves focus to `solution-title`. Pressing Enter on the next-step control successfully reveals it with aria-expanded=true. Empty form submission produces the same useful minimum-length alert; valid synthetic text produces “Описание для будущего разговора”. No real CRM or contact operation was invoked.

Source inspection supports the no-submission promise: both form handlers prevent default, trim and validate text, and set in-memory preview/error state. Browser network/storage instrumentation was not available in the documented API and was not improvised; absence of requests or writes was not independently proved in this assessment.

Live DOM confirms C has one H1 followed by H2/H3 structure. A `getByRole(... level:2).allTextContents()` call unexpectedly included headings of other levels; direct read-only tag inspection resolved that tool ambiguity, so it is not reported as a site heading defect.

## Contrast samples and console

Computed foreground/background pairs, ratios calculated with WCAG relative luminance:

| Sample | Ratio |
| --- | ---: |
| Revenue muted text #56637c / white | 6.05:1 |
| Revenue muted text #56637c / #f7f8fa | 5.69:1 |
| Revenue white CTA / #0d4df3 | 6.23:1 |
| Revenue demo label #bac8dd / #101c31 | 10.06:1 |
| Revenue table header #c0cce0 / #1c2d48 | 8.53:1 |
| C hints #d7c2e6 / #280839 | 10.77:1 |
| C development status #615c73 / #d8d8e7 | 4.53:1 |
| C AI-zvonilka demo note #e0e7ff / #083cf8 | 5.66:1 |

These samples meet 4.5:1. The C development status is close to the threshold. No comprehensive contrast audit, alpha/gradient/pseudo-element audit, or screen-reader test was performed. Small type is the clearer observed problem, not deficient contrast in sampled pairs.

Both tabs' captured warn/error logs returned `[]` before and after sampled interactions. Revenue `impeccable` filtered logs also returned `[]`, as expected because injection was skipped.

## Overlay, cleanup, and bounded failures

No user-visible overlay. Documented `playwright.evaluate` is read-only; advertised tab capabilities were pageAssets and webmcp, with no mutable script-injection API. Mutable preflight was therefore unavailable, not attempted through prohibited evaluate. Following critique fallback rule, no live server was started, no browser presentation/visibility.set(true), no title or DOM mutation, and no detector script injected. Fallback was one CLI scan plus native screenshots, real interactions, computed-style/geometry reads and captured console logs.

Two bounded browser call errors occurred while opening C: explicit visible:false reported “IAB visibility is not supported in a subagent thread”; an assignment to the uncreated `bC` binding then reported “bC is not defined” although tab 2 opened. Recovery bound that observed tab ID directly and succeeded. No retry loops or custom screenshot scripts. No server process or temporary injection file needed cleanup. Final evidence files are intentional retained artifacts; both own tabs closed and viewport override reset. No application code, Site access, or publication changed.

Questions skipped: Assessment B evidence-only handoff; targeted questions belong to parent synthesis.
