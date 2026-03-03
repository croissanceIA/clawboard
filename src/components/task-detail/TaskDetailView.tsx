'use client'

import { useState } from 'react'
import { ArrowLeft, Play, Loader2, Pencil, Archive, Trash2, Bot, Calendar, Clock, Repeat, FileText } from 'lucide-react'
import type { TaskDetailProps, TaskStatus } from './types'
import { ActivityTimeline } from './ActivityTimeline'
import { ExecutionLogs } from './ExecutionLogs'
import { QuickEditModal } from './QuickEditModal'

const statusBadge: Record<TaskStatus, { label: string; cls: string }> = {
  planned: { label: 'Planifié', cls: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  pending: { label: 'En attente', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  running: { label: 'En cours', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  completed: { label: 'Terminé', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  failed: { label: 'Échoué', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  disabled: { label: 'Désactivé', cls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500' },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function TaskDetailView({ task, activityEvents, executionRuns, activeExecutionId, onSelectExecution, isRunning, onRunAgain, onEditTask, onArchiveTask, onDeleteTask, onCopyLogs, onNavigateBack }: TaskDetailProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const badge = statusBadge[task.status] ?? statusBadge.planned

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 sm:py-10">
      <button onClick={() => onNavigateBack?.()} className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"><ArrowLeft className="size-3.5" />Tâches</button>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-xl font-semibold text-zinc-900 dark:text-zinc-50">{task.name}</h1>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
          </div>
          {task.templateName && <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Modèle : {task.templateName}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => onRunAgain?.(task.id)} disabled={isRunning} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600">{isRunning ? <><Loader2 className="size-3.5 animate-spin" />Lancement…</> : <><Play className="size-3.5" />Relancer</>}</button>
          <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"><Pencil className="size-3.5" /><span className="hidden sm:inline">Modifier</span></button>
          <button onClick={() => onArchiveTask?.(task.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"><Archive className="size-3.5" /><span className="hidden sm:inline">Archiver</span></button>
          <button onClick={() => setDeleteConfirm(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800/50 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-950/30"><Trash2 className="size-3.5" /><span className="hidden sm:inline">Supprimer</span></button>
        </div>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500"><Bot className="size-3" />Agent</div><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.agent.name}</p></div>
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500"><Calendar className="size-3" />Planifié</div><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.scheduledAt ? formatDate(task.scheduledAt) : '—'}</p></div>
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500"><Clock className="size-3" />Créé</div><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{formatDate(task.createdAt)}</p></div>
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500"><Repeat className="size-3" />Récurrence</div><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{task.frequencyLabel ?? (task.isRecurring ? task.cronExpression : 'Aucune')}</p></div>
      </div>
      <div className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"><FileText className="size-4 text-zinc-400 dark:text-zinc-500" />Instructions</h2>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>{task.instructions}</pre>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">Activité</h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><ActivityTimeline events={activityEvents} /></div>
      </div>
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">Exécutions</h2>
        <ExecutionLogs runs={executionRuns} activeRunId={activeExecutionId} onSelectRun={onSelectExecution} onCopyLogs={onCopyLogs} />
      </div>
      <QuickEditModal task={task} isOpen={editOpen} onClose={() => setEditOpen(false)} onSave={onEditTask} />
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Supprimer la tâche ?</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Cette action est irréversible. La tâche « {task.name} » et tout son historique seront supprimés définitivement.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Annuler</button>
              <button onClick={() => { onDeleteTask?.(task.id); setDeleteConfirm(false) }} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
