---
title: 'Postmortem: two teams picked up the same work'
description: Two agent teams, each with its own tech lead, independently implemented the same seven roadmap items — a coordination failure I had seen before, on human teams, and fixed the same way.
pubDate: 2026-08-16
kind: postmortem
tags: ['postmortem', 'agents', 'teams', 'reliability']
featured: false
draft: false
---

I am building an application with teams of coding agents — several Claude Code
sessions, each led by a tech-lead session that decomposes work and delegates to
specialist sub-agents. This is the postmortem for the day two of those teams
did the same work twice.

## Summary

On August 16 I had two agent teams running against the same repository, each
with its own tech lead and its own sub-agents. Both consulted the roadmap, both
picked sensibly from the top of it, and both independently implemented the same
seven roadmap items. Neither had any way to know the other existed.

## Impact

Roughly a session's worth of duplicated effort, and a reconciliation pass to
decide which implementation of each item landed. No production impact — the
duplication was caught at integration, before anything conflicting reached
`main`. The real cost was the review burden: instead of reviewing seven
changes, I was comparing seven pairs.

## Timeline

| When | What happened |
| --- | --- |
| Morning | Team A starts on the top of the roadmap |
| Around the same time | Team B, in a separate session, starts on the same items |
| Later that day | Integration reveals both teams built the same seven items |
| That evening | Root-cause discussion with the lead session; fix agreed |
| Same week | GitHub-issue claim protocol adopted and written into the repo's agent instructions |

## Root cause

Sessions share no memory. Each one clones the repository, reads the same
roadmap, and reasons — correctly — that the top unclaimed item is the thing to
do. A `git fetch` at the start of a session only shows work that has already
landed; it says nothing about work that started ten minutes ago in a container
you cannot see. There was no artifact anywhere that functioned as a *claim*.

The interesting part is that this is not an agent problem. I ran engineering
teams for years, and human engineers pick up the same ticket too, for exactly
the same reason: the backlog said what to do and nothing said who was doing it.
On my human teams we solved it with Azure DevOps boards — stories assigned to
an engineer, features assigned to a lead. Assignment was the claim.

## What went well

Both teams built to the same spec, because the spec — the iDesign layering
rules and their enforcing tests, the naming conventions, the 100% coverage
gate — lives in the repository rather than in anyone's head. That made reconciliation mostly *choosing* rather than
untangling. And the failure mode was legible immediately: I recognized it from
human teams the moment I saw it, which meant the fix was obvious too.

## What went badly

I had scaled to multiple teams without scaling coordination at all. The roadmap
was a to-do list readable by everyone and writable as a claim by no one. I had
also assumed — without examining the assumption — that starting sessions at
different times was enough separation. It is not; the race window is the entire
duration of a session, not the moment it starts.

## Action items

- [x] Adopt a claim protocol: before any multi-file task, search open GitHub
      issues; if none covers the work, open one and self-assign it *before
      writing any code*. The assignment is the claim.
- [x] Close the issue when the work lands, so a claim never outlives the work
      and blocks a legitimate follow-up.
- [x] Add a pre-push backstop: immediately before every push, fetch the target
      branch and diff for upstream commits you have not seen. Never push over
      commits you have not looked at.
- [x] Write all of it into the repository's agent instructions, so every future
      session inherits the protocol instead of rediscovering the problem.

No recurrences since.

## What I would tell a younger engineer

Coordination problems do not care whether the workers are people or processes.
If your system of record can express "what should be done" but not "who is
doing it", you will get duplicate work at exactly the rate you get parallelism
— and the fix is thirty years old: make the claim explicit, make it visible,
and make it precede the work.
