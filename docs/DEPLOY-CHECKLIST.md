# Deploy checklist (Vercel + Railway)

Use this when configuring **Production** (and Preview if you need full flows there). Mirror variables from [`.env.example`](../.env.example).

## Verify after deploy

1. Open **`GET /api/setup-status`** on your production origin (no auth). It reports OpenAI, FAL, video worker, ElevenLabs, Stripe, Blob, cron, and service-auth status.
2. Open **`GET /api/config`** for client flags (`videoFeatureEnabled`, `homeworkAdventureConfigured`, `homeworkAllowUnauth`).

## Core homework / AI

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | Required for homework analyze/explain/story, process-homework, school weekly units. |
| `ALLOW_UNAUTH_HOMEWORK` | Dev/staging only: skips Stripe for homework APIs. **Do not** set on public production without other gates. |

## Stripe (Safety Pass, ebooks)

| Variable | Notes |
|----------|--------|
| `STRIPE_SECRET_KEY` | Live or test key per environment. |
| `STRIPE_SAFETY_PASS_PRICE_ID`, checkout success/cancel URLs | As in `.env.example`. |
| `STRIPE_EBOOK_*_PRICE_ID` | One per ebook product. |

## Listen / TTS (ElevenLabs)

| Variable | Notes |
|----------|--------|
| `ELEVENLABS_API_KEY` | Required for cloud TTS via `POST /api/tts`. |
| `ELEVENLABS_VOICE_ID`, `ELEVENLABS_VOICE_ID_ES` | Optional ES voice. |
| `TTS_ALLOW_ORIGINS` | Comma-separated `https://` origins allowed to call `/api/tts` from the browser. |
| `SPARKI_SERVICE_SECRET` | Shared secret: video worker → Vercel TTS; lock worker `/generate` in production. |

## Optional scene art (homework)

| Variable | Notes |
|----------|--------|
| `FAL_KEY` | Enables `POST /api/generate-visuals` (Flux via fal.ai). |

## Video worker (Vercel + Railway)

**Vercel**

| Variable | Notes |
|----------|--------|
| `VIDEO_FEATURE_ENABLED` | `true` to show video UI. |
| `VIDEO_WORKER_URL` | Public URL of the worker service. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob; cron cleanup uses it. |

**Railway worker** (`worker/` root)

| Variable | Notes |
|----------|--------|
| `TTS_URL` | `https://<your-app>.vercel.app/api/tts` |
| `BLOB_READ_WRITE_TOKEN` | Same token as Vercel. |
| `ASSET_BASE_URL` | Same origin as the app (for returned URLs). |
| `SPARKI_SERVICE_SECRET` | Same value as Vercel. |

## Cron (optional)

| Variable | Notes |
|----------|--------|
| `CRON_SECRET` | Vercel Cron `Authorization: Bearer` for `/api/cron/cleanup-adventure-videos`. |

## School pilots (Supabase) — **build-time on Vercel**

These are **`VITE_`** prefixed: they are baked in at **build** time, not read by `setup-status`.

| Variable | Notes |
|----------|--------|
| `VITE_SUPABASE_URL` | Project URL. |
| `VITE_SUPABASE_ANON_KEY` | Anon public key. |

After changing them, **redeploy** the frontend. Confirm in-app: Teacher Dashboard and weekly track should connect; if unset, `supabase` is null and those UIs show a graceful message.

## Optional marketing / demo

| Variable | Notes |
|----------|--------|
| `VITE_SCHOOL_DEMO_VIDEO_URL` | HeyGen embed, YouTube, or direct `.mp4`/`.webm` for For Schools demo. |

## Local development

- Run **`npm run dev:local`** (Vite + `server/local-api.js` on port 3001) so `/api/*` matches production routes including **`/api/tts`**.
- **`npm run dev`** alone proxies `/api` to 3001; TTS also works via Vite middleware for some paths—prefer `dev:local` for full parity.
