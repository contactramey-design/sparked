# Security overview

How sensitive flows are protected, what is **not** a bug, and what to lock down before **public marketing**.

## Verified strengths (code)

- **Homework** (`/api/homework/*`, adventure video, `generate-visuals`, `generate-adventure-video`): gated by `requireHomeworkEntitlement` / Stripe Academy session unless `ALLOW_UNAUTH_HOMEWORK=true` (**never** set on public production). Multipart size capped (~4.5 MB) in `api/homework/lib/multipart.js`.
- **Legacy** `/api/process-homework`: same Academy session check when unauth homework is off.
- **Tutor text** `/api/tutor-chat`: rate-limited; unpaid users capped at **3 user messages** per request shape (server-enforced); then `TUTOR_FREE_LIMIT`.
- **Live video** `/api/liveavatar-session`: paid path verifies Academy; **empty** `checkout_session_id` allows a preview token (aligned with free text tier) with **two** per-IP limits: `liveavatar-free-preview` (8/hour) + `liveavatar-session` (10/10 min). `ALLOW_UNAUTH_TUTOR=true` skips paid checks (**dev only**).
- **Ebook downloads** `/api/download-ebook`: allowlisted `ebookId`; Stripe session or Academy; PDFs only from `private/ebooks/`.
- **Checkout** `/api/create-checkout-session`: `returnTo` allowlist (`/ai-tutor`, `/tutor`, `/pricing`, `/homework`, `/ebook` prefixes); Stripe secrets server-only.
- **Tutor lead** `/api/tutor-lead`: honeypot fields rejected; email validation; rate limit 10/hour/IP; optional webhook URL must be **https** to a non-private host (SSRF guard).
- **Teacher weekly** `/api/schools/generate-weekly-units`: Supabase JWT; verifies teacher owns class; PDF size capped.
- **Cron** `/api/cron/*`: optional `CRON_SECRET` Bearer.
- **TTS** `/api/tts`: `TTS_ALLOW_ORIGINS` + optional `SPARKI_SERVICE_SECRET` (see below).
- **No** `eval`, `dangerouslySetInnerHTML`, or shell `exec` in reviewed API paths.

## Rate limiting (important caveat)

Several routes use `api/lib/rateLimit.js` (**in-memory, per serverless instance**). It helps against casual abuse but is **not** a global DDoS barrier. For marketing traffic, also use **Vercel firewall / bot protection**, monitor Stripe + OpenAI + LiveAvatar dashboards, and set billing alerts.

## Production checklist (before ads)

1. **Never** in Production: `ALLOW_UNAUTH_HOMEWORK`, `ALLOW_UNAUTH_TUTOR`, `ALLOW_FREE_TEST_EBOOK` (unless you consciously run a public costless demo).
2. **Stripe**: Live keys only on Production; `STRIPE_WEBHOOK` signing secret if you add webhooks; never expose `STRIPE_SECRET_KEY` or price IDs as `NEXT_PUBLIC_*`.
3. **`TTS_ALLOW_ORIGINS`**: List every real **`https://`** origin users hit (custom domain + `*.vercel.app` if used).
4. **`SPARKI_SERVICE_SECRET`**: Same value on Vercel and the video worker so `/generate` is not anonymously callable.
5. **`CRON_SECRET`**: Set on Vercel and on the Cron job so cleanup routes are not public.
6. **`TUTOR_LEAD_WEBHOOK_URL`**: Must be `https://` to a public hostname (internal IPs and `http://` are rejected).
7. **Supabase**: Anon key in the client is normal; enforce **RLS** on all tables (`supabase/*.sql`). **Never** put the service role key in the browser or in client env.
8. **`GET /api/setup-status`**: Intentionally public for ops — shows which integrations are on (no secrets). Bump `schemaVersion` is the deploy fingerprint.
9. **Dependency audit**: Run `npm audit` on a schedule; upgrade transitive deps when fixes exist.

## Residual risks (honest)

| Risk | Notes |
|------|--------|
| **AI cost** (OpenAI, Anthropic, FAL, LiveAvatar, ElevenLabs) | Strong entitlements + rate limits reduce drive-by cost; not zero. Watch dashboards after launch. |
| **Free LiveAvatar preview** | Empty `checkout_session_id` path is bounded by rate limits, not by “3 turns” server-side (same class as any unauthenticated API). |
| **Prompt injection** | User/homework text goes to models; treat outputs as **untrusted** in any future server persistence or cross-user features. |
| **Class join codes** | Low entropy; treat like shared links — rotate if leaked. |
| **Forwarded `Origin` / `Host`** | Checkout success URL uses forwarded host when env URLs unset; Vercel sets these — avoid running the same app on an untrusted edge that forwards arbitrary hosts. |

## Dependency audit

Run `npm audit` periodically. Many advisories are **transitive** (e.g. `vite-plugin-pwa` / `workbox-build`). Upgrade on a branch when maintainers publish fixes; avoid `--force` without testing.
