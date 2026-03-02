// =============================================================================
// UI Data Shapes — Combined Reference
//
// These types define the data that UI components expect to receive as props.
// They are a frontend contract, not a database schema. How you model, store,
// and fetch this data is an implementation decision.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/dashboard
// -----------------------------------------------------------------------------

export type DashboardExecutionStatus = 'ok' | 'failed'

export interface DashboardStats {
  completedToday: number
  totalToday: number
  failedCount: number
  nextRun: { taskName: string; scheduledAt: string }
  activeCrons: number
}

export interface CostSummary {
  todayUsd: number
  monthUsd: number
  yesterdayUsd: number
  trendPercent: number
}

export interface RecentExecution {
  id: string
  taskName: string
  cronJobId: string
  status: DashboardExecutionStatus
  executedAt: string
  durationMs: number
  costUsd: number
  model: string
}

export interface FailureAlert {
  cronJobId: string
  taskName: string
  lastFailedAt: string
  consecutiveErrors: number
  lastError: string
}

// -----------------------------------------------------------------------------
// From: sections/tasks
// -----------------------------------------------------------------------------

export interface Template {
  id: string
  name: string
  skillName: string | null
  instructions: string
  preInstructions: string | null
  agentId: string
  deliveryChannel: string
  deliveryRecipient: string | null
  model: string
  cronJobId: string | null
  executionCount: number
  createdAt: string
  updatedAt: string
}

export type CronStatus = 'ok' | 'error' | null

export interface CronJob {
  id: string
  templateId: string | null
  cronExpression: string
  timezone: string
  enabled: boolean
  frequencyLabel: string
  lastRunAtMs: number | null
  lastStatus: CronStatus
  nextRunAtMs: number | null
  consecutiveErrors: number
}

export type ExecutionStatus = 'ok' | 'failed'

export interface ExecutionLog {
  id: string
  cronJobId: string | null
  templateId: string | null
  stdout: string
  stderr: string
  exitCode: number
  durationMs: number
  status: ExecutionStatus
  model: string
  promptTokens: number | null
  completionTokens: number | null
  costUsd: number | null
  generationId: string | null
  executedAt: string
}

export interface PreInstruction {
  content: string
  updatedAt: string
}

// -----------------------------------------------------------------------------
// From: sections/task-detail
// -----------------------------------------------------------------------------

export interface Agent {
  id: string
  name: string
  avatarUrl: string | null
}

export type TaskStatus = 'planned' | 'pending' | 'running' | 'completed' | 'failed' | 'disabled'

export interface TaskDetail {
  id: string
  name: string
  status: TaskStatus
  agent: Agent
  templateId: string | null
  templateName: string | null
  cronExpression: string | null
  frequencyLabel: string | null
  timezone: string
  enabled: boolean
  isRecurring: boolean
  scheduledAt: string | null
  createdAt: string
  completedAt: string | null
  lastRunAtMs: number | null
  nextRunAtMs: number | null
  consecutiveErrors: number
  instructions: string
  model: string
}

export type ActivityEventType = 'created' | 'status_change' | 'dispatched' | 'completed' | 'failed'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  description: string
  timestamp: string
}

export interface ExecutionRun {
  id: string
  status: ExecutionStatus
  stdout: string
  stderr: string
  exitCode: number
  durationMs: number
  model: string
  promptTokens: number | null
  completionTokens: number | null
  costUsd: number | null
  generationId: string | null
  executedAt: string
}

export interface TaskEditPayload {
  name: string
  instructions: string
  status: TaskStatus
  agentId: string
  scheduledAt: string | null
}

// -----------------------------------------------------------------------------
// From: sections/settings
// -----------------------------------------------------------------------------

export interface ConfigEntry {
  key: string
  label: string
  value: string
  description: string
  masked?: boolean
}

export interface ConfigSection {
  id: string
  title: string
  entries: ConfigEntry[]
}

export type ConnectionStatusValue = 'connected' | 'error' | 'unchecked'

export interface ConnectionStatus {
  id: string
  name: string
  status: ConnectionStatusValue
  detail: string
  checkedAt: string
}
