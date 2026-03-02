# Milestone 4: Task Detail

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-3 complete

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Implement the Task Detail page — a single-column detail view for a specific task showing metadata, instructions, activity timeline, execution logs, and action buttons.

## Overview

The Task Detail page gives users deep visibility into a single task's lifecycle. They can see its current state, read its full instructions, trace its activity history, inspect execution logs with cost details, and take actions like re-running, editing, or deleting.

**Key Functionality:**
- View task metadata: agent, status badge, scheduled/created/completed dates, recurrence
- Read full assembled instructions in monospace block
- Browse activity timeline with chronological events (created, dispatched, completed, failed)
- Switch between execution logs via tabs (one per run, showing date + status)
- View execution details: stdout, stderr, exit code, duration, tokens, cost
- Copy execution logs to clipboard
- Re-run task ("Relancer"), edit via modal, archive, or delete with confirmation

## Components Provided

Copy from `product-plan/sections/task-detail/components/`:

- `TaskDetailView` — Main detail page layout
- `ActivityTimeline` — Vertical timeline with connected dots
- `ExecutionLogs` — Tabbed execution log viewer
- `QuickEditModal` — Edit modal with form fields and recurring task banner

## Props Reference

**Data props:** `TaskDetail`, `ActivityEvent[]`, `ExecutionRun[]`, `activeExecutionId`

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSelectExecution` | User switches execution tabs |
| `onRunAgain` | User clicks "Relancer" |
| `onEditTask` | User saves quick-edit modal |
| `onArchiveTask` | User clicks "Archiver" |
| `onDeleteTask` | User confirms deletion |
| `onCopyLogs` | User copies logs |
| `onNavigateBack` | User clicks back button |

## Expected User Flows

### Flow 1: Inspect Task Details

1. User clicks a task card from the Kanban board
2. User sees task name, status badge, and metadata
3. User reads the full instructions
4. User browses the activity timeline
5. **Outcome:** User understands the task's lifecycle

### Flow 2: Review Execution Logs

1. User scrolls to the execution logs section
2. User clicks different tabs to compare runs
3. User copies a log output
4. **Outcome:** User has the log content in their clipboard

### Flow 3: Re-run a Task

1. User clicks "Relancer"
2. **Outcome:** Task is dispatched for immediate execution

### Flow 4: Edit a Task

1. User clicks "Modifier"
2. User updates the task name or instructions
3. User clicks "Enregistrer"
4. **Outcome:** Task is updated, modal closes

## Empty States

- **No executions:** "Aucune exécution disponible."
- **No scheduled date:** Metadata card shows "—"
- **Non-recurring task:** Recurrence card shows "Aucune"

## Testing

See `product-plan/sections/task-detail/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/task-detail/README.md` — Feature overview
- `product-plan/sections/task-detail/tests.md` — UI behavior test specs
- `product-plan/sections/task-detail/components/` — React components
- `product-plan/sections/task-detail/types.ts` — TypeScript interfaces
- `product-plan/sections/task-detail/sample-data.json` — Test data
- `product-plan/sections/task-detail/*.png` — Visual references

## Done When

- [ ] Components render with real data
- [ ] Back navigation works
- [ ] Status badge displays correct label and color
- [ ] Activity timeline renders events chronologically with colored dots
- [ ] Execution log tabs switch correctly
- [ ] Copy logs to clipboard works
- [ ] "Relancer" dispatches task
- [ ] Quick-edit modal saves changes
- [ ] Delete requires confirmation
- [ ] Recurring task banner shown in edit modal when applicable
- [ ] Responsive on mobile
