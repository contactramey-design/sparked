# Homework Adventure – Complete These Steps

Follow in order. You need: Vercel project with OpenAI connected, Railway account, and this repo deployed on Vercel.

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
4. Set **Root Directory**: `worker` (so Railway builds and runs only the `worker` folder).
5. Open **Variables** and add (replace placeholders with your real values):

   | Name | Value |
   |------|--------|
   | `TTS_URL` | `https://YOUR_VERCEL_APP.vercel.app/api/tts` |
   | `BLOB_READ_WRITE_TOKEN` | The token from Step 1 |
   | `ASSET_BASE_URL` | `https://YOUR_VERCEL_APP.vercel.app` |

   Use your actual Vercel URL (e.g. `https://sparkyedu.vercel.app` or your custom domain). No trailing slash.

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

1. Open your live app → go to **Homework Adventure** (e.g. `/homework`).
2. Select a homework image (JPG/PNG) and click **Create adventure**.
3. The **parent consent** modal should appear. Enter an email and check the box → **I agree**. The adventure should generate (OpenAI).
4. You should see a **Create video** button. Click it. After the worker runs, a video player should appear with SpArki’s adventure.

If **Create video** never appears or you get 403, check:

- `VIDEO_FEATURE_ENABLED` is exactly `true` in Vercel.
- `VIDEO_WORKER_URL` is the full Railway URL with no trailing slash.
- Redeploy Vercel after changing env vars.

If video creation fails (500 or worker error), check Railway logs and that `TTS_URL`, `BLOB_READ_WRITE_TOKEN`, and `ASSET_BASE_URL` are set correctly in Railway.

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
