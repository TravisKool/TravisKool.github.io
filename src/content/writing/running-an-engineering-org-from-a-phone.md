---
title: Running an engineering org from a phone
description: Talking to a tech lead over coffee, launching six containerized agents from a phone, and what the org chart of an AI team actually feels like from the top — including the parts that don't work yet.
pubDate: 2026-08-17T18:00:00
kind: essay
tags: ['agents', 'teams', 'process']
featured: false
draft: false
---

The most satisfying moment of this project so far was not a feature shipping.
It was sitting somewhere away from my laptop, phone in hand, talking through a
round of work with a tech lead — and then watching six agents spin up in
containers to execute it.

Everything runs remotely now: the repository, the sessions, the whole team.
The setup cost was real — agent instructions, hooks, specialist agent
definitions, a claim protocol — but the payoff is that the entire operation is
reachable from a phone. I describe the round, the lead decomposes it, and the
work happens whether or not I am at a desk.

## The org chart

The lead session does not write feature code. Its operating manual — a real
document in the repository — says so directly: decompose, delegate, integrate,
and keep `main` moving. It runs two to four specialists at a time, each in an
isolated git worktree, and follows a landing protocol for every piece that
comes back: fetch, examine the diff, rebase, retest, land. Work that has not
reached `main` does not exist for anybody else, so small landings beat big
branches.

The specialists are defined roles, not generic sessions — a backend .NET
engineer, a frontend Blazor engineer, a devops engineer — each fenced into its
own directories by hooks, each with its own stop-gate holding its side of the
suite at 100% coverage.

One instruction I added after watching costs and quality for a while: match
the model to the work. Smaller, well-drawn tasks go to agents running Sonnet;
larger tasks that might need design work not already drawn up go to Opus. It
is exactly the judgment a manager makes about seniority, translated into a
dispatch rule the lead applies without asking.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 168" role="img" aria-label="Horizontal bar chart of commits by co-author trailer: Fable 5 with 166, Opus 5 with 23, Sonnet 5 with 5, and 5 untagged.">
<text x="130" y="18" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="start">COMMITS ON MAIN, BY CO-AUTHOR TRAILER</text><text x="118" y="47" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">FABLE 5</text><path d="M130 34 L536 34 Q540 34 540 38 L540 48 Q540 52 536 52 L130 52 Z" fill="var(--accent)"/><text x="550" y="47" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" text-anchor="start">166</text><text x="118" y="79" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">OPUS 5</text><path d="M130 66 L182.80722891566265 66 Q186.80722891566265 66 186.80722891566265 70 L186.80722891566265 80 Q186.80722891566265 84 182.80722891566265 84 L130 84 Z" fill="var(--accent)"/><text x="196.80722891566265" y="79" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" text-anchor="start">23</text><text x="118" y="111" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">SONNET 5</text><path d="M130 98 L138.34939759036143 98 Q142.34939759036143 98 142.34939759036143 102 L142.34939759036143 112 Q142.34939759036143 116 138.34939759036143 116 L130 116 Z" fill="var(--accent)"/><text x="152.34939759036143" y="111" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" text-anchor="start">5</text><text x="118" y="143" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">UNTAGGED</text><path d="M130 130 L138.34939759036143 130 Q142.34939759036143 130 142.34939759036143 134 L142.34939759036143 144 Q142.34939759036143 148 138.34939759036143 148 L130 148 Z" fill="var(--accent)"/><text x="152.34939759036143" y="143" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" text-anchor="start">5</text>
</svg>

*Commit trailers by model — the record of the session that landed each
change, which is usually the lead integrating its specialists' work rather
than the specialist itself.*

There was a genuinely uncanny management moment in all this. An
engineering-manager agent bubbled up a note that one of its sub-agents had made
a good suggestion, which it had reviewed and approved — and when I read the
suggestion, I agreed with both of them. Information flowing up an org chart,
with judgment applied at each level, none of it human until it reached me. I
have sat in exactly that exchange at work. It felt the same.

## The roadmap as a living artifact

The coordination backbone is a roadmap that has grown into a real document —
84 items across five tiers, from "fix what is shipped and broken" down to
"data, legal, and platform hygiene", with about 38 shipped so far. It
describes itself as a review document, not a commitment: items are reasoned
about there, then claimed and scheduled through issues.

It has been reprioritized seven times, each pass logged with its input — a
competitive scan, a codebase review, my own fifteen-item review of the running
site, a design review. I check it the way I used to check a program board:
occasionally, to see the shape of things, trusting the process in between.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 236" role="img" aria-label="Stacked horizontal bar chart of roadmap items shipped versus open by tier: stabilize 15 of 28, access defence 13 of 17, club adoption 6 of 16, community 0 of 9, data and legal 4 of 14.">
<rect x="230" y="10" width="10" height="10" rx="2" fill="var(--accent)"/><text x="246" y="19" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="start">SHIPPED</text><rect x="330" y="10" width="10" height="10" rx="2" fill="var(--rule-strong)"/><text x="346" y="19" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="start">OPEN</text><text x="218" y="57" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">TIER 0 · STABILIZE</text><path d="M230 44 L380.2857142857143 44 Q384.2857142857143 44 384.2857142857143 48 L384.2857142857143 58 Q384.2857142857143 62 380.2857142857143 62 L230 62 Z" fill="var(--accent)"/><path d="M386.2857142857143 44 L516 44 Q520 44 520 48 L520 58 Q520 62 516 62 L386.2857142857143 62 Z" fill="var(--rule-strong)"/><text x="528" y="57" font-family="var(--font-mono)" font-size="11" fill="var(--ink-muted)" text-anchor="start">15 / 28</text><text x="218" y="91" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">TIER 1 · ACCESS DEFENCE</text><path d="M230 78 L359.7142857142857 78 Q363.7142857142857 78 363.7142857142857 82 L363.7142857142857 92 Q363.7142857142857 96 359.7142857142857 96 L230 96 Z" fill="var(--accent)"/><path d="M365.7142857142857 78 L402.85714285714283 78 Q406.85714285714283 78 406.85714285714283 82 L406.85714285714283 92 Q406.85714285714283 96 402.85714285714283 96 L365.7142857142857 96 Z" fill="var(--rule-strong)"/><text x="414.85714285714283" y="91" font-family="var(--font-mono)" font-size="11" fill="var(--ink-muted)" text-anchor="start">13 / 17</text><text x="218" y="125" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">TIER 2 · CLUB ADOPTION</text><path d="M230 112 L287.7142857142857 112 Q291.7142857142857 112 291.7142857142857 116 L291.7142857142857 126 Q291.7142857142857 130 287.7142857142857 130 L230 130 Z" fill="var(--accent)"/><path d="M293.7142857142857 112 L392.57142857142856 112 Q396.57142857142856 112 396.57142857142856 116 L396.57142857142856 126 Q396.57142857142856 130 392.57142857142856 130 L293.7142857142857 130 Z" fill="var(--rule-strong)"/><text x="404.57142857142856" y="125" font-family="var(--font-mono)" font-size="11" fill="var(--ink-muted)" text-anchor="start">6 / 16</text><text x="218" y="159" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">TIER 3 · COMMUNITY</text><path d="M230 146 L318.57142857142856 146 Q322.57142857142856 146 322.57142857142856 150 L322.57142857142856 160 Q322.57142857142856 164 318.57142857142856 164 L230 164 Z" fill="var(--rule-strong)"/><text x="332.57142857142856" y="159" font-family="var(--font-mono)" font-size="11" fill="var(--ink-muted)" text-anchor="start">0 / 9</text><text x="218" y="193" font-family="var(--font-mono)" font-size="10" letter-spacing="1.4" fill="var(--ink-muted)" text-anchor="end">TIER 4 · DATA & LEGAL</text><path d="M230 180 L267.1428571428571 180 Q271.1428571428571 180 271.1428571428571 184 L271.1428571428571 194 Q271.1428571428571 198 267.1428571428571 198 L230 198 Z" fill="var(--accent)"/><path d="M273.1428571428571 180 L372 180 Q376 180 376 184 L376 194 Q376 198 372 198 L273.1428571428571 198 Z" fill="var(--rule-strong)"/><text x="384" y="193" font-family="var(--font-mono)" font-size="11" fill="var(--ink-muted)" text-anchor="start">4 / 14</text>
</svg>

*Where the roadmap stands by tier, as tracked on its summary’s open
tables, 2026-08-18. The top two tiers are where the work has gone — on purpose.*

## Decisions are the bottleneck

Here is the honest friction: on a phone, the scarce resource is not compute or
code review. It is *my decisions*.

The failure mode we started with was decisions parked where I could not
conveniently make them — open questions filed on GitHub issues or noted in the
roadmap, which on a phone means hunting through tabs with no way to reply
in-line. Questions rotted there, and stalled work rots with them.

The fix was to make the session bring questions to me: interactive prompts for
every roadblock, decision, or contract review, raised in the conversation
where I actually am. The lead's manual now requires that a question carry its
context and visuals with it — never a bare "should we do 2.2?" that forces me
to go scrolling for what 2.2 is.

It mostly works, and when it works it is the best part of the workflow. It is
also genuinely buggy at the edges: prompts sometimes auto-close and take my
half-typed answer with them, and occasionally one falls into a loop and
re-presents itself endlessly. I flag it because the pattern — surface the
decision to wherever the decision-maker is — is right, and the rough edges are
worth enduring until the tooling catches up.

## What I still cannot see

The gap that bothers me most is observability of delegation. When I went to
watch a sub-agent work — inspired, honestly, by how good its manager's report
was — all I could see was the initial handoff prompt the lead had written. The
prompt was impressive. But I could not watch the work happen, and I could not
verify whether the specialist agent definitions I had carefully built were
actually the ones doing the working.

On a human team you can walk over. Here, the middle of the org chart is still
somewhat dark, and I am left auditing outcomes — the diff, the tests, the
hooks that fired — rather than process. Outcomes are the better thing to audit
anyway. But trust-but-verify needs the verify, and today it stops one level
down.

## The title problem

Running this does not feel like using a tool. It feels like the job I had —
except the role keeps expanding sideways. In one day I am the engineering
manager setting the round, the architect ruling on a boundary, the product
manager cutting scope, the CTO deciding what the platform even is. On the peak
day so far, the teams landed 165 commits and about fifty thousand lines behind
those decisions — more commits in that one day than the project's entire 2025
era produced in five and a half weeks, with the coverage gate at 100% the
whole time.

I used to manage engineers at a fintech and the texture is strikingly similar:
the work is decomposition, review policy, unblocking, and judgment. What has
changed is that everything else — the typing — stopped being the constraint.
Which means the quality of the operation is now almost exactly the quality of
its decisions, and that is a more honest mirror than I expected to be looking
into.
