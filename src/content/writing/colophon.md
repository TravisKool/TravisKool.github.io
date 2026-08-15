---
title: How this site is built
description: A static site with no database, no framework runtime, and no tracking — and the reasoning behind each of those choices.
pubDate: 2026-08-15
kind: note
tags: ['astro', 'web', 'architecture']
featured: false
draft: false
---

Every personal site is a small architecture decision, so it may as well be a
consistent one. Here is what is running underneath this page and why.

## The stack

The site is built with [Astro](https://astro.build). Every page is rendered to
static HTML at build time and served as files. There is no server process, no
database, and no framework runtime shipped to your browser. The only JavaScript
on the page is a theme toggle, a clock, and a scroll observer — a few hundred
bytes, not a few hundred kilobytes.

Content lives as Markdown files in the same repository as the code. Git is the
database. Every post has a full revision history for free, and publishing is a
commit.

## Why no database

A database is a good answer to the question "how do I store data that changes
without my involvement?" Nothing on this site does. The content changes when I
change it, which means the natural storage medium is a file in version control.

Adding Postgres here would mean a server, a deployment target, a backup story,
and a migration path — all in service of content I edit by hand a few times a
month. That is a genuinely worse system, not a more capable one.

## Type-checked content

Post frontmatter is validated against a schema at build time. A typo in a date,
a missing description, or a `kind` outside the allowed set fails the build
rather than shipping a broken page.

```ts
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(240),
    pubDate: z.coerce.date(),
    kind: z.enum(['essay', 'postmortem', 'note', 'case-study']).default('essay'),
  }),
});
```

This is the same instinct that makes me reach for a compiler in application
code. If a mistake can be caught mechanically, it should be.

## Design

The typography pairs a serif for reading with a monospace for anything that is
really data — dates, tags, routes, times. The hairline rules and the small
uppercase labels come from engineering drawings and instrument panels, which
felt like the honest reference for a site that is half architecture and half
aviation.

Both themes are defined as tokens in one file. Nothing else in the codebase
hardcodes a colour.

## Hosting

Static files on GitHub Pages, deployed by GitHub Actions on every push to
`main`. Total cost: nothing. Total moving parts in production: also
approximately nothing, which is the point.
