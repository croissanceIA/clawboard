# Test Specs: Settings

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Settings page displays read-only configuration values and connection status indicators.

---

## User Flow Tests

### Flow 1: View Configuration

**Scenario:** User views all configuration values

**Setup:**
- 3 config sections: General, Paths, API Keys
- 5 connection statuses

**Steps:**
1. User navigates to Settings page

**Expected Results:**
- [ ] Info banner visible: "Settings are read from your environment file..."
- [ ] `.env.local` file path displayed in monospace with copy button
- [ ] "General" section shows Port, Default Agent, Execution Timeout
- [ ] "Paths" section shows OpenClaw CLI Path, Skills Directory, BRAIN Directory
- [ ] "API Keys & Connections" section shows OpenRouter API Key masked
- [ ] All values displayed in monospace font

### Flow 2: Copy Configuration Value

**Steps:**
1. User clicks copy button on "Application Port" row

**Expected Results:**
- [ ] `onCopyValue` called with key "PORT" and value "3333"
- [ ] Copy icon changes to checkmark for 2 seconds

### Flow 3: Test OpenRouter Connection

**Steps:**
1. User clicks "Test" button next to OpenRouter API Key

**Expected Results:**
- [ ] `onTestOpenRouterConnection` is called
- [ ] Test button only appears on the OpenRouter API Key row

### Flow 4: Recheck Connection Statuses

**Steps:**
1. User clicks "Recheck" button

**Expected Results:**
- [ ] `onRecheckStatuses` is called

---

## Empty State Tests

### No Config Sections

**Setup:** `configSections` is `[]`

**Expected Results:**
- [ ] Info banner still shows
- [ ] No config sections rendered
- [ ] Connection statuses still visible

---

## Component Interaction Tests

### ConfigRow

- [ ] Label and description displayed
- [ ] Value in monospace with copy button
- [ ] Test button only shown when `showTestButton` is true
- [ ] Masked values display correctly

### ConnectionStatusList

- [ ] Green dot for "connected" status
- [ ] Red dot for "error" status
- [ ] Gray dot for "unchecked" status
- [ ] Error status detail text in red
- [ ] Timestamps shown on desktop, hidden on mobile

---

## Edge Cases

- [ ] Very long config values truncate with ellipsis
- [ ] Very long file paths truncate in info banner
- [ ] Connection status with very long detail text truncates

---

## Accessibility Checks

- [ ] Copy buttons have title attributes
- [ ] Test button has accessible label (sr-only on mobile)
- [ ] Status dots are supplemented by text status details

---

## Sample Test Data

```typescript
const mockConfigSection = {
  id: "general",
  title: "General",
  entries: [
    { key: "PORT", label: "Application Port", value: "3333", description: "Port ClawBoard runs on" },
  ],
};

const mockConnectionStatus = {
  id: "openclaw-cli",
  name: "OpenClaw CLI",
  status: "connected" as const,
  detail: "v2.4.1",
  checkedAt: "2026-02-28T10:32:15Z",
};
```
