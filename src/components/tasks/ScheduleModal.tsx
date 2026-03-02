import { useState } from 'react'
import { X } from 'lucide-react'
import type { CronJob, Template } from '@/components/tasks/types'

interface ScheduleModalProps {
  mode: 'create' | 'edit'
  cronJob?: CronJob
  templates: Template[]
  onSave: (data: { templateId: string; cronExpression: string; timezone: string }) => void
  onClose: () => void
}

export function ScheduleModal({ mode, cronJob, templates, onSave, onClose }: ScheduleModalProps) {
  const [templateId, setTemplateId] = useState(cronJob?.templateId ?? '')
  const [cronExpression, setCronExpression] = useState(cronJob?.cronExpression ?? '0 9 * * *')
  const [timezone, setTimezone] = useState(cronJob?.timezone ?? 'Europe/Paris')

  const canSave = templateId && cronExpression.trim()

  function handleSave() {
    if (!canSave) return
    onSave({ templateId, cronExpression: cronExpression.trim(), timezone: timezone.trim() || 'Europe/Paris' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {mode === 'create' ? 'Nouvelle récurrence' : 'Modifier la récurrence'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Modèle</span>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"
            >
              <option value="">Sélectionner un modèle...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Expression cron</span>
            <input
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              placeholder="0 9 * * *"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Fuseau horaire</span>
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"
              placeholder="Europe/Paris"
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Annuler</button>
          <button onClick={handleSave} disabled={!canSave} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600">
            {mode === 'create' ? 'Créer la récurrence' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
