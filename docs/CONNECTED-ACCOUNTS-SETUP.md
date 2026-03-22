# Connected Accounts & APIs – Full Checklist

Use this to verify **every** connection for Homework Adventure and video generation.  
**Quick check:** Open `https://YOUR_APP.vercel.app/api/setup-status` (or `http://localhost:3001/api/setup-status` when running `npm run dev:api`). Expect **`schemaVersion`: `3`** and optional **`deployment.gitCommitSha`** (Vercel) so you know Production matches Git.

**School pilots:** [SUPABASE-PILOT-SETUP.md](./SUPABASE-PILOT-SETUP.md), [PILOT-RUNBOOK.md](./PILOT-RUNBOOK.md), [PILOT-INFRA-CHECKLIST.md](./PILOT-INFRA-CHECKLIST.md).  
**Spend / quotas:** [BILLING-AND-QUOTAS.md](./BILLING-AND-QUOTAS.md).

---

## 1. GitHub

- [ ] Repo **sparkyedu** (or your fork) exists and has the latest code.
- [ ] **Vercel** is connected to this repo (Vercel → Project → Settings → Git).
- [ ] **Railway** is connected to the same repo (Railway → New Project → Deploy from GitHub → select repo).
- Pushes to main (or your production branch) trigger a Vercel deploy. Railway deploys when you connect and on push if you enabled it.

---

## 2. Vercel (sparkyedu project)

**Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**.

| Variable | Required for | Value | Notes |
|----------|----------------------|--------|--------|
| `OPENAI_API_KEY` | Create adventure | `sk-...` from OpenAI | Must have billing/credits. |
| `ELEVENLABS_API_KEY` | TTS + video narration | From ElevenLabs | Worker calls `/api/tts`. |
| `VIDEO_FEATURE_ENABLED` | Create video button | `true` | Exact string. |
| `VIDEO_WORKER_URL` | Video generation | `https://YOUR-RAILWAY-SERVICE.up.railway.app` | No trailing slash. From Railway → Settings → Networking → Public domain. |
| `BLOB_READ_WRITE_TOKEN` | Cron cleanup + worker | `vercel_blob_rw_...` | From Vercel Storage → Blob store → Tokens → Create (Read-Write). Same token also goes on Railway. |

- [ ] All of the above set for **Production** (and Preview if you use preview URLs).
- [ ] **Redeploy** after any change (Deployments → ⋮ → Redeploy).

---

## 3. Vercel Blob

- [ ] In Vercel → **Storage** → **Blob** → create a store if you don’t have one.
- [ ] Open the store → **Tokens** → **Create token** → Read-Write → copy value.
- [ ] That value is `BLOB_READ_WRITE_TOKEN` on **Vercel** and on **Railway** (worker).

---

## 4. OpenAI

- [ ] Account has **billing** and **credits** (GPT-4o needs paid/usage).
- [ ] [platform.openai.com](https://platform.openai.com) → **API keys** → create key → copy.
- [ ] Paste as `OPENAI_API_KEY` in Vercel (and in `.env` for local dev).

---

## 5. ElevenLabs (for TTS and video narration)

- [ ] [elevenlabs.io](https://elevenlabs.io) → API key.
- [ ] Set `ELEVENLABS_API_KEY` in **Vercel** (and `.env` locally). Optional: `ELEVENLABS_VOICE_ID` etc.

---

## 6. Railway (video worker)

**Dashboard:** [railway.app/dashboard](https://railway.app/dashboard) → your project → your **service**.

- [ ] **Root Directory:** `worker` (no leading slash).
- [ ] **Variables** (service → Variables):

| Variable | Value |
|----------|--------|
| `TTS_URL` | `https://YOUR_VERCEL_APP.vercel.app/api/tts` |
| `BLOB_READ_WRITE_TOKEN` | Same token as Vercel Blob |
| `ASSET_BASE_URL` | `https://YOUR_VERCEL_APP.vercel.app` (no trailing slash) |

- [ ] **Networking:** Public domain generated; copy the URL (e.g. `https://xxx.up.railway.app`).
- [ ] Paste that URL into **Vercel** as `VIDEO_WORKER_URL`.
- [ ] Redeploy the Railway service after changing variables.

---

## 7. Verify without logging in

- **Setup status (no secrets):**  
  `GET https://YOUR_APP.vercel.app/api/setup-status`  
  You should see something like:
  - `homeworkAdventure.configured: true`
  - `video.featureEnabled: true`, `video.workerConfigured: true`
  - `tts.configured: true`
  - `blob.configured: true`

- **Config (feature flags):**  
  `GET https://YOUR_APP.vercel.app/api/config`  
  Expect `homeworkAdventureConfigured: true` and `videoFeatureEnabled: true`.

- **Worker health:**  
  `GET https://YOUR_RAILWAY_URL/health`  
  Expect `{ "ok": true }`.

---

## 8. End-to-end test

1. Open app → **Homework Adventure**.
2. Upload image → consent → **Create adventure** → you get steps (OpenAI).
3. Click **Create video** → after a short wait, video player appears (worker + TTS + Blob).

If step 2 fails: check OpenAI key and billing; check `/api/setup-status` and Vercel logs.  
If step 3 fails: the UI shows the worker’s error when possible (e.g. "TTS failed: 503", "Worker not configured: TTS_URL and BLOB_READ_WRITE_TOKEN required", "No images in manifest"). Check Railway → your service → **Logs** for the full stack trace. Fix the missing env var on Railway or Vercel, then redeploy.

---

## Final checklist (all in one place)

- [ ] **Vercel** env: OPENAI_API_KEY, ELEVENLABS_API_KEY, VIDEO_FEATURE_ENABLED=true, VIDEO_WORKER_URL=Railway URL, BLOB_READ_WRITE_TOKEN
- [ ] **Railway** service: Root dir `worker`; vars TTS_URL, BLOB_READ_WRITE_TOKEN, ASSET_BASE_URL; public domain set; that URL = VIDEO_WORKER_URL on Vercel
- [ ] **Redeployed** Vercel and Railway after any env change
- [ ] **/api/setup-status** shows everything configured
- [ ] **Flow test:** Create adventure then Create video; video plays
