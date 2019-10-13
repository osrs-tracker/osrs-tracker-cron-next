[![Build Status](https://travis-ci.com/osrs-tracker/osrs-tracker-cron-next.svg?branch=master)](https://travis-ci.com/osrs-tracker/osrs-tracker-cron-next)

# OSRS Tracker Cron NEXT

There are two kind of jobs that the OSRS Tracker Cron executes: [Common](#common-jobs) and [Agenda](#agenda-jobs) jobs.

## Agenda jobs

These are jobs that are executed using [Agenda](https://github.com/agenda/agenda).

The reason we use Agenda to schedule these jobs is because the jobs wil only be executed once, even across replicas. This is especially useful for **queueing jobs**.

We can be 100% sure we won't have doubly queued players or items if we use Agenda jobs.

> Agenda uses a state in MongoDB to prevent double executions.

### Queue Items

TODO

## Common jobs

Common jobs are jobs that run using [node-cron](https://github.com/kelektiv/node-cron).

These jobs will run at certain intervals, completely independent of other replicas. This is especially useful for **processing jobs**.

This means the more replicas there are, the faster the queue will be processed.

> The replicas should run on a different ip-address, otherwise we might get blocked from using the OSRS Tracker API.

### Process Items

TODO
