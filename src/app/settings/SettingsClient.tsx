'use client'

import { useState, useTransition, useCallback } from 'react'
import { Settings } from '@/components/settings'
import type { ConfigSection, ConnectionStatus } from '@/components/settings/types'
import { testOpenRouterConnection, recheckAllStatuses } from './actions'

interface SettingsClientProps {
  configSections: ConfigSection[]
  connectionStatuses: ConnectionStatus[]
  configFilePath: string
}

export function SettingsClient({
  configSections,
  connectionStatuses: initialStatuses,
  configFilePath,
}: SettingsClientProps) {
  const [connectionStatuses, setConnectionStatuses] = useState(initialStatuses)
  const [, startTransition] = useTransition()

  const handleCopyValue = useCallback((_key: string, value: string) => {
    navigator.clipboard.writeText(value)
  }, [])

  const handleTestOpenRouterConnection = useCallback(() => {
    startTransition(async () => {
      const result = await testOpenRouterConnection()
      setConnectionStatuses((prev) =>
        prev.map((s) => (s.id === 'openrouter' ? result : s))
      )
    })
  }, [])

  const handleRecheckStatuses = useCallback(() => {
    startTransition(async () => {
      const results = await recheckAllStatuses()
      setConnectionStatuses(results)
    })
  }, [])

  return (
    <Settings
      configSections={configSections}
      connectionStatuses={connectionStatuses}
      configFilePath={configFilePath}
      onTestOpenRouterConnection={handleTestOpenRouterConnection}
      onCopyValue={handleCopyValue}
      onRecheckStatuses={handleRecheckStatuses}
    />
  )
}
