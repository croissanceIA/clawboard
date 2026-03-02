import { RefreshCw } from 'lucide-react'
import type { ConnectionStatus } from '../types'

interface ConnectionStatusListProps { statuses: ConnectionStatus[]; onRecheckStatuses?: () => void }

function StatusDot({ status }: { status: ConnectionStatus['status'] }) {
  const colors = { connected: 'bg-emerald-500 shadow-emerald-500/40', error: 'bg-red-500 shadow-red-500/40', unchecked: 'bg-zinc-300 dark:bg-zinc-600' }
  return <span className={`block size-2 rounded-full shadow-sm ${colors[status]}`} />
}

function formatTime(iso: string): string { return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) }

export function ConnectionStatusList({ statuses, onRecheckStatuses }: ConnectionStatusListProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Connection Status</h2>
        <button onClick={onRecheckStatuses} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"><RefreshCw className="size-3" />Recheck</button>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {statuses.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
              <StatusDot status={item.status} />
              <span className="shrink-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name}</span>
              <span className={`min-w-0 flex-1 truncate text-right text-xs ${item.status === 'error' ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.detail}</span>
              <span className="hidden shrink-0 text-[10px] text-zinc-300 sm:block dark:text-zinc-600">{formatTime(item.checkedAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
