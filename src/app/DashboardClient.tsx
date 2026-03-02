'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'
import type { DashboardProps } from '@/components/dashboard/types'

interface DashboardClientProps {
  dashboardProps: DashboardProps
}

export function DashboardClient({ dashboardProps }: DashboardClientProps) {
  const router = useRouter()
  const { stats, costSummary, recentExecutions, failureAlerts } = dashboardProps
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExecutions = useMemo(() => {
    if (!searchQuery) return recentExecutions
    const q = searchQuery.toLowerCase()
    return recentExecutions.filter(
      (e) => e.taskName.toLowerCase().includes(q) || e.model.toLowerCase().includes(q)
    )
  }, [searchQuery, recentExecutions])

  const filteredAlerts = useMemo(() => {
    if (!searchQuery) return failureAlerts
    const q = searchQuery.toLowerCase()
    return failureAlerts.filter(
      (a) => a.taskName.toLowerCase().includes(q) || a.lastError.toLowerCase().includes(q)
    )
  }, [searchQuery, failureAlerts])

  const handleExecutionClick = useCallback((executionId: string) => {
    router.push(`/tasks/${executionId}`)
  }, [router])

  const handleAlertClick = useCallback((cronJobId: string) => {
    router.push(`/tasks/${cronJobId}`)
  }, [router])

  return (
    <Dashboard
      stats={stats}
      costSummary={costSummary}
      recentExecutions={filteredExecutions}
      failureAlerts={filteredAlerts}
      onSearch={setSearchQuery}
      onExecutionClick={handleExecutionClick}
      onAlertClick={handleAlertClick}
    />
  )
}
