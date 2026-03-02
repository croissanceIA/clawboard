# ClawBoard — Product Overview

## Summary

ClawBoard is a local web dashboard that serves as a visual control layer on top of OpenClaw's native cron system. It lets you define reusable task templates, manage cron schedules through a UI instead of raw JSON, track execution logs with real costs via the OpenRouter API, and manually dispatch one-shot tasks — all without replacing the underlying OpenClaw scheduler.

## Planned Sections

1. **Dashboard** — Home page with daily/monthly cost indicator, task counters (completed/total, failed), next scheduled task, last 10 executions with status, failure alerts, and global search bar.
2. **Tasks** — Tabbed page with five tabs: Tasks (Kanban view of crons by status), Templates (card grid with CRUD), Schedules (cron management with natural-language frequency and toggle), Pre-instructions (markdown editor), and Archives (searchable past executions).
3. **Task Detail** — Detail page for a single task showing agent info, status, dates, instructions, activity timeline, execution logs with copy button, and a "Run Again" action. Includes a quick-edit modal.
4. **Settings** — Configuration panel for environment variables, OpenRouter API key management, and connection status indicators.

## Product Entities

- **Template** — A reusable task blueprint bundling instructions, skill name, pre-instructions, delivery config, and target agent
- **CronJob** — A scheduled job entry from `cron/jobs.json` with cron expression, enabled flag, and execution state
- **ExecutionLog** — An enriched record of a single task execution with stdout/stderr, exit code, duration, token usage, and cost
- **PreInstruction** — A global markdown block prepended to every task sent to the agent
- **Agent** — The OpenClaw agent that receives and executes tasks

## Design System

**Colors:**
- Primary: blue — Buttons, links, active states
- Secondary: amber — Cost badges, warnings, highlights
- Neutral: zinc — Backgrounds, text, borders

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Shell** — Set up design tokens and application shell (collapsible sidebar, navigation, theme toggle)
2. **Dashboard** — Home page with stat counters, cost indicator, recent executions, and failure alerts
3. **Tasks** — Tabbed page with Kanban board, template management, schedule management, pre-instructions editor, and archives
4. **Task Detail** — Single task detail with metadata, instructions, activity timeline, and execution logs
5. **Settings** — Read-only configuration panel with connection status indicators

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
