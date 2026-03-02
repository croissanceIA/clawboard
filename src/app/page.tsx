export const dynamic = 'force-dynamic'

import { aggregateDashboard } from '@/lib/cron/aggregator'
import { DashboardClient } from './DashboardClient'

export default function DashboardPage() {
  const { dashboardProps } = aggregateDashboard()

  return <DashboardClient dashboardProps={dashboardProps} />
}
