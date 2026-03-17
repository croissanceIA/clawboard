'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TasksPage } from '@/components/tasks'
import type { Template, CronJob, ExecutionLog, PreInstruction, TabId } from '@/components/tasks/types'
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  runNow,
  toggleSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  savePreInstructions,
} from './actions'

interface TasksClientProps {
  templates: Template[]
  cronJobs: CronJob[]
  executionLogs: ExecutionLog[]
  preInstruction: PreInstruction
  templateDefaults?: { agentId: string; deliveryChannel: string; model: string }
}

export function TasksClient({ templates, cronJobs, executionLogs, preInstruction, templateDefaults }: TasksClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('tasks')
  const [, startTransition] = useTransition()

  function withRefresh(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  return (
    <TasksPage
      templates={templates}
      cronJobs={cronJobs}
      executionLogs={executionLogs}
      preInstruction={preInstruction}
      activeTab={activeTab}
      templateDefaults={templateDefaults}
      onTabChange={setActiveTab}
      onCreateTemplate={(tpl) => withRefresh(() => createTemplate(tpl))}
      onUpdateTemplate={(id, updates) => withRefresh(() => updateTemplate(id, updates))}
      onDeleteTemplate={(id) => withRefresh(() => deleteTemplate(id))}
      onRunNow={(templateId) => withRefresh(() => runNow(templateId))}
      onToggleSchedule={(cronJobId, enabled) => withRefresh(() => toggleSchedule(cronJobId, enabled))}
      onCreateSchedule={(schedule) => withRefresh(() => createSchedule(schedule))}
      onUpdateSchedule={(cronJobId, updates) => withRefresh(() => updateSchedule(cronJobId, updates))}
      onDeleteSchedule={(cronJobId) => withRefresh(() => deleteSchedule(cronJobId))}
      onSavePreInstructions={(content) => withRefresh(() => savePreInstructions(content))}
      onViewTaskDetail={(cronJobId) => router.push(`/tasks/${cronJobId}`)}
      onFilterArchives={() => {}}
    />
  )
}
