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
rounded:
  square: "0"
  status: "30px"
spacing:
  control-gap: "18px"
  inset: "24px"
  group: "32px"
  panel: "40px"
  section-mobile: "56px"
  heading-desktop: "64px"
  section-desktop: "96px"
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

## Layout

The current first surface has a proportional desktop opening: 66.8% hero and 33.2% aside, height 38.672vw. Its graphic index directly follows with four unequal columns (26.9%, 28.32%, 25.78%, 19%), no gutters and a height of 27.995vw. These measurements reproduce the pinned comp; they do not prescribe every future surface.

Content below uses 1.05fr/1fr columns, 6vw gaps, 4vw horizontal insets and the section-desktop spacing token vertically. Heading-to-body spacing uses heading-desktop. Panels use panel padding. No boxed page-wide maximum-width container is implemented.

At 900px and below, the opening and content sections become single-column, the duplicate header action disappears, navigation wraps with the wordmark, and the index becomes two equal columns. Sections use 56px vertical and 24px horizontal padding; gaps become 32px. Each index tile is 290px tall with 185px reserved above its text for artwork. Mobile status labels use 12px type and 6px 14px padding. The hero uses clamp(44px, 10.9vw, 92px), line-height 1 and no third-line upward shift.

At 370px and below, hero/aside insets become 20px, display type becomes 40px and tile labels become 16px with 14px horizontal tile padding. The footer changes from a row to a column at 900px.

## Elevation & Depth

No box shadows, gradients, blur or simulated volume are present. Adjacent solid fields, thin rules and contrasting text carry separation. Product-index artwork is flat CSS geometry, with clipping and curves that construct letterforms; it is not a 3D illustration system. Scenario changes reveal the demonstration panel with a 450ms clipped entrance. Reduced-motion removes this entrance and smooth scrolling.

**The Flat Field Rule.** Preserve solid field separation and do not add floating shadows to the existing components.

## Shapes

Buttons, panels and the textarea are square. Readiness pills use the status radius. Geometric artwork combines polygons and constructed curved letterforms; these curves do not establish rounded containers. Thin 1px rules separate explanatory copy, scenario expansion and request preview.

## Components

### Buttons

Rectangular actions pair text with an inline arrow SVG. Desktop base actions use 1.43vw type and the primary-button padding. The hero uses a paper action, 600 weight, a 22.59vw width and 4.36vw height; on mobile it becomes intrinsic width with 18px 22px padding and 16px type. Discussion actions fill their column with the light-button padding and 18px type, then 16px on mobile. Dark actions hover to violet; light actions hover to light-hover. There is no animated hover transform.

### Readiness labels

Pills use 600 weight and paired backgrounds/text from Colors. Their desktop type is 1.1vw, line-height 1.5. The full MVP readiness is also spelled out in the selected solution; the condensed index label is not the only readiness evidence.

### Containers

Demonstration panels are solid product-color rectangles with paper text, panel padding and no border/shadow. Mobile padding is 28px 24px. Product tiles are full-area native buttons rather than independent rounded cards; hover underlines their name. A selected tile has a 3px paper outline inset 8px, using plum on the lavender tile.

### Inputs / Fields

The task textarea has a dark field background, 1px field-border stroke, 20px padding, 17px type, line-height 1.55 and a 160px minimum height. It is vertically resizable. Placeholder, hint and error colors are explicit frontmatter tokens. Error feedback is text below the field; there is no implemented disabled variant. The local preview preserves line breaks and wraps long text.

### Navigation and focus

Desktop navigation uses 1.28vw type, tight tracking and 3.1vw gaps; mobile uses 14px type and 24px gaps. Link/button hover underlines with a 7px offset. Text links have a thin underline rule and turn cobalt on hover.

Keyboard focus uses a 3px outline with 5px offset: violet on light fields, paper on dark fields. Product focus moves the outline inside by 6px. Labels and selection remain textual and semantic, not decorative substitutes.

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
