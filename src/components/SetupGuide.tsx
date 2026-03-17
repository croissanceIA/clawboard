export function SetupGuide() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 text-3xl">&#9881;</div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Configuration requise
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          ClawBoard n&apos;est pas encore configuré. Lancez le wizard de configuration :
        </p>
        <pre className="mt-4 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          npm run setup
        </pre>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Ou créez manuellement un fichier <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">.env.local</code> avec :
        </p>
        <pre className="mt-2 rounded-lg bg-zinc-100 p-4 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
{`OPENCLAW_CRON_PATH=/chemin/vers/.openclaw/cron`}
        </pre>
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          Consultez le README pour plus de détails sur la configuration.
        </p>
      </div>
    </div>
  )
}
