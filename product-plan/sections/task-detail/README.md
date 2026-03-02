# Task Detail

## Overview

A single-column detail page for a specific task (cron job), accessible from the Kanban board or archives. Displays metadata, full instructions, an activity timeline, tabbed execution logs with cost breakdowns, and action buttons for re-running, editing, archiving, and deleting.

## User Flows

- Navigate to task detail from Kanban board or archives
- View task metadata: agent, status, dates, recurrence
- Read full assembled instructions
- Browse activity timeline (creation, status changes, dispatch, completion)
- Switch between execution logs (tabbed by date and status)
- View execution details: stdout, stderr, exit code, duration, tokens, cost
- Copy logs to clipboard
- Re-run the task ("Relancer")
- Quick-edit via modal (name, instructions, status, agent, scheduled date)
- Archive or delete the task

## Design Decisions

- Single-column layout for natural mobile stacking
- French UI labels (Relancer, Modifier, Archiver, Supprimer) for the target audience
- Activity timeline uses connected dots with color-coded event types
- Execution logs tabbed by date with status icons (green check / red x)
- Quick-edit modal shows recurring task banner when applicable
- Delete requires confirmation dialog

## Data Shapes

**Entities:** TaskDetail, Agent, ActivityEvent, ExecutionRun, TaskEditPayload

## Components Provided

- `TaskDetailView` — Main detail page with metadata, instructions, timeline, logs, and actions
- `ActivityTimeline` — Vertical timeline with connected dots and event descriptions
- `ExecutionLogs` — Tabbed execution viewer with stdout/stderr and stats
- `QuickEditModal` — Inline edit modal with form fields and recurring task banner

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSelectExecution` | User switches between execution tabs |
| `onRunAgain` | User clicks "Relancer" |
| `onEditTask` | User saves changes from quick-edit modal |
| `onArchiveTask` | User clicks "Archiver" |
| `onDeleteTask` | User confirms task deletion |
| `onCopyLogs` | User copies execution logs |
| `onNavigateBack` | User clicks back button |
