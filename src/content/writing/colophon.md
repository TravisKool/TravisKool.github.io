---
title: How this site is built
description: A static site with no database and no framework runtime — chosen and written by agents, under someone who had never heard of Astro until it was recommended to him.
pubDate: 2026-08-15
kind: note
tags: ['astro', 'agents', 'web', 'architecture']
featured: false
draft: false
---

Every personal site is a small architecture decision, so it may as well be a
consistent one. Here is what is running underneath this page and why — starting
with who decided it.

## Who chose this

I did not pick Astro. I had not heard of it.

I gave Claude Code the constraints — a personal site, static, fast, no server to
run, content in version control, a design that could carry both engineering and
flying — and asked what it would build with and why. It came back with Astro and
a rationale. My job was the part that still matters when you are not the one
typing: interrogating the recommendation until I understood the tradeoffs well
enough to reject it if it did not hold up. It held up. So I own the decision
without having made the discovery.

The code is the same story. Agents wrote it. I set the constraints, directed the
content and the design, reviewed what came back, and decided what was allowed to
ship.

That is not a disclaimer, it is the subject. After eight years leading backend
teams I am spending this year on whether agents can build systems that hold
up — precision, decoupling, and quality under real velocity rather than traded
away for it. A site is a small instance of that question, with the useful
property that anyone can open the repository and judge the answer.

The rest of this is what got decided, and why it survived review.

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
code. If a mistake can be caught mechanically, it should be — and that matters
more, not less, when an agent is doing the typing. Mechanical checks are the
part of review that scales at the speed generation does.

## Design

The typography pairs a serif for reading with a monospace for anything that is
really data — dates, tags, routes, times. The hairline rules and the small
uppercase labels come from engineering drawings and instrument panels, which
felt like the honest reference for a site that is half architecture and half
aviation.

Both themes are defined as tokens in one file. Nothing else in the codebase
hardcodes a colour. That rule lives in the repository's agent instructions, and
keeping it true is most of what directing an agent turns out to be.

## Hosting

Static files on GitHub Pages, deployed by GitHub Actions on every push to
`main`. Total cost: nothing. Total moving parts in production: also
approximately nothing, which is the point.
