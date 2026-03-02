'use server'

import type { ConnectionStatus } from '@/components/settings/types'
import { testOpenRouterKey, checkConnections } from '@/lib/settings/connections'

export async function testOpenRouterConnection(): Promise<ConnectionStatus> {
  return testOpenRouterKey()
}

export async function recheckAllStatuses(): Promise<ConnectionStatus[]> {
  const statuses = checkConnections()
  // Also test OpenRouter key async
  const openRouterResult = await testOpenRouterKey()
  return statuses.map((s) => (s.id === 'openrouter' ? openRouterResult : s))
}
