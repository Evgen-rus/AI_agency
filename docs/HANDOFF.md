# Continuation checkpoint

## Current state: two public pages

2026-10-15. The site is one AI-agency home at `/agency/` and the NeuroROP product landing at `/neurorop/`. `/` is a minimal redirect page (`index.html`) that sends the site root to `/agency/`, preserving query and hash through a replacement navigation; every other path shows a simple Russian 404 with a link to `/agency/`. There is no router and no shared concept navigation.

- Entry: `src/main.tsx` selects `/agency/` (also `/agency`) → `AgencyApp.tsx` and `/neurorop/` (also `/neurorop`) → `NeuroApp.tsx`; anything else replaces the body with the 404.
- Shared chrome, contact draft and icons: `src/BrandShared.tsx`; shared styles: `src/brand.css`; product content: `src/products.ts`.
- Static entries: `index.html` (root redirect and 404), `agency/index.html`, `neurorop/index.html`. `vite.config.ts` builds those three inputs.

## Product truths

- Lead generation is an operating direction; the AI voice agent is a working MVP in development; NeuroROP is a product in pilot development; custom AI solutions are a developing direction.
- Demonstrations are synthetic and labelled. The contact block prepares a bounded, escaped draft in memory only: no submission, storage, backend, API or CRM write.

## Commands and checks

Node.js 24 from the project root: `npm ci`, `npm run dev`, `npm run typecheck`, `npm run build`, `npm run preview`, `npm run check`, `npm run format`, `npm run test:ui`.

`npm run test:ui` runs `scripts/check-brand.mjs` against a running server (default `http://127.0.0.1:5173`, override with `PREVIEW_URL`, browser with `IMPECCABLE_BROWSER`). It covers both pages at 320, 390, 768, 1024, 1280, 1440 and 1536 px: headings, anchors, keyboard menu and Escape, the NeuroROP demo and roles, FAQ, validation and escaped draft, no writes or storage, clean reload and reduced motion. It also checks the root redirect with query and hash and replaced history, that unknown and removed paths show the 404 without either page, that neither page links to removed routes, and that the removed entries and concept bundles are absent from `dist/`.

## Publication

The existing Site is published publicly through the Sites plugin; `.openai/hosting.json` holds the Site ID and `.openai/deployment.json` the last deployment. The publishing copy is separate from this repository and is not synchronized automatically. See `docs/PUBLISHING.md`.

## Known limits

- Not verified: Safari, real devices, screen readers.
- Real contacts, approved cases, metrics, testimonials, client logos and audio still require owner confirmation before publication.
- Generated office and portrait images are illustrations, not the team or clients; provenance is in `.impeccable/assets/brand/provenance.json`.
