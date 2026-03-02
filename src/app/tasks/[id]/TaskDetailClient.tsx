'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { TaskDetailView } from '@/components/task-detail'
import type { TaskDetail, ActivityEvent, ExecutionRun, TaskEditPayload } from '@/components/task-detail/types'
import { runAgainTask, editTask, archiveTask, deleteTask } from './actions'

interface TaskDetailClientProps {
  task: TaskDetail
  activityEvents: ActivityEvent[]
  executionRuns: ExecutionRun[]
}

export function TaskDetailClient({ task, activityEvents, executionRuns }: TaskDetailClientProps) {
  const router = useRouter()
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(
    executionRuns[0]?.id ?? null
  )
  const [, startTransition] = useTransition()

  function withRefresh(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  return (
    <TaskDetailView
      task={task}
      activityEvents={activityEvents}
      executionRuns={executionRuns}
      activeExecutionId={activeExecutionId}
      onSelectExecution={setActiveExecutionId}
      onNavigateBack={() => router.push('/tasks')}
      onRunAgain={() => withRefresh(() => runAgainTask(task.id))}
      onEditTask={(_taskId: string, updates: TaskEditPayload) =>
        withRefresh(() => editTask(task.id, updates))
      }
      onArchiveTask={() =>
        withRefresh(async () => {
          await archiveTask(task.id)
          router.push('/tasks')
        })
      }
      onDeleteTask={() =>
        withRefresh(async () => {
          await deleteTask(task.id)
          router.push('/tasks')
        })
      }
      onCopyLogs={(executionId: string) => {
        const run = executionRuns.find((r) => r.id === executionId)
        if (run?.stdout) {
          navigator.clipboard.writeText(run.stdout)
        }
      }}
    />
  )
}
