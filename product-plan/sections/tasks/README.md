# Tasks

## Overview

A single tabbed page that centralizes all task management for ClawBoard. Five tabs — Tasks (Kanban), Templates, Schedules, Pre-instructions, and Archives — let the user view cron statuses in real time, manage reusable task blueprints, configure recurring schedules visually, edit global pre-instructions, and browse past execution history.

## User Flows

- View all active cron jobs on a 5-column Kanban board (Planifié, En attente, En cours, Terminé, Échoué)
- Filter Kanban cards by status
- Browse templates as a card grid with CRUD operations via modal
- Preview assembled instructions (pre-instructions + template instructions) inside the modal
- View, create, edit, delete, and toggle schedules
- Edit global pre-instructions in a plain textarea
- Browse archived executions in expandable rows with logs, cost, and duration
- Trigger a one-shot "Run now" from a template card

## Design Decisions

- 5-column Kanban with color-coded columns (blue, amber, violet, emerald, red)
- Template cards show instruction excerpt (2 lines), skill badge, agent badge, execution counter
- Schedule list shows cron expression in monospace, linked template badge, model badge
- Archives table has expandable rows with full log output and copy button
- Tab bar shows item counts in parentheses for quick reference

## Data Shapes

**Entities:** Template, CronJob, ExecutionLog, PreInstruction, KanbanCard

## Components Provided

- `TasksPage` — Main tabbed page wrapper with tab bar and content switching
- `KanbanBoard` — 5-column Kanban with status filters and task cards
- `TemplatesGrid` — Card grid with create/edit modal and run-now action
- `ScheduleTimeline` — Schedule list with toggle, edit, delete actions
- `PreInstructionsEditor` — Textarea editor with save button and info banner
- `ArchivesTable` — Searchable table with expandable rows for execution logs

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onTabChange` | User switches tabs |
| `onCreateTemplate` | Template created via modal |
| `onUpdateTemplate` | Template updated via modal |
| `onDeleteTemplate` | Template deleted |
| `onRunNow` | "Run now" button clicked on a template |
| `onToggleSchedule` | Schedule toggled on/off |
| `onCreateSchedule` | New schedule created |
| `onUpdateSchedule` | Schedule updated |
| `onDeleteSchedule` | Schedule deleted |
| `onSavePreInstructions` | Pre-instructions saved |
| `onViewTaskDetail` | Task card clicked to view detail |
| `onFilterArchives` | Archive search/filter criteria change |
