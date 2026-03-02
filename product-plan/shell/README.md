# Application Shell

## Overview

ClawBoard uses a collapsible sidebar layout optimized for a dashboard/ops tool. The sidebar provides quick access to all main sections with icons and labels, and can collapse to icon-only mode to maximize content space. A persistent cost indicator lives in the sidebar header.

## Navigation Structure

- **Dashboard** (LayoutDashboard icon) — Home with counters, recent executions, alerts
- **Tasks** (ListChecks icon) — Tabbed page with Kanban, Templates, Schedules, Pre-instructions, Archives
- **Settings** (Settings icon) — Configuration panel

Note: Task Detail is accessed by clicking a task from the Tasks page — it is not a top-level nav item.

## Components Provided

- `AppShell` — Main layout wrapper with responsive sidebar handling (desktop/tablet/mobile)
- `MainNav` — Navigation sidebar with logo, cost indicator, nav items, theme toggle, and user menu
- `UserMenu` — User avatar with initials fallback and name display

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onNavigate` | User clicks a navigation item |
| `onToggleCollapse` | User clicks the collapse/expand button |

## Responsive Behavior

- **Desktop (>=1024px):** Full sidebar, collapsible via toggle button
- **Tablet (768-1023px):** Sidebar starts collapsed (icon-only), expandable
- **Mobile (<768px):** Sidebar hidden, accessible via hamburger menu in a top bar. Overlay sidebar slides in from left.

## Design Notes

- Sidebar background: zinc-50 (light), zinc-900 (dark)
- Active nav item: blue-50/blue-600 (light), blue-950/blue-400 (dark)
- Cost badge uses amber accent color
- Collapse animation: smooth 200ms transition on width
- Theme toggle in sidebar footer (Sun/Moon icons)
