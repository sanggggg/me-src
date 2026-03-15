# sanggggg.me

Personal site built with Astro, TypeScript, Tailwind CSS, and file-based Markdown content.

## Development

```bash
pnpm dev
```

The Astro dev server runs at `http://localhost:4321` by default if that port is available, otherwise Astro will pick the next open port. For redirect parity, Playwright validation runs against `wrangler pages dev ./dist` instead of `astro preview`.

## Content

- Blog posts live in `src/content/blog/`
- Intro pages live in `src/content/intro/`
- Locale suffixes stay file-based, for example `retrospect-organization.en.md`
- Adjacent images remain next to their Markdown files and are optimized at build time

## Commands

- `pnpm dev`: start the Astro development server
- `pnpm build`: run `astro check` and create a production build in `dist/`
- `pnpm serve`: build and serve `dist/` through `wrangler pages dev` so redirects and headers match Cloudflare Pages locally
- `pnpm lint`: run Biome checks
- `pnpm lint:fix`: apply Biome fixes
- `pnpm format`: format supported files with Biome
- `pnpm test:e2e`: rebuild and run Playwright against `wrangler pages dev ./dist`
- `pnpm wrangler-deploy`: build and upload `dist/` to Cloudflare Pages
