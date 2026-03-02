import { TrendingDown, TrendingUp } from 'lucide-react'
import type { CostSummary } from './types'

interface CostIndicatorProps {
  costSummary: CostSummary
}

export function CostIndicator({ costSummary }: CostIndicatorProps) {
  const isDown = costSummary.trendPercent < 0
  const trendLabel = `${isDown ? '' : '+'}${costSummary.trendPercent.toFixed(1)}%`

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Coût</p>
        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isDown ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'}`}>
          {isDown ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
          {trendLabel} vs hier
        </div>
      </div>
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
