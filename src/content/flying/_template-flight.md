---
title: 'First mountain crossing'
description: A template flight entry — copy this file, rename it, and fill in the details.
pubDate: 2026-08-13
aircraft: 'Cessna 172S'
route: ['KAPA', 'KLXV', 'KASE']
hours: 2.4
conditions: 'VFR, light chop'
featured: false
draft: true
---

> **This is a template.** It has `draft: true`, so it renders locally but is
> excluded from the production build. Copy it, rename the file, set
> `draft: false`, and publish.
>
> The frontmatter above drives the technical readout under the title and the
> aggregate totals on the [Flying](/flying/) index. `route` renders as
> `KAPA → KLXV → KASE`; leave it as an empty array for local flights.

## Planning

Weather, weight and balance, fuel, alternates. What made this flight worth
thinking carefully about before it started.

## The flight

The narrative. Departure, the leg itself, what the air was doing, what the
terrain looked like, the moment worth remembering.

## What I would do differently

The aviation equivalent of a postmortem, and the reason this section pairs so
naturally with the engineering writing on this site. Both disciplines get safer
the same way: by writing down what actually happened, honestly, while it is
still fresh.

## Photos

Drop images in `public/photos/` and reference them:

```markdown
![Looking north over the divide](/photos/divide.webp)
```

Convert to `.webp` and resize to roughly 1600px on the long edge before
committing — see `CLAUDE.md` for the reasoning and the one-line command.
