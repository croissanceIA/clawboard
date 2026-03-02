# Dashboard

## Overview

The Dashboard is ClawBoard's home page, providing an at-a-glance overview of today's task activity, execution costs, recent runs, and active failures. It features a global search bar, four stat counters, a cost indicator with daily/monthly totals and trend, a dedicated alerts section for failed tasks, and a list of the 10 most recent executions.

## User Flows

- View four stat counters: tasks completed today, failed task count, next scheduled run, and total active crons
- View cost indicator showing today's spend, month total, and trend vs yesterday
- Browse the 10 most recent executions with status, time, cost, and duration
- See failure alerts for currently failed tasks
- Use global search to find tasks and templates
- Click on an execution or alert to navigate to Task Detail

## Design Decisions

- Cost indicator uses amber accent for financial data prominence
- Failure alerts use red styling to draw immediate attention
- Task names displayed in monospace (JetBrains Mono) for technical readability
- Status dots use glowing shadows for visual distinction
- Trend badge shows green for cost decrease, red for increase

## Data Shapes

**Entities:** DashboardStats, CostSummary, RecentExecution, FailureAlert

## Components Provided

- `Dashboard` — Main dashboard layout with search, stats, cost, alerts, and executions
- `StatCard` — Individual stat counter card with label, value, sub-text, and icon
- `CostIndicator` — Cost summary with daily/monthly amounts and trend badge
- `AlertsSection` — Failed tasks alert panel with red styling
- `ExecutionRow` — Single execution row with status dot, name, time, duration, and cost

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSearch` | User types in the global search bar |
| `onExecutionClick` | User clicks on a recent execution row |
| `onAlertClick` | User clicks "View" on a failure alert |
