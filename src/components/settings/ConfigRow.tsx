'use client'

import { useState } from 'react'
import { Copy, Check, Zap } from 'lucide-react'
import type { ConfigEntry } from './types'

interface ConfigRowProps {
  entry: ConfigEntry
  onCopyValue?: (key: string, value: string) => void
  onTestConnection?: () => void
  showTestButton?: boolean
}

export function ConfigRow({ entry, onCopyValue, onTestConnection, showTestButton }: ConfigRowProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopyValue?.(entry.key, entry.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group flex items-start justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{entry.label}</span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{entry.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <code
          className="truncate rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs text-zinc-500 sm:px-3 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          style={{ fontFamily: "'JetBrains Mono', monospace", maxWidth: 'min(260px, 40vw)' }}
        >
          {entry.value}
        </code>
        {showTestButton && (
          <button
            onClick={onTestConnection}
            className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 sm:px-2.5 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-400"
          >
            <Zap className="size-3" />
            <span className="sr-only sm:not-sr-only">Test</span>
          </button>
        )}
        <button
          onClick={handleCopy}
          className="rounded-lg p-1.5 text-zinc-300 transition-colors hover:bg-zinc-100 hover:text-zinc-500 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          title="Copier la valeur"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  )
}
