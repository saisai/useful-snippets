---
title: "Welcome to the Knowledge Base"
description: "How this site turns a folder of Markdown notes into a searchable developer wiki."
category: "Getting Started"
tags:
  - documentation
  - markdown
  - workflow
date: "2026-08-12"
updated: "2026-08-12"
published: true
featured: true
---

# Welcome to the Knowledge Base

Every page on this site is a Markdown file on disk. There is no database, no CMS
and no admin panel: you write a note, save it, and it becomes a page.

## The daily workflow

1. Create a Markdown file inside a category directory.
2. Write the note.
3. Refresh the browser.

```bash
# A new note in an existing category
$EDITOR content/git/git-worktrees.md

# A new note in a brand new category — the directory is the category
mkdir -p content/postgres
$EDITOR content/postgres/vacuum.md
```

> [!TIP]
> Frontmatter is optional. A note with no metadata at all still gets a title,
> a description, a category, a reading time and a place in the sidebar.

## What you get for free

| Feature | Source |
| --- | --- |
| Page route | The file path, for example `content/git/git-log.md` becomes `/git/git-log` |
| Sidebar entry | The directory structure |
| Category page | The top-level directory name |
| Tag pages | The `tags` list in the frontmatter |
| Table of contents | The `##` and `###` headings in the note |
| Search result | The title, description, tags and full text |
| Previous / next links | The position of the note in the sidebar |
| Reading time | The word count of the note |

## Keyboard shortcuts

- <kbd>Ctrl</kbd> + <kbd>K</kbd> — or <kbd>⌘</kbd> + <kbd>K</kbd> on macOS — opens search
- <kbd>↑</kbd> and <kbd>↓</kbd> move through results
- <kbd>Enter</kbd> opens the highlighted result
- <kbd>Esc</kbd> closes the dialog

## Checklist for a good note

- [x] A title that you would actually search for
- [x] A one line description
- [ ] Tags, so it shows up next to related notes
- [ ] A fenced code block with a language, for example ` ```bash `

> [!NOTE]
> Notes without a language on the code fence still get highlighted: the language
> is inferred from the contents. Adding it explicitly is always more accurate.

Read [Writing Notes](/general/writing-notes) for the full frontmatter reference.
