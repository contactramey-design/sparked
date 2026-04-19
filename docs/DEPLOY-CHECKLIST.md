# Deploy checklist (Vercel + Railway)

Use this when configuring **Production** (and Preview if you need full flows there). Mirror variables from [`.env.example`](../.env.example).

## Verify after deploy

1. Open **`GET /api/setup-status`** on your production origin (no auth). It reports OpenAI, FAL, video worker, ElevenLabs, Stripe, Blob, cron, service-auth, and **AI Tutor** (HeyGen + OpenAI) status.
2. Open **`GET /api/config`** for client flags (`videoFeatureEnabled`, `homeworkAdventureConfigured`, `homeworkAdventurePaused`, `homeworkAllowUnauth`, `tutorAllowUnauth`, `aiTutorRequireCheckout`).

## Core homework / AI

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | Required for homework analyze/explain/story, process-homework, school weekly units. |
| `ALLOW_UNAUTH_HOMEWORK` | Dev/staging only: skips Stripe for homework APIs. **Do not** set on public production without other gates. |

## Stripe (Adventure Academy, ebooks)

| Variable | Notes |
|----------|--------|
| `STRIPE_SECRET_KEY` | Live or test key per environment. |
| `STRIPE_ACADEMY_PRICE_ID` | Adventure Academy subscription; `POST /api/create-checkout-session` always creates Academy checkout with `entitlement_type` `academy`. Homework/tutor/PDF subscriber downloads verify this session. |
| Checkout success/cancel URLs | Must allow `checkout_session_id` + `entitlement_type` query params (see `.env.example`). |
| `STRIPE_EBOOK_*_PRICE_ID` | One per ebook product. |

## Listen / TTS (ElevenLabs)

| Variable | Notes |
|----------|--------|
| `ELEVENLABS_API_KEY` | Required for cloud TTS via `POST /api/tts`. |
| `ELEVENLABS_VOICE_ID`, `ELEVENLABS_VOICE_ID_ES` | Optional ES voice. |
| `TTS_ALLOW_ORIGINS` | Comma-separated `https://` origins allowed to call `/api/tts` from the browser. |
| `SPARKI_SERVICE_SECRET` | Shared secret: video worker → Vercel TTS; lock worker `/generate` in production. |

**Streaming TTS:** `POST /api/tts-stream` uses the same **`ELEVENLABS_API_KEY`** and voice env vars as `/api/tts`; same **`TTS_ALLOW_ORIGINS`** / Bearer rules apply.

## AI Tutor Academy (`/ai-tutor`)

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | Required for `POST /api/tutor-chat` (GPT-4o). |
| `LIVEAVATAR_API_KEY` | Preferred for live avatar (`POST /api/liveavatar-session`). Fallback: `HEYGEN_API_KEY`. |
| `LIVEAVATAR_AVATAR_ID` | Real LiveAvatar avatar UUID (or `HEYGEN_TUTOR_AVATAR_ID`). Not `default`. |
| `LIVEAVATAR_CONTEXT_ID` | For FULL mode with voice; omit for LITE. |
| `LIVEAVATAR_VOICE_ID` / `HEYGEN_TUTOR_VOICE_ID` | Voice UUID for FULL mode. |
| `HEYGEN_API_KEY` | Optional fallback API key if `LIVEAVATAR_API_KEY` unset. |
| `ELEVENLABS_API_KEY` | Same as Listen — needed for voice playback when not using avatar speech, and for `/api/tts-stream`. |
| `ALLOW_UNAUTH_TUTOR` | Dev/staging only: skips Stripe on tutor APIs. **Do not** enable on public production. |
| `AI_TUTOR_REQUIRE_CHECKOUT` | **Unset (default):** text tutor allows **3 free user messages** without checkout; subscribe after that. **Live video:** `POST /api/liveavatar-session` with an **empty** `checkout_session_id` still returns a token (free tier, same abuse envelope as text); a **non-empty** id must pass Academy verification. Set `AI_TUTOR_REQUIRE_CHECKOUT` to **`true`** only for optional `GET /api/config` → `aiTutorRequireCheckout`. `ALLOW_UNAUTH_TUTOR=true` skips paid checks entirely (dev only). |
| `HOMEWORK_ADVENTURE_PAUSED` | Set to **`true`** to turn off Homework Adventure Video (Claude + TTS + worker) with a friendly “paused” UI while you market other features. |
| `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `TUTOR_LEAD_NOTIFY_TO` | Optional: **`POST /api/tutor-lead`** emails you when a parent submits from the “3 more free messages” modal (`GET /api/config` → `tutorLeadCaptureEnabled`). |
| `TUTOR_LEAD_WEBHOOK_URL` | Optional: same lead POST as JSON (Zapier/Make). Optional `TUTOR_LEAD_WEBHOOK_SECRET` → `Authorization: Bearer …`. |

Entitlement: **`POST /api/tutor-chat`** allows **3 user messages** without a paid session, then returns `TUTOR_FREE_LIMIT` until Adventure Academy checkout is stored; with a valid session, unlimited. `ALLOW_UNAUTH_TUTOR=true` skips paid checks. **`POST /api/liveavatar-session`**: empty `checkout_session_id` → token for unpaid preview (client should only call while free tries remain); non-empty id → must verify Academy unless `ALLOW_UNAUTH_TUTOR=true`.

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
