---
title: Guardrails I trust more than my own review
description: How iDesign pillars, eleven shell hooks, a gated 100% coverage bar, and a 955-line spec let me stop reviewing every change an agent team makes — without lowering the quality bar.
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

The architecture is **iDesign** — Juval Löwy's volatility-based decomposition,
the method I have used on human teams — applied without softening. Every layer
lives in its own project, and each layer is defined by what it is allowed to
contain, not just what it is allowed to call:

| Layer | Contains | May call |
| --- | --- | --- |
| **Manager** | Workflow orchestration only | Engine, Access, DataAccess, Proxy |
| **Engine** | Business and algorithmic logic | Access, DataAccess |
| **Access** | External API calls **only** — no DB connections | nothing (leaf) |
| **DataAccess** | DB connections **only** — no external API calls | nothing (leaf) |
| **Proxy** | The one permitted Manager-to-Manager bridge | its one target Manager |

The call graph is strictly unidirectional — down, never sideways to a peer,
never up — and a Manager never calls another Manager directly, even inside the
same assembly. Each project exposes exactly one `Contract/` folder, and that
folder may hold only two things: the interfaces other layers use to call in,
and the DTOs those interface signatures use. Everything else lives beside its
consumer. Callers depend on contracts, never on concrete classes — which is
what makes any layer swappable, and what makes an agent's diff reviewable by
its imports alone.

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
compiler drops from assembly metadata. The same fixture enforces the contract
naming conventions by reflecting over every `Contract/` interface and naming
the offending member when it fails:

- **Never append `Async`** to a method name — every contract method returns
  `Task`, so the suffix is noise repeated a thousand times.
- **Never append `Dto`, `Result`, or `Response`** — a DTO is named for the
  thing it is (`OrderConfirmation`, not `PlaceOrderResultDto`).
- **Bake the lookup argument into the method name.** A method taking an opaque
  handle says so: `GetDestinationByKey(string key)`, never
  `GetDestination(string key)`; a method taking two handles names both, in
  parameter order. The test for whether a name is complete is whether the
  contract needs a comment restating the signature — a comment that does is
  the signature admitting it is incomplete.
- **Name injected fields for the full interface they hold** — `IListingEngine`
  goes in `_listingEngine`, never `_engine`, because a Manager is precisely
  where six same-shaped dependencies sit side by side, two hundred lines from
  the constructor that would disambiguate them.

Naming rules sound like nitpicking until you have agents generating call sites
by the hundred. Then they become the difference between a diff you can read
and one you have to interrogate.

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

## 100% coverage, as a gate rather than a goal

The coverage requirement deserves its own section, because it is the guardrail
people push back on hardest: **100% line coverage, on both the backend and the
UI component suite, enforced as a hard gate.** Not a target, not a ratchet — a
session that leaves one new uncovered line does not get to finish. The test
lands with the code or the code does not land.

On a human team I would never set that bar; the marginal test costs real
engineer-hours and 85% buys most of the value. With agents the economics
invert. The marginal test is nearly free to write, and the coverage gate turns
out to be less about verifying behavior than about *forcing every line to
justify itself*. When a line looks impossible to cover, it almost always turns
out to be genuinely unreachable — and the right fix is deleting it, not
papering over it. Several dead guards and one entire dead method came out of
the codebase exactly that way. Dead code is where an unsupervised generator's
mistakes go to hide; a 100% gate leaves them nowhere to sit.

The exclusions are as disciplined as the rule: declared once, in one settings
file, applied to every test run automatically. Scaffolded migrations (tool
output, and the schema they build is covered by tests against a real
database), design-time factories reached only by tooling, and the composition
root — whose logic was extracted into a startup folder precisely so it *could*
be covered. Nothing else. And the suite behind the gate is real: 3,057 backend
and 1,173 UI component tests at the last measurement, up from 474 tests at the
end of the 2025 scaffold era — the bar went from aspiration to gate in the
same week the team became mostly agents, and it was the agents that made the
bar affordable.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 172" role="img" aria-label="Horizontal bar chart of test methods: 474 at the end of the 2025 era, versus 3,057 backend and 1,173 UI component tests today.">
<text x="176" y="18" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)" text-anchor="start" style="font-variant-numeric: tabular-nums">TEST METHODS, AT 100% LINE COVERAGE TODAY</text><text x="164" y="47" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)" text-anchor="end">2025 ERA</text><path d="M176 34 L228.4396467124632 34 Q232.4396467124632 34 232.4396467124632 38 L232.4396467124632 48 Q232.4396467124632 52 228.4396467124632 52 L176 52 Z" fill="var(--accent)"/><text x="242.4396467124632" y="47" font-family="var(--font-mono)" font-size="13" letter-spacing="1" fill="var(--ink)" text-anchor="start" style="font-variant-numeric: tabular-nums">474</text><text x="164" y="81" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)" text-anchor="end">TODAY · BACKEND</text><path d="M176 68 L536 68 Q540 68 540 72 L540 82 Q540 86 536 86 L176 86 Z" fill="var(--accent)"/><text x="550" y="81" font-family="var(--font-mono)" font-size="13" letter-spacing="1" fill="var(--ink)" text-anchor="start" style="font-variant-numeric: tabular-nums">3,057</text><text x="164" y="115" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)" text-anchor="end">TODAY · UI</text><path d="M176 102 L311.67026496565256 102 Q315.67026496565256 102 315.67026496565256 106 L315.67026496565256 116 Q315.67026496565256 120 311.67026496565256 120 L176 120 Z" fill="var(--accent)"/><text x="325.67026496565256" y="115" font-family="var(--font-mono)" font-size="13" letter-spacing="1" fill="var(--ink)" text-anchor="start" style="font-variant-numeric: tabular-nums">1,173</text>
</svg>

*The suite, then and now — every bar held at 100% line coverage by a
stop-gate.*

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
