# Pre-investor engineering checklist

Ordered tasks with **primary files** and **acceptance criteria (AC)**. Goal: one reliable demo path for Homework, polished subject visuals on `/practice`, and a single strong LiveAvatar tutor flow. **Defer** a second LiveAvatar for Homework unless it becomes a named investor differentiator.

---

## 1. Homework: golden path (upload → analysis → explain/story → scene strip)

| Step | Owner files | AC |
|------|-------------|-----|
| 1.1 Upload + gates | [`HomeworkUpload.tsx`](../src/features/homework/pages/HomeworkUpload.tsx), [`useHomeworkAllowUnauth.ts`](../src/features/homework/hooks/useHomeworkAllowUnauth.ts), [`homeworkApi.ts`](../src/features/homework/api/homeworkApi.ts) | In **prod** with your intended Stripe/unauth flags: user can upload an image/PDF path you support; clear error if file type or checkout gate fails; no silent hang. |
| 1.2 Analyze → explain → story | Same upload page + [`api/homework/analyze.js`](../api/homework/analyze.js) (and related handlers) | Pipeline completes with **analysis** always; **explanation** for explain mode; **story** for story mode; phases reflected in UI copy. |
| 1.3 Result page | [`HomeworkResult.tsx`](../src/features/homework/pages/HomeworkResult.tsx), [`AdventureVisuals.tsx`](../src/features/homework/components/AdventureVisuals.tsx), [`lib/visualGenerator.ts`](../src/features/homework/lib/visualGenerator.ts) | After story: user can generate **scene strip** (manual CTA or auto when entitled); carousel shows one image per scene; errors show retry, not blank shell. |
| 1.4 Demo job (“Try a demo”) | [`demoJob.ts`](../src/features/homework/demo/demoJob.ts), [`HomeworkHome.tsx`](../src/features/homework/pages/HomeworkHome.tsx) | **Try a demo** saves job and navigates to `/homework/result/demo-sparki-homework`; shows analysis + explanation + **story** (already in `buildDemoHomeworkJob`). |
| 1.5 Demo + scene strip (optional but high impact for pitch) | [`demoJob.ts`](../src/features/homework/demo/demoJob.ts) | Add **`storyVisuals`**: 3 entries (`sceneNumber` 1–3) pointing at **static** assets under `public/` (e.g. `/homework-demo/scene-1.webp`) so the carousel works **without** calling image APIs. Add small art files and keep total localStorage footprint reasonable. |
| 1.6 Demo worksheet thumb (optional) | [`demoJob.ts`](../src/features/homework/demo/demoJob.ts) | Set **`previewDataUrl`** to a small bundled placeholder so the preview block matches the real flow. |

**Pitch script:** Home → Try a demo **or** Upload → result with story → illustrate → swipe scenes.

---

## 2. Subject tracks: heroes + optional hub thumbnails

| Step | Owner files | AC |
|------|-------------|-----|
| 2.1 Final hero art (core four) | [`public/school-subject-heroes/`](../public/school-subject-heroes/) (see [`README.md`](../public/school-subject-heroes/README.md)), [`subjectTrackVisuals.ts`](../src/school/subjects/subjectTrackVisuals.ts) | Replace placeholder SVGs with **final WebP** (or keep SVG if brand-approved). If filenames change, update **`heroImage`** paths in `SUBJECT_TRACK_VISUAL`. Recommended aspect ~**1792×640** per README. |
| 2.2 Mission tracks | `subjectTrackVisuals.ts` | **`internet-safety`** / **`ai-literacy`** already use root PNGs; swap to final marketing art if needed, still referenced from `SUBJECT_TRACK_VISUAL`. |
| 2.3 Track page hero | [`SchoolSubjectTrackPage.tsx`](../src/school/subjects/SchoolSubjectTrackPage.tsx) | Each `/practice/:subjectId` shows hero image without broken image icon; gradient fallback acceptable only as backup. |
| 2.4 Practice hub cards (optional) | [`SchoolSubjectsHubPage.tsx`](../src/school/subjects/SchoolSubjectsHubPage.tsx), [`school-subject.css`](../src/school/subjects/school-subject.css) | Replace emoji-only **`.school-subj-card-thumb`** with `<img>` (or CSS `background-image`) sourced from e.g. `public/school-subject-hub/` — add a small map `SchoolSubjectId → url` next to the page or in `subjectTrackVisuals.ts`. **AC:** six cards show distinct art; alt text from existing `schoolSubjects` strings or new `hubImageAlt` keys. |

---

## 3. Tutor: one polished LiveAvatar flow (Sparki-aligned)

| Step | Owner files | AC |
|------|-------------|-----|
| 3.1 Server config | [`api/liveavatar-session.js`](../api/liveavatar-session.js), Vercel/host **env** | **`LIVEAVATAR_API_KEY`** (or `HEYGEN_API_KEY`), **`LIVEAVATAR_AVATAR_ID`** (or `HEYGEN_TUTOR_AVATAR_ID`) set to real UUID ≠ `default`. For **FULL** mode: `LIVEAVATAR_CONTEXT_ID`, `LIVEAVATAR_VOICE_ID` (or `HEYGEN_TUTOR_VOICE_ID`). |
| 3.2 Client flow | [`InteractiveTutor.tsx`](../src/ai-tutor/InteractiveTutor.tsx), [`tutorService.ts`](../src/ai-tutor/tutorService.ts) | From `/ai-tutor`: consent path works; **Start video** (or equivalent) yields stream; disconnect shows friendly message; **tots** path matches product (no mic to LiveAvatar per code comments). |
| 3.3 Entitlement | [`api/lib/tutorEntitlement.js`](../api/lib/tutorEntitlement.js) (or as imported) | Pitch account has checkout/session or allow flag so **403** does not block the investor demo. |
| 3.4 Sparki-aligned avatar | HeyGen / LiveAvatar **dashboard** (not repo) | Create or select avatar + voice that match Sparki brand; paste IDs into env. **AC:** video reads as “Sparki tutor,” not generic stock. |

---

## 4. Explicitly deferred

- **Second LiveAvatar** wired only for Homework Adventure: **do not** schedule unless investors need “talking Sparki” on homework. Homework remains **scene images +** [`PresetAvatarPicker`](../src/features/homework/components/PresetAvatarPicker.tsx) / prompts for brand.

---

## 5. Final verification (run before pitch)

- [ ] `npm run build` passes.
- [ ] Homework: demo path + one real upload path on **staging/prod** with production env.
- [ ] `/practice` hub + one subject track: heroes (and hub thumbs if implemented) load.
- [ ] `/ai-tutor`: LiveAvatar starts within 60s on target network/device.
