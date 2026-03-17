#!/usr/bin/env node

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ENV_FILE = path.join(process.cwd(), '.env.local')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const suffix = defaultValue ? ` (${defaultValue})` : ''
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

function detectOpenclawCli() {
  try {
    return execSync('which openclaw', { encoding: 'utf-8' }).trim()
  } catch {
    return null
  }
}

function detectCronPath() {
  const home = process.env.HOME || process.env.USERPROFILE || ''
  const candidate = path.join(home, '.openclaw', 'cron')
  if (fs.existsSync(path.join(candidate, 'jobs.json'))) {
    return candidate
  }
  return null
}

async function main() {
  console.log('')
  console.log('  ClawBoard - Configuration')
  console.log('  -------------------------')
  console.log('')

  // Check existing .env.local
  if (fs.existsSync(ENV_FILE)) {
    const overwrite = await ask('Un fichier .env.local existe deja. Ecraser ? (o/N)', 'N')
    if (overwrite.toLowerCase() !== 'o') {
      console.log('\nConfiguration annulee.')
      rl.close()
      return
    }
  }

  // 1. OPENCLAW_CRON_PATH
  const detectedCronPath = detectCronPath()
  if (detectedCronPath) {
    console.log(`\n  Dossier cron detecte : ${detectedCronPath}`)
  }

  let cronPath = await ask(
    '\n  Chemin vers le dossier cron OpenClaw (contient jobs.json)',
    detectedCronPath || ''
  )

  if (!cronPath) {
    console.log('\n  ERREUR: OPENCLAW_CRON_PATH est requis.')
    rl.close()
    process.exit(1)
  }

  // Expand ~ to home
  if (cronPath.startsWith('~')) {
    cronPath = path.join(process.env.HOME || '', cronPath.slice(1))
  }

  const jobsFile = path.join(cronPath, 'jobs.json')
  if (!fs.existsSync(jobsFile)) {
    console.log(`\n  ATTENTION: ${jobsFile} introuvable. Le dashboard affichera des donnees vides.`)
  } else {
    console.log('  OK')
  }

  // 2. OPENCLAW_CLI_PATH
  const detectedCli = detectOpenclawCli()
  if (detectedCli) {
    console.log(`\n  Binaire openclaw detecte : ${detectedCli}`)
  } else {
    console.log('\n  Binaire openclaw non detecte dans le PATH.')
  }

  const cliPath = await ask(
    '  Chemin vers le binaire openclaw (laisser vide pour auto-detection)',
    detectedCli || ''
  )

  // 3. PORT
  const port = await ask('\n  Port du serveur', '3000')

  // Build .env.local content
  const lines = [
    `OPENCLAW_CRON_PATH=${cronPath}`,
  ]

  if (cliPath) {
    lines.push(`OPENCLAW_CLI_PATH=${cliPath}`)
  }

  if (port && port !== '3000') {
    lines.push(`PORT=${port}`)
  }

  lines.push('')

  fs.writeFileSync(ENV_FILE, lines.join('\n'), 'utf-8')
  console.log(`\n  .env.local cree avec succes !`)
  console.log('')
  console.log('  Prochaines etapes :')
  console.log('    npm run build')
  console.log('    npm start')
  console.log('')

  rl.close()
}

main().catch((err) => {
  console.error(err)
  rl.close()
  process.exit(1)
})
