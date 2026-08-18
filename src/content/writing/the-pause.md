---
title: 'The pause: reprioritizing at 85% of the weekly budget'
description: What started as a reprioritization thread became a billing-model design session where my free-flight domain knowledge did the deciding — and where the workflow itself got its most important upgrades.
pubDate: 2026-08-18T09:00:00
kind: essay
tags: ['agents', 'process', 'product']
featured: false
draft: false
---

For a stretch of this project I was launching features about as fast as agents
could produce them, agreeing with the plans more than examining them, and
letting contracts land unreviewed. It worked, in the way that driving fast
works right up until the road bends.

The bend, in my case, was noticing on a Tuesday morning that I had burned 85%
of the week's Claude usage allowance. Small joke, but true: it is easier to
pause, slow down, and get everything in alignment when you literally cannot
afford to be out of alignment. Scarcity is an underrated code reviewer.

So I paused, and opened what was supposed to be a reprioritization thread.

## The thread that wandered somewhere better

It started as sequencing: which of 80-some roadmap items actually matter next.
But working the priorities honestly kept surfacing the same question — which
item produces revenue, and what does charging for this even look like? — and
the thread evolved into a full billing-model design session. That drift was
the most valuable thing the pause produced, and I would not have gotten there
at speed.

The platform is a preservation record for free-flight sites — launches and
landing zones looked after by clubs, with alerting when the land under a site
comes up for sale. The obvious billing model, the one any generic analysis
lands on, is tiered pricing on club size: count the roster, band the price.

This is where domain knowledge earned its seat. I fly. I know how these clubs
actually work: they sell day memberships, month memberships, season and annual
memberships, so "how many members do you have" has no stable answer — the same
club is three price bands apart in July and February. A roster-based meter
would be a billing dispute generator. I put that on the table, and it killed
the default model.

## What we landed on

The model that survived the back-and-forth is built on what the platform
actually meters well:

- **The record is free forever; payment runs on monitored sites.** The price
  meter is the number of sites a club has land-watch monitoring on — the first
  at one rate, each additional site tapered, landing inside the envelope clubs
  already spend on the tool stack this replaces.
- **The fact fires free; the dossier is paid.** An unpaid club still gets the
  alert that a parcel near their launch was just listed — withholding that
  would betray the mission. What is paid is the depth: acreage, price, owner
  of record, distances, who to call.
- **No trial — the teasers are the trial.** And no card required to start.
- **Verification is earned, never sold.** A club's type is identity, not a
  billing tier.
- **A lapsed club is a free club with history.** Nothing is deleted; dossiers
  degrade back to teasers after a grace window.
- **Contributions are never gated** — a contribution *is* the record — and
  safety-critical material is never behind the paywall.

Every one of those gates lives as a seeded value in a capability matrix, never
as a branch at a call site — so the pricing model is data, and changing it is
an edit, not a refactor.

What I like most about the final shape is that each decision traces to a fact
about the domain, not to a pricing-page convention. The pause is what made
room for those facts to be heard.

## The pause changed the process, not just the plan

The same session produced the workflow upgrades that outlived it:

1. **A contract review gate.** Major or uncertain interface changes are now
   proposed to me and approved before implementation. Small pattern-following
   additions land free but get called out. I stepped back from reviewing
   *everything* — the guardrails carry that — but the decisions that are
   expensive to reverse now stop at my desk.
2. **An official review step on the frontier model.** A deliberate pass by
   the strongest model available, distinct from the generation that produced
   the work.
3. **Model routing as a management instruction.** The tech lead now dispatches
   smaller, well-specified tasks to agents on Sonnet and reserves Opus for
   larger work that may need design that is not already drawn up — the same
   call a manager makes about seniority, stated once and applied every round.

## Alignment is the scarce resource

The generic lesson I would offer from this: when generation is nearly free,
the constraint moves. It is no longer how fast you can build; it is how long
you can afford to build the wrong thing. A pause that realigns the roadmap,
the billing model, and the review process pays for itself in the first
avoided wrong week.

I just happen to have needed a usage meter to teach me what a calendar
reminder should have.
