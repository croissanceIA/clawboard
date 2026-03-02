import { AlertTriangle, ChevronRight } from 'lucide-react'
import type { FailureAlert } from './types'

interface AlertsSectionProps {
  alerts: FailureAlert[]
  onAlertClick?: (cronJobId: string) => void
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function AlertsSection({ alerts, onAlertClick }: AlertsSectionProps) {
  if (alerts.length === 0) return null
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
      <div className="flex items-center gap-2 border-b border-red-200 px-5 py-3 dark:border-red-900/50">
        <AlertTriangle className="size-4 text-red-500 dark:text-red-400" />
        <h3 className="text-sm font-medium text-red-700 dark:text-red-400">{alerts.length} {alerts.length === 1 ? 'tâche échouée' : 'tâches échouées'}</h3>
      </div>
      <div className="divide-y divide-red-100 dark:divide-red-900/30">
        {alerts.map((alert) => (
          <button key={alert.cronJobId} onClick={() => onAlertClick?.(alert.cronJobId)} className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-red-100/50 dark:hover:bg-red-950/30">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-red-800 dark:text-red-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{alert.taskName}</p>
              <p className="mt-0.5 truncate text-xs text-red-500/80 dark:text-red-400/60">{alert.lastError}</p>
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-red-500 dark:text-red-400">{formatTime(alert.lastFailedAt)}</p>
                {alert.consecutiveErrors > 1 && (<p className="text-[10px] text-red-400 dark:text-red-500">{alert.consecutiveErrors} consécutives</p>)}
              </div>
              <ChevronRight className="size-4 text-red-300 dark:text-red-600" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
