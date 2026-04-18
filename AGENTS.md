# Agent / contributor context — Sparki Academy (sparkyedu)

- **Platform rules (COPPA, LiveAvatar, Next target stack):** `.cursor/rules/sparki-academy-product.mdc` and `.cursor/rules/sparki-academy-next-code.mdc`
- **Next.js 14 app (Human Tutor / LiveAvatar):** `sparki-academy-next/` — App Router, Supabase, Stripe, Vercel
- **Legacy consumer app:** Vite + React + TypeScript + Tailwind (`src/`), React Router 7.
- **Serverless API:** `api/*.js` (Vercel-style handlers), mirrored in `server/local-api.js` for `npm run dev:local`.
- **Legacy `src/` app** is not Next.js — do not assume `app/` or Next middleware there. **`sparki-academy-next/`** is Next.js 14 App Router.
- **AI Tutor:** `src/ai-tutor/*`, routes `/ai-tutor`; backends `api/tutor-chat.js`, `api/heygen-streaming-token.js`, `api/tts-stream.js`. See `docs/AI-TUTOR-ARCHITECTURE.md`.
- **COPPA (tutor v1):** avoid server-side child chat transcript persistence; session-scoped state in `sessionStorage` for tutor keys — see `src/ai-tutor/sessionKeys.ts`.
- **School / orange shell:** paths in `src/lib/schoolShell.ts`; do not restyle consumer marketing as school theme.
- **Ascent-style marketing URLs (ThemeForest parity):** `/home-2`, `/about-us`, `/contact-us`, `/faq`, `/blog`, `/blog/:slug`, `/blog-details` (redirect), `/services`, `/service-details`, `/portfolio` — see `src/features/marketing/*` and `src/design-system/ascent/AscentPageChrome.tsx`.
