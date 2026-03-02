'use client'

import { useState } from 'react'
import { Info, Copy, Check } from 'lucide-react'
import type { SettingsProps } from './types'
import { ConfigRow } from './ConfigRow'
import { ConnectionStatusList } from './ConnectionStatusList'

export function Settings({
  configSections,
  connectionStatuses,
  configFilePath,
  onTestOpenRouterConnection,
  onCopyValue,
  onRecheckStatuses,
}: SettingsProps) {
  const [pathCopied, setPathCopied] = useState(false)

  const handleCopyPath = () => {
    onCopyValue?.('CONFIG_FILE_PATH', configFilePath)
    setPathCopied(true)
    setTimeout(() => setPathCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Paramètres</h1>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          Configuration de l'environnement et état des connexions pour ClawBoard.
        </p>
      </div>

      <div className="mb-8 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 dark:border-blue-900/40 dark:bg-blue-950/20">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <div className="min-w-0 text-sm text-blue-700 dark:text-blue-300">
          <p>
            Les paramètres sont lus depuis votre fichier de configuration OpenClaw et nécessitent un redémarrage pour être modifiés.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code
              className="truncate rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {configFilePath}
            </code>
            <button
              onClick={handleCopyPath}
              className="shrink-0 rounded p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
              title="Copier le chemin du fichier"
            >
              {pathCopied ? (
                <Check className="size-3 text-emerald-500" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {configSections.map((section) => (
          <div key={section.id}>
            <h2 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {section.title}
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {section.entries.map((entry) => (
                  <ConfigRow
                    key={entry.key}
                    entry={entry}
                    onCopyValue={onCopyValue}
                    showTestButton={entry.key === 'OPENROUTER_API_KEY'}
                    onTestConnection={
                      entry.key === 'OPENROUTER_API_KEY'
                        ? onTestOpenRouterConnection
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ConnectionStatusList
          statuses={connectionStatuses}
          onRecheckStatuses={onRecheckStatuses}
        />
      </div>
    </div>
  )
}
