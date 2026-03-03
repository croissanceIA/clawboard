import type { TaskDetail, TaskStatus, ActivityEvent, ExecutionRun } from '@/components/task-detail/types'
import { readJobs, readAllRuns } from './reader'
import type { RawRunLine } from './types'
import { computeCostUsd } from './pricing'
import { frequencyLabel } from './utils'
import { db } from '@/lib/db'
import { templates as templatesTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function deriveStatus(enabled: boolean, lastStatus: string, runs: RawRunLine[]): TaskStatus {
  if (!enabled) return 'disabled'
  // Check if a "dispatched/running" line exists without a subsequent "finished" line
  const sorted = [...runs].sort((a, b) => b.ts - a.ts)
  if (sorted.length > 0 && sorted[0].status === 'running') return 'running'
  if (lastStatus === 'ok') return 'completed'
  if (lastStatus === 'error') return 'failed'
  return 'pending'
}

export function aggregateTaskDetail(cronJobId: string): {
  task: TaskDetail
  activityEvents: ActivityEvent[]
  executionRuns: ExecutionRun[]
} | null {
  const rawJobs = readJobs()
  const raw = rawJobs.find((j) => j.id === cronJobId)
  if (!raw) return null

  // Look up linked template
  const tpl = db.select().from(templatesTable).where(eq(templatesTable.cronJobId, cronJobId)).get()

  // Read run lines early (needed for status derivation)
  const allRuns = readAllRuns()
  const jobRuns = allRuns.get(cronJobId) ?? []

  // Derive status
  const status = deriveStatus(raw.enabled, raw.state.lastStatus, jobRuns)

  // Build TaskDetail
  const task: TaskDetail = {
    id: raw.id,
    name: raw.name,
    status,
    agent: { id: raw.agentId, name: raw.agentId, avatarUrl: null },
    templateId: tpl?.id ?? null,
    templateName: tpl?.name ?? null,
    cronExpression: raw.schedule.expr,
    frequencyLabel: frequencyLabel(raw.schedule.expr),
    timezone: raw.schedule.tz,
    enabled: raw.enabled,
    isRecurring: true,
    scheduledAt: raw.state.nextRunAtMs ? new Date(raw.state.nextRunAtMs).toISOString() : null,
    createdAt: new Date(raw.createdAtMs).toISOString(),
    completedAt: raw.state.lastStatus === 'ok' && raw.state.lastRunAtMs
      ? new Date(raw.state.lastRunAtMs).toISOString()
      : null,
    lastRunAtMs: raw.state.lastRunAtMs || null,
    nextRunAtMs: raw.state.nextRunAtMs || null,
    consecutiveErrors: raw.state.consecutiveErrors ?? 0,
    instructions: tpl?.instructions ?? raw.payload.message,
    model: tpl?.model ?? raw.payload.model ?? 'unknown',
  }

  const executionRuns: ExecutionRun[] = jobRuns
    .sort((a, b) => b.ts - a.ts) // newest first
    .map((run) => ({
      id: `${cronJobId}-${run.ts}-${run.durationMs}`,
      status: run.status === 'ok' ? ('ok' as const) : run.status === 'running' ? ('running' as const) : ('failed' as const),
      stdout: run.summary ?? '',
      stderr: run.error ?? '',
      exitCode: run.status === 'ok' ? 0 : run.status === 'running' ? -1 : 1,
      durationMs: run.durationMs,
      model: run.model ?? 'unknown',
      promptTokens: run.usage?.input_tokens ?? null,
      completionTokens: run.usage?.output_tokens ?? null,
      costUsd: computeCostUsd(run.model, run.usage) || null,
      generationId: run.sessionId ?? null,
      executedAt: new Date(run.ts).toISOString(),
    }))

  // Build activity events
  const activityEvents: ActivityEvent[] = []

  // "Created" event
  activityEvents.push({
    id: `${cronJobId}-created`,
    type: 'created',
    description: `Tâche « ${raw.name} » créée`,
    timestamp: new Date(raw.createdAtMs).toISOString(),
  })

  // Events from execution runs (chronological order for timeline)
  for (const run of [...jobRuns].sort((a, b) => a.ts - b.ts)) {
    const ts = new Date(run.ts).toISOString()
    activityEvents.push({
      id: `${cronJobId}-dispatched-${run.ts}`,
      type: 'dispatched',
      description: 'Exécution lancée',
      timestamp: ts,
    })
    activityEvents.push({
      id: `${cronJobId}-${run.status}-${run.ts}`,
      type: run.status === 'ok' ? 'completed' : 'failed',
      description: run.status === 'ok'
        ? `Exécution terminée en ${Math.round(run.durationMs / 1000)}s`
        : `Exécution échouée : ${run.error?.slice(0, 100) ?? 'erreur inconnue'}`,
      timestamp: new Date(run.ts + run.durationMs).toISOString(),
    })
  }

  return { task, activityEvents, executionRuns }
}
