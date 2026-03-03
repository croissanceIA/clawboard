'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Copy, Clock, Cpu, DollarSign } from 'lucide-react'
import type { ExecutionRun } from './types'

function formatDate(iso: string): string { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }
function formatDuration(ms: number): string { const seconds = Math.floor(ms / 1000); const m = Math.floor(seconds / 60); const s = seconds % 60; return m > 0 ? `${m}m ${s}s` : `${s}s` }

interface ExecutionLogsProps { runs: ExecutionRun[]; activeRunId: string | null; onSelectRun?: (runId: string) => void; onCopyLogs?: (runId: string) => void }

export function ExecutionLogs({ runs, activeRunId, onSelectRun, onCopyLogs }: ExecutionLogsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const activeRun = runs.find((r) => r.id === activeRunId) ?? runs[0]

  if (!activeRun) return <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">Aucune exécution disponible.</div>

  const handleCopy = (runId: string) => { onCopyLogs?.(runId); setCopiedId(runId); setTimeout(() => setCopiedId(null), 2000) }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex gap-1 overflow-x-auto border-b border-zinc-100 px-3 pt-2 dark:border-zinc-800">
        {runs.map((run) => {
          const isActive = run.id === activeRun.id
          const isRunning = run.status === 'running'
          const isFailed = run.status === 'failed'
          return (
            <button key={run.id} onClick={() => onSelectRun?.(run.id)} className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-medium transition-colors ${isActive ? 'bg-zinc-50 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'}`}>
              {isRunning ? <Loader2 className="size-3 animate-spin text-blue-500" /> : isFailed ? <XCircle className="size-3 text-red-500" /> : <CheckCircle2 className="size-3 text-emerald-500" />}
              {isRunning ? 'En cours…' : formatDate(run.executedAt)}
            </button>
          )
        })}
      </div>
      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1"><Clock className="size-3" />{formatDuration(activeRun.durationMs)}</span>
          <span className="inline-flex items-center gap-1"><Cpu className="size-3" />{activeRun.promptTokens?.toLocaleString('fr-FR') ?? '—'} / {activeRun.completionTokens?.toLocaleString('fr-FR') ?? '—'} tokens</span>
          <span className="inline-flex items-center gap-1"><DollarSign className="size-3" />{activeRun.costUsd != null ? `$${activeRun.costUsd.toFixed(4)}` : '—'}</span>
          <span className="inline-flex items-center gap-1">Exit: <code className={`font-mono ${activeRun.exitCode === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{activeRun.exitCode}</code></span>
        </div>
        {activeRun.stdout && (
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">stdout</span>
              <button onClick={() => handleCopy(activeRun.id)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"><Copy className="size-3" />{copiedId === activeRun.id ? 'Copié !' : 'Copier'}</button>
            </div>
            <pre className="max-h-80 overflow-auto rounded-lg bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap break-words dark:bg-zinc-950 dark:text-zinc-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeRun.stdout}</pre>
          </div>
        )}
        {activeRun.stderr && (
          <div>
            <span className="mb-1.5 block text-xs font-medium text-red-500 dark:text-red-400">stderr</span>
            <pre className="max-h-48 overflow-auto rounded-lg bg-red-50 p-4 text-xs leading-relaxed text-red-700 whitespace-pre-wrap break-words dark:bg-red-950/30 dark:text-red-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeRun.stderr}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
