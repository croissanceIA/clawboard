'use server'

import crypto from 'crypto'
import { exec } from 'child_process'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { templates, preInstructions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { readJobs, writeJobs } from '@/lib/cron/reader'
import type { Template } from '@/components/tasks/types'
import type { RawJob } from '@/lib/cron/types'

export async function createTemplate(
  data: Omit<Template, 'id' | 'executionCount' | 'createdAt' | 'updatedAt'>
) {
  const now = new Date().toISOString()
  db.insert(templates).values({
    id: crypto.randomUUID(),
    name: data.name,
    skillName: data.skillName,
    instructions: data.instructions,
    preInstructions: data.preInstructions,
    agentId: data.agentId,
    deliveryChannel: data.deliveryChannel,
    deliveryRecipient: data.deliveryRecipient,
    model: data.model,
    cronJobId: data.cronJobId,
    executionCount: 0,
    createdAt: now,
    updatedAt: now,
  }).run()
  revalidatePath('/tasks')
}

export async function updateTemplate(id: string, updates: Partial<Template>) {
  const now = new Date().toISOString()
  const { id: _id, createdAt: _ca, executionCount: _ec, ...rest } = updates
  db.update(templates)
    .set({ ...rest, updatedAt: now })
    .where(eq(templates.id, id))
    .run()
  revalidatePath('/tasks')
}

export async function deleteTemplate(id: string) {
  db.delete(templates).where(eq(templates.id, id)).run()
  revalidatePath('/tasks')
}

export async function runNow(templateId: string) {
  const tpl = db.select().from(templates).where(eq(templates.id, templateId)).get()
  if (!tpl) return

  const pre = db.select().from(preInstructions).where(eq(preInstructions.id, 1)).get()

  const parts = [
    pre?.content,
    tpl.preInstructions,
    tpl.skillName ? `Utilise le skill ${tpl.skillName}, lis attentivement ses instructions et exécute-les.` : null,
    tpl.instructions,
  ].filter(Boolean).join('\n\n---\n\n')

  const escaped = parts.replace(/'/g, "'\\''")
  const cmd = `/opt/homebrew/bin/openclaw agent -m '${escaped}'`
  exec(cmd, { env: { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH}` } }, (error, stdout, stderr) => {
    if (error) console.error('[runNow] exec error:', error.message)
    if (stderr) console.error('[runNow] stderr:', stderr)
    if (stdout) console.log('[runNow] stdout:', stdout)
  })

  // Increment execution count
  db.update(templates)
    .set({ executionCount: tpl.executionCount + 1, updatedAt: new Date().toISOString() })
    .where(eq(templates.id, templateId))
    .run()

  revalidatePath('/tasks')
}

export async function toggleSchedule(cronJobId: string, enabled: boolean) {
  const jobs = readJobs()
  const job = jobs.find((j) => j.id === cronJobId)
  if (!job) return
  job.enabled = enabled
  job.updatedAtMs = Date.now()
  writeJobs(jobs)
  revalidatePath('/tasks')
}

export async function createSchedule(data: {
  templateId: string
  cronExpression: string
  timezone: string
}) {
  const jobs = readJobs()
  const tpl = db.select().from(templates).where(eq(templates.id, data.templateId)).get()
  if (!tpl) return

  const jobId = `clawboard-${crypto.randomUUID().slice(0, 8)}`
  const now = Date.now()

  // Build the full message from pre-instructions + template
  const pre = db.select().from(preInstructions).where(eq(preInstructions.id, 1)).get()
  const messageParts = [
    pre?.content,
    tpl.preInstructions,
    tpl.skillName ? `Utilise le skill ${tpl.skillName}, lis attentivement ses instructions et exécute-les.` : null,
    tpl.instructions,
  ].filter(Boolean).join('\n\n---\n\n')

  const newJob: RawJob = {
    id: jobId,
    agentId: tpl.agentId || 'main',
    name: tpl.name,
    enabled: true,
    createdAtMs: now,
    updatedAtMs: now,
    schedule: {
      kind: 'cron',
      expr: data.cronExpression,
      tz: data.timezone,
    },
    sessionTarget: 'isolated',
    wakeMode: 'now',
    payload: {
      kind: 'agentTurn',
      message: messageParts,
      model: tpl.model || undefined,
    },
    state: {
      nextRunAtMs: 0,
      lastRunAtMs: 0,
      lastStatus: '',
      lastDurationMs: 0,
      consecutiveErrors: 0,
    },
    delivery: tpl.deliveryChannel ? {
      mode: 'announce',
      bestEffort: true,
      channel: tpl.deliveryChannel,
      to: tpl.deliveryRecipient ? `channel:${tpl.deliveryRecipient}` : undefined,
    } : undefined,
  }

  jobs.push(newJob)
  writeJobs(jobs)

  // Link template to cron job
  db.update(templates)
    .set({ cronJobId: jobId, updatedAt: new Date().toISOString() })
    .where(eq(templates.id, data.templateId))
    .run()

  revalidatePath('/tasks')
}

export async function updateSchedule(
  cronJobId: string,
  updates: { cronExpression?: string; timezone?: string; enabled?: boolean }
) {
  const jobs = readJobs()
  const job = jobs.find((j) => j.id === cronJobId)
  if (!job) return

  if (updates.cronExpression !== undefined) job.schedule.expr = updates.cronExpression
  if (updates.timezone !== undefined) job.schedule.tz = updates.timezone
  if (updates.enabled !== undefined) job.enabled = updates.enabled
  job.updatedAtMs = Date.now()

  writeJobs(jobs)
  revalidatePath('/tasks')
}

export async function deleteSchedule(cronJobId: string) {
  const jobs = readJobs()
  const filtered = jobs.filter((j) => j.id !== cronJobId)
  writeJobs(filtered)

  // Clear cronJobId from template
  const tpl = db.select().from(templates).where(eq(templates.cronJobId, cronJobId)).get()
  if (tpl) {
    db.update(templates)
      .set({ cronJobId: null, updatedAt: new Date().toISOString() })
      .where(eq(templates.id, tpl.id))
      .run()
  }

  revalidatePath('/tasks')
}

export async function savePreInstructions(content: string) {
  const now = new Date().toISOString()
  db.update(preInstructions)
    .set({ content, updatedAt: now })
    .where(eq(preInstructions.id, 1))
    .run()
  revalidatePath('/tasks')
}
