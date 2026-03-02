import { Power, PowerOff, Plus, Pencil, Trash2 } from 'lucide-react'
import type { CronJob, Template } from '../types'

interface ScheduleTimelineProps {
  cronJobs: CronJob[]
  templates: Template[]
  onToggleSchedule?: (cronJobId: string, enabled: boolean) => void
  onCreateSchedule?: (schedule: { templateId: string; cronExpression: string; timezone: string }) => void
  onUpdateSchedule?: (cronJobId: string, updates: Partial<Pick<CronJob, 'cronExpression' | 'timezone' | 'enabled'>>) => void
  onDeleteSchedule?: (cronJobId: string) => void
}

const SCHEDULE_COLORS = [{ dot: 'bg-blue-500' }, { dot: 'bg-emerald-500' }, { dot: 'bg-amber-500' }, { dot: 'bg-violet-500' }, { dot: 'bg-rose-500' }, { dot: 'bg-cyan-500' }]

export function ScheduleTimeline({ cronJobs, templates, onToggleSchedule, onCreateSchedule, onUpdateSchedule, onDeleteSchedule }: ScheduleTimelineProps) {
  const templateMap = new Map(templates.map((t) => [t.cronJobId, t]))
  const schedules = cronJobs.map((job, i) => ({ job, template: templateMap.get(job.id) ?? null, color: SCHEDULE_COLORS[i % SCHEDULE_COLORS.length] }))

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{schedules.length} schedule{schedules.length !== 1 ? 's' : ''}</p>
        <button onClick={() => onCreateSchedule?.({ templateId: '', cronExpression: '0 9 * * *', timezone: 'Europe/Paris' })} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"><Plus className="size-3.5" />New schedule</button>
      </div>
      <div className="space-y-2">
        {schedules.length === 0 && <div className="rounded-xl border border-zinc-200 bg-white py-12 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">No schedules configured. Create one to get started.</div>}
        {schedules.map((s) => {
          const modelShort = s.template?.model?.split('/').pop() ?? null
          return (
            <div key={s.job.id} className="rounded-xl border border-zinc-200 bg-white px-4 py-3.5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <span className={`size-2.5 shrink-0 rounded-full ${s.color.dot} ${!s.job.enabled ? 'opacity-30' : ''}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${s.job.enabled ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 line-through dark:text-zinc-500'}`}>{s.template?.name ?? s.job.id}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{s.job.frequencyLabel}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button onClick={() => onUpdateSchedule?.(s.job.id, {})} className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" title="Edit schedule"><Pencil className="size-3.5" /></button>
                  <button onClick={() => onDeleteSchedule?.(s.job.id)} className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400" title="Delete schedule"><Trash2 className="size-3.5" /></button>
                  <button onClick={() => onToggleSchedule?.(s.job.id, !s.job.enabled)} className={`rounded-full p-1.5 transition-colors ${s.job.enabled ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'}`} title={s.job.enabled ? 'Disable schedule' : 'Enable schedule'}>{s.job.enabled ? <Power className="size-3.5" /> : <PowerOff className="size-3.5" />}</button>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-5.5">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.job.cronExpression}</span>
                {s.template ? <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{s.template.name}</span> : <span className="rounded-md bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500">No template</span>}
                {modelShort && <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">{modelShort}</span>}
                {s.job.nextRunAtMs && <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Next: {new Date(s.job.nextRunAtMs).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
                {s.job.consecutiveErrors > 0 && <span className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">{s.job.consecutiveErrors} error{s.job.consecutiveErrors !== 1 ? 's' : ''}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
