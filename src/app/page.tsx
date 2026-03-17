export const dynamic = 'force-dynamic'

import { aggregateDashboard } from '@/lib/cron/aggregator'
import { getConfig } from '@/lib/config'
import { SetupGuide } from '@/components/SetupGuide'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  if (!getConfig().openclawCronPath) {
    return <SetupGuide />
  }

  const { dashboardProps } = await aggregateDashboard()

  return <DashboardClient dashboardProps={dashboardProps} />
}
