# Billing, quotas, and cost control (pilots)

Third-party APIs bill **your** accounts. The app does not enforce spend caps server-side; use provider dashboards and pilot scope to stay sustainable.

## ElevenLabs (TTS)

- **Used for:** `POST /api/tts` (Listen buttons, locale `en`/`es`), and the video worker (narration) via `TTS_URL` → your app’s `/api/tts`.
- **Failure modes:** `401` / `403` (bad key), `quota_exceeded` (not enough credits for the request — response includes `detail.status`).
- **Controls:** [elevenlabs.io](https://elevenlabs.io) → Subscription / usage. Upgrade plan or add credits before large pilots.
- **Tip:** Shorter text = fewer characters = lower cost per tap. Very long passages are truncated server-side (`MAX_TEXT_LENGTH` in [api/tts.js](../api/tts.js)).

## fal.ai (Flux — optional scene art)

- **Used for:** Homework story mode — still images per scene ([api/generate-visuals.js](../api/generate-visuals.js), [api/homework/lib/visualProvider.js](../api/homework/lib/visualProvider.js)).
- **Env:** `FAL_KEY` on Vercel.
- **Controls:** [fal.ai](https://fal.ai) dashboard — usage and credits; model is `fal-ai/flux-pro/v1.1`.

## OpenAI

- **Used for:** Homework Adventure — vision + structured story ([api/process-homework.js](../api/process-homework.js)).
- **Controls:** [platform.openai.com](https://platform.openai.com) → Billing → limits and usage alerts.
- **Pilot scope:** If a class will upload many images, set usage alerts and consider a daily cap in your org settings.

## Stripe (optional)

- **Used for:** Adventure Academy checkout, per-ebook checkout, server-side entitlement checks ([api/lib/verifyBundleEntitlement.js](../api/lib/verifyBundleEntitlement.js)).
- **Controls:** Stripe Dashboard → monitor failed payments and webhook health (if you add webhooks later).

## Vercel Blob + worker

- **Blob:** Storage and egress can accrue with many/large homework videos.
- **Worker (Railway/Render/Fly):** Hosting plan limits; cold starts can time out long jobs — see worker README.

## Pilot cost discipline

1. **Define in pilot runbook** what is enabled (e.g. “Homework video: off for week 1”).
2. Set **usage alerts** on OpenAI and ElevenLabs before inviting a class.
3. After each session, spot-check `GET /api/setup-status` and provider dashboards.

See also: [PILOT-RUNBOOK.md](./PILOT-RUNBOOK.md) (in/out of scope).
