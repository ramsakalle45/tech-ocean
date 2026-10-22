# Ram's Dev Ocean: Repo Blueprint, Architecture and Master Prompt

An open-source, book-styled learning and interview-prep site for **Python, SQL, GenAI and System Design**, going from basic to advanced, with a short assessment at the end of every module.

---

## 1. Principles

1. **Content in files, no database.** Every tutorial is an `.mdx` file; every quiz is a `.json` file.
2. **Modular.** One subject, one folder. One module, one folder. One topic, one file. Nothing is shared except the theme and components.
3. **Predictable.** Numeric prefixes (`01-`, `02-`) control order. Same template for every topic.
4. **Contributor-friendly.** Adding a topic = adding a Markdown file. No React knowledge needed.
5. **Book feel.** Pages look and read like an old printed book (paper, serif fonts, drop caps, chapter numbers).
6. **Progress is local.** Quiz scores and "completed" ticks are stored in the browser (`localStorage`). No server.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Docusaurus 3** (React, MDX) | Sidebar, search, versioning, dark mode and SEO built in |
| Content | **MDX** | Markdown plus small interactive components (Quiz, Callout) |
| Styling | Custom CSS theme (`src/css/book-theme.css`) | Old-book look |
| Fonts | Google Fonts, self-hosted via `@fontsource` | Fast, works offline |
| Search | Local search plugin (`@easyops-cn/docusaurus-search-local`) | Free, no Algolia needed |
| Code runner (optional) | Pyodide for Python, sql.js for SQL | In-browser, no backend |
| Hosting | Vercel / Netlify / Cloudflare Pages | Free, preview URL per PR |
| CI | GitHub Actions | Lint, link check, quiz schema validation, build |

Local run for anyone: `npm install && npm run dev`.

---

## 3. Repository Structure

```
rams-dev-ocean/
├── docs/                                  # ALL learning content lives here
│   ├── intro.mdx                          # "How to read this book"
│   │
│   ├── python/                            # ── SUBJECT ──
│   │   ├── _category_.json                # subject label, position, description
│   │   ├── index.mdx                      # subject overview + roadmap
│   │   ├── 01-basics/                     # ── LEVEL / PART ──
│   │   │   ├── _category_.json
│   │   │   ├── 01-syntax-and-variables/   # ── MODULE (chapter) ──
│   │   │   │   ├── _category_.json
│   │   │   │   ├── 01-variables.mdx       # ── TOPIC (page) ──
│   │   │   │   ├── 02-data-types.mdx
│   │   │   │   ├── 03-operators.mdx
│   │   │   │   ├── quiz.json              # module assessment
│   │   │   │   └── 99-assessment.mdx      # renders <Quiz src={...}/>
│   │   │   ├── 02-control-flow/
│   │   │   └── 03-functions/
│   │   ├── 02-intermediate/
│   │   │   ├── 01-oop/
│   │   │   ├── 02-decorators-and-generators/
│   │   │   └── 03-error-handling-and-files/
│   │   ├── 03-advanced/
│   │   │   ├── 01-concurrency/
│   │   │   ├── 02-memory-and-gil/
│   │   │   └── 03-performance-and-profiling/
│   │   └── 04-interview/
│   │       ├── 01-top-questions/
│   │       ├── 02-coding-patterns/
│   │       └── 03-mock-tests/
│   │
│   ├── sql/                               # same shape as python/
│   │   ├── 01-basics/                     # SELECT, WHERE, ORDER BY, aggregates
│   │   ├── 02-intermediate/               # JOINs, subqueries, GROUP BY, CTEs
│   │   ├── 03-advanced/                   # window functions, indexing, query plans, transactions
│   │   └── 04-interview/
│   │
│   ├── genai/
│   │   ├── 01-foundations/                # ML basics, tokens, embeddings, transformers
│   │   ├── 02-working-with-llms/          # prompting, APIs, structured output
│   │   ├── 03-rag-and-agents/             # vector DBs, RAG, tools, agents, MCP
│   │   ├── 04-production/                 # evals, guardrails, cost, latency, deployment
│   │   └── 05-interview/
│   │
│   └── system-design/
│       ├── 01-fundamentals/               # scaling, latency, CAP, load balancing
│       ├── 02-building-blocks/            # caching, queues, DBs, CDNs, sharding
│       ├── 03-case-studies/               # URL shortener, chat, feed, rate limiter
│       └── 04-interview/
│
├── src/
│   ├── components/
│   │   ├── Quiz/                          # quiz engine (reads quiz.json)
│   │   ├── Callout/                       # Note, Tip, Warning, Interview-Tip boxes
│   │   ├── DropCap/
│   │   ├── ChapterHeader/                 # "Chapter III" ornamental header
│   │   ├── ProgressBadge/                 # reads localStorage progress
│   │   └── CodeRunner/                    # optional Pyodide / sql.js
│   ├── css/
│   │   └── book-theme.css                 # the whole old-book look
│   ├── pages/
│   │   └── index.tsx                      # landing page, book cover style
│   ├── theme/                             # swizzled Docusaurus components (DocItem, Footer)
│   └── utils/
│       └── progress.ts                    # localStorage helpers
│
├── static/
│   ├── img/                               # paper texture, ornaments, logo (WebP, small)
│   └── fonts/                             # only if not using @fontsource
│
├── examples/                              # small runnable code, mirrors docs/ layout
│   ├── python/
│   ├── sql/
│   └── genai/
│
├── templates/                             # copy these to start new content
│   ├── topic.mdx
│   ├── quiz.json
│   └── module-checklist.md
│
├── scripts/
│   ├── new-topic.js                       # npm run new:topic -- python 02-intermediate 01-oop 01-classes
│   ├── validate-quizzes.js                # JSON schema check for every quiz.json
│   └── generate-progress-map.js           # optional: builds a roadmap from the folders
│
├── .github/
│   ├── CODEOWNERS
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── new-topic.md
│   │   └── content-fix.md
│   └── workflows/
│       ├── ci.yml                         # lint, link check, quiz validation, build
│       └── deploy.yml                     # optional if not using Vercel/Netlify
│
├── docusaurus.config.ts
├── sidebars.ts                            # autogenerated from folder structure
├── package.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE                                # MIT (code)
├── LICENSE-CONTENT                        # CC BY-SA 4.0 (written content)
└── README.md
```

**Naming rules**
- Folders and files: `lowercase-with-hyphens`, prefixed with two digits for order.
- Depth: `subject / level / module / topic`. Never deeper.
- One topic per file. Aim for 5 to 15 minutes of reading.
- One `quiz.json` per module (5 to 10 questions).

---

## 4. Architecture

```
            ┌────────────────────────────────────────────┐
            │              Contributor / You             │
            │   writes .mdx + quiz.json, opens a PR      │
            └──────────────────────┬─────────────────────┘
                                   │
                         GitHub (public repo)
                  main protected: PR required, you merge
                                   │
                    ┌──────────────┴──────────────┐
                    │   GitHub Actions (CI)       │
                    │ lint · link-check · quiz    │
                    │ schema validation · build   │
                    └──────────────┬──────────────┘
                                   │ pass
                    ┌──────────────┴──────────────┐
                    │  Vercel / Netlify / CF Pages│
                    │  PR → preview URL           │
                    │  merge → production deploy  │
                    └──────────────┬──────────────┘
                                   │
                         Static site (HTML/JS/CSS)
                                   │
            ┌──────────────────────┴───────────────────────┐
            │                  Reader's browser            │
            │  reads pages · takes quizzes · progress in   │
            │  localStorage · optional Pyodide / sql.js    │
            └──────────────────────────────────────────────┘
```

**Build-time flow:** `docs/**/*.mdx` + `_category_.json` → Docusaurus autogenerates sidebar → static pages. `quiz.json` is imported by `<Quiz />` at build time. No runtime server.

**Module independence:** a module only depends on the shared components in `src/components`. Deleting or adding a module never breaks another one. Cross-links use relative doc links.

---

## 5. Topic Page Template (`templates/topic.mdx`)

```mdx
---
id: decorators
title: Decorators
sidebar_label: Decorators
description: Wrap functions to add behaviour without changing their code.
tags: [python, intermediate, functions]
difficulty: intermediate        # basic | intermediate | advanced
reading_time: 10                # minutes
last_updated: 2026-01-01
prerequisites: [functions, closures]
---

import Callout from '@site/src/components/Callout';
import DropCap from '@site/src/components/DropCap';

<DropCap>A</DropCap> decorator is ...   {/* one-paragraph hook, drop cap */}

## What you will learn
- bullet list of 3 to 5 outcomes

## The Concept
Plain-English explanation, then a diagram if useful.

## Example
```python
# small, runnable, commented
```

<Callout type="warning" title="Common Mistake">...</Callout>

## Under the Hood        {/* optional for advanced readers */}

## Interview Corner
<Callout type="interview" title="Often asked">
Q: ... A: ...
</Callout>

## Quick Recap
- 3 to 5 bullets

## Further Reading
- links
```

### Module assessment page (`99-assessment.mdx`)
```mdx
---
title: Module Assessment
sidebar_label: ✎ Assessment
---
import Quiz from '@site/src/components/Quiz';
import quiz from './quiz.json';

<Quiz data={quiz} moduleId="python/02-intermediate/02-decorators-and-generators" />
```

---

## 6. Assessment System

**`quiz.json` schema**
```json
{
  "title": "Decorators and Generators",
  "passMark": 70,
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "What does @decorator do?",
      "options": ["A", "B", "C", "D"],
      "answer": 1,
      "explanation": "Why this is correct and why others are not.",
      "topicRef": "01-decorators"
    },
    { "id": "q2", "type": "multi", "question": "...", "options": [], "answer": [0, 2], "explanation": "" },
    { "id": "q3", "type": "truefalse", "question": "...", "answer": true, "explanation": "" },
    { "id": "q4", "type": "code-output", "question": "What does this print?", "code": "print(1)", "answer": "1", "explanation": "" },
    { "id": "q5", "type": "sql-fill", "question": "Complete the query", "template": "SELECT ___ FROM users", "answer": "*", "explanation": "" }
  ]
}
```

**Behaviour**
- Instant feedback with explanation after each question; final score at the end.
- Pass mark default 70%. Passing marks the module "completed" (saved in `localStorage`).
- Wrong answers show a link back to the related topic (`topicRef`).
- Retry allowed; shuffle questions and options.
- A progress badge appears in the sidebar and on the subject overview page.
- `scripts/validate-quizzes.js` fails CI if any quiz breaks the schema (missing explanation, answer index out of range, etc.).

---

## 7. Old-Book Theme

**Fonts (all free on Google Fonts)**

| Use | Font |
|---|---|
| Body text | **EB Garamond** (or Crimson Pro) |
| Headings / chapter titles | **Playfair Display SC** or **IM Fell English SC** |
| Drop caps / ornaments | **Cinzel Decorative** |
| Margin notes / callouts | **Caveat** (handwritten feel) |
| Code | **Courier Prime** or **IBM Plex Mono** (typewriter look) |

**`src/css/book-theme.css` starter**
```css
@import '@fontsource/eb-garamond/400.css';
@import '@fontsource/eb-garamond/400-italic.css';
@import '@fontsource/playfair-display-sc/700.css';
@import '@fontsource/cinzel-decorative/700.css';
@import '@fontsource/caveat/500.css';
@import '@fontsource/courier-prime/400.css';

:root {
  --paper: #f4ecd8;            /* aged paper */
  --paper-edge: #e6d9b8;
  --ink: #2b2118;              /* warm black */
  --ink-soft: #5a4a3a;
  --accent: #8b2f1f;           /* faded red, chapter marks */
  --gold: #b08d3c;             /* ornaments */
  --rule: #cdbb94;

  --ifm-font-family-base: 'EB Garamond', Georgia, serif;
  --ifm-heading-font-family: 'Playfair Display SC', Georgia, serif;
  --ifm-font-size-base: 120%;
  --ifm-line-height-base: 1.75;
  --ifm-color-primary: var(--accent);
  --ifm-background-color: var(--paper);
  --ifm-font-color-base: var(--ink);
  --ifm-code-font-size: 90%;
}

[data-theme='dark'] {          /* "candlelight" mode */
  --paper: #1f1812;
  --paper-edge: #2a2118;
  --ink: #e8dcc2;
  --ink-soft: #b9a98a;
  --accent: #d4694f;
  --gold: #d1a954;
  --rule: #3d3022;
}

body {
  background: var(--paper);
  background-image: url('/img/paper-texture.webp'); /* tiny tileable texture */
  color: var(--ink);
}

/* the "page" */
.theme-doc-markdown {
  background: var(--paper);
  padding: 3rem 3.5rem;
  border: 1px solid var(--rule);
  box-shadow: 0 0 0 6px var(--paper-edge), 0 8px 30px rgba(0,0,0,.18);
  border-radius: 2px;
  position: relative;
}
/* gutter shadow like a book spine */
.theme-doc-markdown::before {
  content: ''; position: absolute; inset: 0 auto 0 0; width: 40px;
  background: linear-gradient(to right, rgba(0,0,0,.08), transparent);
  pointer-events: none;
}

h1 { text-align: center; letter-spacing: .04em; border-bottom: 2px double var(--gold); padding-bottom: .5rem; }
h2 { color: var(--accent); }
h2::before { content: '❦ '; color: var(--gold); }

/* drop cap */
.dropcap::first-letter, .dropcap-letter {
  font-family: 'Cinzel Decorative', serif;
  float: left; font-size: 4.2rem; line-height: .8;
  padding: .3rem .6rem 0 0; color: var(--accent);
}

/* text feels printed */
p { text-align: justify; hyphens: auto; }
blockquote { border-left: 3px solid var(--gold); font-style: italic; color: var(--ink-soft); }

/* code = typewriter insert */
pre, code { font-family: 'Courier Prime', monospace; }
pre { background: #efe3c2 !important; border: 1px dashed var(--rule); }

/* callouts = margin notes */
.callout { font-family: 'Caveat', cursive; font-size: 1.25rem; border: 1px solid var(--gold);
  background: rgba(176,141,60,.08); padding: .8rem 1rem; transform: rotate(-.4deg); }

/* chapter header */
.chapter-header { text-align: center; font-family: 'Cinzel Decorative', serif; color: var(--accent); }
.chapter-header small { display: block; letter-spacing: .3em; color: var(--gold); }

/* mobile: drop the heavy frame */
@media (max-width: 996px) {
  .theme-doc-markdown { padding: 1.5rem 1.2rem; box-shadow: none; }
}
```

**Extra book touches:** book-cover landing page (leather texture, gold title "Ram's Dev Ocean"), "Table of Contents" as the home sidebar, "Chapter III" ornaments, page-turn style Next/Previous buttons, footnote style references, printable stylesheet (`@media print`), `prefers-reduced-motion` respected.

---

## 8. Curriculum Map (starter outline)

**Python:** Basics (syntax, types, control flow, functions, collections) → Intermediate (OOP, comprehensions, decorators, generators, iterators, modules, files, exceptions, typing) → Advanced (concurrency, asyncio, GIL, memory, metaclasses, packaging, testing, profiling) → Interview (top questions, coding patterns, mock tests).

**SQL:** Basics (SELECT, filtering, sorting, aggregates, DDL/DML) → Intermediate (JOINs, subqueries, CTEs, GROUP BY/HAVING, set operations, constraints) → Advanced (window functions, indexes, query plans, transactions and isolation, normalization, partitioning, optimization) → Interview (classic problems, 50 query challenges).

**GenAI:** Foundations (ML basics, neural nets, tokens, embeddings, transformers) → Working with LLMs (prompt engineering, APIs, structured output, function calling) → RAG and Agents (chunking, vector DBs, retrieval, agents, tools, MCP) → Production (evals, guardrails, fine-tuning vs RAG, cost and latency, observability) → Interview.

**System Design:** Fundamentals (scalability, latency vs throughput, CAP, consistency) → Building blocks (load balancers, caching, queues, databases, sharding, CDN, API design) → Case studies (URL shortener, rate limiter, chat, news feed, video streaming, notification system) → Interview (framework, estimation, mock designs).

---

## 9. Governance and Safety (free GitHub plan, public repo)

- `main` branch: require PR, block force push, restrict deletion. Set approvals to 0 while you are the only maintainer.
- Nobody gets write access. Contributors use forks.
- `CODEOWNERS`: `* @your-github-username`
- Actions: require approval for workflows from outside contributors; read-only token by default.
- CI must pass before merge: lint, link check, quiz validation, build.
- PR template checklist: follows topic template, code tested, no copied content, quiz updated, no large files.

---

## 10. COPY-PASTE MASTER PROMPT

Paste this into Claude Code, Cursor, or any AI coding assistant.

````text
You are a senior full-stack engineer and technical writer. Build an open-source,
book-styled learning and interview-preparation website called "Ram's Dev Ocean"
(repo slug: rams-dev-ocean).

## GOAL
A static website with in-depth tutorials, basic to advanced, for four subjects:
Python, SQL, GenAI, System Design. Every module ends with a short assessment.
Everything is file-based: no database, no backend.

## TECH STACK (do not substitute)
- Docusaurus 3 with TypeScript and MDX
- Custom CSS theme (no Tailwind), fonts via @fontsource
- Local search plugin: @easyops-cn/docusaurus-search-local
- localStorage for quiz progress
- Node 20, npm. `npm install && npm run dev` must work with zero extra setup.

## CONTENT ARCHITECTURE
docs/<subject>/<NN-level>/<NN-module>/<NN-topic>.mdx
- Subjects: python, sql, genai, system-design
- Levels per subject: 01-basics, 02-intermediate, 03-advanced, 04-interview
  (genai has 01-foundations, 02-working-with-llms, 03-rag-and-agents, 04-production, 05-interview;
   system-design has 01-fundamentals, 02-building-blocks, 03-case-studies, 04-interview)
- Each folder has a _category_.json (label, position, description).
- Each module folder contains topic .mdx files, a quiz.json, and 99-assessment.mdx.
- Numeric prefixes control order. Folder depth never exceeds subject/level/module/topic.
- Sidebar is autogenerated from folders. Do not hand-write sidebar entries.
- Shared code only in src/components, src/css, src/utils. Modules never import from each other.

## FOLDERS TO CREATE
docs/, src/components/{Quiz,Callout,DropCap,ChapterHeader,ProgressBadge,CodeRunner}/,
src/css/book-theme.css, src/pages/index.tsx, src/theme/, src/utils/progress.ts,
static/img/, examples/{python,sql,genai}/, templates/{topic.mdx,quiz.json,module-checklist.md},
scripts/{new-topic.js,validate-quizzes.js}, .github/{CODEOWNERS,pull_request_template.md,
ISSUE_TEMPLATE/,workflows/ci.yml}, CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE (MIT),
LICENSE-CONTENT (CC BY-SA 4.0), README.md.

## TOPIC PAGE TEMPLATE
Front matter: id, title, sidebar_label, description, tags, difficulty
(basic|intermediate|advanced), reading_time, last_updated, prerequisites.
Sections: hook paragraph with drop cap, What you will learn, The Concept, Example
(runnable code), Common Mistake callout, Under the Hood (optional), Interview Corner,
Quick Recap, Further Reading.

## ASSESSMENT SYSTEM
- <Quiz data={quiz} moduleId="..."/> component reads a quiz.json.
- Question types: mcq, multi, truefalse, code-output, sql-fill.
- Each question has id, question, options/answer, explanation, topicRef.
- passMark default 70. Instant feedback, final score, retry, shuffle.
- Passing saves module completion to localStorage; ProgressBadge shows it in the
  sidebar and on subject overview pages.
- scripts/validate-quizzes.js validates every quiz.json against a JSON schema and
  runs in CI.

## DESIGN: OLD BOOK PAGES
- Aged paper background (#f4ecd8) with subtle texture, warm ink (#2b2118), faded red
  accent (#8b2f1f), gold ornaments (#b08d3c). Dark mode = "candlelight" (#1f1812).
- Fonts: EB Garamond (body), Playfair Display SC (headings), Cinzel Decorative
  (drop caps, chapter headers), Caveat (margin-note callouts), Courier Prime (code).
- Content area looks like a printed page: border, soft shadow, book-spine gradient on
  the left edge, justified text with hyphenation, drop cap on first paragraph,
  ornament (❦) before h2, double-rule under h1, "Chapter III" style header for modules.
- Landing page is a book cover with title, tagline and four subject "volumes".
- Callout types: note, tip, warning, interview (styled as handwritten margin notes).
- Responsive: simplify the frame on mobile. Add print stylesheet. Respect
  prefers-reduced-motion. Keep contrast WCAG AA.

## AUTOMATION
- `npm run new:topic -- <subject> <level> <module> <topic>` scaffolds a topic from
  templates/topic.mdx and creates quiz.json if the module is new.
- CI (GitHub Actions): lint markdown, check links, validate quizzes, build site.

## STARTER CONTENT (write real, high-quality content)
- Python: 01-basics/01-syntax-and-variables (3 topics + quiz of 8 questions)
- SQL: 01-basics/01-select-and-filtering (3 topics + quiz)
- GenAI: 01-foundations/01-what-are-llms (3 topics + quiz)
- System Design: 01-fundamentals/01-scalability (3 topics + quiz)
Each with 5 to 8 quiz questions covering varied question types.

## RULES
- No database, no server code, no paid services.
- Keep images small (WebP) and never commit large binaries.
- TypeScript strict mode. Components are small, typed and documented.
- Do not invent facts; keep code examples correct and runnable.
- After each phase, summarise what you built and how to run it.

## WORK IN PHASES. STOP AFTER EACH AND WAIT FOR MY "continue".
Phase 1: Scaffold Docusaurus, folder structure, config, README, CONTRIBUTING, licenses.
Phase 2: book-theme.css, fonts, DropCap, Callout, ChapterHeader, landing page.
Phase 3: Quiz component, progress.ts, ProgressBadge, quiz schema and validator.
Phase 4: Templates, new-topic script, CI workflow, PR/issue templates, CODEOWNERS.
Phase 5: Starter content for all four subjects.
Phase 6: Polish: search, SEO meta, print CSS, accessibility check, deployment notes
         for Vercel/Netlify/Cloudflare Pages.
````

---

## 11. Handy Follow-up Prompts

**Add a new module**
```text
Add module "02-control-flow" under docs/python/01-basics with 4 topics (if/else, loops,
break/continue, comprehensions intro), a quiz.json of 8 mixed-type questions and
99-assessment.mdx. Follow templates/topic.mdx exactly.
```

**Review a contributor PR**
```text
Review this PR against templates/topic.mdx and CONTRIBUTING.md. Check technical
accuracy, front matter, quiz schema, tone, broken links, and code correctness.
List required fixes and optional suggestions.
```

**Expand a subject**
```text
Generate a full module-by-module outline for docs/genai/03-rag-and-agents, with topic
titles, difficulty, prerequisites and 5 interview questions per module. Output as a
folder tree plus a checklist.
```

---

## 12. Launch Checklist

- [ ] Repo public, `main` protected, 2FA on
- [ ] Phase 1 to 4 done, CI green
- [ ] At least 1 full module per subject with a quiz
- [ ] README with live link, screenshots, local setup
- [ ] CONTRIBUTING + issue and PR templates
- [ ] Deployed on Vercel / Netlify / Cloudflare Pages with PR previews
- [ ] GitHub topics: `python`, `sql`, `genai`, `system-design`, `interview-preparation`, `docusaurus`
- [ ] Share on LinkedIn, Reddit (r/learnprogramming, r/Python), Dev.to, Hacker News
