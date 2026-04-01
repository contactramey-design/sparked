import { useCallback, useMemo, useState } from 'react'
import type { HomeworkJob } from '../types/homework'

const STORAGE_KEY = 'sparki_homework_jobs_v1'
const MAX_JOBS = 20
const MAX_PREVIEW_CHARS = 400_000

function readAll(): HomeworkJob[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(jobs: HomeworkJob[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  } catch {
    // quota exceeded — drop oldest
    const trimmed = jobs.slice(0, Math.max(1, Math.floor(jobs.length / 2)))
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch {
      // ignore
    }
  }
}

export function getHomeworkJob(jobId: string): HomeworkJob | null {
  return readAll().find((j) => j.jobId === jobId) ?? null
}

export function saveHomeworkJob(job: HomeworkJob): void {
  const preview =
    job.previewDataUrl && job.previewDataUrl.length > MAX_PREVIEW_CHARS
      ? undefined
      : job.previewDataUrl
  const next: HomeworkJob = { ...job, previewDataUrl: preview }
  const all = readAll().filter((j) => j.jobId !== next.jobId)
  all.unshift(next)
  writeAll(all.slice(0, MAX_JOBS))
}

export function useHomeworkJob(jobId: string | undefined) {
  const [, bump] = useState(0)
  const refresh = useCallback(() => bump((n) => n + 1), [])

  const job = useMemo(() => {
    if (!jobId) return null
    return getHomeworkJob(jobId)
  }, [jobId, bump])

  const updateJob = useCallback(
    (updated: HomeworkJob) => {
      saveHomeworkJob(updated)
      refresh()
    },
    [refresh],
  )

  return { job, updateJob, refresh }
}

export function listHomeworkJobs(): HomeworkJob[] {
  return readAll()
}
