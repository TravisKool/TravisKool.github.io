---
title: Forty landings a day through one lock
description: Forty landings a day from agent teams, a 100% coverage bar, and three iterations of a landing script in a month — with the numbers that sent each one back to the drawing board.
pubDate: 2026-10-05T21:00:00
kind: essay
tags: ['agents', 'process', 'testing', 'reliability']
featured: false
draft: false
---

Yesterday thirty-eight changes landed on `main`. Today it was forty-three by
the evening. They came from several agent teams, each with its own tech-lead
session and its own tickets, and for most of the last month the teams finished
work faster than `main` could take it. The limiting factor was not the agents.
It was the ritual that turns a green feature branch into a commit on `main`.

The ritual is expensive on purpose. The bar is 100% line coverage, enforced on
the backend and the Blazor UI separately. There are some sixty test projects,
an acceptance suite of 1,357 tests over the real dependency graph and a real
SQLite file, 220 Playwright browser tests, 826 JavaScript tests, a style
census, architecture tests that read the project graph off disk, and two
release-notes gates that check the what's-new entry and its screenshots
against the pages they photograph. Run everything and you are waiting a while.
Run it forty times a day and you have a queueing problem whether you have
noticed or not.

This is the story of noticing, three times.

## Iteration one: the landing that raced itself

The first version was the one every careful engineer writes. A session
finishes its branch, runs the suites, and calls the landing script. The script
runs its gates, merges `main` into the branch, builds the merged tree with
warnings as errors, runs the suites the diff can reach, and pushes. If somebody
else landed while all that was running, the push is rejected as
non-fast-forward and the script goes round again: fetch, re-merge, re-gate,
push. Five rounds, then give up.

That is Graydon Hoare's Not Rocket Science Rule — automatically maintain a
repository that always passes all its tests, by testing the merged result
before it lands — and it is the right rule when landings are rare. The
arithmetic turns on you as they get frequent. Every lander validates against a
snapshot of `main`, and the push is a compare-and-swap on that snapshot. The
loser re-validates. So a suite ran once on the branch, once in the landing, and
once more for every landing that beat it to `main`.

I had already scoped the tests. A small Python script, the coverage-scope
script, maps each changed file to its project, walks the solution's
`ProjectReference` graph, and hands back only the test projects whose
dependency closure reaches a touched project, so a one-engine diff runs 2 of
57 backend projects in about 45 seconds instead of the whole suite's 10 to 18
minutes. It did not
matter, because `main` moved faster than a pass. The numbers from the tracker,
in order:

- A landing lost the race four times in 35 minutes. Another lost it with
  nothing to re-run: a one-file docs change whose whole landing was seven git
  commands.
- A landing that touched the contracts project — a leaf nearly everything
  references — reached 55 of 59 test projects, so each pass took about 30
  minutes. It landed on attempt four, two hours and four minutes after it
  started.
- On October 4 one run made five passes in 69 minutes. Every pass was green:
  Release build, 1,270 of 1,270 acceptance tests, both coverage suites at 100%.
  Every push was rejected, because `main` took another landing during the 15 to
  18 minutes each pass's gates ran. The script gave up.

There was a second cost under the first. The landing script holds the
machine's one dotnet lock for the whole run, so a landing that lost the race
for two hours also blocked every other build on that machine for two hours,
including the Stop-time coverage gates of the session waiting on it.

## Iteration two: a merge queue made of branches

The fix the industry converged on is a queue: order the landings, and keep the
serialized step short because the expensive validation already ran. GitHub has
a merge queue, GitLab has merge trains, Rust has bors, Uber has SubmitQueue.
None of them fit as built, for two reasons that are decisions rather than
accidents. This repository has no pull requests, on purpose: review happens
when the tech-lead session reads its sub-agent's work before landing, so a
pull request here would be opened and closed by the same session, paying
tokens for a review surface nobody else reads. And a Claude Code web session is
a container whose git proxy can push a branch and fast-forward one but refuses
to delete a branch or write a ref outside `refs/heads/`, whatever the
repository's own settings say. So the queue had to be built from the one thing
every session can already reach: branches on origin.

A ticket is a branch named `landing-queue/<epoch>-<base>-<tip>-<issue>`, and
the names sort first-come-first-served. A ticket counts only while it is live —
unreleased, younger than ninety minutes, and for a landing not yet on `main` —
so a killed run cannot wedge the line. Release is a fast-forward of the ticket
to `main`'s tip, which the daily branch sweep then deletes as fully merged.
Every failure to read or write the queue fails open, and a push that is still
rejected re-merges and retries as before. Correctness never rests on the
queue; it only stops doomed gate runs.

The retry got smarter at the same time. When `main` moved under a ticket, the
script diffed the old base against the new one and re-ran only the suites the
incoming commits owed — a UI path owes the Blazor suite, a backend path owes
the store suites and backend coverage — and the project graph narrowed that
further whenever it could prove the incoming paths reach none of the tests this
branch is measured by. That is Uber's SubmitQueue conflict analysis, done with
the same coverage-scope script from iteration one, walking the same project
graph over the incoming commits instead of the branch's own.

It landed on October 4 at 18:13 UTC and it felt solved. The next afternoon I
had three landings in flight at once, one of them on attempt four. I asked
Claude, running as the lead session, to read the day's tickets against
`main`'s first-parent log:

- An uncontended ticket landed in about four seconds. Seven of the day's did.
- A contended ticket held the line for 9 to 32 minutes — 8.6, 10.8, 17, 28 and
  32 on the five it measured. When its turn came, `main` had moved (the landing
  ahead of it had just pushed, by construction), so the script went round from
  the top while holding the ticket: re-merge, every gate, the build, then the
  suites the incoming commits owed.
- Throughput was therefore one re-gate at a time: two to six landings an hour
  once two sessions overlapped.
- A relaunched run went to the back of the line. One landing took three
  tickets and landed 91 minutes after the first, most likely because the script
  was run in the foreground and the tool's ten-minute limit killed it mid-wait.

The queue had ordered the bottleneck instead of removing it.

## The question that fixed it

Throughput through a critical section is one over the time you hold it. Hold a
ticket for twenty minutes and `main` takes three landings an hour no matter
how many teams you add; the work they finish in parallel piles up behind the
lock. So the only design question that mattered was: what has to run while
holding the ticket?

Only what makes the push wrong if it runs anywhere else. The re-merge,
obviously. The compile, because a `main` that does not build is a `main` nobody
else can land on, and the incremental build with warnings as errors takes about
a minute. The six tree-wide script checks, which take seconds and catch the
case where a branch's new rule first meets `main`'s newest files. That is the
whole list.

Tests are not on it. A test that runs on `main` one minute after the push tells
you exactly what it would have told you one minute before. The only thing that
changes is who else lands during that minute — and they land on a tree that
compiles, pushed by the session that will see the red first and fix it forward.
Every gate that is a property of the branch alone — the style census, the
what's-new entry and its pictures, the closing-keyword check on commit
messages — does not belong near the lock either. It belongs before the session
is allowed in line.

I gave up the Not Rocket Science Rule, knowingly. `main` is compile-green at
every push and test-green within minutes, verified by the session that pushed
it, with a daily scheduled run on GitHub as the independent witness. At forty
landings a day and fifteen minutes a pass, the rule cost more than the bugs it
would have stopped.

## Iteration three: get ready, get in line, test after

Before, as of yesterday:

1. Session: run the suites on the feature branch.
2. Session: start the landing script, which runs every gate and then takes a
   ticket.
3. Landing script, once its turn comes: merge `main` into the branch, resolve
   conflicts, run every gate again, build, run the suites the incoming commits
   owe, push.
4. Session: close the issue when the script reports success. The ticket is
   released on exit.

Since this afternoon:

1. Session: run the suites on the feature branch.
2. Session: run the preflight. It runs every gate once on the reconciled branch
   and stamps the commit as ready to land. No stamp, no ticket — the script
   refuses one.
3. Session: start the landing script in the background, so no tool time limit
   can kill a queued run. This is the step that gets in line: the script pushes
   a ticket branch to origin, which is its place in the queue, and polls until
   every ticket ahead of it has been released.
4. Landing script, once its turn comes — every landing ahead of it has pushed
   and released its ticket, so this run holds the front of the line and nobody
   else is landing: merge `main`, resolve conflicts, run the tree-wide checks,
   build with warnings as errors, push. The ticket is released the moment
   `main` is pushed.
5. Landing script, after the push: run the suites the incoming commits owe, on
   the pushed `main`, in the lander's own session. A red suite is `main` red —
   the script exits 5, and the session fixes forward on a fresh branch before it
   does anything else.
6. Session: close the issue.

Two details earned their place. An interrupted run now parks its ticket, and a
relaunch within 45 minutes rejoins the line where it was. And the release line
prints how long the ticket was held, so tomorrow's measurement needs no
reconstruction from ticket refs. The landing script's own self-test grew from
221 checks to 249 to pin all of it.

What I did not build is batching at the head of the queue — the head landing
every waiting stamped branch in one bulk merge, so one critical section lands
many. It is the natural next step and every merge queue has it. I ruled it out,
for now, because it means one session pushing other sessions' branches and
writing none of their close-outs, while a session waiting in line spends
nothing until its turn. Same-session batching exists for the case where one
session holds several ready branches.

## What the big shops do, and what I took

Naming the sources is cheaper than pretending the design was original.

**Bors and the Not Rocket Science Rule** is iteration one: test the merged
result, then fast-forward. The queue keeps its ordering. The rule itself I
relaxed on purpose, above.

**GitHub's merge queue and GitLab's merge trains** are the shape — a line of
ready changes, a short serialized step — minus the pull request, and minus the
batching, for the reason above.

**Uber's SubmitQueue** contributed the conflict analysis: decide which pending
changes can affect each other, so independent ones do not pay for each other's
tests. Here that is the project graph deciding which suites a moved `main`
owes.

**Google's TAP and Chromium's commit queue** contributed the vocabulary that
finally made the decision legible — presubmit versus postsubmit — and two
practices that come with it. The suites run on `main` after the push. And when
the daily run finds `main` red, a script bisects `main`'s first-parent history
in throwaway worktrees, names the landing that did it, and prepares a revert
without landing it. Chromium calls the person who does that the sheriff. Here
it is whichever session reads the red first.

## The catch-all, and the arithmetic on GitHub minutes

The remaining question is where the independent witness runs. Today it is one
scheduled run on GitHub-hosted runners at 04:11 Pacific, on a private
repository on the Free plan: 2,000 included minutes a month and twenty
concurrent jobs. A full run is eleven jobs and about 23 minutes of wall clock,
but GitHub bills each job rounded up to the minute, so one run costs about 61
billable minutes: 20 for build and test, 23 for the browser suite, 6 for
rendering the public pages against production's dataset, and the rest in
checkers that finish in seconds. The build-and-test job spends five minutes
compiling and nine running every backend test project, because a hosted run
cannot see which projects a landing reached.

Run that on every landing and the arithmetic is short. Forty landings a day is
about 2,400 billable minutes a day and 73,000 a month, against an allowance of
2,000. At $0.006 a minute for Linux that is about $430 a month. Collapse the
bursts with a concurrency group that cancels the superseded run and it is
still something like $250, for a signal that arrives twenty-five minutes after
the fact from a machine that has already been beaten to the answer. The Pro
plan's extra thousand minutes is a rounding error at that rate.

Would it bottleneck `main`? No. A post-merge run never blocks a push. What it
bottlenecks is itself: eleven jobs a landing against a twenty-job ceiling means
any two overlapping landings queue, and cancelling superseded runs means a
burst of five landings produces one verdict, for the last of them. That answers
"is `main` green" and not "which landing broke it", which is the bisect
script's job anyway. The subtler problem is latency in the other direction.
GitHub documents that scheduled runs can be delayed under load, and this week's
daily run started between four and eight and a half hours after its cron, every
day. A push-triggered run starts within a minute or two. The schedule is the
cheap option and the slow one.

So the witness stays where the tests already are, which is the Google and Uber
answer too: the lander runs postsubmit on the machine it already has, and the
scheduled run stays as the once-a-day full pass from a cold checkout. I
considered a self-hosted runner as a per-landing independent witness and
decided against it, for the reason I had already decided against an integrator
session: it is a second standing process to run and pay for, and the session
that landed the change has already run the suites on the tree it pushed. What
a runner would add is a second opinion on a verdict the session already has.

## Where it stands

Iteration three has been live for one afternoon. Three landings have gone
through it, each one preflighted, ticketed, merged and built under the lock,
pushed, and then tested on the pushed `main` by the session that pushed it.
The release line now prints how long each ticket was held, so tomorrow's
measurement is a grep rather than a reconstruction from ticket refs. The daily
run has not yet judged a `main` built this way; its verdicts so far are on the
first two iterations.

The risk I accepted is specific. Two branches that are each green alone and
wrong together now reach `main` and are caught minutes later, by the lander's
post-push suites, instead of before the push. When that happens the answer is
fix forward, and if the daily run finds it first the bisect script names the
landing. At forty landings a day I would rather pay that occasionally than pay
fifteen minutes of lock on every landing.

Three iterations in a month, each one sent back by a measurement rather than a
hunch: the race by a run that lost five green passes in 69 minutes, the queue
by five contended tickets held for 9 to 32 minutes, and the shape I have now by
the question of what actually has to happen inside the lock. The answer was a
merge and a compile. Everything else was tradition.
