export const dynamic = 'force-dynamic'

import { aggregateTasks } from '@/lib/cron/tasks-aggregator'
import { getConfig } from '@/lib/config'
import { SetupGuide } from '@/components/SetupGuide'
import { TasksClient } from './TasksClient'

export default function TasksPage() {
  const config = getConfig()

  if (!config.openclawCronPath) {
    return <SetupGuide />
  }

  const data = aggregateTasks()
  const templateDefaults = {
    agentId: config.defaultAgent,
    deliveryChannel: config.defaultDeliveryChannel,
    model: config.defaultModel,
  }
  return <TasksClient {...data} templateDefaults={templateDefaults} />
}
