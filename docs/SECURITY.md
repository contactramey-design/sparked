# Security overview

This document summarizes how sensitive flows are protected and what to configure for production.

## Verified strengths

- **Homework pipeline** (`/api/homework/analyze`, `explain`, `story`, `/api/generate-visuals`): gated by `requireHomeworkEntitlement` unless `ALLOW_UNAUTH_HOMEWORK=true` (dev only).
- **Legacy** `/api/process-homework`: same Stripe bundle check when `ALLOW_UNAUTH_HOMEWORK` is not set.
- **Ebook downloads** `/api/download-ebook`: allowlisted `ebookId`, Stripe session checks, PDFs under `private/ebooks/` (not `public/`).
- **Teacher weekly generator** `/api/schools/generate-weekly-units`: requires valid Supabase JWT, verifies `school_classes.teacher_id === auth.uid()`, PDF size capped (~8.5 MB), text extraction capped.
- **Checkout** `/api/create-checkout-session`: success/cancel URLs from env or trusted forwarded host; `returnTo` restricted to `/ebook/` paths.
- **Cron** `/api/cron/cleanup-adventure-videos`: optional `CRON_SECRET` Bearer check; Blob token server-side only.
- **No** `eval`, `dangerouslySetInnerHTML`, or shell `exec` in API code reviewed for this audit.

## Hardening added (service auth)

1. **Video worker** `POST /generate`: if `SPARKI_SERVICE_SECRET` is set on the worker, requests must send `Authorization: Bearer <same secret>`. Vercel (`generate-adventure-video`, `generate-weekly-units`) sends this header when calling the worker.
2. **`/api/generate-adventure-video`**: requires homework entitlement via `checkout_session_id` in JSON body (same model as homework APIs), unless `ALLOW_UNAUTH_HOMEWORK=true`.
3. **`/api/tts`**: if `SPARKI_SERVICE_SECRET` and/or `TTS_ALLOW_ORIGINS` are set, anonymous internet abuse is reduced:
   - Worker calls include `Authorization: Bearer SPARKI_SERVICE_SECRET`.
   - Browsers must send an `Origin` (or `Referer`) that matches one of the comma-separated origins in `TTS_ALLOW_ORIGINS`.
   - If **both** are unset, behavior matches the legacy **open** endpoint (acceptable for local dev; **not** recommended for public production).

## Remaining risks and mitigations

| Risk | Mitigation |
|------|------------|
| **OpenAI / FAL / ElevenLabs cost** if homework entitlements are bypassed | Keep `ALLOW_UNAUTH_HOMEWORK` unset in production; use Stripe test mode only on staging. |
| **Supabase anon key in the client** | Expected for Supabase; rely on **RLS** and reviewed policies (`supabase/*.sql`). Never ship service role keys to the browser. |
| **Rate limiting** | Not implemented in-app; use Vercel WAF / edge rules or a gateway if you see abuse. |
| **`/api/setup-status`** | Intentionally public for ops; reveals which integrations are configured (no secrets). |
| **Student class codes** | Low entropy codes are a product tradeoff; treat as “link sharing” sensitivity. |

## Production checklist

1. Set **`SPARKI_SERVICE_SECRET`** (same value) on **Vercel** and the **video worker** (Railway/Render).
2. Set **`TTS_ALLOW_ORIGINS`** on Vercel to every **https://** origin users use (custom domain + Vercel URL if needed).
3. Set **`CRON_SECRET`** on Vercel and match Vercel Cron’s secret.
4. Leave **`ALLOW_UNAUTH_HOMEWORK`** and **`ALLOW_FREE_TEST_EBOOK`** unset in production.
5. Confirm **`GET /api/setup-status`** shows `schemaVersion: 5` and review `serviceAuth` / `tts` blocks after deploy.

## Dependency audit

Run `npm audit` periodically. Current advisories are often **transitive** (e.g. `vite-plugin-pwa` / `workbox-build`). Prefer upgrading those packages on a branch when maintainers publish fixes; `--force` can introduce breaking changes.
