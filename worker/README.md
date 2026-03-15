# Homework Adventure Video Worker

Builds a short MP4 (images + TTS narration) from adventure JSON. Deploy to **Railway** (or Render / Fly.io).

## Deploy on Railway

1. **Create a new project** in [Railway](https://railway.app):
   - New Project → Deploy from GitHub repo.
   - Set **Root Directory** to `worker` (so Railway uses this folder, not the repo root).

2. **Set environment variables** in Railway → your service → Variables:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `TTS_URL` | Yes | Your app’s TTS endpoint. Use your Vercel URL: `https://YOUR_APP.vercel.app/api/tts` (so the worker calls your app for narration). |
   | `BLOB_READ_WRITE_TOKEN` | Yes | From Vercel: Dashboard → Storage → create or open a Blob store → “Create token” (read-write). Paste here so the worker can upload the generated MP4. |
   | `ASSET_BASE_URL` | Yes | Base URL of your main app so the worker can fetch the asset manifest and images. Use your Vercel URL: `https://YOUR_APP.vercel.app` (no trailing slash). |
   | `PORT` | No | Railway sets this automatically. |

3. **Deploy**: Push to your repo or use Railway’s deploy from the `worker` directory. Railway will run `npm install` and `npm start` (`node index.js`).

4. **Copy the public URL**: Railway gives you a URL like `https://your-service.up.railway.app`. You need this for Vercel.

## Vercel configuration (after worker is live)

In your **Vercel** project (Dashboard → Project → Settings → Environment Variables), add:

- `VIDEO_FEATURE_ENABLED` = `true`
- `VIDEO_WORKER_URL` = `https://your-service.up.railway.app` (the Railway URL from step 4, no trailing slash)

Redeploy the Vercel app so the “Create video” button appears and the app can call the worker.

## Local run (optional)

```bash
cd worker
npm install
TTS_URL=https://YOUR_VERCEL_APP.vercel.app/api/tts \
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx \
ASSET_BASE_URL=https://YOUR_VERCEL_APP.vercel.app \
npm run dev
```

The worker listens on port 3333 (or `PORT`). It does not run FFmpeg in the browser; deploy to Railway (or a server with Node + FFmpeg) for full video generation.
