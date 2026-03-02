# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:** blue (primary), amber (secondary), zinc (neutral)
**Fonts:** Inter (heading + body), JetBrains Mono (code/technical)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with responsive sidebar handling
- `MainNav.tsx` — Navigation sidebar with logo, cost indicator, nav items, theme toggle
- `UserMenu.tsx` — User menu with avatar/initials and name

**Wire Up Navigation:**

Connect navigation to your routing:

- **Dashboard** → `/` (LayoutDashboard icon)
- **Tasks** → `/tasks` (ListChecks icon)
- **Settings** → `/settings` (Settings icon)

Note: Task Detail (`/tasks/:id`) is accessed by clicking a task — it's not a top-level nav item.

**User Menu:**

The user menu expects:
- User name
- Avatar URL (optional — falls back to initials)
- No logout needed (local-only app)

**Cost Indicator:**

The sidebar shows a daily cost badge. Pass `costToday` as a formatted string (e.g., "$0.42").

**Theme Toggle:**

The sidebar includes a theme toggle (Sun/Moon icon) that switches between light and dark mode using the `dark` class on `<html>` and `localStorage`.

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (Inter + JetBrains Mono fonts, blue/amber/zinc colors)
- [ ] Shell renders with collapsible sidebar
- [ ] Navigation links to correct routes (Dashboard, Tasks, Settings)
- [ ] User menu shows user info with initials avatar
- [ ] Cost indicator badge visible in sidebar
- [ ] Theme toggle switches between light and dark mode
- [ ] Responsive: full sidebar on desktop, collapsed on tablet, hamburger menu on mobile
