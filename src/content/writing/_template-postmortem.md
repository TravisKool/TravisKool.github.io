---
title: 'Postmortem: the template'
description: A blameless postmortem template — copy this file, rename it, and fill in the sections.
pubDate: 2026-08-14
kind: postmortem
tags: ['postmortem', 'reliability']
featured: false
draft: true
---

> **This is a template.** It has `draft: true`, so it renders while you run
> `npm run dev` but is excluded from the production build. Copy it, rename the
> file, set `draft: false`, and publish.

Postmortems are the single most recruiter-legible thing a senior engineer can
publish. They demonstrate judgement, ownership, and the ability to describe
failure without defensiveness — which is much harder to fake than a project
list.

## Summary

One paragraph a reader can stop after. What broke, who was affected, for how
long, and what the resolution was.

## Impact

Be specific and quantified. Requests failed, customers affected, duration,
revenue or trust cost. Vague impact makes the whole writeup read as evasive.

## Timeline

All times in a single stated timezone.

| Time | Event |
| --- | --- |
| 14:02 | First alert fires |
| 14:09 | Engineer acknowledges |
| 14:31 | Root cause identified |
| 14:48 | Mitigation deployed |
| 15:10 | Fully recovered |

## Root cause

The technical mechanism, in enough depth that another engineer could reproduce
your reasoning. Resist stopping at the proximate cause — keep asking why until
you reach something structural.

## What went well

Genuinely. Detection speed, rollback tooling, the person who thought to check
the thing nobody else would have.

## What went badly

The honest version. This section is why anyone trusts the document.

## Action items

Each with an owner and a date. Action items without both are aspirations.

- [ ] Concrete change — *Owner, date*
- [ ] Concrete change — *Owner, date*

## What I would tell a younger engineer

The reflective close. This is where your voice belongs, and it is usually the
part people remember.
