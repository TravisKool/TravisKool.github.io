# traviskool.github.io

Personal portfolio and writing site — [traviskool.github.io](https://traviskool.github.io)

Static Astro site. No database, no server, no tracking. Content is Markdown in
this repo; git is the database.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server. Drafts are visible. |
| `npm run build` | Production build to `dist/`. Drafts excluded. |
| `npm run preview` | Serve the production build locally. |
| `npm run check` | Type-check `.astro` and `.ts` files. |
| `npm run og` | Regenerate `public/og.png`. |

## Editing your details

Everything personal lives in **`src/data/site.ts`** — name, role, tagline,
links, employer, availability, and the career timeline. Nothing else needs to
change.

Items marked `TODO` in that file (and in `src/pages/about.astro`) are
placeholders from the initial scaffold and need real content.

## Writing a post

Add a Markdown file to `src/content/writing/`. The filename becomes the URL.

```markdown
---
title: 'Postmortem: the cache that ate Tuesday'
description: One sentence that makes someone want to read the rest.
pubDate: 2026-08-20
kind: postmortem
tags: ['reliability', 'postmortem']
draft: true
---

Your post here.
```

`kind` is one of `essay`, `postmortem`, `note`, `case-study`. Frontmatter is
schema-validated at build time, so mistakes fail the build instead of shipping.

Flight entries go in `src/content/flying/` and take `aircraft`, `route`,
`hours`, and `conditions` instead of `kind` and `tags`.

Files starting with `_` are templates — copy them rather than editing in place.

## Photos

Resize and convert before committing. Git history is permanent, and full-size
camera JPEGs will bloat this repo forever.

```bash
npx @squoosh/cli --resize '{"width":1600}' --webp auto -d public/photos/ input.jpg
```

Reference them as `/photos/name.webp`.

## Deployment

Push to `main`. GitHub Actions builds and publishes to GitHub Pages
automatically — see `.github/workflows/deploy.yml`.

## Stack

- [Astro 7](https://astro.build) — static site generation
- Content collections with Zod-validated frontmatter
- Self-hosted variable fonts: Newsreader, Inter, JetBrains Mono
- GitHub Pages + GitHub Actions

Design notes and contribution rules for AI agents are in [AGENTS.md](AGENTS.md).
