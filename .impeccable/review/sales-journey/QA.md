# Sales Journey verification

Production build checked in existing Chromium with reduced motion, using Playwright and Node assertions. Biome and strict TypeScript/Vite build pass.

- C regression suite: 5 widths; product selections, keyboard, draft validation/escaping, no submission/storage.
- A regression suite: 6 widths, including user width1242; stages/products, arrow, text sizes, touch targets, draft validation and anchors.
- B suite: 1536,1440,1280,1242,768,390,320; four scene states, next/back, keyboard, scroll-driven state, content counts, local draft whitespace validation, escaped script text,1500-character limit, reload clearing, valid fragment anchors.
- All three routes: active concept link, three links,44px minimum height, links within viewport, native click navigation, no horizontal overflow/page errors.
- Captures from document top after h1 and font loading; full-page desktop/mobile and user1242, hero1536×1024.

Comp gates before review correction: hero89%, responsive88%; preceding final diff88% archived in `pre-review-diff/`. Post-correction final diff75% (drift) against the original uncompensated boxes: the in-flow comparison strip shifts the entire composition, and synthetic disclosure moved below the company. Paired crops confirm the changed positions rather than missing UI. Reviewer explicitly resolved these requested corrections from fresh captures; no current88% claim is made. Reproduction readings are not business effectiveness or accessibility certification. Safari, physical devices and screen-reader navigation were not tested. No backend or real lead reception exists.
