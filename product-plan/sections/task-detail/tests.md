# Test Specs: Task Detail

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Task Detail page shows a single task's metadata, instructions, activity timeline, execution logs, and provides actions for re-running, editing, archiving, and deleting.

---

## User Flow Tests

### Flow 1: View Task Detail

**Scenario:** User navigates to a task detail page

**Setup:**
- Task with status "completed", recurring, with 4 execution runs

**Steps:**
1. User clicks a task card from the Kanban board

**Expected Results:**
- [ ] Back button shows "Tâches" with arrow icon
- [ ] Task name displayed as heading with status badge "Terminé" in green
- [ ] Template name shown below heading
- [ ] 4 metadata cards: Agent, Planifié, Créé, Récurrence
- [ ] Instructions displayed in monospace font
- [ ] Activity timeline shows chronological events with colored dots
- [ ] Execution logs show tabs for each run

### Flow 2: Re-run Task

**Steps:**
1. User clicks "Relancer" button

**Expected Results:**
- [ ] `onRunAgain` is called with the task ID

### Flow 3: Edit Task via Quick-Edit Modal

**Steps:**
1. User clicks "Modifier" button
2. Modal opens with pre-filled form
3. User changes the task name
4. User clicks "Enregistrer"

**Expected Results:**
- [ ] Modal title shows "Modifier la tâche"
- [ ] Form pre-filled with current task data
- [ ] For recurring tasks, amber banner: "Cette tâche fait partie d'une récurrence..."
- [ ] `onEditTask` called with task ID and updated payload
- [ ] Modal closes after save

### Flow 4: Delete Task

**Steps:**
1. User clicks "Supprimer"
2. Confirmation dialog appears
3. User clicks "Supprimer" in the dialog

**Expected Results:**
- [ ] Confirmation dialog shows: "Supprimer la tâche ?"
- [ ] Warning text mentions the task name and irreversibility
- [ ] "Annuler" button closes dialog without action
- [ ] "Supprimer" button calls `onDeleteTask` with task ID

### Flow 5: Copy Execution Logs

**Steps:**
1. User clicks "Copier" button on stdout section

**Expected Results:**
- [ ] `onCopyLogs` called with execution run ID
- [ ] Button text changes to "Copié !" for 2 seconds

### Flow 6: Switch Execution Tabs

**Steps:**
1. User clicks a different execution tab

**Expected Results:**
- [ ] `onSelectExecution` called with the run ID
- [ ] Active tab shows different background
- [ ] Content updates to show selected run's stdout/stderr/stats

---

## Empty State Tests

### No Execution Runs

**Setup:** `executionRuns` is `[]`

**Expected Results:**
- [ ] Shows "Aucune exécution disponible."

### No Scheduled Date

**Setup:** `task.scheduledAt` is `null`

**Expected Results:**
- [ ] "Planifié" metadata card shows "—"

### Non-Recurring Task

**Setup:** `task.isRecurring` is `false`

**Expected Results:**
- [ ] "Récurrence" metadata card shows "Aucune"
- [ ] Quick-edit modal does NOT show recurring task banner

---

## Component Interaction Tests

### ActivityTimeline

- [ ] Events displayed in chronological order with vertical connecting line
- [ ] Last event has no connecting line below it
- [ ] Each event type has correct color (blue=created, amber=dispatched, emerald=completed, red=failed)
- [ ] Timestamps formatted in French locale

### ExecutionLogs

- [ ] Tabs show date and status icon (green check or red x)
- [ ] Stats row shows duration, tokens, cost, exit code
- [ ] Exit code 0 shown in green, non-zero in red
- [ ] stdout in neutral styling, stderr in red styling

### QuickEditModal

- [ ] Form resets to current task values when opened
- [ ] Status dropdown shows all 6 options in French
- [ ] Backdrop click closes modal

---

## Edge Cases

- [ ] Very long task name truncates with ellipsis
- [ ] Very long instructions wrap correctly in monospace block
- [ ] Task with no template shows no "Modèle :" subtitle
- [ ] Execution with null tokens shows "—" for token counts
- [ ] Execution with null cost shows "—"

---

## Accessibility Checks

- [ ] Back button is keyboard accessible
- [ ] Modal traps focus when open
- [ ] Form fields have proper labels
- [ ] Confirmation dialog is keyboard navigable

---

## Sample Test Data

```typescript
const mockTask = {
  id: "cron-twitter-trends",
  name: "Twitter Trends Daily",
  status: "completed" as const,
  agent: { id: "main", name: "Main Agent", avatarUrl: null },
  templateId: "tpl-twitter-trends",
  templateName: "Synthèse Twitter Trends",
  cronExpression: "0 7 * * *",
  frequencyLabel: "Tous les jours à 7h",
  timezone: "Europe/Paris",
  enabled: true,
  isRecurring: true,
  scheduledAt: "2026-02-28T07:00:00Z",
  createdAt: "2026-01-15T10:30:00Z",
  completedAt: "2026-02-28T07:04:32Z",
  lastRunAtMs: 1740726272000,
  nextRunAtMs: 1740812400000,
  consecutiveErrors: 0,
  instructions: "Analyse les tendances Twitter France du jour.",
  model: "openrouter/anthropic/claude-sonnet-4",
};
```
