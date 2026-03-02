# Milestone 5: Settings

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete

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

Implement the Settings page — a read-only configuration panel displaying environment variables and connection status indicators.

## Overview

The Settings page lets users see their ClawBoard configuration at a glance. It's intentionally read-only — users edit values by modifying `.env.local` and restarting the app. The page focuses on visibility: what's configured, what's connected, and what needs attention.

**Key Functionality:**
- View configuration values organized in sections (General, Paths, API Keys)
- See the OpenRouter API key masked with only last 4 characters visible
- Test the OpenRouter API connection with a single click
- View connection status indicators for all dependencies
- Copy any configuration value to clipboard
- Info banner explaining how to edit settings

## Components Provided

Copy from `product-plan/sections/settings/components/`:

- `Settings` — Main page with info banner, config sections, connection statuses
- `ConfigRow` — Single config entry row with copy and optional test button
- `ConnectionStatusList` — Dependency health checks with status dots

## Props Reference

**Data props:** `ConfigSection[]`, `ConnectionStatus[]`, `envFilePath`

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onTestOpenRouterConnection` | User clicks "Test Connection" |
| `onCopyValue` | User copies a config value |
| `onRecheckStatuses` | User clicks "Recheck" |

## Expected User Flows

### Flow 1: View Configuration

1. User navigates to Settings
2. User sees info banner about editing `.env.local`
3. User browses config sections
4. **Outcome:** User understands current configuration

### Flow 2: Test API Connection

1. User clicks "Test" on the OpenRouter API key row
2. **Outcome:** Connection test runs, result shown inline

### Flow 3: Copy a Config Value

1. User clicks copy button on a config row
2. **Outcome:** Value copied, checkmark shown briefly

## Empty States

- **No config sections:** Info banner still shows, no sections rendered

## Testing

See `product-plan/sections/settings/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/settings/README.md` — Feature overview
- `product-plan/sections/settings/tests.md` — UI behavior test specs
- `product-plan/sections/settings/components/` — React components
- `product-plan/sections/settings/types.ts` — TypeScript interfaces
- `product-plan/sections/settings/sample-data.json` — Test data
- `product-plan/sections/settings/*.png` — Visual references

## Done When

- [ ] All config sections render with real environment values
- [ ] API key is masked
- [ ] "Test Connection" triggers API validation
- [ ] Connection statuses load on page visit
- [ ] "Recheck" refreshes all statuses
- [ ] Copy buttons work on all config values
- [ ] Info banner displays with copyable file path
- [ ] Responsive on mobile
