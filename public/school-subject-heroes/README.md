# Subject hero images (school tracks)

Shipped defaults are **SVG** banners (`math.svg`, `english.svg`, `science.svg`, `history.svg`). Replace with **WebP or PNG** if you prefer raster art—then update paths in `src/school/subjects/subjectTrackVisuals.ts`.

| File (default) | Subject                    |
|----------------|----------------------------|
| `math.svg`     | Math                       |
| `english.svg`  | English / ELA              |
| `science.svg`  | Science                    |
| `history.svg`  | History & social studies   |

Recommended raster size: **1792×640** or similar wide aspect (~2.8:1), WebP for size.

**Art direction:** Bright, friendly, classroom-safe, on-brand with Sparki. If a file fails to load, the app shows a colorful gradient hero instead—no broken layout.

Paths in code: [`subjectTrackVisuals.ts`](../../src/school/subjects/subjectTrackVisuals.ts) → `/school-subject-heroes/*`.
