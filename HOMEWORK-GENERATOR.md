# Homework generator — architecture

## Frontend (PWA)

Feature lives under [`src/features/homework/`](src/features/homework/):

| Path | Screen |
|------|--------|
| `/homework` | Hub: Upload / Demo / History |
| `/homework/upload` | Image + language + mode + optional grade → pipeline |
| `/homework/result/:jobId` | Analysis, explanation, practice, optional story |
| `/homework/history` | List of jobs from **localStorage** only |
| `/home` | Redirects to `/` |

**Client API:** [`homeworkApi.ts`](src/features/homework/api/homeworkApi.ts) — `analyzeWorksheet`, `explainWorksheet`, `storyFromLesson`.

**Persistence:** `sparki_homework_jobs_v1` in localStorage (max 20 jobs). No worksheet images on the server; optional small `previewDataUrl` on device only.

**Types:** [`types/homework.ts`](src/features/homework/types/homework.ts) — `HomeworkAnalysis`, `HomeworkExplanation`, `HomeworkStory`, `HomeworkJob`.

**Demo:** [`demo/demoJob.ts`](src/features/homework/demo/demoJob.ts) — static job, no API calls.

## Backend (Vercel serverless + local-api)

| Method | Path | Role |
|--------|------|------|
| POST | `/api/homework/analyze` | Vision → structured `HomeworkAnalysis` JSON |
| POST | `/api/homework/explain` | Text-only → `HomeworkExplanation` |
| POST | `/api/homework/story` | Analysis + explanation → `HomeworkStory` (3–5 scenes + recap) |
| POST | `/api/homework/images` | **501** — not implemented (v2) |
| POST | `/api/homework/video` | **501** — not implemented (v2) |

Shared code: [`api/homework/lib/multipart.js`](api/homework/lib/multipart.js) (multipart + Stripe entitlement), [`openai.js`](api/homework/lib/openai.js), [`prompts.js`](api/homework/lib/prompts.js) (child-safety rules).

**Entitlement:** Same as legacy homework: `verifyBundleCheckoutSession` unless `ALLOW_UNAUTH_HOMEWORK=true`. Multipart handlers accept `checkout_session_id`; JSON handlers accept `checkout_session_id` in body.

**Legacy:** [`api/process-homework.js`](api/process-homework.js) remains for older clients/scripts (single-shot vision + 5-step adventure). New UI uses the split pipeline above.

**Local dev:** [`server/local-api.js`](server/local-api.js) proxies the new `/api/homework/*` routes.

## Env vars

| Variable | Role |
|----------|------|
| `OPENAI_API_KEY` | Required for analyze / explain / story |
| `ALLOW_UNAUTH_HOMEWORK` | `true` = skip Stripe check (local only) |

## Flow

1. **Analyze** — image in; JSON: subject, topic, gradeBand?, language, extractedText, learningObjective, confidence, needsReview.
2. **Explain** — uses analysis only; JSON: childExplanation, steps[], practiceQuestions[], parentNotes?.
3. **Story** (optional mode) — uses analysis + explanation; JSON: title, scenes[], recap.

## Later (not in MVP)

- `GET /api/homework/:jobId` when server-side job store exists (Supabase/KV).
- Image and video pipelines; richer tutor / voice.
