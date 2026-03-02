import type { CostSummary } from '@/components/dashboard/types'
import { getOpenRouterToken } from '@/lib/settings/connections'

interface AuthKeyUsage {
  usage: number // total USD
  usage_daily: number
  usage_weekly: number
  usage_monthly: number
}

// In-memory cache
let usageCache: AuthKeyUsage | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

async function fetchKeyUsage(): Promise<AuthKeyUsage> {
  const token = getOpenRouterToken()
  if (!token) throw new Error('OpenRouter API key not found in auth-profiles.json')

  const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`OpenRouter auth/key API returned ${res.status}`)
  const json = await res.json()
  return json.data as AuthKeyUsage
}

function isCacheFresh(): boolean {
  return usageCache !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS
}

async function getKeyUsage(): Promise<AuthKeyUsage> {
  if (isCacheFresh()) return usageCache!
  try {
    usageCache = await fetchKeyUsage()
    cacheTimestamp = Date.now()
    return usageCache
  } catch (err) {
    console.warn('[OpenRouter] Key usage fetch failed:', err instanceof Error ? err.message : err)
    throw err
  }
}

export async function getOpenRouterCostSummary(): Promise<CostSummary> {
  const data = await getKeyUsage()

  const todayUsd = data.usage_daily
  const monthUsd = data.usage_monthly
  // No yesterday data available from this endpoint
  const yesterdayUsd = 0
  const trendPercent = 0

  return { todayUsd, yesterdayUsd, monthUsd, trendPercent }
}
