import fs from 'fs'
import path from 'path'
import type { RawJob, RawJobsFile, RawRunLine } from './types'

function getCronPath(): string {
  return process.env.OPENCLAW_CRON_PATH || ''
}

export function appendRun(jobId: string, entry: Record<string, unknown>): void {
  const cronPath = getCronPath()
  if (!cronPath) return
  const runsDir = path.join(cronPath, 'runs')
  if (!fs.existsSync(runsDir)) fs.mkdirSync(runsDir, { recursive: true })
  const filePath = path.join(runsDir, `${jobId}.jsonl`)
  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8')
}

export function readJobs(): RawJob[] {
  const cronPath = getCronPath()
  if (!cronPath) return []
  try {
    const filePath = path.join(cronPath, 'jobs.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed: RawJobsFile = JSON.parse(raw)
    return parsed.jobs || []
  } catch {
    return []
  }
}

export function writeJobs(jobs: RawJob[]): void {
  const cronPath = getCronPath()
  if (!cronPath) return
  const filePath = path.join(cronPath, 'jobs.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const existing: RawJobsFile = JSON.parse(raw)
  existing.jobs = jobs
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8')
}

export function readAllRuns(): Map<string, RawRunLine[]> {
  const cronPath = getCronPath()
  const result = new Map<string, RawRunLine[]>()
  if (!cronPath) return result
  try {
    const runsDir = path.join(cronPath, 'runs')
    if (!fs.existsSync(runsDir)) return result
    const files = fs.readdirSync(runsDir).filter((f) => f.endsWith('.jsonl'))
    for (const file of files) {
      const jobId = file.replace('.jsonl', '')
      const filePath = path.join(runsDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          try {
            return JSON.parse(line) as RawRunLine
          } catch {
            return null
          }
        })
        .filter((line): line is RawRunLine => line !== null)
      result.set(jobId, lines)
    }
  } catch {
    // graceful fallback
  }
  return result
}
