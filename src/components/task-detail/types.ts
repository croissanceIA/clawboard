// ── Data Interfaces ──────────────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export type TaskStatus =
  | "planned"
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "disabled";

export interface TaskDetail {
  id: string;
  name: string;
  status: TaskStatus;
  agent: Agent;
  templateId: string | null;
  templateName: string | null;
  cronExpression: string | null;
  frequencyLabel: string | null;
  timezone: string;
  enabled: boolean;
  isRecurring: boolean;
  scheduledAt: string | null;
  createdAt: string;
  completedAt: string | null;
  lastRunAtMs: number | null;
  nextRunAtMs: number | null;
  consecutiveErrors: number;
  instructions: string;
  model: string;
}

export type ActivityEventType =
  | "created"
  | "status_change"
  | "dispatched"
  | "completed"
  | "failed";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  description: string;
  timestamp: string;
}

export type ExecutionStatus = "ok" | "failed" | "running";

export interface ExecutionRun {
  id: string;
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  model: string;
  promptTokens: number | null;
  completionTokens: number | null;
  costUsd: number | null;
  generationId: string | null;
  executedAt: string;
}

// ── Quick-Edit Modal Types ──────────────────────────────────────

export interface TaskEditPayload {
  name: string;
  instructions: string;
  status: TaskStatus;
  agentId: string;
  scheduledAt: string | null;
}

// ── Props Interface ─────────────────────────────────────────────

export interface TaskDetailProps {
  task: TaskDetail;
  activityEvents: ActivityEvent[];
  executionRuns: ExecutionRun[];
  activeExecutionId: string | null;
  onSelectExecution?: (executionId: string) => void;
  isRunning?: boolean;
  onRunAgain?: (taskId: string) => void;
  onEditTask?: (taskId: string, updates: TaskEditPayload) => void;
  onArchiveTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onCopyLogs?: (executionId: string) => void;
  onNavigateBack?: () => void;
}
