import { aggregateTasks } from '@/lib/cron/tasks-aggregator'
import { TasksClient } from './TasksClient'

export default function TasksPage() {
  const data = aggregateTasks()
  return <TasksClient {...data} />
}
