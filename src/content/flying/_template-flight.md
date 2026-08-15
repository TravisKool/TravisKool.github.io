---
title: 'Chelan Butte, first 100'
description: A template flight entry — copy this file, rename it, and fill in the details.
pubDate: 2026-08-13
wing: 'TODO: your wing, e.g. Ozone Zeno 2'
site: 'Chelan Butte'
distance: 104
airtime: 4.2
maxAltitude: 12400
conditions: 'Strong thermals, 1000+ fpm, light convergence late'
flightType: 'xc'
featured: false
draft: true
---

> **This is a template.** It has `draft: true`, so it renders while you run
> `npm run dev` but is excluded from the production build. Copy it, rename the
> file, set `draft: false`, and publish.
>
> The frontmatter drives the technical readout under the title and the totals
> on the [Flying](/flying/) index. Add `trackLog:` with an XContest or
> vol.flights URL and a link renders at the end of the post.
>
> `flightType` is one of `xc`, `competition`, `local`, `hike-and-fly`, `acro`.

## Conditions

Forecast versus what actually happened. Wind, lapse rate, cloudbase, the
inversion that did or did not break. What made you pick this day and this site.

## The flight

The narrative. Launch, the first climb, the decision points — where you pushed,
where you sat, where you nearly went down and what saved it. This is the part
people read.

## Decisions I would change

The flying equivalent of a postmortem, and the reason this section sits so
naturally next to the engineering writing on this site. Both disciplines get
safer the same way: by writing down what actually happened, honestly, while it
is still fresh.

Being specific here is the whole value. "I got low over the flats" is a note.
"I left the climb at 9,400 because I was chasing a glide I had not actually
computed" is a lesson.

## Photos

Drop images in `public/photos/` and reference them:

```markdown
![Looking north up the gorge](/photos/chelan-north.webp)
```

Convert to `.webp` and resize to roughly 1600px on the long edge before
committing — see `AGENTS.md` for the reasoning and the one-line command.
