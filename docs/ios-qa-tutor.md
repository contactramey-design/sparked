# iOS Safari — AI Tutor (LiveAvatar + video)

Use this as a short QA runbook for **iPhone** (Safari, not only in-app browsers).

## Environment

- Device: iPhone 12 or newer (or oldest supported iOS you ship).
- Network: run once on **good Wi‑Fi** and once on **throttled / “Low Data Mode”**.
- Accounts: parent with **Adventure Academy** so LiveAvatar can start.

## Checks

1. **Inline video**  
   Confirm the tutor video stays **inline** (not forced fullscreen) and respects `playsInline`. If the stream stays black or frozen, **tap the video once** — iOS often requires a user gesture after autoplay policy kicks in.

2. **Autoplay / audio**  
   With live video on, confirm the avatar’s speech is audible after the first explicit **Start live video tutor** tap (user gesture). If silent, toggle video off and on once; note whether **Low Power Mode** was on.

3. **Session teardown**  
   Toggle **Stop live video**, navigate away from `/ai-tutor`, and return. No stuck camera indicator; no duplicate audio.

4. **Degraded path**  
   Turn off video; confirm **text + read-aloud** (non-Tots) still works. Tots: confirm **typing + optional video** without mic to LiveAvatar.

5. **Tab close / background**  
   After at least one user + assistant exchange, **close the tab** or **background Safari** for a minute. With Supabase + `SUPABASE_SERVICE_ROLE_KEY` configured, a **parent-readable session row** may appear (see Parent dashboard Insights). No full transcript is stored in v1.

## Known constraints

- Safari may delay `play()` on `MediaStream`; the client retries at **0ms, 150ms, 600ms, 1200ms** after `SESSION_STREAM_READY`.
- `webkit-playsinline` is set for older WebKit builds that ignore the standard attribute alone.

## Filing issues

Include: iOS version, Safari vs embedded WebView, Low Power Mode on/off, screenshot of any on-screen tutor message, and whether the problem is **video only** or **audio + video**.
