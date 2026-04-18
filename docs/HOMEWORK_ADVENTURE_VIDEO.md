# Homework Adventure Video (Claude + ElevenLabs)

Integrated into the **Vite** app (not Next.js): route **`/homework/adventure-video`**, APIs **`/api/homework-adventure-claude`** and **`/api/homework-adventure-tts`**.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Proxies Anthropic Messages API for the 4-scene script |
| `ELEVENLABS_API_KEY` | Scene narration TTS |
| `ELEVENLABS_HW_VOICE_SPARKI` (optional) | Override default voice ID for Sparki |
| `ELEVENLABS_HW_VOICE_BYTE` | Byte |
| `ELEVENLABS_HW_VOICE_PIXEL` | Pixel |
| `ELEVENLABS_HW_VOICE_ZAP` | Zap |
| `ELEVENLABS_HW_MODEL_ID` (optional) | Default `eleven_turbo_v2` |

Homework **entitlement** uses the same rules as other homework APIs (`ALLOW_UNAUTH_HOMEWORK`, `HOMEWORK_REQUIRE_CHECKOUT`, Stripe session). The client sends `checkout_session_id` from the same device storage as the main homework flow.

**TTS browser access:** If you set `SPARKI_SERVICE_SECRET` and `TTS_ALLOW_ORIGINS`, add your app origin so `/api/homework-adventure-tts` is allowed (same pattern as `/api/tts`).

## Character videos (optional)

Place looping MP4s under **`public/characters/`** (see `public/characters/README.md`). If a file is missing, the UI shows an emoji fallback.

## Local development

Run **`npm run dev:local`** so Vite proxies `/api/*` to the local API server on port 3001, which loads these handlers.

## Original prototype

The JSX + Next `app/api` prototypes lived under `Downloads/files-2/`; this repo uses Vercel-style **`api/*.js`** and a TypeScript page component.
