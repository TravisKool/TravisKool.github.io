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
