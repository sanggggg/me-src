# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal bilingual (Korean/English) blog built with Gatsby 5, React 18, and TypeScript. Deployed to Cloudflare Pages.

## Commands

```bash
# Development
pnpm develop          # Start dev server at localhost:8000
pnpm build            # Type-check + Gatsby build
pnpm deploy           # Clean, build, and deploy to Cloudflare Pages

# Quality
pnpm lint             # ESLint for src/*.ts,tsx,js
pnpm typecheck        # TypeScript check (no emit)
pnpm clean            # Clear Gatsby cache
```

Use mise for Node version management.

## Architecture

### Content Structure
- `blog/*.md` - Blog posts in Korean (default)
- `blog/*.en.md` - Blog posts in English
- `intro/intro.md` and `intro/intro.en.md` - Homepage intro content

Posts use YAML frontmatter with fields: title, date, tags, series.

### Routing & i18n
- Language is determined by file suffix (`.en.md` = English, `.md` = Korean)
- URLs follow pattern: `/{lang}/blog/{slug}`, `/{lang}/tag/{tag}`
- Root paths redirect to `/ko/...` (default language)
- `LocaleContext` provides current language throughout the app

### Key Files
- `gatsby-node.ts` - Page generation logic, handles language-based routing
- `src/i18n/` - i18next config and locale JSON files (ko.json, en.json)
- `src/components/LocaleLink.tsx` - Locale-aware navigation
- `src/queries.tsx` - GraphQL type definitions

### Styling
Tailwind CSS with dark mode support. Global styles in `src/css/global.css`, code highlighting in `src/css/prism-js.css`.
