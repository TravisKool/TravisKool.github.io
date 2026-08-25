---
title: The outbox that replaced a pillar
description: An evolving architecture discussion with an AI teammate — honest defect-surfacing, contract review both ways, and a durable async notification flow that never stands up a NotificationManager pillar.
pubDate: 2026-08-25T18:00:00
kind: essay
tags: ['agents', 'architecture', 'reliability', 'process']
featured: false
draft: false
---

Every product eventually has to send email, and where notifications live is one
of those architecture questions that looks small and shapes everything. On the
platform I am building with agent teams — a large .NET application under
iDesign rules — that question turned into a week-long conversation between me
and the AI: it surfaced defects in its own earlier work, I caught two
architectural violations through contract review, and what came out the other
end is a notification flow I trust more than the one I used to build on human
teams. This is the story of how the design evolved, and the numbers that
settled the arguments.

One production note worth knowing up front, because the reviews are where this
story turns: most of the building ran on Claude Opus sessions, and the review
steps usually ran on Fable, the heavier model. The catches below came out of
that split — generation at volume, with a slower, sharper pass over the parts
that are expensive to get wrong.

## The shape we were aiming for

The vocabulary we landed on is worth stating first, because the rest of the
essay uses it. An email leaves the system one of two ways: **direct**, or
through the **durable outbox**. In the outbox way, **upstream** is everything
that happens on the UI thread — the domain write and an outbox row, committed
in one database transaction. **Downstream** is a background service — the
*drainer* — that dequeues from the outbox and does the slow, failure-prone
work: resolving the
audience, checking each recipient's preferences, resolving email addresses,
building the message, calling the email provider.

The point of the split is that the person clicking a button never waits on
mail. Publishing a club announcement or closing a site commits in
milliseconds; the notification fan-out — which might mean dozens of
recipients, a preference lookup each, and a third-party API call each — happens
on a worker, with retries, after the fact. And because the outbox row commits
*in the same transaction* as the domain change, an outage anywhere downstream
loses nothing: the row is still there when the process comes back, and the
drainer picks it up. A notification is never missed; at worst it is late.

## The AI found the crash windows itself

The uncomfortable part of the story is that the first implementation did not
have that property, and the way I found out was the AI auditing its own work.

Asked to check how notifications actually left the system, it filed an audit
that walked every send site in production code and reported eleven paths that
did not go through the durable outbox — six of which bypassed the delivery
queue entirely, meaning no preference check, no retry, no record. Worse, it
enumerated the crash windows precisely. The club-announcement path saved the
announcement through one Manager call and then invoked the notify call as a
second, separate operation — its own words: *announcement committed, notice
lost*. The magic-link sign-in wrote its rate-limit row and its token in two
separate saves, so a crash in between spent the requester's rate budget and
stored no token. The general form had already been named in an earlier session:
workflows were doing three unwrapped `SaveChangesAsync` calls in a row, and a
failure between any two of them left partial work — a record changed with no
trace, or in the email case, a domain change committed with the notification
intent evaporated.

None of this was me catching the machine. It was the machine reporting, with
file-and-line citations, that the thing it had built earlier did not honor the
rule we both thought it honored. That honesty is what made the rest of the
collaboration possible: you cannot align on a fix with a partner that
papers over its own gaps.

## The rule that made the review possible

Around the same time I had adopted a rule, born from an earlier period when my
review had quietly degraded into agreement: **every new contract is posted in
the session chat, as terse code, before it is implemented.** Interfaces only,
trimmed to the members that changed, one comment saying how many other methods
exist on that contract. New projects, new namespaces, new strategies, and new
naming go further — they are proposed and approved before any code exists.

The rule is not new to me — on my human teams we ran the same ceremony and
called it the same thing: Contract Review. What was new was pointing it at an
AI teammate, and whether the ceremony survives that change of teammate is
exactly what the next three sections answer.

That rule is the hinge of this whole story, because both of the catches that
follow happened *in a contract review*, before the wrong version was built.
Reviewing a proposal on my phone costs me two minutes. Reviewing a landed
implementation costs a revert, a re-test, and an argument with sunk cost.

## Catch one: the transaction that tried to climb the stack

The atomicity fix seemed obvious: put all the upstream inserts in one database
transaction. I suggested it; the AI agreed; and its first proposal put the
transaction in the Manager's hands — the Manager opening a transaction and
orchestrating calls into several DataAccess projects inside it.

Mechanically that can be made to work. Architecturally it is exactly backwards,
and the contract review is where I caught it. In this codebase the layering is
strict: a DataAccess project owns one entity group and is a leaf; a Manager
orchestrates workflows and owns no database machinery. A `DbTransaction` in a
Manager's hands drags data-access orchestration up into the one layer that is
supposed to be free of it — and it leaks the EF Core context out of the
assembly that owns it. Interestingly, the AI was over-weighting the *other*
rule — one entity group per DataAccess, Manager orchestrates — and concluded
the Manager was the only place multiple tables could be coordinated.

The resolution was a clarification, not a compromise: **the outbox row and the
audit entry are exceptions to entity-group ownership.** They ride with the use
case. The use case's own DataAccess method takes one change DTO carrying the
domain change, its traces, and its outbox row, and commits all of it in one
EF Core transaction — one context, one `SaveChangesAsync` where possible, two
saves inside one `BeginTransactionAsync` when an insert's database-assigned id
has to appear in a row committed beside it. The Manager decides what the rows
say; the DataAccess commits them as one act. For tables owned by another
context, the domain context carries a write-only copy of the entity — mapped
`ExcludeFromMigrations`, no `DbSet`, guarded by an architecture test that fails
the build if the copy drifts from the owner's schema.

The performance objection to doing all of this upstream came up, and it died
on a measurement. Committing the traces and the outbox row inline costs about
0.6 ms per write — a handful of inserts on a connection the use case already
holds open, nothing a person clicking a button will ever feel. And the
alternative is not cheaper, it is more expensive in the place that actually
matters: handing the audit row and the notification to a downstream
AuditManager and NotificationManager to write after the fact means a second
round of connections and lookups to reconstruct context the upstream write
already had in hand, a second writer contending for the same tables, and a
delivery guarantee that now has to be rebuilt on top. Fast, inline, and atomic
turned out to be the cheap option — for the UI thread *and* for the database.

## Catch two: nine copies of the same outbox

With the atomic write shape settled, I asked a scope question: there were
several email types by now — how generic was the flow? I asked it from
experience rather than suspicion: I have watched this kind of flow, built
without a generic spine, metastasize into a copy per message type — so I knew
what the wrong answer would look like before I heard it.

It was the wrong answer, and again the AI produced the count against its own
work: the pattern had been rolled out **one outbox per notification type**.
Upstream, nine outbox tables and nine record DTOs, all nine entities repeating
the same six columns. Downstream, nine drainer/BackgroundService pairs — that
is eighteen hosted-service classes — two of them 93 lines each and differing
only in type names and prose. Roughly **3,100 lines** in all, held together by
**47 Manager contract methods** to stage the rows upstream and to drain, mark,
and dead-letter them downstream. The only genuinely shared piece was the
per-recipient delivery queue behind them.

Each copy had been individually reasonable — the second one copied the first
because the first was the approved shape, and by the ninth the duplication was
load-bearing. This is a failure mode agents inherit from us: nobody decides to
build nine of something, they decide eight times not to refactor. On my human
teams the threshold was two copies, maybe three — after that a refactor was
mandatory. The agents had sailed past that line six times, because nothing in
the spec had drawn it.

The alignment I asked for was simple to state: **the flow is generic until the
moment a specific email body and subject must exist.** One
`NotificationOutboxEntries` table, owned by the notification store and copied
write-only into every domain context — the same mechanism the trace tables
already used — so any use case can stage a notification inside its own
transaction. One drainer. And at the far end, a message factory with one
method per unique email, because the email content is the *only* part that is
legitimately per-type. The consolidation deletes the ~3,100 lines of
near-identical plumbing, collapses nine tables to one, nine DTOs to one,
eighteen hosted-service classes to two, and retires the 47-method contract
surface — leaving each notification type owning exactly one thing: what its
email says.

## Catch three: the factory drifting upstream

The factory went through the same contract review as everything else, and the
review looked fine — one creation method per email, pure function of its
arguments, no dependencies. Then I asked the question that was not on the
page: *where does this get called?*

The AI's plan had the factory resolving subject and body **upstream** — on the
UI thread, at enqueue time, with the rendered prose stored in the outbox row.
The correction: the factory runs **downstream**, at drain time, just before
the communication layer that calls the email provider. Upstream stores intent —
keys, kinds, ids — not prose.

The dependency graph tells the same story, which is why the question was worth
asking in a *contract* review. A factory called at enqueue time has to be
injected into every Manager that stages a notification — several constructors,
across every pillar. Called at drain time, it is injected exactly once, into
the one downstream service that sends. One injection site instead of many is
not just tidier wiring; it is the architecture saying the content concern
belongs at the end of the pipe.

The reasons stack up. The upstream transaction stays as small as the
architecture promises. The message is built against the state of the world at
send time, not at click time. And one class of email cannot safely be built
early at all: a steward invitation carries a single-use token whose only other
copy is a one-way hash — rendering it at enqueue would persist a live
credential in a table that never redacts, indefinitely. The shipped fix mints
the token at drain, seconds before the send, so no plaintext credential is
ever at rest. A message factory called upstream would have quietly foreclosed
that.

## The final alignment: some mail must not queue

The last decision was recognizing the outbox's one genuine limit. A queue puts
a drain interval between the click and the mail, and for one path that is
wrong: the magic-link sign-in, where a person is sitting in a browser having
just clicked, and where the sign-in link is the mail that recovers every other
failure. Queue it, and the "pause all email" switch can silence the very
message that lifts the pause — a lockout with no exit.

So the design has two lanes, chosen per mail and both with obligations.
**Direct** mail sends instantly, owes a one-transaction upstream write, and
owes a written-down argument at the call site — because an unexplained direct
send is indistinguishable from an oversight, which is how these survive
audits. Everything else goes through the outbox. Magic link is direct
permanently, argued twice over: immediacy, and the credential. The decision is
in the code where the next reader will meet it, not in a chat log nobody can
search.

## Against the design I used to build

The comparison that convinced me this is an upgrade is the notification
architecture I worked with earlier in my career: the Manager finishes its
domain inserts, then orchestrates a call through a NotificationProxy to a
service bus, and a function app picks up the message and delivers the email.
It is a solid, proven flow — and it has the same crash window this project
just closed. The bus publish happens *after* the domain transaction, as a
separate operation over the network, so a crash between the commit and the
publish loses the notification. How big that window is depends on how much
orchestration the Manager does in between; it is never zero.

The outbox closes it by construction: the notification intent is rows in the
same transaction as the change, so there is no "between".

To be fair to the proxy design, that window is solvable — and it is worth
saying how, because the solution is the concession that strengthens the point.
The industry fix is the transactional outbox with a relay: the outbox row,
committed with the domain change, carries the event itself, and a background
publisher reads unpublished rows, creates the bus message, sends it, and marks
the row published — retrying until it succeeds. That is what NServiceBus and
MassTransit ship as their outbox features, and what change-data-capture tools
do by reading the transaction log directly. It makes publishing at-least-once,
so the consumer dedups — Service Bus keys duplicate detection on the message
id, and the outbox row id is the natural one. But notice what just happened:
the fix for the proxy design *is* the outbox. Both architectures need the same
load-bearing half to be correct. The only real question is what sits
downstream of it — a service bus and a function app, or a background service
reading the same database.

That framing is also why I am comfortable with what this system has today.
The outbox rows are already the integration events, and the architecture is
already modular — so if the platform ever breaks down into separate services
as the systems and traffic grow, a relay publishing those same rows to a
service bus slots in downstream without touching a single upstream write. That
is the natural next step, and the design leaves the door open at zero cost.
For now, though, one host and one database make the in-process drainer the
cost-effective choice for early platform development: the dead-letter admin
page is the DLQ, the drain loop is the retry policy, and declining the proxy,
the service bus, and the function app declines their standing bill and their
operational surface — three deployables and a broker to monitor, version, and
secure — in exchange for nothing the drainer does not already deliver at this
scale.

The second trade-off is quieter and mattered more to me. The proxy design
needs somewhere for the proxy to point — a NotificationManager, standing as a
peer of the real domain pillars. This system has exactly three pillars, each
one a genuine business concern, and a rule that a fourth must survive the
question *is this really independent of all three?* Notifications would not
have survived it; delivery is a mechanism, not a domain. The outbox never asks
the question. The background drainer is a *client* — the same standing as a
UI component — and a client may call any Manager, so the cross-pillar
notification workflow needs no Manager-to-Manager bridge at all. The queue
removed the call instead of bridging it. The pillar list stays a list of
things the business would recognize.

## What the collaboration actually was

Reading back over the week, the division of labor is clear, and neither half
works alone. The AI did the things machines are good at being honest about:
it audited every send site and filed the gaps against its own code, it
counted the nine-fold duplication instead of defending it, it measured the
cost of the inline write instead of guessing at it, and it enumerated crash
windows down to the save call. I did the things a human owner is for: holding the layering
line when the fix tried to climb into the Manager, naming the exceptions the
rules needed, insisting the flow stay generic until content, and pinning the
factory to the right end of the pipe. The contract-review rule is what gave
those judgments a place to land *before* the code existed — and every decision
was written down where the next session, or the next engineer, will trip over
it.

The result is a flow that is fast where a person is waiting, durable
everywhere else, and boring in the best way: a crash before the commit means
nothing happened; a crash after it means the notification is rows on disk,
waiting for the drainer; five failed delivery attempts dead-letter the row
onto an admin page instead of into the void. Never missing a notification
turned out not to require a notification pillar. It required a transaction, a
queue, and two reviewers — one of whom writes the code, and one of whom reads
the contracts.
