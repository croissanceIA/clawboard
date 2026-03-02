import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon?: ReactNode
  accent?: boolean
}

export function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white px-5 py-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${accent ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-50'}`}>{value}</p>
          {sub && (<p className="mt-1.5 truncate text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>)}
        </div>
        {icon && (<div className="shrink-0 rounded-lg bg-zinc-100 p-2 text-zinc-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-zinc-800 dark:text-zinc-500 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400">{icon}</div>)}
      </div>
    </div>
  )
}
