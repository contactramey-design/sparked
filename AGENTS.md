# Agent / contributor context — Sparki Academy (sparkyedu)

- **App:** Vite + React + TypeScript + Tailwind (`src/`), React Router 7.
- **Serverless API:** `api/*.js` (Vercel-style handlers), mirrored in `server/local-api.js` for `npm run dev:local`.
- **Not** Next.js — do not assume `app/`, `NEXT_PUBLIC_*` for secrets, or Next middleware unless the repo is migrated.
- **AI Tutor:** `src/ai-tutor/*`, routes `/ai-tutor`; backends `api/tutor-chat.js`, `api/heygen-streaming-token.js`, `api/tts-stream.js`. See `docs/AI-TUTOR-ARCHITECTURE.md`.
- **COPPA (tutor v1):** avoid server-side child chat transcript persistence; session-scoped state in `sessionStorage` for tutor keys — see `src/ai-tutor/sessionKeys.ts`.
- **School / orange shell:** paths in `src/lib/schoolShell.ts`; do not restyle consumer marketing as school theme.
- **Ascent-style marketing URLs (ThemeForest parity):** `/home-2`, `/about-us`, `/contact-us`, `/faq`, `/blog`, `/blog/:slug`, `/blog-details` (redirect), `/services`, `/service-details`, `/portfolio` — see `src/features/marketing/*` and `src/design-system/ascent/AscentPageChrome.tsx`.
