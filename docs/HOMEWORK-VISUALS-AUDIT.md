# Homework Adventure visuals — audit (Phase 1)

## What already works

- **Story pipeline:** [`HomeworkUpload.tsx`](../src/features/homework/pages/HomeworkUpload.tsx) → analyze → explain → optional story → [`HomeworkResult.tsx`](../src/features/homework/pages/HomeworkResult.tsx).
- **API:** [`api/generate-visuals.js`](../api/generate-visuals.js) validates entitlement, builds Pixar-style prompts via [`visualPrompts.js`](../api/homework/lib/visualPrompts.js) (Sparki + squad + child description), calls **Fal** Flux 1.1 in [`visualProvider.js`](../api/homework/lib/visualProvider.js), returns up to **6** scene image URLs.
- **Client:** [`visualGenerator.ts`](../src/features/homework/lib/visualGenerator.ts) POSTs JSON; [`AdventureVisuals.tsx`](../src/features/homework/components/AdventureVisuals.tsx) manual **Generate** + horizontal strip of images.
- **Avatars (before this pass):** Preset-only descriptions in [`avatarPresets.ts`](../src/features/homework/constants/avatarPresets.ts) — no session-persisted custom builder.

## Gaps addressed in this implementation

1. **Discoverability:** Visuals lived in a collapsed `<details>`; user had to expand and click Generate. **Fix:** auto-run generation once when a story result loads (with checkout/entitlement), plus clearer carousel controls.
2. **Custom child look:** Product asked for face/clothes picker in **sessionStorage** (COPPA-friendly). **Fix:** [`CustomAvatarBuilder`](../src/features/homework/components/CustomAvatarBuilder.tsx) + [`homeworkAvatarSession.ts`](../src/features/homework/lib/homeworkAvatarSession.ts) composing an English prompt; optional tiny canvas preview stored as base64 for delight (not sent to server).
3. **Carousel / iPad:** Horizontal scroll only. **Fix:** prev/next controls + snap styling for larger touch targets.
4. **Operations:** `FAL_KEY` must be set in production; errors already mapped to friendly messages in `generate-visuals.js`.

## Out of scope (later)

- True **image-to-video** (Kling/Runway) and Lottie loops (see comments in `visualProvider.js`).
- Server-side persistence of images (by design: ephemeral URLs).
