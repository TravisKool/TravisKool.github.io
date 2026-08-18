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

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 232" role="img" aria-label="Bar chart of annual price by number of monitored sites, tapering from 120 dollars for one site to 540 dollars for eight; three sites cost 240 dollars.">
<line x1="46" y1="144" x2="592" y2="144" stroke="var(--rule)" stroke-width="1"/><text x="40" y="147" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="end" style="font-variant-numeric: tabular-nums">$200</text><line x1="46" y1="92" x2="592" y2="92" stroke="var(--rule)" stroke-width="1"/><text x="40" y="95" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="end" style="font-variant-numeric: tabular-nums">$400</text><path d="M46 196 L46 168.8 Q46 164.8 50 164.8 L99.75 164.8 Q103.75 164.8 103.75 168.8 L103.75 196 Z" fill="var(--accent)"/><text x="74.875" y="158.8" font-family="var(--font-mono)" font-size="13" letter-spacing="1" fill="var(--ink)" text-anchor="middle" style="font-variant-numeric: tabular-nums">$120</text><text x="74.875" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">1</text><path d="M115.75 196 L115.75 153.2 Q115.75 149.2 119.75 149.2 L169.5 149.2 Q173.5 149.2 173.5 153.2 L173.5 196 Z" fill="var(--accent)"/><text x="144.625" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">2</text><path d="M185.5 196 L185.5 137.6 Q185.5 133.6 189.5 133.6 L239.25 133.6 Q243.25 133.6 243.25 137.6 L243.25 196 Z" fill="var(--accent)"/><text x="214.375" y="127.6" font-family="var(--font-mono)" font-size="13" letter-spacing="1" fill="var(--ink)" text-anchor="middle" style="font-variant-numeric: tabular-nums">$240</text><text x="214.375" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">3</text><path d="M255.25 196 L255.25 122 Q255.25 118 259.25 118 L309 118 Q313 118 313 122 L313 196 Z" fill="var(--accent)"/><text x="284.125" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">4</text><path d="M325 196 L325 106.4 Q325 102.4 329 102.4 L378.75 102.4 Q382.75 102.4 382.75 106.4 L382.75 196 Z" fill="var(--accent)"/><text x="353.875" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">5</text><path d="M394.75 196 L394.75 90.80000000000001 Q394.75 86.80000000000001 398.75 86.80000000000001 L448.5 86.80000000000001 Q452.5 86.80000000000001 452.5 90.80000000000001 L452.5 196 Z" fill="var(--accent)"/><text x="423.625" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">6</text><path d="M464.5 196 L464.5 75.19999999999999 Q464.5 71.19999999999999 468.5 71.19999999999999 L518.25 71.19999999999999 Q522.25 71.19999999999999 522.25 75.19999999999999 L522.25 196 Z" fill="var(--accent)"/><text x="493.375" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">7</text><path d="M534.25 196 L534.25 59.599999999999994 Q534.25 55.599999999999994 538.25 55.599999999999994 L588 55.599999999999994 Q592 55.599999999999994 592 59.599999999999994 L592 196 Z" fill="var(--accent)"/><text x="563.125" y="49.599999999999994" font-family="var(--font-mono)" font-size="13" letter-spacing="1" fill="var(--ink)" text-anchor="middle" style="font-variant-numeric: tabular-nums">$540</text><text x="563.125" y="212" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" text-anchor="middle" style="font-variant-numeric: tabular-nums">8</text><line x1="46" y1="196" x2="592" y2="196" stroke="var(--rule-strong)" stroke-width="1"/><text x="46" y="18" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)" text-anchor="start" style="font-variant-numeric: tabular-nums">ANNUAL PRICE — FIRST SITE $120, EACH ADDITIONAL $60</text><text x="592" y="230" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)" text-anchor="end" style="font-variant-numeric: tabular-nums">MONITORED SITES</text>
</svg>

*The taper. A three-site club pays $240 a year; an eight-launch club
$540 — inside the envelope clubs already spend on the stack this replaces.*

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
