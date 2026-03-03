export type ExecutionStatus = 'ok' | 'failed'

export interface DashboardStats {
  completedToday: number
  totalToday: number
  failedCount: number
  nextRun: {
    taskName: string
    scheduledAt: string
  }
  activeCrons: number
}

export interface CostSummary {
  todayUsd: number
  monthUsd: number
}

export interface RecentExecution {
  id: string
  taskName: string
  cronJobId: string
  status: ExecutionStatus
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

export interface DashboardProps {
  stats: DashboardStats
  costSummary: CostSummary
  recentExecutions: RecentExecution[]
  failureAlerts: FailureAlert[]
  onSearch?: (query: string) => void
  onExecutionClick?: (executionId: string) => void
  onAlertClick?: (cronJobId: string) => void
}
