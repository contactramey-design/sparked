# Where to Plug In Videos

All course and track videos are configured in one place: **`src/curriculum.ts`**. Put video files in the **`public/`** folder so they are served from the site root.

**Pilot / MVP:** Until each unit has its own file, AI units may share **`/coding_intro.mp4`** and social-safety units **`/safety_into.mp4`** (see comments in `curriculum.ts`). Replace with unit-specific MP4s when ready.

## Unit videos (lesson intros)

- In **`src/curriculum.ts`**, each object in the **`units`** array can have a **`videoUrl`** property.
- **Value:** A path from the site root (e.g. `'/Unit1b_intro_.mp4'`) or a YouTube embed URL (e.g. `'https://www.youtube.com/embed/...'`).
- **File:** Put the video file in **`public/`** (e.g. `public/Unit1b_intro_.mp4`). Reference it as **`/Unit1b_intro_.mp4`** in the unit.
- **Rendering:** [UnitPage.tsx](src/UnitPage.tsx) shows the video in the unit’s material section (MP4/WebM via `<video>`, YouTube via `<iframe>`).

### Unit video posters (thumbnail before play)

- Optional **`videoPosterUrl`**: path to a still image (e.g. PNG in **`public/`**). Used as the HTML **`<video poster>`** so learners see a screenshot until the real MP4 is finished or while a placeholder clip plays.
- **Sparki Tots (foundations)** thumbnails live in **`public/tots-video-thumbnails/`** (`found-1-colors.png` … `found-5-patterns.png`), wired on units `found-1`–`found-5` in `curriculum.ts`. Source art can stay in **`Sparki Tots vid thumbnails/`** at repo root — copy into `public/` when updating.
- **Colors & Sorting** (`found-1-colors-sorting`) uses **`/tots-video-thumbnails/Sparkiunit1colors.mp4`** (file: `public/tots-video-thumbnails/Sparkiunit1colors.mp4`; poster: `found-1-colors.png` in the same folder).
- **Shapes & Matching** (`found-2-shapes-matching`) uses **`/tots-video-thumbnails/Sparkitotsunit2educational.mp4`** (poster: `found-2-shapes.png`). Keep MP4s next to the Tots poster PNGs so paths stay in sync.
- **Social media safety** unit posters use the matching **ebook covers** in **`public/social-safety-covers/`** (`instagram.png`, `tiktok.png`, `snapchat.png`, `roblox.png`, `fortnite.png`, `reddit.png`), wired on `safety-instagram` through `safety-reddit`. The track intro uses the Instagram cover as its poster until you add a dedicated track still. Original cover assets remain in **`public/`** with their long filenames; the `social-safety-covers/` copies keep URL-safe names.

Example in `curriculum.ts`:

```ts
{
  id: 'ai-1-what-is-ai',
  trackId: 'ai-coding',
  title: 'What Is AI?',
  // ...
  videoUrl: '/Unit1b_intro_.mp4',
  videoPosterUrl: '/tots-video-thumbnails/found-1-colors.png',
}
```

## Track intro videos

- In **`src/curriculum.ts`**, each object in the **`tracks`** array can have an optional **`introVideoUrl`** property.
- **Value:** Same as unit: path from root (e.g. `'/safetyAppIntro.mp4'`) or YouTube embed URL.
- **File:** Put the file in **`public/`** and use the path in the track config.
- **Rendering:** [TrackPage.tsx](src/TrackPage.tsx) shows the track intro video at the top of the track overview when `introVideoUrl` is set; otherwise it shows a text placeholder.
- Optional **`introVideoPosterUrl`**: `<video poster>` for that intro clip (e.g. early-foundations uses the Colors unit thumbnail until a dedicated track still exists).

Example in `curriculum.ts`:

```ts
{
  id: 'social-safety',
  title: 'Social Media Safety & Kindness',
  description: '...',
  order: 2,
  introVideoUrl: '/safetyAppIntro.mp4',
}
```

## Summary

| Where       | Config file      | Property        | Page that renders it   |
|------------|------------------|-----------------|-------------------------|
| Unit video | `curriculum.ts`  | `unit.videoUrl` | UnitPage.tsx            |
| Unit poster | `curriculum.ts` | `unit.videoPosterUrl` | UnitPage `<video poster>`; track list thumb on TrackPage |
| Track intro| `curriculum.ts`  | `track.introVideoUrl` | TrackPage.tsx   |
| Track intro poster | `curriculum.ts` | `track.introVideoPosterUrl` | TrackPage `<video poster>` |

Files go in **`public/`** and are referenced with a leading slash (e.g. `/MyVideo.mp4`).
