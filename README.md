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
| Styling  | Hand-written CSS — six layers in `src/css/theme/`    |
| Fonts    | Self-hosted via `@fontsource` (no external requests) |
| Search   | `@easyops-cn/docusaurus-search-local` (no Algolia)   |
| Hosting  | Static output — Vercel, Netlify or Cloudflare Pages  |

## Local development

Requires Node 24 or newer (see `.nvmrc`).

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

Search is built by the production build, so the search box is empty in
`npm run start`. To exercise it locally, run `npm run build && npm run serve`
and open the printed URL.

## Repository layout

```
docs/                 all learning content
  <subject>/<level>/<module>/<topic>.mdx
src/
  components/         Callout, DropCap, ChapterHeader, Figure, DraftNotice
  css/theme/          tokens · typography · page · components · responsive · motion
  pages/index.tsx     the book cover
  theme/Root.tsx      page turn, and the navigation fade
  theme/prismBook.ts  syntax highlighting for both colour themes
  utils/roman.ts      Roman numerals for chapter numbers
static/               favicon, social card
BLUEPRINT.md          the design brief this site is built from
```

Ordering is controlled by two-digit prefixes (`01-`, `02-`). Docusaurus strips
those prefixes from URLs, so `docs/python/01-basics/01-syntax-and-variables/`
is served at `/docs/python/basics/syntax-and-variables/`.

## Status

| Area | State |
|---|---|
| Structure | 4 subjects · 18 levels · 65 modules scaffolded |
| Module pages | 65 written — each with learning outcomes, prerequisites, a topic roadmap, a worked example and an interview question |
| Topics | Not yet written; every module page lists the topics it will contain |
| Quizzes | Not yet built — the assessment engine is the next phase |
| Theme | Book layout, four responsive tiers, dark mode, page-turn motion — done |
| Search | Local search, 71 pages indexed — available in the production build |

Pages marked *Draft* are deliberate: the roadmap stays honest, and each one is
a claim on a topic somebody can write.

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
