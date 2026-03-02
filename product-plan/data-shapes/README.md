# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities

- **DashboardStats** — Summary counters for today's task activity (used in: dashboard)
- **CostSummary** — Aggregated cost data with daily/monthly spend and trend (used in: dashboard)
- **RecentExecution** — A single execution record from recent history (used in: dashboard)
- **FailureAlert** — An active failure needing attention (used in: dashboard)
- **Template** — A reusable task blueprint (used in: tasks)
- **CronJob** — A scheduled job entry (used in: tasks)
- **ExecutionLog** — An enriched execution record (used in: tasks)
- **PreInstruction** — Global markdown prepended to every task (used in: tasks)
- **TaskDetail** — A hydrated view of a single cron job (used in: task-detail)
- **Agent** — The agent that executes tasks (used in: task-detail)
- **ActivityEvent** — A lifecycle event in a task's timeline (used in: task-detail)
- **ExecutionRun** — A single execution with full details (used in: task-detail)
- **ConfigEntry** — A configuration key-value pair (used in: settings)
- **ConfigSection** — A grouped section of config entries (used in: settings)
- **ConnectionStatus** — A health check result for a dependency (used in: settings)

## Per-Section Types

Each section includes its own `types.ts` with the full interface definitions:

- `sections/dashboard/types.ts`
- `sections/tasks/types.ts`
- `sections/task-detail/types.ts`
- `sections/settings/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.
