import { useState } from 'react'
import { Plus, MoreHorizontal, Play, Pencil, Trash2, X, Zap, Hash, Eye, Loader2 } from 'lucide-react'
import type { Template } from '../types'

interface TemplatesGridProps {
  templates: Template[]
  globalPreInstructions?: string
  onCreateTemplate?: (template: Omit<Template, 'id' | 'executionCount' | 'createdAt' | 'updatedAt'>) => void
  onUpdateTemplate?: (id: string, updates: Partial<Template>) => void
  onDeleteTemplate?: (id: string) => void
  onRunNow?: (templateId: string) => void
}

const EMPTY_FORM = {
  name: '', skillName: '', instructions: '', preInstructions: '',
  agentId: 'main', deliveryChannel: 'discord', deliveryRecipient: '',
  model: 'openrouter/anthropic/claude-sonnet-4', cronJobId: null as string | null,
}

export function TemplatesGrid({ templates, globalPreInstructions, onCreateTemplate, onUpdateTemplate, onDeleteTemplate, onRunNow }: TemplatesGridProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPreview, setShowPreview] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [runningId, setRunningId] = useState<string | null>(null)

  function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setShowPreview(false); setModalOpen(true) }
  function openEdit(tpl: Template) { setEditingId(tpl.id); setForm({ name: tpl.name, skillName: tpl.skillName ?? '', instructions: tpl.instructions, preInstructions: tpl.preInstructions ?? '', agentId: tpl.agentId, deliveryChannel: tpl.deliveryChannel, deliveryRecipient: tpl.deliveryRecipient ?? '', model: tpl.model, cronJobId: tpl.cronJobId }); setShowPreview(false); setModalOpen(true); setOpenMenu(null) }
  function handleSave() { if (editingId) { onUpdateTemplate?.(editingId, { ...form, skillName: form.skillName || null, preInstructions: form.preInstructions || null, deliveryRecipient: form.deliveryRecipient || null }) } else { onCreateTemplate?.({ ...form, skillName: form.skillName || null, preInstructions: form.preInstructions || null, deliveryRecipient: form.deliveryRecipient || null }) }; setModalOpen(false) }
  function handleRunNow(id: string) { setRunningId(id); onRunNow?.(id); setTimeout(() => setRunningId(null), 2000); setOpenMenu(null) }

  const assembledInstructions = [globalPreInstructions, form.preInstructions, form.skillName ? `Utilise le skill ${form.skillName}, lis attentivement ses instructions et exécute-les.` : null, form.instructions].filter(Boolean).join('\n\n---\n\n')

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"><Plus className="size-3.5" />New template</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => (
          <div key={tpl.id} className="group relative rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="absolute right-3 top-3">
              <button onClick={() => setOpenMenu(openMenu === tpl.id ? null : tpl.id)} className="rounded-lg p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-100 group-hover:opacity-100 dark:hover:bg-zinc-800"><MoreHorizontal className="size-4" /></button>
              {openMenu === tpl.id && (<><div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} /><div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"><button onClick={() => openEdit(tpl)} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"><Pencil className="size-3.5" /> Edit</button><button onClick={() => handleRunNow(tpl.id)} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"><Play className="size-3.5" /> Run now</button><button onClick={() => { onDeleteTemplate?.(tpl.id); setOpenMenu(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"><Trash2 className="size-3.5" /> Delete</button></div></>)}
            </div>
            <h3 className="pr-8 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{tpl.name}</h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{tpl.instructions}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tpl.skillName && <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"><Zap className="size-3" />{tpl.skillName}</span>}
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{tpl.agentId}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{tpl.deliveryChannel}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500"><Hash className="size-3" />{tpl.executionCount} execution{tpl.executionCount !== 1 ? 's' : ''}</span>
              {runningId === tpl.id ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"><Loader2 className="size-3 animate-spin" />Running...</span> : <button onClick={() => handleRunNow(tpl.id)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"><Play className="size-3" />Run now</button>}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{editingId ? 'Edit template' : 'New template'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="size-4" /></button>
            </div>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" placeholder="e.g. Synthèse quotidienne" /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Skill name <span className="text-zinc-400">(optional)</span></span><input value={form.skillName} onChange={(e) => setForm({ ...form, skillName: e.target.value })} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" placeholder="e.g. daily-synthesis" /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Instructions</span><textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={4} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" placeholder="Instructions sent to the agent..." /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Pre-instructions <span className="text-zinc-400">(optional)</span></span><textarea value={form.preInstructions} onChange={(e) => setForm({ ...form, preInstructions: e.target.value })} rows={2} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" placeholder="Text prepended to instructions..." /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Agent</span><input value={form.agentId} onChange={(e) => setForm({ ...form, agentId: e.target.value })} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" /></label>
                <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Delivery channel</span><select value={form.deliveryChannel} onChange={(e) => setForm({ ...form, deliveryChannel: e.target.value })} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50"><option value="discord">Discord</option><option value="telegram">Telegram</option></select></label>
              </div>
              <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Recipient <span className="text-zinc-400">(channel ID)</span></span><input value={form.deliveryRecipient} onChange={(e) => setForm({ ...form, deliveryRecipient: e.target.value })} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" placeholder="e.g. 1234567890" /></label>
              <label className="block"><span className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Model</span><input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" placeholder="e.g. openrouter/anthropic/claude-sonnet-4" /></label>
              <div>
                <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"><Eye className="size-3.5" />{showPreview ? 'Hide' : 'Preview'} assembled instructions</button>
                {showPreview && <pre className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{assembledInstructions || 'No instructions yet.'}</pre>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <button onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.instructions} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600">{editingId ? 'Save changes' : 'Create template'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
