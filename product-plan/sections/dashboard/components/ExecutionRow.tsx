import type { RecentExecution } from '../types'

interface ExecutionRowProps {
  execution: RecentExecution
  onClick?: () => void
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (isToday) return time
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${day} ${time}`
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function ExecutionRow({ execution, onClick }: ExecutionRowProps) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <div className={`size-2 shrink-0 rounded-full ${execution.status === 'ok' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]'}`} />
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{execution.taskName}</span>
      <span className="hidden text-xs tabular-nums text-zinc-400 sm:block dark:text-zinc-500">{formatDuration(execution.durationMs)}</span>
      <span className="w-20 text-right text-xs tabular-nums text-zinc-400 dark:text-zinc-500">{formatTime(execution.executedAt)}</span>
      <span className="w-14 rounded-full bg-amber-50 px-2 py-0.5 text-center text-xs font-medium tabular-nums text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">${execution.costUsd.toFixed(2)}</span>
    </button>
  )
}
