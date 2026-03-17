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

let cachedDockerCompose: string | null = null
let dockerDetected = false

function autoDetectDocker(): string | null {
  if (dockerDetected) return cachedDockerCompose
  dockerDetected = true
  try {
    // Check if docker-compose.yml exists next to the OpenClaw config
    const cronPath = process.env.OPENCLAW_CRON_PATH || ''
    if (!cronPath) return null
    const { existsSync } = require('fs')
    const { resolve } = require('path')
    const composePath = resolve(cronPath, '..', '..', 'docker-compose.yml')
    if (existsSync(composePath)) {
      cachedDockerCompose = resolve(cronPath, '..', '..')
      return cachedDockerCompose
    }
  } catch {
    // ignore
  }
  return cachedDockerCompose
}

export function getConfig() {
  const cliPath = process.env.OPENCLAW_CLI_PATH || autoDetectCli()
  const dockerComposePath = process.env.OPENCLAW_DOCKER_COMPOSE || autoDetectDocker()

  return {
    openclawCronPath: process.env.OPENCLAW_CRON_PATH || '',
    openclawCliPath: cliPath,
    dockerComposePath: !cliPath ? dockerComposePath : null,
    defaultAgent: process.env.OPENCLAW_DEFAULT_AGENT || 'main',
    defaultModel: process.env.OPENCLAW_DEFAULT_MODEL || 'openrouter/anthropic/claude-sonnet-4',
    defaultDeliveryChannel: process.env.OPENCLAW_DEFAULT_DELIVERY_CHANNEL || 'discord',
  }
}

/**
 * Returns the command and args to spawn openclaw.
 * On native installs: { cmd: '/path/to/openclaw', args: [...] }
 * On Docker installs: { cmd: 'docker', args: ['compose', '-f', '...', 'exec', '-T', 'openclaw-gateway', 'openclaw', ...] }
 * Returns null if neither is available.
 */
export function getOpenclawSpawn(openclawArgs: string[]): { cmd: string; args: string[] } | null {
  const config = getConfig()
  if (config.openclawCliPath) {
    return { cmd: config.openclawCliPath, args: openclawArgs }
  }
  if (config.dockerComposePath) {
    const composePath = config.dockerComposePath + '/docker-compose.yml'
    return {
      cmd: 'docker',
      args: ['compose', '-f', composePath, 'exec', '-T', 'openclaw-gateway', 'openclaw', ...openclawArgs],
    }
  }
  return null
}
