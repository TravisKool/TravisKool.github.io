---
title: 'The pause: reprioritizing at 85% of the weekly budget'
description: Reprioritizing around one question — what gets clubs something useful soonest, and how does it stay free for the pilots who need it — and the billing model my own flying knowledge decided.
pubDate: 2026-08-17T08:00:00
kind: essay
tags: ['agents', 'process', 'product']
featured: false
draft: false
---

For a stretch of this project I was launching features about as fast as agents
could produce them, agreeing with the plans more than examining them, and
letting contracts land unreviewed. It worked — the code was sound and most of
it is still in the product. But the faster it went, the more of it rested on
decisions I had not actually made yet.

The bend, in my case, was noticing on a Tuesday morning that I had burned 85%
of the week's Claude usage allowance. Small joke, but true: it is easier to
pause, slow down, and get everything in alignment when you literally cannot
afford to be out of alignment. Scarcity is an underrated code reviewer.

So I paused, and opened what was supposed to be a reprioritization thread.

## The question underneath the priorities

It started as sequencing: which of 80-some roadmap items actually matter next.
But the ranking kept coming back to the same test, and it was not a revenue
test. This is a preservation record for free-flight sites — launches and
landing zones looked after by volunteer clubs, with alerting when the land
under a site comes up for sale. The clubs doing that work are a handful of
officers with a shared spreadsheet and a renewal date they hope somebody
remembers. So the ranking question was: **which items add up soonest to
something a club can actually pick up and use**, and what has to be true for
it to stay free for the pilots and clubs who need it?

The second half of that is where billing came in, and it arrived as a
constraint rather than a goal. Keeping the lights on is not the point of the
product; it is the condition for the product continuing to exist. Something
has to cover the hosting and the land-data work, and the honest version of
that question is *what is the smallest thing I can charge for that never
stands between a pilot and the information that protects their site.* That
reframing is what made the design session worth having, and I would not have
reached it at speed — at speed you take the default.

The default, the one any generic analysis lands on, is tiered pricing on club
size: count the roster, band the price. And this is where domain knowledge
earned its seat. I fly. I know how these clubs actually work: they sell day
memberships, month memberships, season and annual memberships, so "how many
members do you have" has no stable answer — the same club is three price bands
apart in July and February. A roster-based meter would be a billing dispute
generator, aimed at exactly the volunteers I need on my side. I put that on
the table, and it killed the default model.

## What we landed on

The model that survived the back-and-forth keeps the record itself free and
charges only where a club is getting active, ongoing work done on its behalf:

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
about the domain rather than to a pricing-page convention — and that a pilot
who never pays anything still gets the alert, the site record, the incident
history, and the safety files. The paid edge is narrow on purpose. The pause
is what made room for that to be the design instead of an afterthought.

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
3. **Model routing, which is really a decomposition strategy.** The tech lead
   now dispatches smaller, well-specified tasks to agents running Sonnet and
   reserves Opus for the larger work that still needs design not already drawn
   up.

   The routing rule is the visible half; the productive half is what it forces
   me to do upstream. To hand work to a cheaper, faster engineer you have to
   cut it into pieces small enough to be unambiguous — and that act of cutting
   is most of the thinking. I ran teams this way for four years at a fintech,
   and it was the highest-leverage thing I did there: break the work down far
   enough that a mid-level engineer could take a ticket and finish it without
   coming back with questions, and reserve the senior time for the parts where
   the design genuinely was not settled. Do that well and the whole team goes
   faster, because most work is not actually hard — it is just under-specified.
   Do it badly and your seniors become a queue.

   The economics are sharper with agents than they ever were with people —
   a well-specified task now costs a fraction of an ambiguous one, and the
   feedback is immediate — but the skill is the same skill, and I already had
   it.

## Alignment is the scarce resource

I want to be precise about what the pause fixed, because "I stopped and
reprioritized" invites the reading that I had been building the wrong thing.
I had not been. The code that existed that morning was good code — the
architecture held, the coverage gate held, the pillars were right, and
essentially all of it is still in the product today. Nothing got thrown away.

What was missing was not quality, it was sequence and settlement. A few
decisions sat underneath a lot of downstream work — what the free tier
protects, what a club gets first, which contract shapes are load-bearing —
and while those stayed open, the work continued to be good and continued to
be built in an order nobody had actually chosen. That is the failure mode
worth naming: not wrong code, but correct code arriving in an arbitrary
order, with the expensive decisions still unmade behind it.

So the generic lesson is narrower than "slow down." When generation is nearly
free, throughput stops being the constraint and *decision latency* becomes
one. The questions only you can answer are the ones holding the most work
hostage, and they do not announce themselves — they just quietly get deferred
while the easy items keep shipping. A pause that settles them costs a morning
and buys back the sequencing of everything after it.

I just happen to have needed a usage meter to tell me it was time. A calendar
reminder should have.
