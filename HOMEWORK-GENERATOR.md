# Homework generator — how it works & what to build next

## Current flow (production-shaped)

1. **Browser** (`HomeworkAdventurePage.tsx`)
   - Grown-up uploads a homework **image** (JPG/PNG).
   - Sends `multipart/form-data`: `image`, optional `checkout_session_id` (Stripe), `locale` (`en` | `es`), `age` (age-band hint).
   - In production, checkout session is required unless you explicitly allow unauthenticated homework on the server.

2. **API** (`api/process-homework.js`)
   - Parses multipart with `formidable`; max ~4.5 MB.
   - **Entitlement**: `verifyBundleCheckoutSession` unless `ALLOW_UNAUTH_HOMEWORK=true` (dev/local).
   - **Vision + JSON**: Reads image as base64 data URL, calls OpenAI `gpt-4o` chat completions with `image_url` + text instructions.
   - **Prompting**: System rules enforce COPPA-friendly behavior (no PII extraction, exactly 5 Socratic steps, kid-safe language). Optional `public/adventure-assets/squad.json` names get woven into the story.
   - **Response**: `{ title, subject, topic, steps: [{ id, story, prompt, hint }] }` — normalized server-side.

3. **Feature flag** (`api/config.js`)
   - `homeworkAdventureConfigured`: `true` when `OPENAI_API_KEY` is set (UI can show “ready” vs misconfiguration).

## Env vars that matter

| Variable | Role |
|----------|------|
| `OPENAI_API_KEY` | Required for generation |
| `ALLOW_UNAUTH_HOMEWORK` | `true` = skip Stripe check (local only) |
| Stripe-related vars | Used by `verifyBundleCheckoutSession` for paid bundle |

## Suggested next builds (functionality first)

1. **Quality & resilience**
   - Structured output / JSON schema (or `response_format` where supported) to cut parse failures.
   - Retry once on empty or malformed JSON; log correlation id only (never image bytes).

2. **Teacher / school path**
   - Reuse the same `analyzeAndGenerateAdventure` with a school API key or org-based auth instead of consumer checkout.
   - `teacher/generator` can POST the same shape; share types between FE and API.

3. **Input UX**
   - Optional subject hint field (API already accepts `subjectHint` in multipart — wire it in the form).
   - Client-side image resize before upload to reduce failures and cost.

4. **Observability**
   - Metrics: success rate, step count distribution, latency (no PII).

5. **Merch**
   - Intentionally **not** tied to homework; shop merch is paused in the UI until you reopen the store.

See also `SETUP-HOMEWORK-ADVENTURE.md` for deployment checklist.
