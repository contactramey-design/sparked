# AI Tutor Academy — architecture (Sparki repo)

This document reconciles the **Vite + React** Sparki codebase with any external specs that assume **Next.js App Router**. Use it as the single map for routes, env vars, and COPPA posture.

## Stack truth

| External / generic doc | Sparki implementation |
| ---------------------- | ----------------------- |
| Next.js `app/api/tutor/token` | `POST /api/liveavatar-session` — [`api/liveavatar-session.js`](../api/liveavatar-session.js) (LiveAvatar v1 token only; client uses `@heygen/liveavatar-web-sdk`) |
| Next.js `app/api/tutor/chat` | `POST /api/tutor-chat` — [`api/tutor-chat.js`](../api/tutor-chat.js) |
| Next.js TTS route | `POST /api/tts-stream`, `POST /api/tts` — [`api/tts-stream.js`](../api/tts-stream.js), [`api/tts.js`](../api/tts.js) |
| LiveAvatar env | Server-only `LIVEAVATAR_API_KEY` (or fallback `HEYGEN_API_KEY`); `LIVEAVATAR_AVATAR_ID` (or `HEYGEN_TUTOR_AVATAR_ID`, not `default`); FULL mode: `LIVEAVATAR_CONTEXT_ID` + voice (`LIVEAVATAR_VOICE_ID` or `HEYGEN_TUTOR_VOICE_ID`). See [`api/setup-status.js`](../api/setup-status.js) `aiTutor.liveAvatar` and [`.env.example`](../.env.example) |
| Supabase `sessions` JSONB (Phase 2 idea) | **v1:** no server-side transcript persistence; tutor chat history in **sessionStorage** only — see [`src/ai-tutor/sessionKeys.ts`](../src/ai-tutor/sessionKeys.ts), [`src/ai-tutor/tutorService.ts`](../src/ai-tutor/tutorService.ts) |

## Client UI

| Concern | Location |
| ------- | -------- |
| Route | `/ai-tutor` — [`src/App.tsx`](../src/App.tsx), [`src/ai-tutor/AiTutorPage.tsx`](../src/ai-tutor/AiTutorPage.tsx) |
| Chat + optional LiveAvatar stream | [`src/ai-tutor/InteractiveTutor.tsx`](../src/ai-tutor/InteractiveTutor.tsx) |
| Voice consent (Kids/Crew); Tots blocked | [`src/ai-tutor/TutorConsentModal.tsx`](../src/ai-tutor/TutorConsentModal.tsx) |
| Free-limit parent email (“+3 messages”) | [`src/ai-tutor/TutorLeadCaptureModal.tsx`](../src/ai-tutor/TutorLeadCaptureModal.tsx), `POST /api/tutor-lead` — [`api/tutor-lead.js`](../api/tutor-lead.js); gated by `GET /api/config` → `tutorLeadCaptureEnabled` |
| US state for prompts | [`src/ai-tutor/usStates.ts`](../src/ai-tutor/usStates.ts), persisted via tutor session helpers in `tutorService` |

## LiveAvatar Web SDK (client contract)

The app uses **dynamic `import('@heygen/liveavatar-web-sdk')`** to limit bundle size. **Do not** use `@heygen/streaming-avatar` (deprecated for new work).

Verified usage in `InteractiveTutor.tsx`:

- `fetchLiveAvatarSession()` → `POST /api/liveavatar-session` → `{ session_id, session_token, mode }`.
- `new LiveAvatarSession(sessionToken, { voiceChat: true })` then `await session.start()`.
- `session.on(SessionEvent.SESSION_STREAM_READY, …)` then `session.attach(videoElement)`.
- `session.repeat(text)` for lip-synced playback of assistant text; on failure, **ElevenLabs** via `playTtsStreamEphemeral`.
- `await session.stop()` on teardown.

## Entitlement and dev flags

- Production: **`api/tutor-chat.js`** counts user turns and allows three without a paid session; **`api/liveavatar-session.js`** verifies Academy when `checkout_session_id` is non-empty, and allows a token when it is empty (free-tier preview; client limits when live is offered).
- Local only: `ALLOW_UNAUTH_TUTOR=true` — see `.env.example`; **never** enable on public production without other controls.

## QA paths (adapt external checklists)

- Tutor UI: **`/ai-tutor`** (not `/tutor`).
- Setup probe: `GET /api/setup-status` — `aiTutor` block for HeyGen / OpenAI flags.

## Related docs

- [TUTOR-UNIT-ECONOMICS.md](./TUTOR-UNIT-ECONOMICS.md) — how to model cost (no fixed dollar claims).
- [AVATAR-API-BATCH.md](./AVATAR-API-BATCH.md) — HeyGen vs Synthesia for **batch** video automation.
- [.cursor/plans/ai_tutor_automation_stack_5d4c9958.plan.md](../.cursor/plans/ai_tutor_automation_stack_5d4c9958.plan.md) — full product plan.
