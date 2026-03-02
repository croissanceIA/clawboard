export const dynamic = 'force-dynamic'

import { aggregateDashboard } from '@/lib/cron/aggregator'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const { dashboardProps } = await aggregateDashboard()

  return <DashboardClient dashboardProps={dashboardProps} />
}
