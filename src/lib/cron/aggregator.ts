import type {
  DashboardProps,
  CostSummary,
  DashboardStats,
  RecentExecution,
  FailureAlert,
} from '@/components/dashboard/types'
import type { RawJob, RawRunLine } from './types'
import { readJobs, readAllRuns } from './reader'
import { computeCostUsd } from './pricing'

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date: Date): Date {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function buildJobNameMap(jobs: RawJob[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const job of jobs) {
    map.set(job.id, job.name)
  }
  return map
}

function computeRunCosts(allRuns: Map<string, RawRunLine[]>) {
  const now = new Date()
  const todayStart = startOfDay(now).getTime()
  const yesterdayStart = startOfDay(new Date(now.getTime() - 86400000)).getTime()
  const monthStart = startOfMonth(now).getTime()

  let todayUsd = 0
  let yesterdayUsd = 0
  let monthUsd = 0

  for (const [, runs] of allRuns) {
    for (const run of runs) {
      const cost = computeCostUsd(run.model, run.usage)
      if (cost === 0) continue
      if (run.ts >= todayStart) todayUsd += cost
      if (run.ts >= yesterdayStart && run.ts < todayStart) yesterdayUsd += cost
      if (run.ts >= monthStart) monthUsd += cost
    }
  }

  const trendPercent = yesterdayUsd > 0
    ? ((todayUsd - yesterdayUsd) / yesterdayUsd) * 100
    : 0

  return { todayUsd, yesterdayUsd, monthUsd, trendPercent } satisfies CostSummary
}

function computeStats(jobs: RawJob[], allRuns: Map<string, RawRunLine[]>): DashboardStats {
  const now = new Date()
  const todayStart = startOfDay(now).getTime()

  let completedToday = 0
  let totalToday = 0
  let failedCount = 0

  for (const [, runs] of allRuns) {
    for (const run of runs) {
      if (run.ts >= todayStart) {
        totalToday++
        if (run.status === 'ok') completedToday++
        if (run.status === 'error') failedCount++
      }
    }
  }

  const enabledJobs = jobs.filter((j) => j.enabled)
  const activeCrons = enabledJobs.length

  // Find next run
  let nextRun = { taskName: '—', scheduledAt: new Date().toISOString() }
  const futureJobs = enabledJobs
    .filter((j) => j.state.nextRunAtMs > Date.now())
    .sort((a, b) => a.state.nextRunAtMs - b.state.nextRunAtMs)
  if (futureJobs.length > 0) {
    nextRun = {
      taskName: futureJobs[0].name,
      scheduledAt: new Date(futureJobs[0].state.nextRunAtMs).toISOString(),
    }
  }

  return { completedToday, totalToday, failedCount, nextRun, activeCrons }
}

function buildRecentExecutions(
  allRuns: Map<string, RawRunLine[]>,
  jobNameMap: Map<string, string>,
  limit: number = 10
): RecentExecution[] {
  const all: RecentExecution[] = []
  for (const [jobId, runs] of allRuns) {
    for (const run of runs) {
      all.push({
        id: run.sessionId || `${jobId}-${run.ts}`,
        taskName: jobNameMap.get(jobId) || jobId,
        cronJobId: jobId,
        status: run.status === 'ok' ? 'ok' : 'failed',
        executedAt: new Date(run.ts).toISOString(),
        durationMs: run.durationMs,
        costUsd: computeCostUsd(run.model, run.usage),
        model: run.model || 'unknown',
      })
    }
  }
  all.sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
  return all.slice(0, limit)
}

function buildFailureAlerts(jobs: RawJob[], allRuns: Map<string, RawRunLine[]>): FailureAlert[] {
  const alerts: FailureAlert[] = []
  for (const job of jobs) {
    const errors = job.state.consecutiveErrors || 0
    if (errors > 0) {
      // Find the last error run for this job
      const runs = allRuns.get(job.id) || []
      const lastErrorRun = [...runs].reverse().find((r) => r.status === 'error')
      alerts.push({
        cronJobId: job.id,
        taskName: job.name,
        lastFailedAt: lastErrorRun
          ? new Date(lastErrorRun.ts).toISOString()
          : new Date(job.state.lastRunAtMs).toISOString(),
        consecutiveErrors: errors,
        lastError: lastErrorRun?.error || 'Unknown error',
      })
    }
  }
  return alerts
}

export function aggregateDashboard(): {
  dashboardProps: DashboardProps
  costTodayFormatted: string
} {
  const jobs = readJobs()
  const allRuns = readAllRuns()
  const jobNameMap = buildJobNameMap(jobs)

  const stats = computeStats(jobs, allRuns)
  const costSummary = computeRunCosts(allRuns)
  const recentExecutions = buildRecentExecutions(allRuns, jobNameMap)
  const failureAlerts = buildFailureAlerts(jobs, allRuns)

  return {
    dashboardProps: { stats, costSummary, recentExecutions, failureAlerts },
    costTodayFormatted: `$${costSummary.todayUsd.toFixed(2)}`,
  }
}

export function getTodayCost(): string {
  const jobs = readJobs()
  if (jobs.length === 0) return '$0.00'
  const allRuns = readAllRuns()
  const now = new Date()
  const todayStart = startOfDay(now).getTime()

  let todayUsd = 0
  for (const [, runs] of allRuns) {
    for (const run of runs) {
      if (run.ts >= todayStart) {
        todayUsd += computeCostUsd(run.model, run.usage)
      }
    }
  }
  return `$${todayUsd.toFixed(2)}`
}
