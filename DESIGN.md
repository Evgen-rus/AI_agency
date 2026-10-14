---
name: LeadGenBureau — AI Agency
description: Flat color fields, dense Montserrat typography and a geometric product index.
colors:
  plum: "#280839"
  violet: "#491a77"
  blue: "#083cf8"
  paper: "#f4f4f6"
  ink: "#171718"
  lavender: "#d8d8e7"
  muted-plum: "#65546e"
  light-hover: "#ded3ed"
  ready-bg: "#97c89d"
  ready-text: "#112d2b"
  mvp-bg: "#c0cbf8"
  mvp-text: "#082387"
  pilot-bg: "#b8a886"
  pilot-text: "#201b11"
  field-bg: "#351447"
  field-border: "#ab8ec4"
  field-placeholder: "#d0badf"
  field-hint: "#d7c2e6"
  error: "#ffd5b2"
  a-blue: "#0d4df3"
  a-blue-hover: "#0b3abe"
  a-daylight: "#f7f8fa"
  a-midnight: "#101c31"
  a-white: "#ffffff"
  a-muted: "#56637c"
  a-rule: "#d2d9e4"
  a-stage: "#20314b"
  a-stage-hover: "#30476a"
  a-stage-border: "#52627a"
  a-table-heading: "#1c2d48"
  a-dark-copy: "#bac8dd"
  a-dark-focus: "#b8d3ff"
  a-tag-bg: "#e7efff"
  a-tag-text: "#124bc5"
  a-path: "#4b91ff"
  a-mvp-dot: "#b2c7f1"
  a-pilot-ring: "#a2b8d9"
  a-field-border: "#8190a8"
  a-placeholder: "#5b6a81"
  a-error: "#ae263b"
  a-risk-bg: "#ffe4e8"
  a-risk: "#b5223c"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "8.854vw"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 72px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "20px"
    fontWeight: 400
  note:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
  a-display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(calc(44 * var(--r-unit)), 4.04vw, calc(62 * var(--r-unit)))"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  a-headline:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(calc(32 * var(--r-unit)), 4vw, calc(62 * var(--r-unit)))"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  a-title:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(28px, 3vw, 44px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  a-body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.75
  a-control:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "calc(16 * var(--r-unit))"
    fontWeight: 600
  a-note:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  square: "0"
  status: "30px"
  a-control: "calc(6 * var(--r-unit))"
  a-table: "calc(8 * var(--r-unit))"
  a-stage: "calc(9 * var(--r-unit))"
  a-panel: "calc(12 * var(--r-unit))"
  a-field: "8px"
  a-round: "50%"
spacing:
  control-gap: "18px"
  inset: "24px"
  group: "32px"
  panel: "40px"
  section-mobile: "56px"
  heading-desktop: "64px"
  section-desktop: "96px"
  a-control-gap: "calc(20 * var(--r-unit))"
  a-opening-gap: "calc(36 * var(--r-unit))"
  a-page-inset: "calc(44 * var(--r-unit))"
  a-field-inset: "20px"
  a-mobile-inset: "24px"
  a-small-inset: "18px"
  a-section: "88px"
components:
  button-primary:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "1.3vw 2.65vw"
  button-primary-hover:
    backgroundColor: "{colors.violet}"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.plum}"
    rounded: "{rounded.square}"
    padding: "22px 26px"
  button-light-hover:
    backgroundColor: "{colors.light-hover}"
  input-task:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "20px"
  status-ready:
    backgroundColor: "{colors.ready-bg}"
    textColor: "{colors.ready-text}"
    rounded: "{rounded.status}"
    padding: "0.5vw 1.7vw"
  demo-panel:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "40px"
  a-button-primary:
    backgroundColor: "{colors.a-blue}"
    textColor: "{colors.a-white}"
    rounded: "{rounded.a-control}"
    padding: "calc(14 * var(--r-unit)) calc(26 * var(--r-unit))"
    typography: "{typography.a-control}"
  a-button-primary-hover:
    backgroundColor: "{colors.a-blue-hover}"
  a-button-outline:
    backgroundColor: "{colors.a-white}"
    textColor: "{colors.a-midnight}"
    rounded: "{rounded.a-control}"
  a-stage-control:
    backgroundColor: "{colors.a-stage}"
    textColor: "{colors.a-daylight}"
    rounded: "{rounded.a-stage}"
    padding: "calc(12 * var(--r-unit))"
  a-stage-selected:
    backgroundColor: "{colors.a-blue}"
    textColor: "{colors.a-daylight}"
  a-stage-tag:
    backgroundColor: "{colors.a-tag-bg}"
    textColor: "{colors.a-tag-text}"
    rounded: "{rounded.a-control}"
    padding: "calc(6 * var(--r-unit)) calc(8 * var(--r-unit))"
  a-input-task:
    backgroundColor: "{colors.a-white}"
    textColor: "{colors.a-midnight}"
    rounded: "{rounded.a-field}"
    padding: "{spacing.a-field-inset}"
  a-recommendation:
    backgroundColor: "{colors.a-white}"
    textColor: "{colors.a-midnight}"
    rounded: "{rounded.a-panel}"
    padding: "calc(16 * var(--r-unit)) calc(20 * var(--r-unit)) calc(18 * var(--r-unit)) calc(25 * var(--r-unit))"

---

# Design System: LeadGenBureau — AI Agency

## Overview

**Creative North Star: "AI Agency — typographic index"**

The approved C world uses dense Montserrat lettering, large uninterrupted color fields and sharply cut geometric letterforms. The visual tone is assertive and editorial; information is organized by type, space and color rather than floating boxes.

The current identity is LeadGenBureau. Russian copy and honest readiness labels remain legible parts of the composition. The visual system does not imply a unified production platform or verified commercial results.

**Key Characteristics:**
- Flat plum, violet, cobalt and paper fields.
- Dense grotesque typography with tightly tracked headings.
- Square controls and containers; rounded readiness labels.
- A continuous geometric product index with readable text beneath its artwork.

### A — Revenue OS scope

**Creative North Star: "Revenue OS — revenue control-room"**

A is an independent Revenue OS world at `/revenue-os/`: daylight reading ground, midnight focused workspace and precise cobalt controls. Its control-room metaphor exposes a contact, risk and proposed next action without implying a live integrated platform. It shares the self-hosted Montserrat font and confirmed product facts with C, not C's visual composition.

`src/main.tsx` dynamically imports `RevenueApp` with `revenue.css` for A and `App` with `styles.css` for C at `/`. Each entry has its own global styles; never load both stylesheets into one rendered page. All unprefixed frontmatter tokens and the incumbent prose describe C; all `a-` tokens and Revenue OS subsections describe A. The preserved C records are in `.impeccable/archive/concept-c/`.

A follows the approved delegated composition `.impeccable/mocks/revenue-os/command.png`. The owner's later screenshot correction overrides its ambiguous long connector: a short downward SVG now connects the situation table to the recommendation in normal flow at every width. Review images, if present at `.impeccable/review/revenue-os/desktop.png` and `mobile.png`, are evidence rather than application assets. No raster is shipped; the only bundled visual asset is Montserrat with its license. The CLI font-ranking browser resolution failed; Montserrat is an intentional comp match, not a passed font-ranking result. No separate Revenue OS quality bar is established.

**Key Characteristics (A):**
- Daylight page and dark focused console.
- Geometric Montserrat display with fine rules and structured table content.
- Cobalt native controls, a connected stage path and textual readiness with three distinct dots.
- Local demonstration and draft preparation with explicit limits.

## Colors

The primary family is saturated plum and violet, with cobalt identifying the voice product; paper, ink and lavender establish strong field contrasts. Normative values are in the frontmatter.

### Primary
- **Deep Plum:** hero, discussion area, dark buttons and primary text on paper.
- **Saturated Violet:** lead-generation field, demonstration panel, focus and link accents.
- **Cobalt:** voice-product field and its demonstration panel; text-link hover.

### Neutral
- **Paper:** page background, light actions and geometric letterforms.
- **Ink:** NeuroROP field and demonstration panel.
- **Lavender:** custom-solutions field and connecting section.
- **Muted Plum:** explanatory copy on light fields.

Readiness uses separate paired colors: green for operating, pale cobalt for MVP and sand for pilot. These are contextual labels, not a universal success/warning scale. The custom direction uses plain muted text rather than another pill.

**The Field Identity Rule.** Keep product-field colors paired with their demonstration panels; do not make readiness depend on color alone.

### A — Revenue OS palette

**Primary:** Revenue Blue drives actions, selected stages, wordmark emphasis and focus; Blue Hover darkens interactive actions. Path Blue connects stages to the active table row. The later CSS declaration of `--r-blue` is normative; its earlier value is superseded.

**Neutral:** Daylight is the page ground; Midnight anchors the console and approach section; White is the table body, recommendation and form field. Muted text and Rule provide readable secondary structure. Stage, Stage Hover, Stage Border and Table Heading describe the console's tonal levels. Dark Copy and Dark Focus preserve legibility there. Stage tags use their separate pale-blue/text pair.

**Semantic cues:** the MVP dot is pale blue, the pilot dot is an outlined ring, and the operating dot uses Revenue Blue. Readiness always retains text. The red SVG risk pair marks a demonstrated risk; Error marks validation, with distinct values. These roles do not change C's readiness palette.

**The Focused Console Rule.** In A, Midnight identifies the demonstration or approach context; white surfaces carry the contact and recommendation inside it.

## Typography

**Display Font:** locally bundled variable Montserrat, with sans-serif fallback.
**Body Font:** the same Montserrat family; no second display or monospace family.

### Hierarchy
- **Display:** the desktop hero uses the frontmatter display role. Its three lines have horizontal compression (0.88, 0.94 and 0.92); the third line shifts upward by 0.8vw. This is an approved pinned-comp exception, not a general heading recipe. At 1440px it is about 127.5px, larger than the ordinary headline ramp.
- **Headline:** section headings use the bounded headline role, with 13ch maximum width in the desktop solution header and 16ch on mobile.
- **Title:** demonstration headings use the title role; the request-preview title is 20px.
- **Body:** primary solution copy is 22px with a 35ch measure; contextual copy is 18px. Body paragraph line-height is 1.55. Mobile solution copy becomes 19px and loses its measure cap.
- **Label:** field labels are 20px; readiness headings are 22px/600, then 20px on mobile. Supporting notes are 13–16px according to their context.

**The Display Exception Rule.** Preserve the approved oversized hero on this surface; use the bounded section-heading ramp for ordinary extensions.

### A — Revenue OS type

The same locally bundled variable Montserrat supplies geometric display and readable controls, with sans-serif fallback. A has no second or monospace font. Its display is two lines, the second cobalt; desktop line-height is more open than C's compressed hero.

A's frontmatter records the opening display, solutions headline, product title and product body roles. Introductory copy uses clamp(calc(20 * var(--r-unit)), 1.63vw, calc(25 * var(--r-unit))), weight 450 and line-height 1.5. Recommendation headings use fixed 16px/750/1.35, context copy fixed 14px/1.55 and its functional label fixed 12px. Console table content uses fixed 13px/1.5, then 12px at 900px and below; these reading sizes do not scale with the viewport. The demonstration disclosure and readiness detail remain 13px, and stage controls remain 12px throughout the final cascade. Main CTA type is 20 units/500 above 1200px, 20px below that, then 16px below 900px. Reveal and outline actions use 14 units/500 on proportional desktop and 14px otherwise.

At 900px the display uses clamp(38px, 7vw, 68px), introductory copy 19px and product body 17px. At 420px the display uses clamp(30px, 8.4vw, 35px). Supporting table content remains 12px on mobile.

## Layout

The current first surface has a proportional desktop opening: 66.8% hero and 33.2% aside, height 38.672vw. Its graphic index directly follows with four unequal columns (26.9%, 28.32%, 25.78%, 19%), no gutters and a height of 27.995vw. These measurements reproduce the pinned comp; they do not prescribe every future surface.

Content below uses 1.05fr/1fr columns, 6vw gaps, 4vw horizontal insets and the section-desktop spacing token vertically. Heading-to-body spacing uses heading-desktop. Panels use panel padding. No boxed page-wide maximum-width container is implemented.

At 900px and below, the opening and content sections become single-column, the duplicate header action disappears, navigation wraps with the wordmark, and the index becomes two equal columns. Sections use 56px vertical and 24px horizontal padding; gaps become 32px. Each index tile is 290px tall with 185px reserved above its text for artwork. Mobile status labels use 12px type and 6px 14px padding. The hero uses clamp(44px, 10.9vw, 92px), line-height 1 and no third-line upward shift.

At 370px and below, hero/aside insets become 20px, display type becomes 40px and tile labels become 16px with 14px horizontal tile padding. The footer changes from a row to a column at 900px.

### A — Revenue OS layout

Above 1200px, `--r-unit: calc(100vw / 1536)` proportionally scales the first viewport's control geometry, gaps, insets and console; the table, recommendation copy, disclosure, stage labels and readiness detail retain their fixed reading sizes. At 1200px and below it returns to the root's 1px. Later product, approach, discussion and footer sections retain their own fixed/clamped values; the whole page is not uniformly scaled.

The desktop opening uses a 38% left column and remaining-width console with 36-unit gap and 44-unit left inset. The console reaches the right edge and uses asymmetric 24/40/40/34-unit padding. The four-column readiness strip follows. Product options use three ruled columns, product detail uses 1fr/2fr, and approach/discussion use equal columns with 80px/100px gaps. Product copy is bounded at 72ch; supporting text at 65ch.

At 1200px: 28px opening/header insets, compact stages, two-column recommendation, and action controls beneath its copy. Only the horizontal stage connectors are hidden; the short downward table-to-recommendation arrow stays visible. At 900px: single-column opening and lower sections, square edge-to-edge console, 24px insets, wrapped header, stacked readiness and options, and column footer. The table first-cell inset is 20 units on desktop and becomes 10px on mobile. From 901px through 1350px the industry column is hidden to protect the remaining content. At 420px: 18px insets, two-by-two stage controls, industry column hidden, one-column recommendation and its decorative action icon hidden. The remaining company, status, risk and recommendation retain the meaning.

## Elevation & Depth

No box shadows, gradients, blur or simulated volume are present. Adjacent solid fields, thin rules and contrasting text carry separation. Product-index artwork is flat CSS geometry, with clipping and curves that construct letterforms; it is not a 3D illustration system. Scenario changes reveal the demonstration panel with a 450ms clipped entrance. Reduced-motion removes this entrance and smooth scrolling.

**The Flat Field Rule.** Preserve solid field separation and do not add floating shadows to the existing components.

### A — Revenue OS depth and motion

A is also shadow-free. Its dark workspace and white table/recommendation create depth through tonal containment; rounded control and panel edges distinguish it from C's square field composition. Thin horizontal blue CSS connectors join stages on wide screens; a fixed 24px inline SVG arrow points down from the situation table to the recommendation at every width. Its flow slot is 36 units high with a 32px minimum. This replaces the former stage-positioned return path under the owner's explicit comp override.

Button background transitions last 180ms ease-out; stages use 200ms ease-out. Recommendation updates reveal through a 350ms clipped entrance using cubic-bezier(0.16, 1, 0.3, 1). Reduced-motion disables transitions, animations and smooth scrolling. The downward arrow has no transition.

## Shapes

Buttons, panels and the textarea are square. Readiness pills use the status radius. Geometric artwork combines polygons and constructed curved letterforms; these curves do not establish rounded containers. Thin 1px rules separate explanatory copy, scenario expansion and request preview.

### A — Revenue OS shapes

Use the A radius tokens: restrained controls, softly rounded stages and inner table corners, and larger recommendation corners. Desktop console corners are rounded only on the left; mobile console corners are square. The textarea uses its fixed field radius. Circular action icons and the three readiness dots are semantic/illustrative details, not a prescription for pill containers. Stage connectors are straight 1px CSS rules; the downward connector is a 24px SVG with a 1.7px stroke, without a return loop or right-hand curve.

## Components

### Buttons

Rectangular actions pair text with an inline arrow SVG. Desktop base actions use 1.43vw type and the primary-button padding. The hero uses a paper action, 600 weight, a 22.59vw width and 4.36vw height; on mobile it becomes intrinsic width with 18px 22px padding and 16px type. Discussion actions fill their column with the light-button padding and 18px type, then 16px on mobile. Dark actions hover to violet; light actions hover to light-hover. There is no animated hover transform.

### Readiness labels

Pills use 600 weight and paired backgrounds/text from Colors. Their desktop type is 1.1vw, line-height 1.5. The full MVP readiness is also spelled out in the selected solution; the condensed index label is not the only readiness evidence.

### Containers

Demonstration panels are solid product-color rectangles with paper text, panel padding and no border/shadow. Mobile padding is 28px 24px. Product tiles are full-area native buttons rather than independent rounded cards; hover underlines their name. A selected tile has a 3px paper outline inset 8px, using plum on the lavender tile.

### Inputs / Fields

The task textarea has a dark field background, 1px field-border stroke, 20px padding, 17px type, line-height 1.55 and a 160px minimum height. It is vertically resizable. Placeholder, hint and error colors are explicit frontmatter tokens. Error feedback is text below the field; there is no implemented disabled variant. The local preview preserves line breaks and wraps long text. The demo-form disclosure explicitly says the draft stays on the page and no request is sent; it does not imply that the public site itself is local-only.

### Navigation and focus

Desktop navigation uses 1.28vw type, tight tracking and 3.1vw gaps; mobile uses 14px type and 24px gaps. Link/button hover underlines with a 7px offset. Text links have a thin underline rule and turn cobalt on hover. At 900px and below, header navigation links/buttons and the aside secondary link have a 44px minimum height.

Keyboard focus uses a 3px outline with 5px offset: violet on light fields, paper on dark fields. Product focus moves the outline inside by 6px. Labels and selection remain textual and semantic, not decorative substitutes.

### A — Revenue OS controls and signature

**Actions:** cobalt filled buttons have inline SVG arrows, the A control radius and visible blue focus (3 units, 5-unit offset). Dark contexts switch focus to Dark Focus; the white recommendation restores blue focus. The bordered discussion action is white with a Rule stroke and a Tag Background hover. There is no disabled variant.

**Stage selector:** four native buttons in a labeled fieldset expose `aria-pressed` and `aria-controls`. Selected stages turn cobalt and change the synthetic contact status, risk, recommended action and matching product. Horizontal connectors between stages appear only above 1200px. The separate short downward SVG remains in normal flow between table and recommendation at every size. The fourth stage is «Ответ клиента»; its scenario still describes an unreceived response, not a completed outcome. The stage name remains in the table tag, not only in the active control.

**Contact and recommendation:** the table has semantic headings and a screen-reader caption; its white row holds an inline red SVG risk cue plus full text. The white recommendation contains an inline SVG idea icon, heading, context, reveal action and discussion link. The scene announces changes politely. Revealing the next step changes `aria-expanded` and shows local guidance; it does not create a task.

**Readiness:** three dots distinguish operating (solid cobalt), MVP (pale solid) and pilot (outlined) beside explicit textual states. The future custom direction stays separately identified in product content.

**Problem selector and navigation:** native problem buttons expose selection, retain supporting explanations and update product detail; focus moves to its heading. Header links navigate local sections, while explicit concept links switch to C. The quiet header uses ordinary text links rather than C's navigation styling. At 900px and below, its navigation links and concept-switch link have a 44px minimum height.

**Draft field:** white textarea, fixed field radius, field-border stroke, placeholder token, 20px padding and 16px/1.7 text; resize is vertical. `aria-invalid` changes its border to Error and textual feedback follows. The form trims input and requires at least ten characters before showing a local preview. It preserves line breaks and wraps long content. No request, persistence or submission channel exists.

## Do's and Don'ts

### Do:
- **Do** retain solid fields, square controls and the bundled Montserrat family.
- **Do** keep readable product names and readiness text separate from geometric artwork.
- **Do** retain visible focus and the reduced-motion behavior.
- **Do** use the existing mobile stacking and two-column index rather than shrinking desktop controls indefinitely.

### Don't:
- **Don't** turn the pinned hero sizing and compression into a default for every heading.
- **Don't** replace this flat geometric world with robots, neon gradients or volumetric illustrations.
- **Don't** reuse scenario text, synthetic data or readiness colors as proof of real results.
- **Don't** serve review evidence or mock images as application content.

### A — Revenue OS guardrails

- **Do** keep A's daylight reading ground, focused dark console and cobalt selected/action states scoped to its entry.
- **Do** preserve the text accompanying every readiness dot, risk marker and stage selection.
- **Do** retain native semantic controls, visible context-aware focus and reduced-motion behavior.
- **Don't** load the two concepts' global styles together or extend C's compressed display and square fields into A.
- **Don't** present the synthetic workspace, local reveal or draft preview as integration, task creation or message delivery.
- **Don't** publish review images as application content or claim the failed font-ranking run passed.

Not canonized: source declaration overrides and a noninteractive functional recommendation label are existing implementation details, not reusable heading styles. The documentation pass does not repair source or establish new performance/accessibility results.
