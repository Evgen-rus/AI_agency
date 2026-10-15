# Repository Guidelines

## Project Structure & Module Organization

This LeadGenBureau React/TypeScript/Vite project has two pages: `/agency/` (`src/AgencyApp.tsx`) and `/neurorop/` (`src/NeuroApp.tsx`). `/` redirects immediately to `/agency/`. `BrandShared.tsx` and `brand.css` provide shared components and styles; `products.ts` holds confirmed product content. `src/assets/` holds brand images, Montserrat and its license. Root redirect and the two page HTML entries support static hosting. Historical concepts have been removed.

`PRODUCT.md` records confirmed facts. `docs/` holds briefs and research. `.impeccable/` stores approved comps, measurements and review evidence; never serve it as application content. `.agents/skills/impeccable/` is the independent project-local Codex skill.

## Build, Test, and Development Commands

Run from `D:\My_dev_project\AI_agency`, using Node.js 24 and npm:

- `npm ci`: install lockfile dependencies.
- `npm run dev`: start the local Vite server.
- `npm run typecheck`: check strict TypeScript types.
- `npm run build`: typecheck and generate `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run check`: run Biome formatting and lint checks.
- `npm run format`: apply Biome formatting.
- `npm run test:ui`: run browser assertions against a running server; see README for Chromium setup.

## Coding Style & Naming Conventions

Use two-space indentation, single-quoted JavaScript strings and descriptive names. Components use PascalCase; functions and state use camelCase; CSS classes use kebab-case. Biome defines formatting and recommended lint rules. Prefer native controls and existing dependencies. Keep confirmed facts separate from demonstration data.

## Testing Guidelines

The retained browser checks use Playwright and Node assertions for agency/NeuroROP at seven widths, reciprocal navigation, keyboard access, validation, absence of submissions/storage, root redirection and removal of historical routes. Extend checks for changed behavior. No coverage threshold or unit-test framework is configured. Report checks performed; screenshots alone do not prove functionality.

## Commit & Pull Request Guidelines

Follow the initial history's imperative subjects, such as `Initialize website project`. PRs explain changes and validation, link relevant issues, and include desktop/mobile screenshots for UI changes. Keep scope focused.

## Product Safety & Frontend Skill

Use `$impeccable` and its Windows launcher for frontend work. Preserve the agency and NeuroROP pages and honest readiness. Never invent cases, metrics or capabilities, commit secrets, or connect submissions without authorization. Sites publication is authorized; preserve public access and the existing Site ID in `.openai/hosting.json`. `.sites/` is an ignored publishing copy, not an automatically synchronized source. Do not modify global skills or the source project.
