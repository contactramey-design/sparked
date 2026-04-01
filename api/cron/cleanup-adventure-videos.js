/**
 * Vercel Cron: DELETE old adventure videos from Blob (e.g. > 24h) for data minimization.
 * Schedule in vercel.json: "0 2 * * *" (daily 02:00 UTC).
 */
import { list, del } from '@vercel/blob'

const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

export const config = {
  maxDuration: 60,
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const cronSecret = process.env.CRON_SECRET?.trim()
  if (cronSecret) {
    const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : ''
    if (auth !== `Bearer ${cronSecret}`) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    res.status(503).json({ error: 'BLOB_READ_WRITE_TOKEN not set' })
    return
  }

  try {
    const cutoff = new Date(Date.now() - MAX_AGE_MS)
    let cursor
    let deleted = 0
    do {
      const result = await list({
        prefix: 'adventure-videos/',
        limit: 100,
        cursor,
        token,
      })
      const toDelete = result.blobs.filter((b) => b.uploadedAt && new Date(b.uploadedAt) < cutoff).map((b) => b.url)
      if (toDelete.length > 0) {
        await del(toDelete, { token })
        deleted += toDelete.length
      }
      cursor = result.hasMore ? result.cursor : undefined
    } while (cursor)
    res.status(200).json({ ok: true, deleted })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Cleanup failed' })
  }
}
