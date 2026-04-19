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

**Quality UX:** [`HomeworkQualityPanel.tsx`](src/features/homework/components/HomeworkQualityPanel.tsx) — `needsReview`, low confidence banner, optional subject/topic fix + re-run explain/story.

## Backend (Vercel serverless + local-api)

| Method | Path | Role |
|--------|------|------|
| POST | `/api/homework/analyze` | Vision → structured `HomeworkAnalysis` JSON |
| POST | `/api/homework/explain` | Analysis → `HomeworkExplanation` |
| POST | `/api/homework/story` | Analysis + explanation → `HomeworkStory` (4–6 scenes + recap) |
| POST | `/api/homework/images` | **501** — directs clients to `/api/generate-visuals` |
| POST | `/api/homework/video` | **501** — not implemented (v2) |
| POST | `/api/generate-visuals` | Optional scene stills (Flux); separate from core pipeline |

Shared code: [`api/homework/lib/multipart.js`](api/homework/lib/multipart.js) (multipart + Stripe entitlement), [`openai.js`](api/homework/lib/openai.js), [`prompts.js`](api/homework/lib/prompts.js) (child-safety rules), **[`homeworkSchemas.js`](api/homework/lib/homeworkSchemas.js)** (Zod runtime contracts).

**Entitlement:** Same as homework: `verifyHomeworkCheckoutSession` (Adventure Academy) unless `ALLOW_UNAUTH_HOMEWORK=true`. Multipart handlers accept `checkout_session_id`; JSON handlers accept `checkout_session_id` in body.

**Legacy:** [`api/process-homework.js`](api/process-homework.js) remains for older clients/scripts (single-shot vision + 5-step adventure). New UI uses the split pipeline above.

**Local dev:** [`server/local-api.js`](server/local-api.js) proxies the `/api/homework/*` routes and `/api/generate-visuals`.

## Multi-stage data contract (runtime)

TypeScript in the app documents shapes; **the server enforces** them with **Zod** after each model response so corrupt JSON cannot silently propagate.

| Stage | Output schema (module) | Invalid client input | Invalid model JSON |
|--------|-------------------------|----------------------|---------------------|
| Analyze | `homeworkAnalysisOutputSchema` | n/a (multipart) | **502** — safe user message |
| Explain | `homeworkExplanationSchema` | **400** (bad `analysis`) | **502** |
| Story | `homeworkStorySchema` | **400** (bad `analysis` / `explanation`) | **502** |

Client payloads for explain/story use `homeworkAnalysisInputSchema` and `homeworkExplanationInputSchema` (slightly looser than strict model output, e.g. optional empty `practiceQuestions` in stored jobs).

**Why no `GET /api/homework/:jobId`:** Jobs are **only** on the device (`localStorage`). There is no server-side job row to fetch. When/if jobs move to Supabase or KV, add GET + auth rules. Until then, the client loads jobs from [`useHomeworkJob.ts`](src/features/homework/hooks/useHomeworkJob.ts).

## Env vars

| Variable | Role |
|----------|------|
| `OPENAI_API_KEY` | Required for analyze / explain / story |
| `FAL_KEY` | Optional; scene images via `/api/generate-visuals` |
| `ALLOW_UNAUTH_HOMEWORK` | `true` = skip Stripe check (local only) |

## Flow

1. **Analyze** — image in; JSON: subject, topic, gradeBand?, language, extractedText, learningObjective, confidence, needsReview.
2. **Explain** — uses validated analysis; JSON: childExplanation, steps[], practiceQuestions[], parentNotes?.
3. **Story** (optional mode) — uses validated analysis + explanation; JSON: title, scenes[], recap.

## Deferred (explicitly not MVP)

- **Bilingual in one job** (e.g. EN + ES explanations side by side): defer; current pipeline is one `language` per run.
- **Supabase** for job storage / temp upload URLs: defer until cross-device or pilots require it.
- **Image and video** as default homework path: story scene art is optional UI; video remains stub.
- Rich **teacher dashboard** tied to homework: later phase.
