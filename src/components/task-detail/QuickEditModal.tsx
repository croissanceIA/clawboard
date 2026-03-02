'use client'

import { useState, useEffect } from 'react'
import { X, Info } from 'lucide-react'
import type { TaskDetail, TaskStatus, TaskEditPayload } from './types'

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'planned', label: 'Planifié' }, { value: 'pending', label: 'En attente' },
  { value: 'running', label: 'En cours' }, { value: 'completed', label: 'Terminé' },
  { value: 'failed', label: 'Échoué' }, { value: 'disabled', label: 'Désactivé' },
]

interface QuickEditModalProps { task: TaskDetail; isOpen: boolean; onClose: () => void; onSave?: (taskId: string, updates: TaskEditPayload) => void }

export function QuickEditModal({ task, isOpen, onClose, onSave }: QuickEditModalProps) {
  const [name, setName] = useState(task.name)
  const [instructions, setInstructions] = useState(task.instructions)
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [agentId, setAgentId] = useState(task.agent.id)
  const [scheduledAt, setScheduledAt] = useState(task.scheduledAt ?? '')

  useEffect(() => { if (isOpen) { setName(task.name); setInstructions(task.instructions); setStatus(task.status); setAgentId(task.agent.id); setScheduledAt(task.scheduledAt ?? '') } }, [isOpen, task])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave?.(task.id, { name, instructions, status, agentId, scheduledAt: scheduledAt || null }); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Modifier la tâche</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"><X className="size-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {task.isRecurring && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/30">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">Cette tâche fait partie d&apos;une récurrence. Gérez les plannings depuis l&apos;onglet Récurrences.</p>
            </div>
          )}
          <div className="mb-4"><label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Nom</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" /></div>
          <div className="mb-4"><label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Instructions</label><textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }} /></div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div><label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Statut</label><select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50">{statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
            <div><label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Agent</label><select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"><option value={task.agent.id}>{task.agent.name}</option></select></div>
          </div>
          <div className="mb-6"><label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Date planifiée</label><input type="datetime-local" value={scheduledAt ? scheduledAt.slice(0, 16) : ''} onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" /></div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Annuler</button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}
