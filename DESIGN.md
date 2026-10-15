---
name: LeadGenBureau — agency and NeuroROP
description: Light editorial agency photography, an asymmetric product mosaic and a blue-white ascending process.
colors:
  paper: '#fafaf8'
  ink: '#111820'
  muted: '#505c6b'
  blue: '#1261b8'
  lavender: '#eeeaf8'
  line: '#dce1e5'
typography:
  display:
    fontFamily: 'Montserrat, sans-serif'
    fontSize: 'clamp(48px, 4.45vw, 64px)'
    fontWeight: 650
    lineHeight: 1.09
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Montserrat, sans-serif'
    fontSize: 'clamp(32px, 3vw, 44px)'
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: '-0.035em'
  body:
    fontFamily: 'Montserrat, sans-serif'
    fontSize: '17px'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Montserrat, sans-serif'
    fontSize: '14px'
    fontWeight: 500
    lineHeight: 1.6
rounded:
  field: '10px'
  product-card: '26px'
  action: '40px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '#fff'
    rounded: '{rounded.action}'
    padding: '14px 24px'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    rounded: '{rounded.action}'
    padding: '14px 24px'
  draft-field:
    backgroundColor: '#fff'
    textColor: '{colors.ink}'
    rounded: '{rounded.field}'
    padding: '13px 14px'
---

# Design System: LeadGenBureau

## Overview

**Creative North Star: "Clear business context, visible next action"**

Approved 15 October 2026 for /agency/ and /neurorop/. Visual authority: the two images under «референс от директора» and the user's approved implementation plan.

The agency introduces the business in a spacious photographic hero, then presents a standalone product mosaic. NeuroROP explains a single demonstrative situation through four ascending cards connected by a thin curve. Both surfaces are Persuade.

**Key Characteristics:**
- Daylight photography and warm paper.
- Mixed light/dark mosaic.
- Ascending connected process.
- Honest readiness and synthetic demonstrations.

## Colors

Warm paper and ink form the common reading ground. Agency actions are dark; its product cards combine lavender, deep green and neutral photography. NeuroROP uses blue actions and pale blue context surfaces. Product readiness always has text; color alone carries no status.

## Typography

Self-hosted Montserrat, including Cyrillic. Hero size is bounded: agency 64px and NeuroROP 56px on wide desktop; mobile 40/38px, reducing to 34px below 360px. Intro copy is 18–20px on desktop and 17px on mobile. Base reading text is 17px desktop and 16px mobile; navigation uses 14px at wide desktop. UI fragments use a compact illustrative hierarchy; full explanations remain HTML.

## Layout

1320px maximum container, desktop side margins 48px, tablet 32px, mobile 20px. Main section spacing: 96/80/60px. Header is 88px desktop, 76px mobile. Hero height follows content without scroll trapping or viewport locking.

Agency hero uses 55/45 columns. Product mosaic: 12 columns, 24px gaps; first row 6/6, second 7/5, staggered edges. Mobile cards stack and keep different internal content. Mobile office imagery is anchored to the visual panel below the copy to protect text contrast.

NeuroROP uses 40/60 columns from 1280px. Four equal-width cards ascend in 48px increments; a responsive SVG curve carries four points. Below 1280px copy moves above the process and the rise becomes approximately 38px per card. Below 768px cards form a vertical sequence with a left connecting line. No horizontal swipe is required.

## Elevation & Depth

Shared soft offset shadow: 0 14px 48px -16px rgb(25 40 58 / 18%). Photography provides material depth. Small interface panels have restrained rotation; primary text and controls remain flat. No heavy video or scroll-controlled animations.

## Shapes

Cards: 20–28px radii. Inputs: 10px. Buttons: rounded, 52–56px minimum height. Authored outline SVG icons use a consistent 1.6px stroke. The process SVG is geometry, not a bitmap of the reference.

## Components

BrandShared.tsx owns common header, footer, action links, icon set, approach and local-only contact draft. AgencyApp.tsx owns hero, mosaic, business tasks, Rick example and about. NeuroApp.tsx owns process, three-situation demo, role selector, pilot and native FAQ.

Menu: keyboard activation, accurate expanded state, Escape closes and returns focus. Demo and role selectors use native pressed buttons and live content regions. Native FAQ supports keyboard. Focus is a 3px blue outline. Reduced motion disables entry animation and hover transitions.

Contact: trimmed required fields, bounded lengths, field-specific errors, escaped preview, no network submission/storage. Editing invalidates the prepared preview. Demonstrations use synthetic content. Generated illustrative photos have provenance in .impeccable/assets/brand/provenance.json.

## Do's and Don'ts

- Preserve the two approved compositions and honest product maturity.
- Keep image and text assets separate; never ship either reference as a page background.
- Keep context available without animation, hover or selection.
- Do not add client logos, performance metrics, fabricated testimonials or an implied autonomous CRM write.
- Do not load these styles anywhere else or change the two approved compositions.
