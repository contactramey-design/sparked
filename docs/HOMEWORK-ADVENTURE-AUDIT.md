# Homework Adventure – Audit (excluding OpenAI API)

Audit covers everything except the live OpenAI API call, to save test credits.

## Frontend (HomeworkAdventurePage)

| Area | Status | Notes |
|------|--------|--------|
| Config fetch | OK | Fetches `/api/config` on mount; sets `videoFeatureEnabled`, `homeworkConfigured`; cancelled on unmount |
| File selection | OK | Validates `image/*`; clears error/adventure; creates object URL for preview |
| FormData | OK | Appends `image` (correct field name for API) |
| Consent | OK | Session storage; email + checkbox validation; modal → doGenerate() |
| Submit flow | OK | No file → error; no consent → modal; else doGenerate() |
| doGenerate | OK | POST formData; parses JSON with fallback; validates title, subject, steps.length > 0; sets adventure or error; loading in finally |
| Error display | OK | API error message or generic; homeworkConfigured === false shows “not set up” and disables button |
| Adventure display | OK | Title, subject, topic; currentStep; story, prompt, hint (with ?? '') |
| Step navigation | OK | Prev/Next when steps.length > 1; currentStepIndex bounded |
| Video section | OK | Shown when videoFeatureEnabled === true; Create video → POST /api/generate-adventure-video; videoUrl or videoError |

## API: process-homework

| Area | Status | Notes |
|------|--------|--------|
| Config | OK | bodyParser: false for multipart |
| Multipart | OK | Formidable; maxFileSize 4.5 MB; files.image (array or single) |
| File extraction | OK | filepath, mimetype, readFile in one try; 400/413 on error |
| Response | OK | 200 JSON adventure; 500 with safeMessage; console.error for logs |
| (OpenAI call) | Not audited | Skipped to save credits |

## API: config

| Area | Status | Notes |
|------|--------|--------|
| GET | OK | Returns videoFeatureEnabled, homeworkAdventureConfigured |

## API: generate-adventure-video

| Area | Status | Notes |
|------|--------|--------|
| Guards | OK | POST only; VIDEO_FEATURE_ENABLED === 'true'; VIDEO_WORKER_URL set |
| Body | OK | Parses JSON; validates adventure.steps array |
| Worker call | OK | POST to worker /generate; returns videoUrl or error |

## Local API server

| Area | Status | Notes |
|------|--------|--------|
| Routes | OK | /api/config GET, /api/process-homework POST |
| wrapRes | OK | res.status().json() for handlers |
| .env | OK | dotenv loads .env |

## Vite proxy

| Area | Status | Notes |
|------|--------|--------|
| Proxy | OK | /api/config, /api/process-homework → localhost:3001 |

## Test script

- **Audit only (no credits):** `./scripts/test-homework-api.sh http://localhost:3001 no-openai`  
  - 1) GET /api/config → 200, has keys  
  - 2) POST process-homework (no body) → 400, JSON error  
  - 3) Skipped  
- **Full (uses OpenAI):** `./scripts/test-homework-api.sh http://localhost:3001`  
  - Same + 3) POST with 1x1 PNG → 200 with title/steps or 500

## Run full test when ready

1. Put `OPENAI_API_KEY` in `.env` (local) or Vercel env; ensure OpenAI billing is set up.
2. Start API: `npm run dev:api` (or `npm run dev:local`).
3. Run: `./scripts/test-homework-api.sh http://localhost:3001`
4. For deployed app, use your Vercel URL: `./scripts/test-homework-api.sh https://your-app.vercel.app` (CORS may block from CLI; use browser or same-origin).
