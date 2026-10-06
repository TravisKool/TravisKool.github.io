---
title: Forty landings a day through one lock
description: Forty landings a day from agent teams, a 100% coverage bar, and three iterations of a landing script in a month — with the numbers that sent each one back to the drawing board.
pubDate: 2026-10-05T21:00:00
updatedDate: 2026-10-06T10:00:00
kind: essay
tags: ['agents', 'process', 'testing', 'reliability']
featured: false
draft: false
---

> **Update, October 6.** Iteration three has now been through the busiest night
> the queue has seen. I added a [follow-up at the end](#follow-up-forty-six-hours-of-tickets)
> with the real numbers from this project: how deep the line got, how long a
> landing holds the front, throughput, and what CI said about the `main` it built.

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

## Follow-up: forty-six hours of tickets

The last section promised that the next measurement would be a grep. It did
not even need that. Every ticket is a branch, and GitHub keeps an activity log
of every push to every branch, timestamped to the second. A ticket branch is
created when a landing joins the line and pushed once more when it leaves:
released to `main`'s tip, or parked on a commit that names its branch. The
ticket's own name carries the rest — when it was taken, the commit it is
anchored at, the commit it lands, the issue. So the numbers below cost nothing
to collect. There is no metrics service and no instrumentation, just 142
branches and the log git and GitHub already keep. As far as I can tell, getting
the same history out of a hosted merge queue means subscribing to its webhook
events and storing them yourself.

The window runs from 18:13 UTC on October 4, when the queue went live, to 16:21
UTC on October 6. All times here are UTC. Iteration two had the first 26 hours
and iteration three the last 20. In that time 142 tickets passed through the
line and 114 of them landed, seven as bulk merges of several branches, and 131
merge commits reached `main`.

The number that decides throughput is the time a landing spends at the front of
the line, because nobody else can land while it is there. When `main` had moved
since the landing's preflight, iteration two held the front for a median of
12.5 minutes, because the suites the incoming commits owed ran inside it.
Iteration three holds it for 4.7. That is more than the "merge and a compile"
I predicted, because the tree-wide checks run there too, but it is a third of
what it was, and the long tail went from 53 minutes to 16.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" role="img" aria-label="Horizontal bar chart of minutes a landing held the front of the queue when main had moved. Iteration two: median 12.5 minutes, 90th percentile 28.4. Iteration three: median 4.7 minutes, 90th percentile 11.0.">
<text x="0" y="18" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)">MINUTES HOLDING THE FRONT, WHEN MAIN HAD MOVED</text>
<line x1="170.0" y1="34" x2="170.0" y2="166" stroke="var(--rule)"/>
<text x="170.0" y="184" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">0</text>
<line x1="300.0" y1="34" x2="300.0" y2="166" stroke="var(--rule)"/>
<text x="300.0" y="184" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">10</text>
<line x1="430.0" y1="34" x2="430.0" y2="166" stroke="var(--rule)"/>
<text x="430.0" y="184" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">20</text>
<line x1="560.0" y1="34" x2="560.0" y2="166" stroke="var(--rule)"/>
<text x="560.0" y="184" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">30</text>
<text x="160" y="55" text-anchor="end" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-muted)">ITERATION TWO · MEDIAN</text>
<rect x="170" y="42" width="162.5" height="18" rx="2" fill="var(--ink-faint)" fill-opacity="1"/>
<text x="338.5" y="55" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" style="font-variant-numeric: tabular-nums">12.5</text>
<text x="160" y="81" text-anchor="end" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-muted)">ITERATION TWO · P90</text>
<rect x="170" y="68" width="369.2" height="18" rx="2" fill="var(--ink-faint)" fill-opacity="0.45"/>
<text x="545.2" y="81" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" style="font-variant-numeric: tabular-nums">28.4</text>
<text x="160" y="121" text-anchor="end" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-muted)">ITERATION THREE · MEDIAN</text>
<rect x="170" y="108" width="61.1" height="18" rx="2" fill="var(--accent)" fill-opacity="1"/>
<text x="237.1" y="121" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" style="font-variant-numeric: tabular-nums">4.7</text>
<text x="160" y="147" text-anchor="end" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-muted)">ITERATION THREE · P90</text>
<rect x="170" y="134" width="143.0" height="18" rx="2" fill="var(--accent)" fill-opacity="0.45"/>
<text x="319.0" y="147" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" style="font-variant-numeric: tabular-nums">11.0</text>
<line x1="170" y1="34" x2="170" y2="166" stroke="var(--rule-strong)"/>
</svg>

*Minutes a landing held the front of the queue when `main` had moved under it.
Solid bars are medians, pale bars the 90th percentile. Iteration two, 38
landings; iteration three, 27.*

The other case is the common one. 49 of the 114 landings found `main` exactly
where their preflight had left it, and held the front for a median of seven
seconds. That is the whole cost of the queue when nobody is ahead: two pushes.
61% of landings had nobody ahead of them at all.

The deepest the line got was nine tickets, at 01:53 on October 6, an evening
when several teams finished at once. 25 tickets joined between 01:07 and 03:07,
and the line was empty again at 03:07. For about half an hour of that the
front was held by a ticket whose run a container restart had killed outright,
so no trap released it. The script now adopts a dead ticket like that when its
branch is relaunched. Once the front moved again, 21 merge commits reached
`main` in the hour from 02:10. Iteration two's best hour was seven.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" role="img" aria-label="Step chart of landing-queue depth from October 4 at 18:00 to October 6 at 17:00 UTC. Depth stays between zero and five through iteration two, then peaks at nine tickets at 01:53 UTC on October 6, during iteration three, and the line is empty again by 03:07.">
<text x="44" y="18" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5" fill="var(--ink-muted)">TICKETS IN LINE — OCT 4 18:00 TO OCT 6 17:00 UTC</text>
<line x1="44" y1="210.0" x2="588" y2="210.0" stroke="var(--rule)"/>
<text x="36" y="214.0" text-anchor="end" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">0</text>
<line x1="44" y1="165.6" x2="588" y2="165.6" stroke="var(--rule)"/>
<text x="36" y="169.6" text-anchor="end" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">3</text>
<line x1="44" y1="121.2" x2="588" y2="121.2" stroke="var(--rule)"/>
<text x="36" y="125.2" text-anchor="end" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">6</text>
<line x1="44" y1="76.8" x2="588" y2="76.8" stroke="var(--rule)"/>
<text x="36" y="80.8" text-anchor="end" font-family="var(--font-mono)" font-size="11" fill="var(--ink-faint)" style="font-variant-numeric: tabular-nums">9</text>
<path d="M44.0 210.0 L46.7 210.0 L46.7 195.2 L46.7 195.2 L46.7 210.0 L48.1 210.0 L48.1 195.2 L48.1 195.2 L48.1 210.0 L48.8 210.0 L48.8 195.2 L48.8 195.2 L48.8 210.0 L51.4 210.0 L51.4 195.2 L51.5 195.2 L51.5 210.0 L51.7 210.0 L51.7 195.2 L51.7 195.2 L51.7 180.4 L54.2 180.4 L54.2 195.2 L54.3 195.2 L54.3 210.0 L55.1 210.0 L55.1 195.2 L57.8 195.2 L57.8 180.4 L59.3 180.4 L59.3 195.2 L60.2 195.2 L60.2 180.4 L61.4 180.4 L61.4 165.6 L62.0 165.6 L62.0 180.4 L63.7 180.4 L63.7 195.2 L64.9 195.2 L64.9 210.0 L67.4 210.0 L67.4 195.2 L67.4 195.2 L67.4 210.0 L71.3 210.0 L71.3 195.2 L71.3 195.2 L71.3 210.0 L73.3 210.0 L73.3 195.2 L73.4 195.2 L73.4 210.0 L74.2 210.0 L74.2 195.2 L76.8 195.2 L76.8 180.4 L80.0 180.4 L80.0 165.6 L80.3 165.6 L80.3 150.8 L82.2 150.8 L82.2 136.0 L82.9 136.0 L82.9 150.8 L83.9 150.8 L83.9 136.0 L84.9 136.0 L84.9 150.8 L86.4 150.8 L86.4 136.0 L87.7 136.0 L87.7 150.8 L89.5 150.8 L89.5 165.6 L90.4 165.6 L90.4 150.8 L92.6 150.8 L92.6 165.6 L95.4 165.6 L95.4 180.4 L96.4 180.4 L96.4 195.2 L98.5 195.2 L98.5 210.0 L99.5 210.0 L99.5 195.2 L102.7 195.2 L102.7 210.0 L107.6 210.0 L107.6 195.2 L107.6 195.2 L107.6 210.0 L116.4 210.0 L116.4 195.2 L116.4 195.2 L116.4 210.0 L117.9 210.0 L117.9 195.2 L121.6 195.2 L121.6 210.0 L125.6 210.0 L125.6 195.2 L125.7 195.2 L125.7 210.0 L133.9 210.0 L133.9 195.2 L133.9 195.2 L133.9 210.0 L137.7 210.0 L137.7 195.2 L137.7 195.2 L137.7 210.0 L139.1 210.0 L139.1 195.2 L141.1 195.2 L141.1 210.0 L141.1 210.0 L141.1 195.2 L141.7 195.2 L141.7 180.4 L143.0 180.4 L143.0 195.2 L143.0 195.2 L143.0 210.0 L143.7 210.0 L143.7 195.2 L144.1 195.2 L144.1 180.4 L144.9 180.4 L144.9 165.6 L145.5 165.6 L145.5 180.4 L147.1 180.4 L147.1 165.6 L148.1 165.6 L148.1 180.4 L149.8 180.4 L149.8 195.2 L149.8 195.2 L149.8 210.0 L152.2 210.0 L152.2 195.2 L153.0 195.2 L153.0 180.4 L154.0 180.4 L154.0 165.6 L156.7 165.6 L156.7 180.4 L156.8 180.4 L156.8 165.6 L158.1 165.6 L158.1 150.8 L159.6 150.8 L159.6 165.6 L162.4 165.6 L162.4 180.4 L163.0 180.4 L163.0 195.2 L163.0 195.2 L163.0 180.4 L164.3 180.4 L164.3 165.6 L169.6 165.6 L169.6 180.4 L169.6 180.4 L169.6 195.2 L170.1 195.2 L170.1 180.4 L170.2 180.4 L170.2 165.6 L170.3 165.6 L170.3 180.4 L173.1 180.4 L173.1 165.6 L174.4 165.6 L174.4 180.4 L177.2 180.4 L177.2 195.2 L178.8 195.2 L178.8 180.4 L179.5 180.4 L179.5 195.2 L181.1 195.2 L181.1 210.0 L181.3 210.0 L181.3 195.2 L181.5 195.2 L181.5 180.4 L184.5 180.4 L184.5 195.2 L185.6 195.2 L185.6 210.0 L268.0 210.0 L268.0 195.2 L268.0 195.2 L268.0 210.0 L278.2 210.0 L278.2 195.2 L278.2 195.2 L278.2 210.0 L278.7 210.0 L278.7 195.2 L278.7 195.2 L278.7 180.4 L280.4 180.4 L280.4 195.2 L282.4 195.2 L282.4 210.0 L284.4 210.0 L284.4 195.2 L284.4 195.2 L284.4 210.0 L285.3 210.0 L285.3 195.2 L285.8 195.2 L285.8 180.4 L290.7 180.4 L290.7 195.2 L294.0 195.2 L294.0 210.0 L297.6 210.0 L297.6 195.2 L298.3 195.2 L298.3 210.0 L298.6 210.0 L298.6 195.2 L299.6 195.2 L299.6 180.4 L300.3 180.4 L300.3 195.2 L300.6 195.2 L300.6 180.4 L301.3 180.4 L301.3 195.2 L304.0 195.2 L304.0 210.0 L305.9 210.0 L305.9 195.2 L305.9 195.2 L305.9 210.0 L309.0 210.0 L309.0 195.2 L309.0 195.2 L309.0 210.0 L309.9 210.0 L309.9 195.2 L310.2 195.2 L310.2 210.0 L313.4 210.0 L313.4 195.2 L313.4 195.2 L313.4 210.0 L316.7 210.0 L316.7 195.2 L316.7 195.2 L316.7 210.0 L317.9 210.0 L317.9 195.2 L321.3 195.2 L321.3 210.0 L327.4 210.0 L327.4 195.2 L327.4 195.2 L327.4 210.0 L330.8 210.0 L330.8 195.2 L332.9 195.2 L332.9 180.4 L334.6 180.4 L334.6 195.2 L337.0 195.2 L337.0 210.0 L338.0 210.0 L338.0 195.2 L342.1 195.2 L342.1 210.0 L346.3 210.0 L346.3 195.2 L346.4 195.2 L346.4 210.0 L348.3 210.0 L348.3 195.2 L348.3 195.2 L348.3 210.0 L348.5 210.0 L348.5 195.2 L348.5 195.2 L348.5 210.0 L348.8 210.0 L348.8 195.2 L348.8 195.2 L348.8 210.0 L360.3 210.0 L360.3 195.2 L360.3 195.2 L360.3 210.0 L371.8 210.0 L371.8 195.2 L371.8 195.2 L371.8 210.0 L378.0 210.0 L378.0 195.2 L378.0 195.2 L378.0 210.0 L399.9 210.0 L399.9 195.2 L400.0 195.2 L400.0 210.0 L401.1 210.0 L401.1 195.2 L401.1 195.2 L401.1 210.0 L401.3 210.0 L401.3 195.2 L401.7 195.2 L401.7 180.4 L402.1 180.4 L402.1 195.2 L402.3 195.2 L402.3 180.4 L402.6 180.4 L402.6 195.2 L402.8 195.2 L402.8 210.0 L403.4 210.0 L403.4 195.2 L403.4 195.2 L403.4 210.0 L403.5 210.0 L403.5 195.2 L404.0 195.2 L404.0 210.0 L404.2 210.0 L404.2 195.2 L404.2 195.2 L404.2 180.4 L404.2 180.4 L404.2 195.2 L404.8 195.2 L404.8 180.4 L405.2 180.4 L405.2 165.6 L405.3 165.6 L405.3 150.8 L405.4 150.8 L405.4 136.0 L405.9 136.0 L405.9 121.2 L406.2 121.2 L406.2 106.4 L406.3 106.4 L406.3 91.6 L406.4 91.6 L406.4 106.4 L407.0 106.4 L407.0 91.6 L407.3 91.6 L407.3 106.4 L407.3 106.4 L407.3 121.2 L407.6 121.2 L407.6 106.4 L407.9 106.4 L407.9 91.6 L407.9 91.6 L407.9 106.4 L409.1 106.4 L409.1 91.6 L409.8 91.6 L409.8 106.4 L412.1 106.4 L412.1 91.6 L413.1 91.6 L413.1 76.8 L413.1 76.8 L413.1 91.6 L414.1 91.6 L414.1 106.4 L414.6 106.4 L414.6 91.6 L414.7 91.6 L414.7 106.4 L414.7 106.4 L414.7 91.6 L414.8 91.6 L414.8 106.4 L415.5 106.4 L415.5 121.2 L415.8 121.2 L415.8 106.4 L416.2 106.4 L416.2 121.2 L416.3 121.2 L416.3 136.0 L417.0 136.0 L417.0 150.8 L417.0 150.8 L417.0 136.0 L417.9 136.0 L417.9 150.8 L419.0 150.8 L419.0 136.0 L419.0 136.0 L419.0 150.8 L419.1 150.8 L419.1 136.0 L420.4 136.0 L420.4 121.2 L421.2 121.2 L421.2 106.4 L422.1 106.4 L422.1 121.2 L422.2 121.2 L422.2 136.0 L422.8 136.0 L422.8 150.8 L422.9 150.8 L422.9 136.0 L423.2 136.0 L423.2 121.2 L423.8 121.2 L423.8 136.0 L424.4 136.0 L424.4 150.8 L425.4 150.8 L425.4 165.6 L426.4 165.6 L426.4 180.4 L427.3 180.4 L427.3 195.2 L427.4 195.2 L427.4 210.0 L427.7 210.0 L427.7 195.2 L427.7 195.2 L427.7 210.0 L431.2 210.0 L431.2 195.2 L431.6 195.2 L431.6 180.4 L431.8 180.4 L431.8 195.2 L431.9 195.2 L431.9 210.0 L433.4 210.0 L433.4 195.2 L433.4 195.2 L433.4 180.4 L434.1 180.4 L434.1 165.6 L434.3 165.6 L434.3 180.4 L435.1 180.4 L435.1 195.2 L435.2 195.2 L435.2 210.0 L436.4 210.0 L436.4 195.2 L436.5 195.2 L436.5 210.0 L436.6 210.0 L436.6 195.2 L436.6 195.2 L436.6 210.0 L437.4 210.0 L437.4 195.2 L437.4 195.2 L437.4 210.0 L440.9 210.0 L440.9 195.2 L441.3 195.2 L441.3 180.4 L442.3 180.4 L442.3 165.6 L442.5 165.6 L442.5 150.8 L442.6 150.8 L442.6 136.0 L443.2 136.0 L443.2 150.8 L444.0 150.8 L444.0 165.6 L444.1 165.6 L444.1 180.4 L444.7 180.4 L444.7 195.2 L445.6 195.2 L445.6 180.4 L445.7 180.4 L445.7 195.2 L445.9 195.2 L445.9 210.0 L446.5 210.0 L446.5 195.2 L446.6 195.2 L446.6 210.0 L448.2 210.0 L448.2 195.2 L449.4 195.2 L449.4 210.0 L453.4 210.0 L453.4 195.2 L453.5 195.2 L453.5 210.0 L456.1 210.0 L456.1 195.2 L456.1 195.2 L456.1 210.0 L457.8 210.0 L457.8 195.2 L458.6 195.2 L458.6 180.4 L458.7 180.4 L458.7 195.2 L459.5 195.2 L459.5 210.0 L469.3 210.0 L469.3 195.2 L469.3 195.2 L469.3 210.0 L488.8 210.0 L488.8 195.2 L488.8 195.2 L488.8 210.0 L495.4 210.0 L495.4 195.2 L495.4 195.2 L495.4 210.0 L515.6 210.0 L515.6 195.2 L515.6 195.2 L515.6 210.0 L534.5 210.0 L534.5 195.2 L534.5 195.2 L534.5 210.0 L543.0 210.0 L543.0 195.2 L543.1 195.2 L543.1 210.0 L549.2 210.0 L549.2 195.2 L549.3 195.2 L549.3 210.0 L556.5 210.0 L556.5 195.2 L556.5 195.2 L556.5 210.0 L560.8 210.0 L560.8 195.2 L560.8 195.2 L560.8 210.0 L576.8 210.0 L576.8 195.2 L576.8 195.2 L576.8 210.0 L578.3 210.0 L578.3 195.2 L578.3 195.2 L578.3 210.0 L579.2 210.0 L579.2 195.2 L579.3 195.2 L579.3 210.0 L580.5 210.0 L580.5 195.2 L580.6 195.2 L580.6 210.0 L588.0 210.0 Z" fill="var(--accent)" fill-opacity="0.85"/>
<line x1="348.2" y1="38" x2="348.2" y2="210" stroke="var(--ink-faint)" stroke-dasharray="4 4"/>
<text x="342.2" y="50" text-anchor="end" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-muted)">ITERATION TWO</text>
<text x="354.2" y="50" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-muted)">ITERATION THREE</text>
<text x="413.0" y="70.8" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--ink)" style="font-variant-numeric: tabular-nums">9</text>
<line x1="44" y1="210" x2="588" y2="210" stroke="var(--rule-strong)"/>
<line x1="44.0" y1="210" x2="44.0" y2="215" stroke="var(--rule-strong)"/>
<text x="44.0" y="230" text-anchor="start" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-faint)">OCT 4 18:00</text>
<line x1="182.9" y1="210" x2="182.9" y2="215" stroke="var(--rule-strong)"/>
<text x="182.9" y="230" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-faint)">OCT 5 06:00</text>
<line x1="321.8" y1="210" x2="321.8" y2="215" stroke="var(--rule-strong)"/>
<text x="321.8" y="230" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-faint)">OCT 5 18:00</text>
<line x1="460.7" y1="210" x2="460.7" y2="215" stroke="var(--rule-strong)"/>
<text x="460.7" y="230" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="var(--ink-faint)">OCT 6 06:00</text>
</svg>

*Tickets holding a place in the landing queue, October 4 18:00 to October 6
17:00 UTC, read from the ticket branches' push history. The dashed line is the
moment iteration three landed.*

On the risk I accepted: two full CI runs from a cold checkout have now judged
a `main` built by iteration three. The first, at 22:53 on October 5, went red
in one job, the Playwright browser suite. The second, at 01:03 on October 6,
with the queue at its busiest, was green on all twelve jobs it ran.

What iteration three fixed, measured rather than argued:

- **The suites inside the lock.** They run after the push now, so the median
  time at the front went from 12.5 minutes to 4.7, and the lock time per landing
  from 9.8 minutes to 2.9.
- **The doomed full passes.** No preflight stamp, no ticket, so every gate runs
  once, on the branch, before the landing gets in line. Nothing re-runs the
  branch's own gates at the front.
- **The trip to the back of the line.** In iteration two one landing took five
  tickets, one per attempt, each at the back. In iteration three eleven tickets were parked and
  every one of their branches landed from its old place in line.
- **The tool limit that killed queued runs.** The landing runs in the
  background with the longest limit the tool allows, so a long wait in line is
  only a wait.
- **The throughput ceiling.** The best hour went from seven merges onto
  `main` to twenty-one.

What the free data cannot say is what happened inside a session. Whether a
post-push suite went red lives in the landing's own log, not in git, and that
is the next thing worth counting.
