# Ram's Dev Ocean

A free, open-source, book-styled learning and interview-prep site for **Python,
SQL, GenAI and System Design** — from basics to advanced, with a short
assessment at the end of every module.

- **Content is files.** Every topic is an `.mdx` file, every quiz a `.json` file.
  There is no database and no server.
- **Progress is local.** Quiz scores and completion ticks live in `localStorage`.
- **Contribution is Markdown.** Adding a topic does not require React.

## Stack

| Layer    | Choice                                              |
| -------- | --------------------------------------------------- |
| Framework| Docusaurus 3.10.2 (React, MDX, TypeScript strict)    |
| Styling  | Hand-written CSS (`src/css/book-theme.css`)         |
| Fonts    | Self-hosted via `@fontsource` (no external requests) |
| Search   | `@easyops-cn/docusaurus-search-local` (no Algolia)   |
| Hosting  | Static output — Vercel, Netlify or Cloudflare Pages  |

## Local development

Requires Node 20 or newer (see `.nvmrc`).

```bash
npm install
npm run start      # http://localhost:3000
```

Other commands:

```bash
npm run build      # static output in build/
npm run serve      # preview the production build
npm run typecheck  # tsc, strict mode
```

`npm run build` fails on broken internal links, so run it before opening a pull
request.

## Repository layout

```
docs/                 all learning content
  <subject>/<level>/<module>/<topic>.mdx
src/
  components/         Quiz, Callout, DropCap, ChapterHeader, ...
  css/book-theme.css  the old-book look
  pages/index.tsx     landing page
  utils/progress.ts   localStorage helpers
static/               images, fonts, favicon
examples/             runnable code mirroring docs/
templates/            copy these to start new content
scripts/              scaffolding and validation
```

Ordering is controlled by two-digit prefixes (`01-`, `02-`). Docusaurus strips
those prefixes from URLs, so `docs/python/01-basics/01-syntax-and-variables/`
is served at `/docs/python/basics/syntax-and-variables/`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and `/docs/contributing` once the site is
running. Content is written in public; draft chapters are marked and open to
anyone.

## Deployment

The build is fully static, so no runtime configuration is needed.

| Host              | Notes                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Vercel**        | Zero config. Hobby plan is fine while the project is non-commercial. |
| **Netlify**       | Zero config. Free tier permits commercial use.                |
| **Cloudflare Pages** | Zero config, unmetered bandwidth. Best if a launch goes viral. |

Set `url` in `docusaurus.config.ts` to the production URL before deploying.

## Known build-time advisories

`npm audit` reports one high and one moderate advisory, both in build tooling
that never ships to the browser:

- `braces` — no patched 3.x release exists; it is a transitive dependency of
  Docusaurus's file watcher.
- `uuid` — reachable only through `sockjs` in the local dev server, not in the
  production build.

`tinypool`, `serialize-javascript` and `postcss-selector-parser` are pinned to
patched versions via `overrides` in `package.json`, which removed every critical
advisory.

## Licensing

- **Code** — [MIT](LICENSE)
- **Written content** — [CC BY-SA 4.0](LICENSE-CONTENT)
