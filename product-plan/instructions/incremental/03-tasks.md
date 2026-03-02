# Milestone 3: Tasks

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete, plus Milestone 2 (Dashboard)

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

Implement the Tasks page — a tabbed interface that centralizes all task management with Kanban board, template management, schedule management, pre-instructions editor, and execution archives.

## Overview

The Tasks page is ClawBoard's command center. Five tabs give users everything they need to manage their automated task ecosystem: see task statuses at a glance on a Kanban board, create and manage reusable templates, configure recurring schedules, set global pre-instructions, and browse past execution history.

**Key Functionality:**
- View cron jobs on a 5-column Kanban board (Planifié, En attente, En cours, Terminé, Échoué)
- Filter Kanban cards by status column
- Create, edit, delete templates via modal with assembled instructions preview
- Trigger one-shot "Run now" from any template
- View, create, edit, delete, and toggle schedules on/off
- Edit global pre-instructions in a plain textarea
- Browse archived executions in expandable rows with full logs

## Components Provided

Copy from `product-plan/sections/tasks/components/`:

- `TasksPage` — Main tabbed page wrapper
- `KanbanBoard` — 5-column Kanban with filters
- `TemplatesGrid` — Card grid with create/edit modal
- `ScheduleTimeline` — Schedule list with toggle/edit/delete
- `PreInstructionsEditor` — Textarea editor with save
- `ArchivesTable` — Expandable table with search and filters

## Props Reference

**Data props:** `Template[]`, `CronJob[]`, `ExecutionLog[]`, `PreInstruction`, `TabId`

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onTabChange` | User switches tabs |
| `onCreateTemplate` | Template created via modal |
| `onUpdateTemplate` | Template updated |
| `onDeleteTemplate` | Template deleted |
| `onRunNow` | "Run now" clicked on template |
| `onToggleSchedule` | Schedule toggled on/off |
| `onCreateSchedule` | New schedule created |
| `onUpdateSchedule` | Schedule updated |
| `onDeleteSchedule` | Schedule deleted |
| `onSavePreInstructions` | Pre-instructions saved |
| `onViewTaskDetail` | Task card clicked |
| `onFilterArchives` | Archive filters changed |

## Expected User Flows

### Flow 1: View Task Status on Kanban

1. User navigates to Tasks page (Tasks tab active)
2. User sees cron jobs organized in 5 columns by status
3. User optionally filters by a specific status
4. User clicks a task card
5. **Outcome:** Navigated to Task Detail page

### Flow 2: Create a New Template

1. User switches to Templates tab
2. User clicks "New template"
3. User fills in name, instructions, skill name, delivery config
4. User previews assembled instructions
5. User clicks "Create template"
6. **Outcome:** New template appears in the grid

### Flow 3: Run a Template Now

1. User clicks "Run now" on a template card
2. Button shows "Running..." with spinner
3. **Outcome:** Task dispatched via CLI, feedback shown

### Flow 4: Manage Schedules

1. User switches to Schedules tab
2. User toggles a schedule off
3. **Outcome:** Schedule disabled, visual feedback shown

## Empty States

- **Kanban with no jobs:** Each column shows "No tasks" placeholder
- **No templates:** "0 templates" counter, empty grid, "New template" button visible
- **No schedules:** "No schedules configured. Create one to get started."
- **No archives:** "No archived executions yet."

## Testing

See `product-plan/sections/tasks/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/tasks/README.md` — Feature overview
- `product-plan/sections/tasks/tests.md` — UI behavior test specs
- `product-plan/sections/tasks/components/` — React components
- `product-plan/sections/tasks/types.ts` — TypeScript interfaces
- `product-plan/sections/tasks/sample-data.json` — Test data
- `product-plan/sections/tasks/*.png` — Visual references

## Done When

- [ ] All 5 tabs render correctly with real data
- [ ] Kanban board shows cards in correct columns
- [ ] Template CRUD works via modal
- [ ] "Run now" dispatches task with visual feedback
- [ ] Schedule toggle, create, edit, delete all functional
- [ ] Pre-instructions save correctly
- [ ] Archives expand to show logs with copy button
- [ ] Empty states display properly
- [ ] Responsive on mobile
