---
title: 'The application: a preservation record for free flight'
description: The writeup I promised — a large platform for defending paragliding sites, built end to end with teams of coding agents, and what nine sessions, 279 commits, and 113,000 lines of C# taught me.
pubDate: 2026-08-18T15:00:00
kind: case-study
tags: ['agents', 'architecture', 'dotnet', 'product', 'paragliding']
featured: true
draft: false
---

I said there would be a post about the application itself. This is it — and it
anchors a series about building it with teams of coding agents: the
[guardrails](/writing/guardrails-over-review/) that replaced per-change review,
the [duplicate-work postmortem](/writing/two-teams-one-work-item/), the
[pause that fixed the roadmap and the billing model](/writing/the-pause/), the
[rebrand](/writing/the-rebrand/), and what it is like to
[run the whole thing from a phone](/writing/running-an-engineering-org-from-a-phone/).

The application is not yet public, so this describes it without naming it.
When there is something a stranger can click, I will link it.

## The problem

Free flight — paragliding and hang gliding — depends on sites: a launch, a
landing zone, and the goodwill that lets pilots use both. We do not usually
lose sites to weather or accidents. We lose them to a for-sale sign nobody saw
in time, to a handshake agreement that retired with the landowner, to the
institutional memory that leaves when a club officer moves away.

So the platform is a **free-flight site preservation record**. Sites are
maintained by stewards — clubs and chapters — and the land half is aimed at
access defence: watching the parcels under a launch or LZ and alerting the
people who defend the site when one hits the market. Free tooling for clubs to
manage and preserve what they already look after: rosters, site rules and
status, incidents, airspace files, waivers, even the gate codes landowners
trust them with.

This is a domain I know from the inside — I fly cross-country and
competitions — and that knowledge has repeatedly been the deciding vote, most
visibly in [the billing model](/writing/the-pause/).

## The focus session that made it

It did not start this focused. The first version, scaffolded in late 2025, was
a land-finder: browse destinations, look at parcels near flying sites, maybe
buy land near where pilots recreate. The home page said "Your Gateway to the
Sky."

A deep focus session with Claude earlier this year turned the lens around.
Land *acquisition* is a product for individuals; land *awareness* is
infrastructure for a community — and the community's actual unsolved problem
is preservation. The pivot reframed everything: parcels became listings that
matter only as land under a launch; subscriptions became alerting; clubs
became the first-class actor. The repository still carries the archaeology —
a 181-file rename, a front door rewritten "as the preservation record it is,"
and demo data that once included Yosemite camping and El Capitan big-wall
climbing, replaced by real flying sites.

One detail from that pivot I now teach: a rename in code never rewrites a name
that is already persisted. The old domain's name survives in the database's
migration-history table on purpose, because renaming what production has
already recorded is how you convince a schema tool it never ran.

## The stack, and why I chose it

Agents wrote nearly all of the code. The stack, I chose — on the boring,
correct grounds that it is the one I can supervise best after a career of
.NET: **C# on .NET 10, Blazor Server, EF Core on SQLite, Tailwind, NUnit and
bunit and Playwright** for the three layers of testing. When agents produce
thousands of lines a day, the reviewer's fluency is the scarce resource;
choosing a stack I can read at a glance is a review-throughput decision, not
nostalgia. SQLite in particular — one file, no server — matches a
record-keeping product whose write rate is human-scale, and it keeps both
production and every test fixture honest by running the same engine.

The architecture is **iDesign** — volatility-based decomposition, applied
strictly. Each layer has a hard definition of what it contains: Managers
orchestrate workflows and nothing else; Engines hold the business and
algorithmic logic; Access projects make external API calls only; DataAccess
projects hold database connections only; the two leaves may call nothing at
all, and the graph runs strictly downward. The solution's 62 projects follow
that shape exactly — **3 Manager pillars** (identity, stewardship, and the
site record), **11 Engines**, **3 Access**, **11 DataAccess** (one per entity
group — more leaf projects than Managers is the expected shape, since reuse
lives at the bottom of the pyramid), one shared Contract library of enums and
value types, one UI host, and **32 test projects — one per production
project**, because the coverage bar is 100% and a project without its own test
project has nowhere to keep its proof. Every boundary crossing goes through a
`Contract/` interface, and all of it is machine-enforced by an architecture
test fixture, which is why the layering has held under multi-agent
concurrency — [that story is its own essay](/writing/guardrails-over-review/).

## The domain has ethics, and they are in the schema

The parts I am proudest of are invisible:

- **Every change to the record leaves two traces**, written in the same
  operation: a private audit entry with the actor's capacity, and a public
  transparency entry threaded on the site's page. An owner who can edit
  quietly is exactly what a preservation record cannot allow.
- **Three deliberate exceptions**, each argued in a comment at the write site,
  where the public trace would itself be the leak: the landholding register
  (naming a landowner and the state of a handshake deal damages the
  relationship it protects), waiver signatures, and the gate-code vault —
  where a reveal is a grant, not a read: policy-gated, time-boxed, audited
  whether it grants or refuses.
- **People are identified by key, never by email.** An email is a mutable
  attribute and a credential; an audit row has to identify the same person a
  year later.
- **Imported data is copied or null, never inferred.** The record ingests 756
  US launch sites from a community source under CC BY-SA, with attribution
  rendered wherever the data shows. Elevations come from USGS rather than
  pilot entry — the import caught a site recorded at 12,400 metres that is
  actually at 1,436 — and every generated coordinate was gated against Census
  water geography after an early placement bug put demo listings in the
  Pacific. A degree of longitude is not a degree of latitude, and a fixed
  north-east offset from a coastal launch walks into the sea.

## The numbers

As of this writing, from the repository itself: **279 commits**, about
**113,000 lines of C#** across 769 files plus ~9,600 lines of Blazor markup,
**55 database migrations**, and roughly **3,600 test methods** — 3,057 backend
and 1,173 UI tests at the last measured count — held at **100% line coverage
on both sides** by gates that fail a session on one new uncovered line. Nine
distinct agent sessions have landed work on `main`. The roadmap tracks 84
items across five tiers, with about 38 shipped. On the peak day, six
concurrent agents landed 165 commits and roughly 52,000 added lines — while
the coverage gates held.

The repository also holds a controlled experiment I did not plan: the same
person, the same product, built with 2025 tooling and then with 2026 tooling.

| | 2025 scaffold era | Claude Code era |
| --- | --- | --- |
| Span | Oct 22 – Nov 28, 2025 (~5½ weeks) | Aug 12 – 18, 2026 (7 days) |
| Commits | 39 | 240 |
| Lines added | ~54,000 | ~210,000 |
| Projects | 26 | 62 |
| Test methods | 474 | ~3,600 |
| Coverage bar | aspirational | 100%, gated, both sides |

One week against five and a half: six times the commits, four times the line
churn, the test suite up nearly eightfold — and the quality bar went *up* over
the same interval, from an aspiration to a hard gate, while the product
pivoted, grew three architectural pillars, and got rebranded. The peak single
day of 2026 out-produced the entire 2025 era on commits. Raw volume is the
least interesting measure of software, which is exactly why I list it last —
everything above it in this post is about the discipline that made the volume
safe to accept.

I keep those numbers honest the same way the repo keeps everything else
honest: they are re-derived from the repository, on a date, in a stats file
maintained alongside the code — because a number in prose is only true on the
day it is written.

## What this year is actually about

At my last company I watched AI take over the writing of code and SQL while
contracts, contract review, and PR review stayed stubbornly human. This
platform is my working answer to whether that boundary has to stay where it
is: whether agents can hold precision, decoupling, and long-term quality under
real velocity, rather than quietly trading them away for speed.

Ten months in, my honest reading: the boundary moves, but it does not
disappear. It moves from reviewing changes to designing the system that
reviews changes — pillars, hooks, gates, claims, and a spec that outranks the
code. The judgment concentrates instead of dissolving. The rest of the series
is about exactly where it concentrates.
