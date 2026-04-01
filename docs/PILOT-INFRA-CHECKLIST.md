# Pilot infrastructure checklist (Vercel + APIs)

Use this before demos or school pilot kickoff. Full program context: [PILOT-RUNBOOK.md](./PILOT-RUNBOOK.md).

## 1. Confirm the live deployment matches Git

1. Push your intended commit to the branch Vercel builds (usually `main`).
2. Wait for the Vercel deployment to finish (**Production**).
3. Open:

   `https://YOUR_DOMAIN/api/setup-status`

4. Verify:
   - **`schemaVersion` is `5`** (if lower, Production is on an old serverless bundle — redeploy).
   - **`deployment.environment`** is `"production"` when testing prod.
   - **`deployment.gitCommitSha`** matches your latest commit on GitHub (full SHA from Vercel build logs if needed).

## 2. Environment variables (Vercel → Settings → Environment Variables)

Copy from [.env.example](../.env.example) and [CONNECTED-ACCOUNTS-SETUP.md](./CONNECTED-ACCOUNTS-SETUP.md). Minimum for a **full** pilot that includes homework + video + Listen:

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Homework Adventure (`/api/process-homework`) |
| `FAL_KEY` | Optional scene art (`/api/generate-visuals`, Flux via fal.ai) |
| `ELEVENLABS_API_KEY` | Listen buttons + worker TTS (`/api/tts`) |
| `BLOB_READ_WRITE_TOKEN` | Blob uploads / cron |
| `VIDEO_FEATURE_ENABLED` | `true` to show Create video |
| `VIDEO_WORKER_URL` | Public worker URL |
| `CRON_SECRET` | Optional: lock `/api/cron/cleanup-adventure-videos` (match Vercel Cron job secret) |
| `SPARKI_SERVICE_SECRET` | Recommended: lock video worker `/generate` and authenticate worker → `/api/tts` |
| `TTS_ALLOW_ORIGINS` | With secret set: comma-separated `https://` origins for Listen buttons |
| Stripe vars | Only if pilots use paid bundle / ebooks / homework entitlement |

Set for **Production** (and **Preview** if you test preview URLs). **Redeploy** after any change.

## 3. Interpret `setup-status` (quick)

| Field | Meaning |
|-------|---------|
| `homeworkAdventure.configured` | `OPENAI_API_KEY` non-empty |
| `sceneArt.configured` | `FAL_KEY` non-empty |
| `video.featureEnabled` | `VIDEO_FEATURE_ENABLED === 'true'` |
| `video.workerConfigured` | `VIDEO_WORKER_URL` set |
| `tts.configured` | `ELEVENLABS_API_KEY` non-empty |
| `tts.keyAcceptedByElevenLabs` | Live check: ElevenLabs accepted the key (GET `/v1/voices`) |
| `tts.generationQuotaNote` | Reminder: voices check ≠ generation credits; `quota_exceeded` still possible on `/api/tts` |
| `stripe.configured` | `STRIPE_SECRET_KEY` non-empty (paid checkout / entitlement) |
| `blob.configured` | Blob token present |

## 4. Optional checks

- `GET /api/video-worker-health` — worker reachability from Vercel.
- Worker service: `GET https://YOUR_WORKER/health` — `{ "ok": true }`.

## 5. School pilots only

If the pilot is **Supabase-only** (no homework/video), you still need **frontend** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on Vercel (see [SUPABASE-PILOT-SETUP.md](./SUPABASE-PILOT-SETUP.md)).
