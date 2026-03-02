import { aggregateTaskDetail } from '@/lib/cron/task-detail-aggregator'
import { TaskDetailClient } from './TaskDetailClient'

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = aggregateTaskDetail(id)

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Tâche introuvable
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            La tâche « {id} » n&apos;existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    )
  }

  return (
    <TaskDetailClient
      task={data.task}
      activityEvents={data.activityEvents}
      executionRuns={data.executionRuns}
    />
  )
}
