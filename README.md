# Knowledge Base

A Markdown-first developer knowledge base: every note in this repository is
published as a searchable, syntax-highlighted page. Built with Next.js 16
(App Router), React 19, TypeScript and Tailwind CSS 4.

**Markdown files are the source of truth.** Adding a file makes a page. No React
component, route or config change is ever required.

---

## Contents

- [Quick start](#quick-start)
- [Adding a note](#adding-a-note)
- [How routing works](#how-routing-works)
- [Frontmatter](#frontmatter)
- [Markdown features](#markdown-features)
- [Categories](#categories)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Architecture notes](#architecture-notes)
- [Deployment](#deployment)

---

## Quick start

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

Every page is prerendered at build time, including the search index, so the
running site does no filesystem work per request.

---

## Adding a note

Create a Markdown file inside a category directory and refresh the browser:

````bash
mkdir -p content/postgres
cat > content/postgres/vacuum.md <<'MD'
---
title: "Vacuum and Analyze"
description: "When to vacuum, and what analyze actually updates."
tags:
  - postgres
  - performance
---

## Manual vacuum

```bash
psql -c 'VACUUM (VERBOSE, ANALYZE) users;'
```
MD
````

That single file produces:

- the page `/postgres/vacuum`
- a `Postgres` category page at `/postgres`
- a sidebar entry under a new `Postgres` group
- tag pages at `/tags/postgres` and `/tags/performance`
- a search index entry, a sitemap entry, and previous/next links

Frontmatter is optional. A file with no metadata at all still gets a title, a
description, a category, tags (none), a reading time and a position in the
sidebar — which is why the notes written long before this site existed all work
unchanged.

---

## How routing works

Two directories are scanned for content:

| Source | Purpose |
| --- | --- |
| the repository root | The existing top-level folders (`git/`, `docker/`, `linux/`, …) |
| `content/` | New notes, if you prefer them in one place |

Routes come from the file path. Files in `content/` drop that prefix, so both
sources share one namespace:

```text
git/git-log.md                   ->  /git/git-log
content/git/git-submodules.md    ->  /git/git-submodules
linux/ubuntu/static-ip.md        ->  /linux/ubuntu/static-ip
```

Rules:

- **The first directory is the category.** `/git` lists every note in `git/`,
  regardless of which source it came from.
- **Nested directories become sidebar sub-groups**, for example `linux/ubuntu/`.
- **A note must live in a directory.** Markdown files at the repository root
  (`README.md`, `LINKS.md`, …) are not published.
- **Two files may not resolve to the same route.** The build fails with both
  file paths if they do.
- Category directories may not be named `tags`, `search`, `categories` or `api`,
  which belong to the application.

Set `CONTENT_SOURCES` to change the scanned directories.

---

## Frontmatter

Every field is optional and validated. Unknown fields are rejected so typos fail
loudly instead of being ignored.

```yaml
---
title: "Useful Git Commands"
description: "A collection of useful Git commands for everyday development."
category: "Git"
tags:
  - git
  - commands
date: "2026-08-12"
updated: "2026-08-12"
published: true
featured: true
author: "Sai"
readingTime: 6
---
```

| Field | Type | Fallback when omitted |
| --- | --- | --- |
| `title` | string | First `#` heading, otherwise the file name |
| `description` | string | First paragraph, otherwise the section headings |
| `category` | string | Directory name, title-cased (label only — the route always follows the directory) |
| `tags` | string list | none |
| `date` | date | File creation time |
| `updated` | date | `date`, otherwise the file modification time |
| `published` | boolean | `true` |
| `featured` | boolean | `false` — `true` puts it on the homepage |
| `author` | string | not shown |
| `readingTime` | number, minutes | Calculated from the word count |

A leading `# Title` in the body is removed when rendering, because the page
already displays the title.

Validation errors name the file and the problem:

```text
Invalid frontmatter in:

  content/git/example.md

  • unknown field: titel
  • date: must be a valid date, for example "2026-08-12"
```

Check everything without starting the site:

```bash
npm run content:check
```

---

## Markdown features

CommonMark and GitHub Flavoured Markdown, rendered on the server:

- Headings with automatic anchors and a generated table of contents
- Tables (horizontally scrollable), task lists, strikethrough, footnotes
- Blockquotes, horizontal rules, images, inline code
- GitHub style alerts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`
- Code blocks with a language label, a copy button and Shiki highlighting in both
  themes at once (switching theme re-paints without re-rendering)
- **Unlabelled code fences are highlighted anyway**: the language is inferred
  from the contents, which matters for notes written in a hurry
- ` ```mermaid ` blocks render as diagrams (Mermaid is loaded only on pages that
  contain one)
- Relative links to other Markdown files (`../git/git-log.md`) are rewritten to
  real routes, so links work both in the editor and on the site
- Raw HTML such as `<kbd>Ctrl</kbd>` is passed through

---

## Categories

Category labels, descriptions, icons and ordering live in
`content/categories.json`. The file is optional: without it, labels are derived
from directory names.

```json
{
  "git": {
    "label": "Git",
    "description": "Everyday Git commands, branch workflows and recovery.",
    "icon": "git",
    "order": 10
  }
}
```

Available icons: `ai`, `cloud`, `code`, `database`, `docker`, `git`,
`kubernetes`, `layers`, `linux`, `network`, `notes`, `security`, `server`,
`shell`, `ssh`, `tools`, `windows`.

---

## Environment variables

All optional — copy `.env.example` to `.env.local` to change them.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical URLs, Open Graph tags, sitemap |
| `NEXT_PUBLIC_SITE_NAME` | `Knowledge Base` | Header and metadata titles |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | see `.env.example` | Homepage tagline and default description |
| `NEXT_PUBLIC_GITHUB_URL` | unset | Adds the header source link and "Edit this page" |
| `NEXT_PUBLIC_GITHUB_BRANCH` | `main` | Branch used for "Edit this page" links |
| `CONTENT_SOURCES` | `,content` | Comma separated content roots |

---

## Scripts

```bash
npm run dev            # development server
npm run build          # production build (prerenders every page)
npm run start          # serve the production build
npm run lint           # ESLint
npm run typecheck      # TypeScript, no emit
npm run format         # Prettier (Markdown notes are left alone)
npm run content:check  # validate frontmatter and routes
```

---

## Project structure

```text
content/                    Optional home for new notes
  categories.json           Category labels, descriptions, icons, order
git/  docker/  linux/  …    Existing notes, published in place

src/
  app/
    layout.tsx              Header, footer, theme and search providers
    page.tsx                Homepage: hero, featured, categories, recent
    (docs)/
      layout.tsx            Sidebar shell
      [...slug]/page.tsx    Every document and category page
      categories/page.tsx
      tags/page.tsx
      tags/[tag]/page.tsx
      search/page.tsx
    api/search-index/       Static JSON search index
    sitemap.ts  robots.ts
  components/
    content/  layout/  markdown/  navigation/  search/  theme/  ui/  views/
  lib/
    content/                Scanning, frontmatter, categories, tags, store
    markdown/               remark/rehype pipeline, Shiki, plugins
    navigation/             Sidebar tree and document order
    search/                 MiniSearch index and query helpers
    utils/                  Slugs, dates, text, class names, client store
  types/content.ts          Shared content types

scripts/check-content.ts    Standalone content validator
```

---

## Architecture notes

**Content processing is separate from the UI.** `lib/content` reads and validates
files; components only receive typed objects. The store builds the index once per
production server process, and rebuilds it on demand in development so a new file
appears on the next refresh without a restart.

**Markdown, not MDX.** Notes are prose written by hand, and MDX would treat a
stray `{` as JavaScript. The pipeline is `remark` → `rehype`, with custom plugins
for alerts, code blocks and link rewriting, converted to React elements on the
server via `hast-util-to-jsx-runtime`.

**Minimal client JavaScript.** Rendering, highlighting and metadata all happen on
the server. The only client components are the ones that need interactivity:
theme switcher, sidebar collapse, table of contents highlighting, copy buttons,
Mermaid and the search dialog.

**Search runs in the browser.** The index is a static JSON file, downloaded the
first time search is used and queried with MiniSearch. There is no search
backend and no request per keystroke.

**Errors are loud.** Invalid frontmatter, an unreadable category config or two
files claiming the same route stop the build and name the file. Readers still get
a polished 404 or error page rather than a stack trace.

**Accessibility.** Semantic landmarks, a skip link, keyboard-operable dialogs with
focus trapping and restore, `aria-current` on the active navigation item, a
combobox/listbox search pattern, and visible focus rings throughout.

---

## Deployment

Any Node host works, as does any static host after `next build` since every page
is prerendered.

Set `NEXT_PUBLIC_SITE_URL` before building so canonical URLs, Open Graph tags,
`sitemap.xml` and `robots.txt` point at the real domain.

If you deploy with `output: 'standalone'`, list your content directories in
`outputFileTracingIncludes` in `next.config.ts` so the Markdown sources travel
with the bundle.
