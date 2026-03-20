# CDE AI Grant — Internal Verification Checklist

## Must-open routes (EN)
1. `/for-schools#school-compliance`
2. `/unit/ai-1-what-is-ai`
3. `/weekly`

## Must-open routes (ES)
1. Switch site language to Spanish (`ES`)
2. `/for-schools#school-compliance`
3. `/unit/ai-1-what-is-ai`
4. `/weekly`

## What to verify (screenshots recommended)
1. `For Schools` compliance area
   - AI Implementation Toolkit cards render (Human-centered AI, Student well-being, Equity/bias, Transparency/disclosure, Governance/procurement).
   - Teacher readiness checklist renders near the bottom with checkboxes and a progress counter.
   - Toggling checkboxes updates progress (local/session state only).
2. AI unit disclosure block (kid-facing)
   - On `/unit/ai-1-what-is-ai`, an “AI Use Disclosure” banner appears above the unit lesson content.
   - The banner includes: human-first messaging, check-with-adult language, and “AI can be wrong” language.
   - Listen buttons on the banner (and on toolkit/checklist text) speak the Spanish/English version that matches the toggle.
3. Weekly adventure reinforcement
   - On `/weekly`, each week’s `Story` and `For grown-ups` parent blurb include:
     - adult check wording
     - “AI can be wrong” reinforcement
   - Weekly unit cards still link to the relevant Safety unit and AI unit for that week.

## Quick failure checks (if something is off)
1. If any section shows raw translation keys, confirm new keys exist in both `src/locales/en.json` and `src/locales/es.json`.
2. If Listen buttons don’t speak:
   - confirm cloud TTS config is set (or browser fallback is available in the environment)
   - try again after page reload and ensure the browser allows audio playback.

