---
title: Guardrails I trust more than my own review
description: How three architectural pillars, eleven shell hooks, and a 955-line spec let me stop reviewing every change an agent team makes — without trading away the quality bar.
pubDate: 2026-08-17T09:00:00
kind: essay
tags: ['agents', 'architecture', 'process', 'testing']
featured: false
draft: false
---

Early on, I was moving fast enough that my review had quietly degraded into
agreement. Agents proposed, I skimmed, features shipped. Contracts — the
interfaces between layers, the part of a system that is expensive to get wrong
— were going in without me really reading them. The velocity was intoxicating
and the oversight was theater.

The fix was not to slow down and review everything. It was to admit that
per-change review does not scale at the speed generation does, and to move the
enforcement somewhere that does scale: into the repository itself. This is what
that looks like on the application I am building — a large .NET platform with
multiple agent teams working it concurrently.

## Pillars, not services

The architecture is a volatility-based decomposition in the iDesign style:
Manager, Engine, Access, and DataAccess layers, each in its own project, with a
strictly unidirectional call graph. A layer may call down; never sideways to a
peer, never up.

The load-bearing decision sits at the top. A Manager is a *pillar of the
application*, not a table with a service in front of it — and there are exactly
three: identity (who you are), stewardship (who looks after a site, and
everything they do), and the site record itself (including the land under it
and alerting on both). Adding a fourth requires surviving the question "is this
really independent of all three?"

One didn't survive it. Subscriptions briefly stood as a fourth pillar, until we
noticed that what sat behind its interface was three methods keyed by site —
which belong to the site record — plus two sign-in methods that were not about
subscriptions at all; sign-in simply happened to be built during the
subscription work. The pillar dissolved into the ones that were real. There is
even a numeric review rule now: a use-case interface that finishes with fewer
than four methods was a split that should not have happened, and one past
twenty-one has stopped being a use-case family and become a pillar's whole
surface.

The point of pillars, for agent work specifically, is that they answer *where
does this go* before any code is written. Most of what I used to catch in
review was misplacement. Now misplacement has a definition.

## Rules that run, not rules that ask

Every rule worth having is enforced by something that executes:

**An architecture test fixture** reads the project-reference graph off disk —
not via reflection over compiled assemblies — and fails the build on any edge
that violates the layering. Reading the graph from disk matters twice: it
covers every project, including ones the test project does not reference, and
it catches a reference that has been *declared but not yet used*. That is
precisely the state a half-finished shortcut is in, and exactly what the
compiler drops from assembly metadata. The same fixture enforces the naming
conventions — no `Async` suffixes, no `Dto` suffixes, contract methods that
name their lookup argument — by reflecting over every contract interface and
naming the offending member when it fails.

**Eleven shell hooks** run at the seams of every agent session. A session-start
hook sets git identity. A pre-command guard blocks the genuinely dangerous
things — force-pushes, table drops, deleting the database, reading secret
files. Two hooks fence the frontend and backend agents into their own
directories, so the backend specialist physically cannot edit UI files and vice
versa. Three advisory hooks check layering, naming, and code shape on every
file edit. And two stop-gates run when a session tries to finish: the test
suites must pass at 100% line coverage — a real gate, where one new uncovered
line fails the run — and the session must not have drifted too far ahead of
`main` (warn at 5 commits or 1,000 lines, block at 12 or 3,000).

The hooks have their own postmortem lesson embedded in them. The first
generation silently did nothing, because they parsed their input with `jq` and
`jq` was not installed in the agent environment. Nothing failed; the guardrails
just weren't there. The current versions parse with Python and are tested. A
guardrail you have not watched fire is a guess.

## The spec that outranks the code

The repository's agent instructions file has grown to about 955 lines, and it
opens with an unusual claim: the architecture rules in this file are the
specification — where the current code disagrees, *the code is wrong*, and you
must not "fix" the file to match the code.

That inversion is what makes the file worth maintaining. It is not
documentation trailing the implementation; it is the standing brief every new
session receives, with dated decisions like an architecture decision record, a
"known deviations" ledger listing exactly where the code has not caught up, and
hard-won specifics — which table names are persisted and must never be renamed
in code, which historical rename is safe and why.

It also carries a rule I have come to love: numbers in prose rot. The file once
claimed a test count that had drifted to two-thirds of reality, because a
number written in a document is only true on the day it is written and nothing
fails when it goes stale. The rule now is to re-measure when you touch the
line, never adjust by the delta you happen to know about.

## What review became

With all of that in place, I stepped back from reviewing every contract — and
that was the goal, not a concession. Review is now tiered: major or uncertain
contract changes are gated on my explicit approval before implementation;
small additive methods that follow an established pattern land without me and
get called out in the report that lands them.

Even the gate needed an iteration. The first version produced no reviews at
all, because proposals were embedded inside long design documents where a
contract is invisible. The fix was formal: one page per contract set, every
item under a stable ID, so I can approve or strike individual items by
reference from a chat message on my phone.

After eight years of leading teams, the lesson is familiar. You do not scale
quality by reviewing harder. You scale it by making the system reject the
mistakes you used to catch by hand — and then spending your attention only
where judgment is genuinely required.
