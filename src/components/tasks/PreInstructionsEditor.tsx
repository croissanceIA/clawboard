import { useState } from 'react'
import { Save, Check, Info } from 'lucide-react'
import type { PreInstruction } from '@/components/tasks/types'

interface PreInstructionsEditorProps {
  preInstruction: PreInstruction
  onSave?: (content: string) => void
}

export function PreInstructionsEditor({ preInstruction, onSave }: PreInstructionsEditorProps) {
  const [content, setContent] = useState(preInstruction.content)
  const [saved, setSaved] = useState(false)
  const isDirty = content !== preInstruction.content

  function handleSave() { onSave?.(content); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/20">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">Ces instructions sont ajoutées au début de chaque tâche envoyée à l'agent. Elles supportent les retours à la ligne et le formatage Markdown.</p>
      </div>
      <textarea value={content} onChange={(e) => { setContent(e.target.value); setSaved(false) }} rows={16} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:border-blue-700 dark:focus:ring-blue-950/50" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }} placeholder="## Notification&#10;Avant de commencer, envoie un message..." />
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Dernière sauvegarde : {new Date(preInstruction.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        <button onClick={handleSave} disabled={!isDirty && !saved} className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium shadow-sm transition-all ${saved ? 'bg-emerald-600 text-white' : isDirty ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500'}`}>{saved ? <><Check className="size-3.5" />Enregistré</> : <><Save className="size-3.5" />Enregistrer</>}</button>
      </div>
    </div>
  )
}
