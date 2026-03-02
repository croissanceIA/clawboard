import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, Copy, Check, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react'
import type { ExecutionLog, Template } from '@/components/tasks/types'

interface ArchivesTableProps {
  executionLogs: ExecutionLog[]
  templates: Template[]
  onFilterArchives?: (filters: { search?: string; templateId?: string; dateFrom?: string; dateTo?: string }) => void
}

function formatDuration(ms: number): string { if (ms < 1000) return `${ms}ms`; const seconds = Math.floor(ms / 1000); if (seconds < 60) return `${seconds}s`; const minutes = Math.floor(seconds / 60); const remainSec = seconds % 60; return `${minutes}m ${remainSec}s` }
function formatCost(cost: number | null): string { if (cost === null) return '—'; return `$${cost.toFixed(4)}` }

export function ArchivesTable({ executionLogs, templates, onFilterArchives }: ArchivesTableProps) {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterTemplate, setFilterTemplate] = useState<string>('')
  const templateMap = new Map(templates.map((t) => [t.id, t]))

  const handleSearch = (q: string) => { setSearch(q); onFilterArchives?.({ search: q, templateId: filterTemplate || undefined }) }
  const handleTemplateFilter = (tid: string) => { setFilterTemplate(tid); onFilterArchives?.({ search: search || undefined, templateId: tid || undefined }) }

  const sortedLogs = [...executionLogs].sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
  const filteredLogs = sortedLogs.filter((log) => {
    if (filterTemplate && log.templateId !== filterTemplate) return false
    if (search) { const tpl = log.templateId ? templateMap.get(log.templateId) : null; const haystack = [tpl?.name, log.stdout, log.stderr, log.cronJobId].filter(Boolean).join(' ').toLowerCase(); if (!haystack.includes(search.toLowerCase())) return false }
    return true
  })

  function handleCopy(text: string, logId: string) { navigator.clipboard.writeText(text); setCopiedId(logId); setTimeout(() => setCopiedId(null), 2000) }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" /><input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher des exécutions..." className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" /></div>
        <select value={filterTemplate} onChange={(e) => handleTemplateFilter(e.target.value)} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-blue-300 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"><option value="">Tous les modèles</option>{templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <style>{`.archive-grid { display: flex; gap: 0.75rem; } @media (min-width: 768px) { .archive-grid { display: grid; grid-template-columns: 1fr 140px 80px 80px 80px; gap: 1rem; } }`}</style>
        <div className="archive-grid max-md:!hidden border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Exécution</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Date</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Statut</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Durée</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Coût</span>
        </div>
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {filteredLogs.map((log) => {
            const tpl = log.templateId ? templateMap.get(log.templateId) : null
            const isExpanded = expandedId === log.id
            const logOutput = log.status === 'failed' ? log.stderr : log.stdout
            return (
              <div key={log.id}>
                <button onClick={() => setExpandedId(isExpanded ? null : log.id)} className="archive-grid w-full items-center px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">{isExpanded ? <ChevronDown className="size-3.5 shrink-0 text-zinc-400" /> : <ChevronRight className="size-3.5 shrink-0 text-zinc-400" />}<div className="min-w-0"><p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{tpl?.name ?? log.cronJobName ?? log.cronJobId ?? 'Unknown'}</p><p className="truncate text-[11px] text-zinc-400 md:hidden dark:text-zinc-500">{new Date(log.executedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p></div></div>
                  <span className="max-md:hidden text-xs text-zinc-500 dark:text-zinc-400">{new Date(log.executedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="ml-auto md:ml-0">{log.status === 'ok' ? <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"><CheckCircle2 className="size-3" />OK</span> : <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400"><XCircle className="size-3" />Échoué</span>}</span>
                  <span className="max-md:hidden flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400"><Clock className="size-3" />{formatDuration(log.durationMs)}</span>
                  <span className="max-md:hidden flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400"><DollarSign className="size-3" />{formatCost(log.costUsd)}</span>
                </button>
                {isExpanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/30">
                    <div className="flex flex-wrap gap-4 mb-3 text-[11px] text-zinc-500 dark:text-zinc-400 md:hidden"><span className="flex items-center gap-1"><Clock className="size-3" />{formatDuration(log.durationMs)}</span><span className="flex items-center gap-1"><DollarSign className="size-3" />{formatCost(log.costUsd)}</span></div>
                    {log.promptTokens !== null && <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-zinc-400 dark:text-zinc-500"><span>Modèle : <span className="font-medium text-zinc-600 dark:text-zinc-300">{log.model}</span></span><span>Prompt : <span className="font-medium text-zinc-600 dark:text-zinc-300">{log.promptTokens?.toLocaleString()}</span></span><span>Complétion : <span className="font-medium text-zinc-600 dark:text-zinc-300">{log.completionTokens?.toLocaleString()}</span></span></div>}
                    <div className="relative">
                      <pre className="max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-3 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{logOutput || 'Aucune sortie.'}</pre>
                      {logOutput && <button onClick={() => handleCopy(logOutput, log.id)} className="absolute right-2 top-2 rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-300" title="Copier dans le presse-papiers">{copiedId === log.id ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}</button>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {filteredLogs.length === 0 && <div className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">{search || filterTemplate ? 'Aucune exécution ne correspond à vos filtres.' : 'Aucune exécution archivée pour le moment.'}</div>}
        </div>
      </div>
    </div>
  )
}
