# ClawBoard — Complete Implementation Instructions

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

## Testing

Each section includes a `tests.md` file with UI behavior test specs. These are **framework-agnostic** — adapt them to your testing setup.

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

## Product Overview

ClawBoard is a local web dashboard that serves as a visual control layer on top of OpenClaw's native cron system. It lets you define reusable task templates, manage cron schedules through a UI, track execution logs with real costs via the OpenRouter API, and manually dispatch one-shot tasks.

### Planned Sections

1. **Dashboard** — Home page with stat counters, cost indicator, recent executions, and failure alerts
2. **Tasks** — Tabbed page with Kanban board, template management, schedule management, pre-instructions, and archives
3. **Task Detail** — Single task detail with metadata, instructions, activity timeline, and execution logs
4. **Settings** — Read-only configuration panel with connection status indicators

### Product Entities

- **Template** — Reusable task blueprint with instructions, skill, delivery config, and agent
- **CronJob** — Scheduled job from `cron/jobs.json` with expression, enabled flag, execution state
- **ExecutionLog** — Execution record with stdout/stderr, exit code, duration, tokens, cost
- **PreInstruction** — Global markdown prepended to every task
- **Agent** — The OpenClaw agent that executes tasks

### Design System

- **Colors:** blue (primary), amber (secondary), zinc (neutral)
- **Fonts:** Inter (heading + body), JetBrains Mono (code/technical)

---

# Milestone 1: Shell

Set up the design tokens and application shell.

- Configure fonts (Inter + JetBrains Mono via Google Fonts) and colors (blue/amber/zinc)
- Implement collapsible sidebar with navigation: Dashboard (/), Tasks (/tasks), Settings (/settings)
- Include cost indicator badge, theme toggle (light/dark), and user menu with initials avatar
- Responsive: full sidebar on desktop, collapsed on tablet, hamburger on mobile

See `product-plan/shell/` for components and `product-plan/design-system/` for tokens.

---

# Milestone 2: Dashboard

Implement the home page with at-a-glance overview.

- 4 stat counters: completed today, failed count, next run, active crons
- Cost indicator with today/monthly spend and trend percentage
- 10 most recent executions with status dot, name, duration, time, cost
- Failure alerts section (hidden when no failures)
- Global search bar
- Click execution or alert → navigate to Task Detail

See `product-plan/sections/dashboard/` for components, types, sample data, and test specs.

---

# Milestone 3: Tasks

Implement the tabbed task management page.

**5 tabs:**
1. **Tasks** — Kanban board with 5 columns (Planifié, En attente, En cours, Terminé, Échoué), status filters, click to detail
2. **Templates** — Card grid with CRUD modal, assembled instructions preview, "Run now" button
3. **Schedules** — List with toggle on/off, create/edit/delete, cron expression display
4. **Pre-instructions** — Textarea editor with save button, info banner
5. **Archives** — Expandable table with search, template filter, log viewer, copy button

See `product-plan/sections/tasks/` for components, types, sample data, and test specs.

---

# Milestone 4: Task Detail

Implement the single-task detail page.

- Back navigation to tasks list
- Task name with status badge, template name subtitle
- 4 metadata cards: Agent, Planifié, Créé, Récurrence
- Full instructions in monospace block
- Activity timeline with colored dots (created, dispatched, completed, failed)
- Tabbed execution logs: stdout/stderr, exit code, duration, tokens, cost, copy button
- Actions: Relancer (re-run), Modifier (quick-edit modal), Archiver, Supprimer (with confirmation)
- Quick-edit modal shows recurring task banner when applicable

See `product-plan/sections/task-detail/` for components, types, sample data, and test specs.

---

# Milestone 5: Settings

Implement the read-only configuration panel.

- Info banner explaining how to edit settings (.env.local)
- 3 config sections: General, Paths, API Keys & Connections
- Each setting row: label, description, monospace value, copy button
- API key masked (last 4 chars visible), "Test Connection" button
- Connection status list: green/red/gray dots with detail text and timestamps
- "Recheck" button to refresh all statuses

See `product-plan/sections/settings/` for components, types, sample data, and test specs.
