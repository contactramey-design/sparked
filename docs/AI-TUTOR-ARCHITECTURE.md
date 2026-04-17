# AI Tutor Academy — architecture (Sparki repo)

This document reconciles the **Vite + React** Sparki codebase with any external specs that assume **Next.js App Router**. Use it as the single map for routes, env vars, and COPPA posture.

## Stack truth

| External / generic doc | Sparki implementation |
| ---------------------- | ----------------------- |
| Next.js `app/api/tutor/token` | `POST /api/heygen-streaming-token` — [`api/heygen-streaming-token.js`](../api/heygen-streaming-token.js) |
| Next.js `app/api/tutor/chat` | `POST /api/tutor-chat` — [`api/tutor-chat.js`](../api/tutor-chat.js) |
| Next.js TTS route | `POST /api/tts-stream`, `POST /api/tts` — [`api/tts-stream.js`](../api/tts-stream.js), [`api/tts.js`](../api/tts.js) |
| `NEXT_PUBLIC_HEYGEN_*` | Server-only `HEYGEN_API_KEY`; avatar/voice IDs: `HEYGEN_TUTOR_AVATAR_ID`, `HEYGEN_TUTOR_VOICE_ID`, optional `HEYGEN_TUTOR_QUALITY` — see [`api/setup-status.js`](../api/setup-status.js) and [`.env.example`](../.env.example) |
| Supabase `sessions` JSONB (Phase 2 idea) | **v1:** no server-side transcript persistence; tutor chat history in **sessionStorage** only — see [`src/ai-tutor/sessionKeys.ts`](../src/ai-tutor/sessionKeys.ts), [`src/ai-tutor/tutorService.ts`](../src/ai-tutor/tutorService.ts) |

## Client UI

| Concern | Location |
| ------- | -------- |
| Route | `/ai-tutor` — [`src/App.tsx`](../src/App.tsx), [`src/ai-tutor/AiTutorPage.tsx`](../src/ai-tutor/AiTutorPage.tsx) |
| Chat + optional HeyGen stream | [`src/ai-tutor/InteractiveTutor.tsx`](../src/ai-tutor/InteractiveTutor.tsx) |
| Voice consent (Kids/Crew); Tots blocked | [`src/ai-tutor/TutorConsentModal.tsx`](../src/ai-tutor/TutorConsentModal.tsx) |
| US state for prompts | [`src/ai-tutor/usStates.ts`](../src/ai-tutor/usStates.ts), persisted via tutor session helpers in `tutorService` |

## HeyGen streaming SDK (pinned contract)

The app uses **dynamic `import('@heygen/streaming-avatar')`** to limit bundle size.

Verified usage in `InteractiveTutor.tsx` (re-check after every **major** `@heygen/streaming-avatar` upgrade):

- `new StreamingAvatar({ token })` after server token.
- `avatar.createStartAvatar({ quality, avatarName, voice, activityIdleTimeout })` — `avatarName` is the HeyGen interactive avatar ID from env.
- `avatar.on(StreamingEvents.STREAM_READY, …)` — attach `MediaStream` to `<video ref>.srcObject`.
- `avatar.speak({ text, task_type: 'repeat', taskMode: 'sync' })` for lip-synced playback of assistant text.
- `avatar.stopAvatar()` on teardown.

Events and property names are SDK-version-specific; if `speak` fails, the UI falls back to **ElevenLabs** streaming TTS via `playTtsStreamEphemeral`.

## Entitlement and dev flags

- Production: Stripe **Adventure Academy** (or bundle) checkout session verified in `api/tutor-chat.js` / `api/heygen-streaming-token.js` via [`api/lib/verifyBundleEntitlement.js`](../api/lib/verifyBundleEntitlement.js).
- Local only: `ALLOW_UNAUTH_TUTOR=true` — see `.env.example`; **never** enable on public production without other controls.

## QA paths (adapt external checklists)

- Tutor UI: **`/ai-tutor`** (not `/tutor`).
- Setup probe: `GET /api/setup-status` — `aiTutor` block for HeyGen / OpenAI flags.

## Related docs

- [TUTOR-UNIT-ECONOMICS.md](./TUTOR-UNIT-ECONOMICS.md) — how to model cost (no fixed dollar claims).
- [AVATAR-API-BATCH.md](./AVATAR-API-BATCH.md) — HeyGen vs Synthesia for **batch** video automation.
- [.cursor/plans/ai_tutor_automation_stack_5d4c9958.plan.md](../.cursor/plans/ai_tutor_automation_stack_5d4c9958.plan.md) — full product plan.
