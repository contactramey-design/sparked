# Debugging "Could not reach video worker"

Use this to pinpoint why Vercel cannot reach the Render video worker.

## 1. Confirm the worker is reachable from the internet

From your machine:

```bash
# Should return 200 and {"ok":true} (may take 30–60s if Render was sleeping)
curl -s "https://sparked-xz35.onrender.com/health"
```

If this fails or times out, the problem is with the Render service (down, wrong URL, or cold start). Fix Render first.

## 2. Test connectivity from Vercel to the worker

Your app has a **health-check endpoint** that runs the same `fetch(VIDEO_WORKER_URL/health)` from Vercel:

```bash
# Production (replace with your Vercel URL)
curl -s "https://www.sparkiedu.com/api/video-worker-health"
```

Response meaning:

- `"workerReachable": true` — Vercel can reach the worker. The "Could not reach" error is likely from the **/generate** call (timeout, worker crash, or 5xx). Check Vercel function logs for the worker response.
- `"workerReachable": false` with `"error"`, `"code"` — Vercel cannot reach the worker. Use the returned `code` and `error` to diagnose (see below).

## 3. Get the exact error from the generate endpoint

To see the **real** error (e.g. `ECONNREFUSED`, `ETIMEDOUT`, `ENOTFOUND`) in the API response:

**Option A – Header (one-off test):**

```bash
curl -s -X POST "https://www.sparkiedu.com/api/generate-adventure-video" \
  -H "Content-Type: application/json" \
  -H "X-Debug-Video-Worker: true" \
  -d '{"adventure":{"title":"T","subject":"math","topic":"add","steps":[{"id":"1","story":"x","prompt":"1+1","hint":"2"}]}}'
```

**Option B – Env (all requests until removed):**

In Vercel → Project → Settings → Environment Variables, add:

- `DEBUG_VIDEO_WORKER` = `true`

Redeploy, then trigger "Create video" once. The JSON error response will include a `debug` object with `code`, `message`, `cause`, and `url`. Remove `DEBUG_VIDEO_WORKER` after debugging.

## 4. What the error codes mean

| Code / message | Meaning | What to do |
|----------------|---------|------------|
| `ECONNREFUSED` | Nothing is listening at that host/port. | Wrong `VIDEO_WORKER_URL`, or Render service is down/crashed. Check Render dashboard and URL. |
| `ETIMEDOUT` / `AbortError` | Connection or response took too long. | Often Render cold start. We retry 3× with 4s delay; if it still fails, wake the worker (hit `/health`), then try again, or use a paid plan / keepalive ping. |
| `ENOTFOUND` | DNS could not resolve the hostname. | Typo in `VIDEO_WORKER_URL` (e.g. `sparked-xz35.onrender.com`). Fix in Vercel env and redeploy. |
| `ECONNRESET` | Connection was closed by the other side. | Can be intermittent (Render, network). Retry; if persistent, check Render logs and Vercel region. |

## 5. Checklist

- [ ] **Vercel env**  
  - `VIDEO_FEATURE_ENABLED` = `true`  
  - `VIDEO_WORKER_URL` = `https://sparked-xz35.onrender.com` (no trailing slash)  
  - Set for the environment you’re testing (Production / Preview).  
  - Redeploy after changing env.

- [ ] **Render**  
  - Service is deployed and running (dashboard shows "Live").  
  - Root directory = `worker`, start command = `node index.js`.  
  - Env: `TTS_URL`, `ASSET_BASE_URL`, `BLOB_READ_WRITE_TOKEN` (and any TTS keys the app needs).

- [ ] **First request after idle**  
  - Render free tier sleeps after ~15 min. First request can take 30–60 s.  
  - The API retries 3 times with 4 s delay. If it still fails, call `GET /api/video-worker-health` once to wake the worker, then try "Create video" again.

## 6. Retries and logging

- **Retries:** The generate endpoint tries the worker up to **3 times** with **4 s** between attempts.  
- **Logging:** Every failure is logged in Vercel (Project → Logs) with `code`, `message`, `cause`, and `url`. Use those when the response message isn’t enough.
