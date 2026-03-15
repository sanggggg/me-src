# Repository Guidelines

## Project Structure & Module Organization
This repository is a Gatsby + TypeScript personal site. App code lives in `src/`: route pages in `src/pages/`, shared UI in `src/components/`, page templates in `src/templates/`, i18n setup and locale files in `src/i18n/`, and global styles in `src/css/`. Content is file-based: blog posts live under `blog/` and intro pages under `intro/`. Static assets such as icons and images live in `static/`. Gatsby build behavior is configured in `gatsby-config.ts` and `gatsby-node.ts`.

## Build, Test, and Development Commands
Use `pnpm` for all local work.

- `pnpm dev`: start the Gatsby dev server at `http://localhost:8000`.
- `pnpm build`: run `pnpm typecheck` and produce a production build in `public/`.
- `pnpm serve`: serve the built site locally for a production check.
- `pnpm clean`: clear Gatsby caches when routes, GraphQL data, or plugins behave unexpectedly.
- `pnpm lint`: run Biome checks on `src/`.
- `pnpm lint:fix`: apply Biome-safe fixes.
- `pnpm format`: format `src/` with Biome.
- `pnpm wrangler-deploy`: clean, build, and deploy `public/` to Cloudflare Pages.

## Coding Style & Naming Conventions
TypeScript and React use 2-space indentation, double quotes, and semicolons, as enforced by `biome.json`. Prefer small Gatsby page/template components and keep shared layout logic in `src/components/`. Use `PascalCase` for React component files such as `LanguageSwitcher.tsx`, and `kebab-case` for Markdown content paths such as `blog/mysql-online-ddl.md`. Localized Markdown uses language suffixes like `retrospect-organization.en.md`.

## Testing Guidelines
There is no dedicated automated test suite in the repository today. Treat `pnpm typecheck`, `pnpm lint`, and `pnpm build` as the required validation baseline before opening a PR. For content or routing changes, manually verify the affected localized pages under `/ko/` and `/en/`, plus generated blog/tag pages.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects such as `Fix i18n hydration mismatch for page titles` and `Migrate to Biome and update dependencies`. Keep commit titles concise, descriptive, and focused on one change. PRs should include a brief summary, note any content or route changes, link the relevant issue when applicable, and attach screenshots for visible UI changes. Mention any required environment variables, especially `GTAG_ID`, when deployment behavior is affected.

## Configuration Notes
Analytics reads `GTAG_ID` from the environment in `gatsby-config.ts`. Do not hardcode secrets. Generated directories such as `public/`, `.cache/`, and `.wrangler/` should stay out of manual edits.
