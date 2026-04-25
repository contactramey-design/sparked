# Homework Adventure – Complete These Steps

Follow in order. You need: Vercel project with OpenAI connected, Railway account, and this repo deployed on Vercel.

**Check what’s configured (no secrets):** Open **`/api/setup-status`** in the browser (e.g. `https://your-app.vercel.app/api/setup-status` or `http://localhost:3001/api/setup-status`). It tells you what is set and what to add. See also **docs/CONNECTED-ACCOUNTS-SETUP.md** for the full checklist (GitHub, Vercel, Railway, OpenAI, ElevenLabs, Blob).

---

## Setup complete — you're done when

1. **`/api/setup-status`** shows all four sections with positive messages (homeworkAdventure configured, video featureEnabled + workerConfigured, tts configured, blob configured).
2. **Homework Adventure** in the app: upload image → Create adventure → you see steps.
3. **Create video** appears; when you click it, a video loads and plays (or you see a clear error from the worker; check Railway logs if needed).

If anything above fails, use the messages on `/api/setup-status` and the checklist in **docs/CONNECTED-ACCOUNTS-SETUP.md**. After changing env vars, **redeploy** both Vercel and (if you changed worker vars) Railway.

---

## Step 1: Vercel Blob (for video + cron)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → your **sparkyedu** project.
2. Open **Storage** in the top nav (or **Settings** → **Storage**).
3. Click **Create Database** → choose **Blob** → Create.
4. Open the new Blob store → **Tokens** (or **Create token**).
5. Create a **Read-Write** token. Copy the value (starts with `vercel_blob_rw_`). You will use it in Step 2 (Railway) and Step 4 (Vercel env).

---

## Step 2: Deploy the video worker on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard) → **New Project**.
2. Choose **Deploy from GitHub repo** → select the **sparkyedu** repo.
3. After the service is created, open it → **Settings** (or **Variables**).
4. Set **Root Directory** to `worker` (no leading slash — so Railway builds and runs only the `worker` folder).
5. Open **Variables** and add (replace placeholders with your real values):

   | Name | Value |
   |------|--------|
   | `TTS_URL` | `https://YOUR_VERCEL_APP.vercel.app/api/tts` |
   | `BLOB_READ_WRITE_TOKEN` | The token from Step 1 |
   | `ASSET_BASE_URL` | `https://YOUR_VERCEL_APP.vercel.app` |

   All three variables are required. Use your actual Vercel URL (e.g. `https://sparkyedu.vercel.app` or your custom domain). No trailing slash on ASSET_BASE_URL or TTS_URL.

6. Trigger a **Redeploy** if the service already deployed before you set the variables.
7. Open **Settings** → **Networking** / **Public Networking** → generate a **Public domain** if you don’t have one.
8. Copy the public URL (e.g. `https://sparkyedu-adventure-video-worker-production.up.railway.app`). You need it for Step 4.

---

## Step 3: Confirm ElevenLabs (optional but needed for video TTS)

- For the worker to generate narration, your app must serve TTS. If you use ElevenLabs, set **ELEVENLABS_API_KEY** (and optional **ELEVENLABS_VOICE_ID**, etc.) in **Vercel** → Project → **Settings** → **Environment Variables** (same place as `OPENAI_API_KEY`). The worker calls your `/api/tts` endpoint, so as long as that works in production, you’re set.

---

## Step 4: Enable video in Vercel

1. Vercel Dashboard → your project → **Settings** → **Environment Variables**.
2. Add or update:

   | Name | Value | Environments |
   |------|--------|----------------|
   | `VIDEO_FEATURE_ENABLED` | `true` | Production, Preview (optional) |
   | `VIDEO_WORKER_URL` | The Railway URL from Step 2 (no trailing slash) | Production, Preview (optional) |
   | `BLOB_READ_WRITE_TOKEN` | Same token from Step 1 | Production (needed for cron that deletes old videos) |

3. **Redeploy** the Vercel project (Deployments → ⋮ on latest → Redeploy) so the new variables are used.

---

## Step 5: Test the flow

**Local E2E (optional):** To test “Create adventure” locally, run `npm run dev:local` to start the app + local API (no Vercel login). Put `OPENAI_API_KEY` in `.env`, then open http://localhost:5173 and try Homework Adventure. Or use `npm run dev:vercel` for the same API as production.

**Deployed:**

1. Open your live app → go to **Homework Adventure** (e.g. `/homework`).
2. Select a homework image (JPG/PNG) and click **Create adventure**.
3. The **parent consent** modal should appear. Enter an email and check the box → **I agree**. The adventure should generate (OpenAI).
4. You should see a **Create video** button. Click it. After the worker runs, a video player should appear with Sparki’s adventure.

If **Create video** never appears or you get 403, check:

- `VIDEO_FEATURE_ENABLED` is exactly `true` in Vercel.
- `VIDEO_WORKER_URL` is the full Railway URL with no trailing slash.
- Redeploy Vercel after changing env vars.

If video creation fails (500 or worker error), check Railway logs and that `TTS_URL`, `BLOB_READ_WRITE_TOKEN`, and `ASSET_BASE_URL` are set correctly in Railway.

---

## Verify connections

- **Vercel:** `VIDEO_FEATURE_ENABLED` = `true`, `VIDEO_WORKER_URL` = Railway public URL (no trailing slash), `BLOB_READ_WRITE_TOKEN` set. Redeploy after env changes.
- **Railway:** Root Directory = `worker`, Variables: `TTS_URL`, `BLOB_READ_WRITE_TOKEN`, `ASSET_BASE_URL`. Public domain enabled under Networking.
- **Blob:** Token created from the Blob store’s **Tokens** (not account-level). Same token used on Vercel and Railway.

---

## After adding OpenAI credits – redeploy and full test

1. **Redeploy Vercel** so the app uses your key and credits:  
   Vercel → your project → **Deployments** → **⋮** on latest → **Redeploy** (or push a new commit to trigger a deploy).
2. **Test in the browser:** Open your live app → **Homework Adventure** → choose a small JPG/PNG → consent → **Create adventure**. You should get an adventure (one request uses a small amount of OpenAI credit).
3. **Full test from terminal (optional):**  
   - Add **OPENAI_API_KEY** to a `.env` in the project root (same value as Vercel).  
   - Run `npm run dev:api`.  
   - In another terminal: `./scripts/test-homework-api.sh http://localhost:3001`.  
   - You should see HTTP 200 and "OK: Got adventure with title" / "Got steps".

---

## Debug: Create adventure returns 500 or does not work

1. **Check config:** Open `https://YOUR_APP.vercel.app/api/config`. You should see `homeworkAdventureConfigured: true`. If `false`, add **OPENAI_API_KEY** in Vercel → Settings → Environment Variables, then Redeploy.
2. **Vercel logs:** Deployments → latest → Functions / Logs. After trying Create adventure, look for `[process-homework]` — the next message is the real error.
3. **Local test:** Run `npm run dev:local`, add **OPENAI_API_KEY** to `.env`, use a small JPG/PNG under 4 MB.
4. **Script:** With `npm run dev:api` running, run `./scripts/test-homework-api.sh http://localhost:3001`.

---

## Quick reference: where each variable goes

| Variable | Where to set it | Used for |
|----------|------------------|----------|
| `OPENAI_API_KEY` | Vercel | Homework → adventure text (already done) |
| `ELEVENLABS_API_KEY` | Vercel | TTS for Listen + video narration |
| `VIDEO_FEATURE_ENABLED` | Vercel | Show “Create video” and allow calls to worker |
| `VIDEO_WORKER_URL` | Vercel | URL of the Railway worker |
| `BLOB_READ_WRITE_TOKEN` | Vercel | Cron job: delete old videos |
| `BLOB_READ_WRITE_TOKEN` | Railway (worker) | Worker uploads MP4 to Blob |
| `TTS_URL` | Railway (worker) | Worker calls your app for narration |
| `ASSET_BASE_URL` | Railway (worker) | Worker fetches manifest + images from your app |
