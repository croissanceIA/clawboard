import { useState } from 'react'
import { Clock, Pause, Loader2, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import type { CronJob, Template, KanbanColumn } from '@/components/tasks/types'

interface KanbanBoardProps {
  cronJobs: CronJob[]
  templates: Template[]
  onViewTaskDetail?: (cronJobId: string) => void
}

const COLUMNS: { id: KanbanColumn; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'planned', label: 'Planifié', icon: <Clock className="size-3.5" />, color: 'blue' },
  { id: 'pending', label: 'En attente', icon: <Pause className="size-3.5" />, color: 'amber' },
  { id: 'running', label: 'En cours', icon: <Loader2 className="size-3.5 animate-spin" />, color: 'violet' },
  { id: 'completed', label: 'Terminé', icon: <CheckCircle2 className="size-3.5" />, color: 'emerald' },
  { id: 'failed', label: 'Échoué', icon: <XCircle className="size-3.5" />, color: 'red' },
]

function getColumn(job: CronJob): KanbanColumn {
  if (!job.enabled) return 'pending'

  // En cours d'exécution (runningAtMs set mais pas de résultat final)
  if (job.runningAtMs && !job.lastStatus) return 'running'

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  // Si le job a tourné aujourd'hui, montrer son résultat
  if (job.lastRunAtMs && job.lastRunAtMs >= todayStart) {
    if (job.lastStatus === 'error') return 'failed'
    if (job.lastStatus === 'ok') return 'completed'
  }

  // Sinon, erreur persistante ou planifié
  if (job.lastStatus === 'error') return 'failed'
  return 'planned'
}

function formatTime(ms: number | null): string {
  if (!ms) return '—'
  const d = new Date(ms)
  return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const columnAccent: Record<string, { dot: string; bg: string; border: string; headerBg: string }> = {
  blue: { dot: 'bg-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-200/60 dark:border-blue-900/40', headerBg: 'bg-blue-500/8' },
  amber: { dot: 'bg-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-950/20', border: 'border-amber-200/60 dark:border-amber-900/40', headerBg: 'bg-amber-500/8' },
  violet: { dot: 'bg-violet-500', bg: 'bg-violet-50/50 dark:bg-violet-950/20', border: 'border-violet-200/60 dark:border-violet-900/40', headerBg: 'bg-violet-500/8' },
  emerald: { dot: 'bg-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', border: 'border-emerald-200/60 dark:border-emerald-900/40', headerBg: 'bg-emerald-500/8' },
  red: { dot: 'bg-red-500', bg: 'bg-red-50/50 dark:bg-red-950/20', border: 'border-red-200/60 dark:border-red-900/40', headerBg: 'bg-red-500/8' },
}

export function KanbanBoard({ cronJobs, templates, onViewTaskDetail }: KanbanBoardProps) {
  const [filterStatus, setFilterStatus] = useState<KanbanColumn | 'all'>('all')
  const templateMap = new Map(templates.map((t) => [t.cronJobId, t]))
  const grouped = COLUMNS.reduce((acc, col) => {
    const jobs = cronJobs.filter((j) => getColumn(j) === col.id)
    // Tri chronologique : planifié par nextRunAtMs, terminé/échoué par lastRunAtMs
    if (col.id === 'planned') {
      jobs.sort((a, b) => (a.nextRunAtMs ?? Infinity) - (b.nextRunAtMs ?? Infinity))
    } else if (col.id === 'completed' || col.id === 'failed') {
      jobs.sort((a, b) => (b.lastRunAtMs ?? 0) - (a.lastRunAtMs ?? 0))
    }
    acc[col.id] = jobs
    return acc
  }, {} as Record<KanbanColumn, CronJob[]>)

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {[{ id: 'all' as const, label: 'Tout' }, ...COLUMNS.map((c) => ({ id: c.id, label: c.label }))].map((f) => (
          <button key={f.id} onClick={() => setFilterStatus(f.id)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterStatus === f.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'}`}>
            {f.label}
            {f.id !== 'all' && <span className="ml-1.5 opacity-60">{grouped[f.id as KanbanColumn]?.length ?? 0}</span>}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: '860px' }}>
        {COLUMNS.filter((col) => filterStatus === 'all' || filterStatus === col.id).map((col) => {
          const accent = columnAccent[col.color]
          const jobs = grouped[col.id]
          return (
            <div key={col.id} className={filterStatus === 'all' ? 'flex-1 min-w-[160px]' : 'w-72'}>
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-3 ${accent.headerBg}`}>
                <span className={`size-2 rounded-full ${accent.dot}`} />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{col.label}</span>
                <span className="ml-auto text-[11px] font-medium text-zinc-400 dark:text-zinc-500">{jobs.length}</span>
              </div>
              <div className="space-y-2.5">
                {jobs.map((job) => {
                  const tpl = templateMap.get(job.id)
                  return (
                    <button key={job.id} onClick={() => onViewTaskDetail?.(job.id)} className={`group w-full rounded-xl border p-3.5 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${accent.border} bg-white dark:bg-zinc-900`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">{tpl?.name ?? job.name}</p>
                        <ExternalLink className="size-3.5 shrink-0 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600" />
                      </div>
                      {tpl?.skillName && <span className="mt-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{tpl.skillName}</span>}
                      {!tpl && <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"><AlertTriangle className="size-3" />Sans modèle</span>}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
                        <span>{job.frequencyLabel}</span>
                        <span>{formatTime(job.lastRunAtMs)}</span>
                      </div>
                      {job.nextRunAtMs && job.nextRunAtMs > Date.now() && (
                        <div className="mt-1.5 text-[11px] text-blue-500 dark:text-blue-400">
                          Prochain : {formatTime(job.nextRunAtMs)}
                        </div>
                      )}
                      {job.consecutiveErrors > 0 && <div className="mt-2 flex items-center gap-1 text-[11px] text-red-500"><AlertTriangle className="size-3" />{job.consecutiveErrors} erreur{job.consecutiveErrors > 1 ? 's' : ''} consécutive{job.consecutiveErrors > 1 ? 's' : ''}</div>}
                    </button>
                  )
                })}
                {jobs.length === 0 && <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">Aucune tâche</div>}
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}
