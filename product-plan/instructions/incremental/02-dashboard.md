# Milestone 2: Dashboard

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

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

Implement the Dashboard — the home page providing an at-a-glance overview of today's task activity, execution costs, recent runs, and active failures.

## Overview

The Dashboard gives users immediate visibility into their scheduled task ecosystem. At a glance, they can see how many tasks completed today, which ones failed, what's running next, and how much it all costs.

**Key Functionality:**
- View 4 stat counters: completed today, failed count, next scheduled run, active crons
- View cost indicator with today's spend, monthly total, and trend vs yesterday
- Browse the 10 most recent executions with status, timing, duration, and cost
- See failure alerts for currently failed tasks with error details
- Search across task names and template names
- Click on executions or alerts to navigate to Task Detail

## Components Provided

Copy the section components from `product-plan/sections/dashboard/components/`:

- `Dashboard` — Main layout with search, stats, cost, alerts, and execution list
- `StatCard` — Individual stat counter card
- `CostIndicator` — Cost summary with daily/monthly and trend badge
- `AlertsSection` — Failed tasks alert panel
- `ExecutionRow` — Single execution row

## Props Reference

**Data props:** `DashboardStats`, `CostSummary`, `RecentExecution[]`, `FailureAlert[]`

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSearch` | User types in the global search bar |
| `onExecutionClick` | User clicks on a recent execution row |
| `onAlertClick` | User clicks "View" on a failure alert |

## Expected User Flows

### Flow 1: View Daily Overview

1. User navigates to the dashboard (home page)
2. User sees 4 stat cards with today's activity
3. User sees cost indicator with today and monthly totals
4. **Outcome:** User understands current task health at a glance

### Flow 2: Investigate a Failure

1. User sees the red alerts section with a failed task
2. User clicks on the failure alert
3. **Outcome:** User is navigated to the Task Detail page for that task

### Flow 3: Review Recent Execution

1. User browses the recent executions list
2. User clicks on an execution row
3. **Outcome:** User is navigated to the Task Detail page for that execution

## Empty States

- **No executions:** "No executions yet. Tasks will appear here once they run."
- **No failures:** Alerts section is hidden entirely (not shown as empty)

## Testing

See `product-plan/sections/dashboard/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/dashboard/README.md` — Feature overview
- `product-plan/sections/dashboard/tests.md` — UI behavior test specs
- `product-plan/sections/dashboard/components/` — React components
- `product-plan/sections/dashboard/types.ts` — TypeScript interfaces
- `product-plan/sections/dashboard/sample-data.json` — Test data
- `product-plan/sections/dashboard/*.png` — Visual references

## Done When

- [ ] Components render with real data
- [ ] Empty states display properly when no records exist
- [ ] All callback props are wired to working functionality
- [ ] User can search, click executions, and click alerts
- [ ] Cost indicator shows correct trend direction and color
- [ ] Matches the visual design (see screenshots)
- [ ] Responsive on mobile
