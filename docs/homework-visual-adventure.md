## Visual Homework Adventure (future upgrade path)

### Goal
Turn the text-only Homework Adventure into a 5‑scene visual adventure (images + voiceover video) while keeping kid-safety and COPPA constraints.

### Proposed flow
1. Parent uploads homework photo (client) → `POST /api/process-homework` (already exists)
2. Backend produces **structured story** with **exactly 5 scenes** (done in `api/process-homework.js`)
3. New endpoint: `POST /api/generate-visual-adventure`
   - Input: `{ homeworkImage, locale }`
   - Output: `{ story, imageUrls: string[], videoUrl?: string }`

### Image generation
- Use Replicate Flux Schnell (or another image model) with a **kid-safe prompt** per scene:
  - “Pixar-style cartoon scene … safe for kids … no text …”
- Generate 5 images and store them in **Supabase Storage** in a private bucket.

### Video composition (worker)
- Render worker downloads the 5 images + audio narration and composes a video:
  - `ffmpeg` slideshow with per-image duration + crossfades + audio track.
- Note: iPad Safari support prefers **H.264 MP4** over WebM for maximum compatibility.

### Safety / compliance notes
- Do not store the uploaded homework image long-term.\n+- Do not include any child names or identifiable details in prompts.\n+- Add a strict “kid-safe content” system prompt and an output validation step.

