import type { CostSummary } from '@/components/dashboard/types'

interface ActivityEntry {
  date: string // YYYY-MM-DD
  model: string
  usage: number // USD
  requests: number
  prompt_tokens: number
  completion_tokens: number
}

// In-memory cache
let activityCache: ActivityEntry[] | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function getMgmtKey(): string | undefined {
  return process.env.OPENROUTER_MGMT_KEY || undefined
}

async function fetchActivity(): Promise<ActivityEntry[]> {
  const key = getMgmtKey()
  if (!key) throw new Error('OPENROUTER_MGMT_KEY not configured')

  const res = await fetch('https://openrouter.ai/api/v1/activity', {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) throw new Error(`OpenRouter activity API returned ${res.status}`)
  const json = await res.json()
  return (json.data ?? []) as ActivityEntry[]
}

function isCacheFresh(): boolean {
  return activityCache !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS
}

async function getActivity(): Promise<ActivityEntry[]> {
  if (isCacheFresh()) return activityCache!
  try {
    activityCache = await fetchActivity()
    cacheTimestamp = Date.now()
    return activityCache
  } catch (err) {
    console.warn('[OpenRouter] Activity fetch failed:', err instanceof Error ? err.message : err)
    throw err
  }
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayUTC(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

function monthPrefixUTC(): string {
  return todayUTC().slice(0, 7) // YYYY-MM
}

export async function getOpenRouterCostSummary(): Promise<CostSummary> {
  const entries = await getActivity()

  const today = todayUTC()
  const yesterday = yesterdayUTC()
  const monthPrefix = monthPrefixUTC()

  let todayUsd = 0
  let yesterdayUsd = 0
  let monthUsd = 0

  for (const entry of entries) {
    const cost = entry.usage ?? 0
    const dateStr = entry.date.slice(0, 10) // "2026-03-01 00:00:00" → "2026-03-01"
    if (dateStr === today) todayUsd += cost
    if (dateStr === yesterday) yesterdayUsd += cost
    if (dateStr.startsWith(monthPrefix)) monthUsd += cost
  }

  const trendPercent = yesterdayUsd > 0
    ? ((todayUsd - yesterdayUsd) / yesterdayUsd) * 100
    : 0

  return { todayUsd, yesterdayUsd, monthUsd, trendPercent }
}
