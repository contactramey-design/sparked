# Agent / contributor context — Sparki Academy (sparkyedu)

- **Platform rules (COPPA, LiveAvatar, Next target stack):** `.cursor/rules/sparki-academy-product.mdc` and `.cursor/rules/sparki-academy-next-code.mdc`
- **Next.js 14 app (Human Tutor / LiveAvatar):** `sparki-academy-next/` — App Router, Supabase, Stripe, Vercel
- **Legacy consumer app:** Vite + React + TypeScript + Tailwind (`src/`), React Router 7.
- **Serverless API:** `api/*.js` (Vercel-style handlers), mirrored in `server/local-api.js` for `npm run dev:local`.
- **Legacy `src/` app** is not Next.js — do not assume `app/` or Next middleware there. **`sparki-academy-next/`** is Next.js 14 App Router.
- **AI Tutor:** `src/ai-tutor/*`, routes `/ai-tutor`; backends `api/tutor-chat.js`, **`api/liveavatar-session.js`** (LiveAvatar), `api/tutor-lead.js` (parent email at free limit), `api/tts-stream.js`. Legacy `api/heygen-streaming-token.js` retained but unused by the app. See `docs/AI-TUTOR-ARCHITECTURE.md`.
- **COPPA (tutor v1):** avoid server-side child chat transcript persistence; session-scoped state in `sessionStorage` for tutor keys — see `src/ai-tutor/sessionKeys.ts`.
- **School / orange shell:** paths in `src/lib/schoolShell.ts`; do not restyle consumer marketing as school theme.
- **Ascent-style marketing URLs (ThemeForest parity):** `/home-2`, `/about-us`, `/contact-us`, `/faq`, `/blog`, `/blog/:slug`, `/blog-details` (redirect), `/services`, `/service-details`, `/portfolio` — see `src/features/marketing/*` and `src/design-system/ascent/AscentPageChrome.tsx`.
- **AI + education (product direction):** Treat AI as both **necessary for literacy and readiness** and **risky for privacy, integrity, and trust**. Sparki’s district-facing narrative is **Strategic framing: AI in education** on `/for-schools?tab=compliance` (strings `governance.strategic*` in `src/locales/en.json` and `es.json`, UI in `src/components/GovernanceOverviewContent.tsx`). Pillars: **safety barrier**, **workforce readiness**, **human-centered outcomes**, **human–machine co-creation** (teacher-initiated, review before assign), **algorithmic accountability**. Keep implementation aligned with COPPA/session rules above; avoid promising certification or mandates in UI without legal review.
