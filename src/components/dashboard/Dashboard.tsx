'use client'

import { useState } from 'react'
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
} from 'lucide-react'
import type { DashboardProps } from './types'
import { StatCard } from './StatCard'
import { CostIndicator } from './CostIndicator'
import { AlertsSection } from './AlertsSection'
import { ExecutionRow } from './ExecutionRow'

function formatNextRun(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function Dashboard({
  stats,
  costSummary,
  recentExecutions,
  failureAlerts,
  onSearch,
  onExecutionClick,
  onAlertClick,
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Tableau de bord</h1>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Aperçu de vos tâches planifiées, exécutions récentes et coûts.</p>
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Rechercher des tâches et modèles..." className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-800 dark:focus:ring-blue-950/50" />
        </div>
      </div>
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Terminées" value={`${stats.completedToday}/${stats.totalToday}`} sub="tâches aujourd'hui" icon={<CheckCircle2 className="size-5" />} />
        <StatCard label="Échouées" value={String(stats.failedCount)} sub={stats.failedCount === 1 ? 'tâche' : 'tâches'} icon={<AlertCircle className="size-5" />} accent={stats.failedCount > 0} />
        <StatCard label="Prochaine exéc." value={formatNextRun(stats.nextRun.scheduledAt)} sub={stats.nextRun.taskName} icon={<Clock className="size-5" />} />
        <StatCard label="Crons actifs" value={String(stats.activeCrons)} sub="planifiés" icon={<Radio className="size-5" />} />
      </div>
      <div className="mb-8"><CostIndicator costSummary={costSummary} /></div>
      {failureAlerts.length > 0 && (<div className="mb-8"><AlertsSection alerts={failureAlerts} onAlertClick={onAlertClick} /></div>)}
      <div>
        <h2 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">Exécutions récentes</h2>
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentExecutions.map((execution) => (<ExecutionRow key={execution.id} execution={execution} onClick={() => onExecutionClick?.(execution.id)} />))}
          </div>
          {recentExecutions.length === 0 && (<div className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">Aucune exécution pour le moment. Les tâches apparaîtront ici une fois lancées.</div>)}
        </div>
      </div>
    </div>
  )
}
