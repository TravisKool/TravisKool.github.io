---
title: 'The rebrand: commissioning a designer who does not exist'
description: A senior-UX agent reviewed the platform's inherited purple design, wrote the most thorough critique I have received in years, and gave the product a theme to live by — a field guide crossed with a land register.
pubDate: 2026-08-18T12:00:00
kind: essay
tags: ['agents', 'design', 'product']
featured: false
draft: false
---

The platform I am building inherited its original look from 2025, when the
styling was decided mostly by Copilot on a free model, with some tweaks from
me. It was dark purple, glassy, and gradient-heavy, and for a while that was
fine — the code underneath was the work. But every time I opened it, the
purple said *side project* while the copy said *institution*, and eventually I
had had enough of looking at it.

So I did what I would have done on a human team: I commissioned a design
review. My tech-lead session brought in a senior UX designer — an agent role,
briefed on the product — for a full design, UX, styling, and naming pass.

What came back was the most thorough design critique I have received in
years, from anyone.

## The teardown

The report ran multiple pages with before screenshots of the live app in both
themes and two viewports, and it opened by taking the current state apart in
plain English. Not "consider increasing contrast" hedging — an actual reading
of what the pixels were saying:

> The writing is ahead of the visuals. The product's voice — sober, honest
> about absence, allergic to hype — is genuinely distinctive. The visual layer
> underneath it is a consumer-app cocktail: glass panels, gradient buttons,
> emoji chrome, and a second purple identity leaking through the green one.
> The design does not yet believe what the copy says.

It kept going, and it kept being right. Two brand identities were shipping at
once, purple leaking through the green everywhere — one primary button was
literally a green-to-indigo gradient, "both brands in one button". The brand
mark was a parachute emoji, which, as the report put it, is to the audience
this product serves *a different sport*. The glassmorphism got the sharpest
line in the document: the surface language said "consumer travel app, 2023"
while the copy said *preservation record* — and records are set on opaque
paper with visible structure; blur is exactly the wrong metaphor for a product
whose brand is "nothing here is fuzzy, nothing is hidden."

Two of the report's exhibits, cropped from its before-captures:

![The old sign-in card: a heading sitting in a purple outline, a primary button fading from green to indigo, and an emoji doing icon work](/photos/rebrand-before-signin.webp)

*Every charge in one card: the purple outline on the heading, the
green-to-indigo gradient — both brands in one button — and the emoji chrome.*

![The old dark theme: translucent glass panels over a muddy gradient, a purple map marker, and a blue-violet gradient action button](/photos/rebrand-before-listing.webp)

*The dark theme's glass panels and purple map markers — the surface language
the report read as "consumer travel app, 2023."*

The verdict, in one sentence I have thought about weekly since:

> The product has a spine. The pixels don't show it yet.

## Understanding before styling

What separated this from a reskin is that the designer worked with the tech
lead to understand intent before proposing anything. It described the product
back to us — a preservation record, not a travel catalogue; stewards, not
browsers; access defence, not lifestyle content — and it named the voice the
writing already had: **sober, honest about absence, allergic to hype**. Then
it judged every visual choice against whether it believed that voice.

That is the order of operations good designers use and rushed projects skip.

## A theme to live by

The redesign direction came with a name — **the Field Register** — and a
one-sentence brief the whole build now answers to:

> Design the product the copy already describes: a field guide crossed with a
> land register — light-first warm paper, one field-green accent, a serif
> voice for the record itself, flat opaque panels with hairline rules, and
> instrument-grade data typography inside them.

The metaphor does real work. A closed site reads like a red stamp on a paper
record. Dark mode becomes lamp-lit paper, not a second brand. Purple is
retired entirely — no violet focus rings, no indigo gradients, no purple map
markers, anywhere. And the framing settled a product argument at the same
time: the record is the product; the cockpit is a feature of it.

Even the name got reviewed. The report was fair to the old one — "a floor,
not a problem" — but proposed a shortlist aligned to the register theme, and
we shifted the name's second half to match: the word for the stronghold at
the heart of a castle, because *keeping* is what stewards do. The icon came
last, reinvented later by the tech lead from the report's own vibe language —
a single monoline mark of a wing over a ridge, replacing the parachute emoji
and the purple favicon it never matched:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="88" height="88" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="A monoline mark: a wing arcing over a ridge line">
  <path d="M7 19 C 12 9.5, 36 9.5, 41 19"/>
  <circle cx="24" cy="26.5" r="2.2" fill="currentColor" stroke="none"/>
  <path d="M4 41 L 17 30 L 25 36.5 L 37 26.5 L 44 32"/>
</svg>

*The new mark — drawn in a single line weight, in whatever ink the page is
already using. Compare it to the emoji in the sign-in card above.*

## What I took from it

I expected a restyle and got a design *position* — a documented argument about
what the product is, strong enough that every future visual decision can be
tested against it. The refresh I feel is only partly about the pixels. It is
that the critique was honest. The report ripped the existing design to pieces
because the pieces deserved it, and it did so with reasons attached, which is
the only kind of criticism that compounds.

The old design was decided by a model without taste being asked for. The new
one was decided by me, informed by an agent that argued like a senior
designer. The difference between those two sentences is most of what I have
learned this year.
