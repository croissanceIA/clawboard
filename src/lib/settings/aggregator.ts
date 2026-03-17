import fs from 'fs'
import path from 'path'
import type { ConfigSection } from '@/components/settings/types'

function getCronPath(): string {
  return process.env.OPENCLAW_CRON_PATH || ''
}

function getOpenClawRoot(): string {
  const cronPath = getCronPath()
  if (!cronPath) return ''
  return path.resolve(cronPath, '..')
}

function readJsonFile(filePath: string): unknown {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '••••••••'
  const last4 = key.slice(-4)
  return `${key.slice(0, 7)}••••${last4}`
}

function getNestedValue(obj: unknown, keyPath: string): unknown {
  const parts = keyPath.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    const match = part.match(/^(.+)\[(\d+)]$/)
    if (match) {
      current = (current as Record<string, unknown>)[match[1]]
      if (!Array.isArray(current)) return undefined
      current = current[parseInt(match[2])]
    } else {
      current = (current as Record<string, unknown>)[part]
    }
  }
  return current
}

export interface AggregatedSettings {
  configSections: ConfigSection[]
  configFilePath: string
}

export function aggregateSettings(): AggregatedSettings {
  const openclawRoot = getOpenClawRoot()
  const cronPath = getCronPath()
  const configFilePath = openclawRoot ? path.join(openclawRoot, 'openclaw.json') : ''

  // Read openclaw.json
  const config = openclawRoot ? readJsonFile(configFilePath) : null

  // Read auth-profiles.json for API key
  const authProfilesPath = openclawRoot
    ? path.join(openclawRoot, 'agents', 'main', 'agent', 'auth-profiles.json')
    : ''
  const authProfiles = authProfilesPath ? readJsonFile(authProfilesPath) : null

  // Read models.json for base URL
  const modelsPath = openclawRoot
    ? path.join(openclawRoot, 'agents', 'main', 'agent', 'models.json')
    : ''
  const models = modelsPath ? readJsonFile(modelsPath) : null

  // General section
  const gatewayPort = config ? String(getNestedValue(config, 'gateway.port') ?? 'N/A') : 'N/A'

  const agentId = config ? String(getNestedValue(config, 'agents.list[0].id') ?? '') : ''
  const agentName = config ? String(getNestedValue(config, 'agents.list[0].name') ?? '') : ''
  const defaultAgent = agentId && agentName ? `${agentId} (${agentName})` : agentId || 'N/A'

  const defaultModel = config
    ? String(getNestedValue(config, 'agents.defaults.model.primary') ?? 'N/A')
    : 'N/A'

  const maxConcurrent = config
    ? String(getNestedValue(config, 'agents.defaults.maxConcurrent') ?? 'N/A')
    : 'N/A'

  // Paths section
  const workspace = config
    ? String(getNestedValue(config, 'agents.defaults.workspace') ?? 'N/A')
    : 'N/A'
  const clawboardPort = process.env.PORT || '3000'

  // API Keys section — find any openrouter profile (manual, default, etc.)
  let openRouterToken = ''
  if (authProfiles) {
    const profiles = getNestedValue(authProfiles, 'profiles') as Record<string, unknown> | undefined
    if (profiles && typeof profiles === 'object') {
      for (const [key, value] of Object.entries(profiles)) {
        if (key.startsWith('openrouter:') && value && typeof value === 'object') {
          const profile = value as Record<string, unknown>
          const token = (profile.token || profile.key) as string | undefined
          if (token) { openRouterToken = token; break }
        }
      }
    }
  }
  const maskedKey = openRouterToken ? maskApiKey(openRouterToken) : 'N/A'

  const openRouterBaseUrl = models
    ? String(getNestedValue(models, 'providers.openrouter.baseUrl') ?? 'N/A')
    : 'N/A'

  const configSections: ConfigSection[] = [
    {
      id: 'general',
      title: 'General',
      entries: [
        {
          key: 'GATEWAY_PORT',
          label: 'Gateway Port',
          value: gatewayPort,
          description: 'Port for the OpenClaw gateway server',
        },
        {
          key: 'DEFAULT_AGENT',
          label: 'Default Agent',
          value: defaultAgent,
          description: 'Primary agent used for task execution',
        },
        {
          key: 'DEFAULT_MODEL',
          label: 'Default Model',
          value: defaultModel,
          description: 'LLM model used by default for agents',
        },
        {
          key: 'MAX_CONCURRENT',
          label: 'Max Concurrent',
          value: maxConcurrent,
          description: 'Maximum number of concurrent agent executions',
        },
      ],
    },
    {
      id: 'paths',
      title: 'Paths',
      entries: [
        {
          key: 'OPENCLAW_ROOT',
          label: 'OpenClaw Root',
          value: openclawRoot || 'N/A',
          description: 'Root directory of the OpenClaw installation',
        },
        {
          key: 'CRON_DIRECTORY',
          label: 'Cron Directory',
          value: cronPath || 'N/A',
          description: 'Path to the cron jobs directory',
        },
        {
          key: 'WORKSPACE',
          label: 'Workspace',
          value: workspace,
          description: 'Working directory for agent operations',
        },
        {
          key: 'CLAWBOARD_PORT',
          label: 'ClawBoard Port',
          value: clawboardPort,
          description: 'Port ClawBoard is running on',
        },
      ],
    },
    {
      id: 'api-keys',
      title: 'API Keys & Connections',
      entries: [
        {
          key: 'OPENROUTER_API_KEY',
          label: 'OpenRouter API Key',
          value: maskedKey,
          description: 'Authentication key for OpenRouter API',
          masked: true,
        },
        {
          key: 'OPENROUTER_BASE_URL',
          label: 'OpenRouter Base URL',
          value: openRouterBaseUrl,
          description: 'Base URL for OpenRouter API requests',
        },
      ],
    },
  ]

  return { configSections, configFilePath }
}
