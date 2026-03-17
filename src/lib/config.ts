import { execSync } from 'child_process'

let cachedCliPath: string | null | undefined

function autoDetectCli(): string | null {
  if (cachedCliPath !== undefined) return cachedCliPath
  try {
    cachedCliPath = execSync('which openclaw', { encoding: 'utf-8' }).trim() || null
  } catch {
    cachedCliPath = null
  }
  return cachedCliPath
}

export function getConfig() {
  return {
    openclawCronPath: process.env.OPENCLAW_CRON_PATH || '',
    openclawCliPath: process.env.OPENCLAW_CLI_PATH || autoDetectCli(),
    defaultAgent: process.env.OPENCLAW_DEFAULT_AGENT || 'main',
    defaultModel: process.env.OPENCLAW_DEFAULT_MODEL || 'openrouter/anthropic/claude-sonnet-4',
    defaultDeliveryChannel: process.env.OPENCLAW_DEFAULT_DELIVERY_CHANNEL || 'discord',
  }
}
