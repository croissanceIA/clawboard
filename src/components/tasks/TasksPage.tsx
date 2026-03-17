import {
  LayoutGrid,
  Blocks,
  CalendarClock,
  FileText,
  Archive,
} from 'lucide-react'
import type { TasksProps, TabId } from '@/components/tasks/types'
import { KanbanBoard } from './KanbanBoard'
import { TemplatesGrid } from './TemplatesGrid'
import { ScheduleTimeline } from './ScheduleTimeline'
import { PreInstructionsEditor } from './PreInstructionsEditor'
import { ArchivesTable } from './ArchivesTable'

const TABS: {
  id: TabId
  label: string
  icon: React.ReactNode
  countKey?: 'cronJobs' | 'templates' | 'executionLogs'
}[] = [
  { id: 'tasks', label: 'Tâches', icon: <LayoutGrid className="size-4" />, countKey: 'cronJobs' },
  { id: 'templates', label: 'Modèles', icon: <Blocks className="size-4" />, countKey: 'templates' },
  { id: 'schedules', label: 'Récurrences', icon: <CalendarClock className="size-4" />, countKey: 'cronJobs' },
  { id: 'pre-instructions', label: 'Pré-instructions', icon: <FileText className="size-4" /> },
  { id: 'archives', label: 'Archives', icon: <Archive className="size-4" />, countKey: 'executionLogs' },
]

export function TasksPage({
  templates, cronJobs, executionLogs, preInstruction, activeTab, templateDefaults,
  onTabChange, onCreateTemplate, onUpdateTemplate, onDeleteTemplate, onRunNow,
  onToggleSchedule, onCreateSchedule, onUpdateSchedule, onDeleteSchedule,
  onSavePreInstructions, onViewTaskDetail, onFilterArchives,
}: TasksProps) {
  const counts: Record<string, number> = {
    cronJobs: cronJobs.length, templates: templates.length, executionLogs: executionLogs.length,
  }

  return (
    <div className="px-6 py-8 sm:px-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Tâches</h1>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Gérez vos tâches planifiées, modèles et historique d'exécution.</p>
      </div>
      <div className="mb-8 -mx-1 overflow-x-auto">
        <div className="flex gap-1 border-b border-zinc-200 px-1 dark:border-zinc-800">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const count = tab.countKey ? counts[tab.countKey] : null
            return (
              <button key={tab.id} onClick={() => onTabChange?.(tab.id)} className={`group relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}>
                <span className={isActive ? 'text-blue-500 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}>{tab.icon}</span>
                <span>{tab.label}</span>
                {count !== null && (<span className={`rounded-full px-1.5 py-0.5 text-[11px] font-medium ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>{count}</span>)}
                {isActive && (<span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />)}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        {activeTab === 'tasks' && <KanbanBoard cronJobs={cronJobs} templates={templates} onViewTaskDetail={onViewTaskDetail} />}
        {activeTab === 'templates' && <TemplatesGrid templates={templates} globalPreInstructions={preInstruction.content} defaults={templateDefaults} onCreateTemplate={onCreateTemplate} onUpdateTemplate={onUpdateTemplate} onDeleteTemplate={onDeleteTemplate} onRunNow={onRunNow} />}
        {activeTab === 'schedules' && <ScheduleTimeline cronJobs={cronJobs} templates={templates} onToggleSchedule={onToggleSchedule} onCreateSchedule={onCreateSchedule} onUpdateSchedule={onUpdateSchedule} onDeleteSchedule={onDeleteSchedule} />}
        {activeTab === 'pre-instructions' && <PreInstructionsEditor preInstruction={preInstruction} onSave={onSavePreInstructions} />}
        {activeTab === 'archives' && <ArchivesTable executionLogs={executionLogs} templates={templates} onFilterArchives={onFilterArchives} />}
      </div>
    </div>
  )
}
