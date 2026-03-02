import { Plus, ArrowRightLeft, Send, CheckCircle2, XCircle } from 'lucide-react'
import type { ActivityEvent, ActivityEventType } from '../types'

const eventConfig: Record<ActivityEventType, { icon: React.ElementType; color: string; dotBg: string }> = {
  created: { icon: Plus, color: 'text-blue-500 dark:text-blue-400', dotBg: 'bg-blue-500' },
  status_change: { icon: ArrowRightLeft, color: 'text-zinc-400 dark:text-zinc-500', dotBg: 'bg-zinc-300 dark:bg-zinc-600' },
  dispatched: { icon: Send, color: 'text-amber-500 dark:text-amber-400', dotBg: 'bg-amber-500' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', dotBg: 'bg-emerald-500' },
  failed: { icon: XCircle, color: 'text-red-500 dark:text-red-400', dotBg: 'bg-red-500' },
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface ActivityTimelineProps { events: ActivityEvent[] }

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <div className="relative">
      {events.map((event, idx) => {
        const config = eventConfig[event.type] ?? eventConfig.status_change
        const Icon = config.icon
        const isLast = idx === events.length - 1
        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <div className="absolute left-[11px] top-7 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />}
            <div className="relative z-10 flex size-6 shrink-0 items-center justify-center"><div className={`size-2.5 rounded-full ${config.dotBg}`} /></div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start gap-2"><Icon className={`size-3.5 mt-0.5 shrink-0 ${config.color}`} /><p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{event.description}</p></div>
              <p className="mt-0.5 ml-5.5 text-xs text-zinc-400 dark:text-zinc-500">{formatTimestamp(event.timestamp)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
