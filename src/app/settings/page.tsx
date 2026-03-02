import { aggregateSettings } from '@/lib/settings/aggregator'
import { checkConnections } from '@/lib/settings/connections'
import { SettingsClient } from './SettingsClient'

export default function SettingsPage() {
  const { configSections, configFilePath } = aggregateSettings()
  const connectionStatuses = checkConnections()

  return (
    <SettingsClient
      configSections={configSections}
      connectionStatuses={connectionStatuses}
      configFilePath={configFilePath}
    />
  )
}
