import type { CostSummary } from './types'

interface CostIndicatorProps {
  costSummary: CostSummary
}

export function CostIndicator({ costSummary }: CostIndicatorProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Coût</p>
      <div className="mt-4 flex items-end gap-6">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">${costSummary.todayUsd.toFixed(2)}</p>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">aujourd'hui</p>
        </div>
        <div className="mb-1">
          <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">${costSummary.monthUsd.toFixed(2)}</p>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">ce mois</p>
        </div>
      </div>
    </div>
  )
}
