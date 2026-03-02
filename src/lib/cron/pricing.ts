import type { RawRunLineUsage } from './types'

interface ModelPricing {
  inputPer1M: number
  outputPer1M: number
}

// Fallback pricing used when OpenRouter API is unreachable
const FALLBACK_PRICING: Record<string, ModelPricing> = {
  'anthropic/claude-sonnet-4.6': { inputPer1M: 3, outputPer1M: 15 },
  'moonshotai/kimi-k2.5': { inputPer1M: 0.14, outputPer1M: 0.28 },
}

// In-memory cache
let pricingCache: Map<string, ModelPricing> | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

let fetchInFlight = false

async function fetchOpenRouterPricing(): Promise<Map<string, ModelPricing>> {
  const res = await fetch('https://openrouter.ai/api/v1/models')
  if (!res.ok) throw new Error(`OpenRouter API returned ${res.status}`)
  const json = await res.json()
  const map = new Map<string, ModelPricing>()
  for (const model of json.data ?? []) {
    const prompt = model.pricing?.prompt
    const completion = model.pricing?.completion
    if (prompt != null && completion != null) {
      const inputPer1M = parseFloat(prompt) * 1_000_000
      const outputPer1M = parseFloat(completion) * 1_000_000
      if (!isNaN(inputPer1M) && !isNaN(outputPer1M)) {
        map.set(model.id, { inputPer1M, outputPer1M })
      }
    }
  }
  return map
}

function isCacheFresh(): boolean {
  return pricingCache !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS
}

function triggerBackgroundRefresh(): void {
  if (fetchInFlight) return
  fetchInFlight = true
  fetchOpenRouterPricing()
    .then((map) => {
      pricingCache = map
      cacheTimestamp = Date.now()
    })
    .catch(() => {
      // Keep stale cache, will retry on next call
    })
    .finally(() => {
      fetchInFlight = false
    })
}

/** Call once at startup to warm the cache. Safe to call multiple times. */
export async function initPricingCache(): Promise<void> {
  if (isCacheFresh()) return
  try {
    pricingCache = await fetchOpenRouterPricing()
    cacheTimestamp = Date.now()
  } catch {
    // Fallback will be used
  }
}

function getPricing(normalizedModel: string): ModelPricing | undefined {
  if (!isCacheFresh()) {
    triggerBackgroundRefresh()
  }
  return pricingCache?.get(normalizedModel) ?? FALLBACK_PRICING[normalizedModel]
}

// Warm cache at module load (fire-and-forget)
initPricingCache()

function normalizeModelName(model: string): string {
  return model.replace(/^openrouter\//, '')
}

export function computeCostUsd(model: string | undefined, usage: RawRunLineUsage | undefined): number {
  if (!model || !usage) return 0
  const normalized = normalizeModelName(model)
  const pricing = getPricing(normalized)
  if (!pricing) return 0
  const inputCost = (usage.input_tokens / 1_000_000) * pricing.inputPer1M
  const outputCost = (usage.output_tokens / 1_000_000) * pricing.outputPer1M
  return inputCost + outputCost
}
