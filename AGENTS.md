# Repository Guidelines

## Project Structure & Module Organization
This repository is an Astro + TypeScript personal site styled with Tailwind CSS. Route files live in `src/pages/` and use localized dynamic segments such as `src/pages/[lang]/...`. Shared UI components live in `src/components/`, layout shells live in `src/layouts/`, and reusable helpers live in `src/lib/`. File-based content is managed through `astro:content`: blog posts live in `src/content/blog/` and intro pages live in `src/content/intro/`, with collection schemas defined in `src/content.config.ts`. Translations live in `src/i18n/` and global styles live in `src/css/`. Static assets are served from `static/` via Astro's `publicDir` setting in `astro.config.mjs`.

## Build, Test, and Development Commands
Use `pnpm` for all local work.

- `pnpm dev`: start the Astro development server. It typically runs on `http://localhost:4321`.
- `pnpm build`: run `pnpm typecheck` and produce the production output in `dist/`.
- `pnpm serve`: build and serve `dist/` through `wrangler pages dev` for Cloudflare Pages parity.
- `pnpm preview`: alias for `pnpm serve`.
- `pnpm lint`: run Biome checks across config files, `src/`, and Playwright tests.
- `pnpm lint:fix`: apply Biome-safe fixes.
- `pnpm format`: format supported files with Biome.
- `pnpm typecheck`: run `astro check`.
- `pnpm test:e2e`: build and run Playwright end-to-end tests.
- `pnpm wrangler-deploy`: build and deploy `dist/` to Cloudflare Pages.

## Coding Style & Naming Conventions
TypeScript, Astro, and configuration files use 2-space indentation, double quotes, and semicolons, as enforced by `biome.json`. Keep route files and layouts small, and move reusable presentation or navigation logic into `src/components/` or `src/lib/`. Use `PascalCase` for Astro component files such as `LanguageSwitcher.astro`, and use `kebab-case` for content paths and Markdown filenames. Localized Markdown stays file-based with language suffixes like `retrospect-organization.en.md`. Keep adjacent images next to the Markdown entry that uses them when the asset belongs to a single post.

## Testing Guidelines
There is no unit test suite in this repository today. Treat `pnpm typecheck`, `pnpm lint`, and `pnpm build` as the minimum validation baseline before opening a PR. When routing, localization, or content rendering changes, manually verify the affected localized pages under `/ko/` and `/en/`, along with blog detail pages, blog index pages, and tag pages. Use `pnpm test:e2e` when changes may affect navigation, redirects, or rendered page behavior.

## Commit & Pull Request Guidelines
Use short, imperative commit subjects focused on one change, for example `Refresh blog layout spacing` or `Fix localized tag page metadata`. PRs should include a brief summary, note any route or content model changes, link the relevant issue when applicable, and attach screenshots for visible UI updates. Mention deployment-impacting configuration changes explicitly, especially anything that affects Cloudflare Pages, analytics, or redirects.

## Configuration Notes
Astro is configured in `astro.config.mjs`, including Tailwind integration, the `static/` public directory, trailing slash behavior, and Markdown plugins such as `rehype-mermaid`. Content collections are defined in `src/content.config.ts`; update schemas there when frontmatter requirements change. Do not hardcode secrets. Generated directories such as `dist/`, `.astro/`, `.wrangler/`, and `playwright-report/` should not be edited manually.
