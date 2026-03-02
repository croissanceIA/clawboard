# Test Specs: Tasks

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Tasks page is a tabbed interface with 5 tabs: Tasks (Kanban), Templates, Schedules, Pre-instructions, and Archives.

---

## User Flow Tests

### Flow 1: View Kanban Board

**Scenario:** User views task cards organized by status

**Setup:**
- 6 cron jobs across different statuses
- 6 templates linked to some jobs

**Steps:**
1. User navigates to Tasks page with "tasks" tab active

**Expected Results:**
- [ ] Tab bar shows "Tasks", "Templates", "Schedules", "Pre-instructions", "Archives"
- [ ] Tab counters show correct counts (e.g., "Tasks (6)")
- [ ] 5 Kanban columns are visible: Planifié, En attente, En cours, Terminé, Échoué
- [ ] Task cards show template name, skill badge, frequency label, and last run time
- [ ] Cards without a linked template show "No template" warning badge

### Flow 2: Filter Kanban by Status

**Steps:**
1. User clicks "Échoué" filter button

**Expected Results:**
- [ ] Only the "Échoué" column is visible
- [ ] Column displays wider (w-72 instead of flex-1)
- [ ] Other columns are hidden

### Flow 3: Create a Template

**Steps:**
1. User clicks "New template" button
2. User fills in: name "Test Template", instructions "Run test task"
3. User clicks "Create template"

**Expected Results:**
- [ ] Modal opens with title "New template"
- [ ] Form has fields: Name, Skill name, Instructions, Pre-instructions, Agent, Delivery channel, Recipient, Model
- [ ] "Create template" button is disabled when name or instructions are empty
- [ ] On submit, `onCreateTemplate` is called with form data
- [ ] Modal closes after submit

### Flow 4: Edit a Template

**Steps:**
1. User hovers over a template card
2. User clicks the three-dot menu icon
3. User clicks "Edit"
4. User modifies the name
5. User clicks "Save changes"

**Expected Results:**
- [ ] Three-dot menu appears on hover
- [ ] Menu shows: Edit, Run now, Delete
- [ ] Modal opens with title "Edit template" and pre-filled form
- [ ] `onUpdateTemplate` is called with template id and updates

### Flow 5: Run Template Now

**Steps:**
1. User clicks "Run now" on a template card

**Expected Results:**
- [ ] Button shows "Running..." with spinner for 2 seconds
- [ ] `onRunNow` is called with the template ID

### Flow 6: Toggle Schedule On/Off

**Steps:**
1. User clicks the power toggle on an enabled schedule

**Expected Results:**
- [ ] `onToggleSchedule` is called with cronJobId and `false`
- [ ] Toggle button changes from green (enabled) to gray (disabled)

### Flow 7: Save Pre-instructions

**Steps:**
1. User switches to "Pre-instructions" tab
2. User modifies the textarea content
3. User clicks "Save"

**Expected Results:**
- [ ] Info banner explains that pre-instructions are prepended to every task
- [ ] Textarea uses monospace font (JetBrains Mono)
- [ ] Save button is disabled when content hasn't changed
- [ ] Save button turns blue when content is dirty
- [ ] After save, button briefly shows "Saved" in green
- [ ] `onSavePreInstructions` is called with the new content

### Flow 8: Browse Archives

**Steps:**
1. User switches to "Archives" tab
2. User clicks on an execution row to expand it

**Expected Results:**
- [ ] Table shows execution name, date, status badge, duration, and cost
- [ ] Clicking a row expands it to show log output in monospace
- [ ] Expanded row shows model, prompt tokens, completion tokens
- [ ] Copy button copies log content to clipboard

---

## Empty State Tests

### No Cron Jobs (Kanban)

**Setup:** `cronJobs` is `[]`

**Expected Results:**
- [ ] Each Kanban column shows "No tasks" placeholder

### No Templates

**Setup:** `templates` is `[]`

**Expected Results:**
- [ ] Shows "0 templates" counter
- [ ] "New template" button is still visible
- [ ] Grid is empty

### No Schedules

**Setup:** `cronJobs` is `[]`

**Expected Results:**
- [ ] Shows "No schedules configured. Create one to get started."

### No Archives

**Setup:** `executionLogs` is `[]`

**Expected Results:**
- [ ] Shows "No archived executions yet."

### Archives with No Filter Results

**Setup:** Search query that matches nothing

**Expected Results:**
- [ ] Shows "No executions match your filters."

---

## Edge Cases

- [ ] Templates with very long instruction text are truncated to 2 lines
- [ ] Cron jobs without linked templates show warning badge on Kanban card
- [ ] Consecutive errors > 0 shown on Kanban cards
- [ ] Schedule with disabled state shows strikethrough name and faded dot
- [ ] Archives sort by most recent first

---

## Accessibility Checks

- [ ] Tab bar is keyboard navigable
- [ ] Modal can be closed with Escape or backdrop click
- [ ] Form fields have proper labels
- [ ] Template action menu is accessible

---

## Sample Test Data

```typescript
const mockTemplate = {
  id: "tpl-001",
  name: "Synthèse quotidienne",
  skillName: "daily-synthesis",
  instructions: "Analyse les dernières 24h...",
  preInstructions: null,
  agentId: "main",
  deliveryChannel: "discord",
  deliveryRecipient: "1234567890",
  model: "openrouter/anthropic/claude-sonnet-4",
  cronJobId: "twitter-trends-daily",
  executionCount: 47,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-02-27T08:30:00Z",
};

const mockCronJob = {
  id: "twitter-trends-daily",
  templateId: "tpl-001",
  cronExpression: "0 7 * * *",
  timezone: "Europe/Paris",
  enabled: true,
  frequencyLabel: "Tous les jours à 7h",
  lastRunAtMs: 1740726000000,
  lastStatus: "ok" as const,
  nextRunAtMs: 1740812400000,
  consecutiveErrors: 0,
};
```
