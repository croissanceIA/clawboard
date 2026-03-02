'use server'

import { exec } from 'child_process'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { templates, preInstructions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { readJobs, writeJobs } from '@/lib/cron/reader'
import type { TaskEditPayload } from '@/components/task-detail/types'

export async function runAgainTask(cronJobId: string) {
  const tpl = db.select().from(templates).where(eq(templates.cronJobId, cronJobId)).get()

  let message: string
  if (tpl) {
    const pre = db.select().from(preInstructions).where(eq(preInstructions.id, 1)).get()
    const parts = [
      pre?.content,
      tpl.preInstructions,
      tpl.skillName ? `Utilise le skill ${tpl.skillName}, lis attentivement ses instructions et exécute-les.` : null,
      tpl.instructions,
    ].filter(Boolean).join('\n\n---\n\n')
    message = parts

    // Increment execution count
    db.update(templates)
      .set({ executionCount: tpl.executionCount + 1, updatedAt: new Date().toISOString() })
      .where(eq(templates.id, tpl.id))
      .run()
  } else {
    // Fallback to raw job payload
    const jobs = readJobs()
    const job = jobs.find((j) => j.id === cronJobId)
    if (!job) return
    message = job.payload.message
  }

  const escaped = message.replace(/'/g, "'\\''")
  exec(`openclaw agent '${escaped}'`)

  revalidatePath('/tasks')
  revalidatePath(`/tasks/${cronJobId}`)
}

export async function editTask(cronJobId: string, updates: TaskEditPayload) {
  const jobs = readJobs()
  const job = jobs.find((j) => j.id === cronJobId)
  if (!job) return

  // Update job name in jobs.json
  job.name = updates.name
  job.updatedAtMs = Date.now()
  writeJobs(jobs)

  // Update template instructions in SQLite if linked
  const tpl = db.select().from(templates).where(eq(templates.cronJobId, cronJobId)).get()
  if (tpl) {
    db.update(templates)
      .set({
        name: updates.name,
        instructions: updates.instructions,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(templates.id, tpl.id))
      .run()
  }

  revalidatePath('/tasks')
  revalidatePath(`/tasks/${cronJobId}`)
}

export async function archiveTask(cronJobId: string) {
  const jobs = readJobs()
  const job = jobs.find((j) => j.id === cronJobId)
  if (!job) return

  job.enabled = false
  job.updatedAtMs = Date.now()
  writeJobs(jobs)

  revalidatePath('/tasks')
  revalidatePath(`/tasks/${cronJobId}`)
}

export async function deleteTask(cronJobId: string) {
  const jobs = readJobs()
  const filtered = jobs.filter((j) => j.id !== cronJobId)
  writeJobs(filtered)

  // Unlink template
  const tpl = db.select().from(templates).where(eq(templates.cronJobId, cronJobId)).get()
  if (tpl) {
    db.update(templates)
      .set({ cronJobId: null, updatedAt: new Date().toISOString() })
      .where(eq(templates.id, tpl.id))
      .run()
  }

  revalidatePath('/tasks')
  revalidatePath(`/tasks/${cronJobId}`)
}
