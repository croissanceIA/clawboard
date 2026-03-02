# Test Specs: Dashboard

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Dashboard is the home page showing task activity summaries, costs, recent executions, and failure alerts.

---

## User Flow Tests

### Flow 1: View Dashboard Overview

**Scenario:** User lands on the dashboard and sees current activity

**Setup:**
- Dashboard has stats: 4/6 completed, 1 failed, 3 active crons
- Cost summary: $0.42 today, $8.73 this month, -17.6% trend
- 10 recent executions
- 1 failure alert

**Steps:**
1. User navigates to the dashboard

**Expected Results:**
- [ ] Shows stat card "Completed" with value "4/6" and sub "tasks today"
- [ ] Shows stat card "Failed" with value "1" in red text
- [ ] Shows stat card "Next run" with formatted time and task name
- [ ] Shows stat card "Active crons" with value "3"
- [ ] Shows cost indicator with "$0.42" as today's cost
- [ ] Shows cost indicator with "$8.73" as month's cost
- [ ] Shows trend badge "-17.6%" in green (decrease)
- [ ] Shows failure alerts section with 1 failed task
- [ ] Shows 10 execution rows with status dots, names, times, and costs

### Flow 2: Search Tasks

**Scenario:** User searches for a specific task

**Steps:**
1. User types "twitter" in the search bar
2. `onSearch` callback fires with "twitter"

**Expected Results:**
- [ ] Search input shows placeholder "Search tasks and templates..."
- [ ] `onSearch` is called with the search query string

### Flow 3: Navigate to Execution Detail

**Scenario:** User clicks on a recent execution

**Steps:**
1. User clicks on the "twitter-trends-daily" execution row

**Expected Results:**
- [ ] `onExecutionClick` is called with the execution ID

### Flow 4: Navigate to Failed Task

**Scenario:** User clicks on a failure alert

**Steps:**
1. User clicks on the "memory-daily" failure alert

**Expected Results:**
- [ ] `onAlertClick` is called with the cronJobId "memory-daily"

---

## Empty State Tests

### No Executions

**Setup:** `recentExecutions` is `[]`

**Expected Results:**
- [ ] Shows message "No executions yet. Tasks will appear here once they run."

### No Failure Alerts

**Setup:** `failureAlerts` is `[]`

**Expected Results:**
- [ ] Alerts section is not rendered (hidden)

---

## Component Interaction Tests

### StatCard

- [ ] Displays label, value, and sub-text correctly
- [ ] When `accent` is true, value text is red
- [ ] Icon hover state shows blue tint

### CostIndicator

- [ ] Negative trend shows green badge with TrendingDown icon
- [ ] Positive trend shows red badge with TrendingUp icon
- [ ] Formats dollar amounts to 2 decimal places

### ExecutionRow

- [ ] Shows green dot for "ok" status, red dot for "failed"
- [ ] Task name in monospace font
- [ ] Formats duration correctly (e.g., "14s", "2m 5s")
- [ ] Formats cost as "$0.12"

### AlertsSection

- [ ] Shows count: "1 failed task" (singular) or "3 failed tasks" (plural)
- [ ] Shows task name in monospace
- [ ] Shows error message text
- [ ] Shows consecutive error count when > 1

---

## Edge Cases

- [ ] Handles very long task names with text truncation
- [ ] Cost of $0.00 displays correctly
- [ ] Trend of exactly 0% shows as "+0.0%"
- [ ] All execution timestamps format correctly for today vs previous days

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Search input has proper placeholder text
- [ ] Status dots have sufficient color contrast
- [ ] Execution rows are full-width buttons for proper click targets

---

## Sample Test Data

```typescript
const mockStats = {
  completedToday: 4,
  totalToday: 6,
  failedCount: 1,
  nextRun: { taskName: "twitter-trends-daily", scheduledAt: "2026-02-28T14:00:00Z" },
  activeCrons: 3,
};

const mockCostSummary = {
  todayUsd: 0.42,
  monthUsd: 8.73,
  yesterdayUsd: 0.51,
  trendPercent: -17.6,
};

const mockExecution = {
  id: "exec-001",
  taskName: "twitter-trends-daily",
  cronJobId: "twitter-trends-daily",
  status: "ok" as const,
  executedAt: "2026-02-28T07:00:12Z",
  durationMs: 14320,
  costUsd: 0.12,
  model: "openrouter/moonshotai/kimi-k2.5",
};
```
