# B2C Season 1 weekly adventures (Tier A)

Bundled manifest + locale copy. **Tier B** (Supabase/CDN + `visible_at` without redeploy) is intentionally deferred until you need week 9+ without an app release.

## Authoring workflow (EN + ES together)

1. **Manifest (unit routing only):** Edit [`season1.manifest.json`](./season1.manifest.json). Each week lists `safetyUnitId` and `aiUnitId` that exist in [`../curriculum.ts`](../curriculum.ts).
2. **Copy:** Add the same `week` keys under `season1.weeks` in **both** [`../locales/weekly-en.json`](../locales/weekly-en.json) and [`../locales/weekly-es.json`](../locales/weekly-es.json). Fields: `title`, `tagline`, `story`, `parentBlurb`.
3. **Cap:** Set `maxPublishedWeek` in the manifest to match `weeks.length` (dev warns if they differ).
4. **Anchor:** Official “week 1 starts” instant is [`b2cSeasonConfig.ts`](./b2cSeasonConfig.ts) `SEASON_1_ANCHOR_ISO` (UTC). Before that date, the UI shows week 1 as a preview.

## Extending beyond 8 weeks

- Append one object to `season1.manifest.json` `weeks` and bump `maxPublishedWeek`.
- Add matching `season1.weeks.N` in **both** locale files.
- Ship a new build (Tier A). When you need remote updates, add Tier B (`public_weekly_episodes` or CDN JSON) and fetch in the client with offline fallback.

## Resolver

- [`b2cSeasonConfig.ts`](./b2cSeasonConfig.ts) — anchor math and caps.
- [`b2cWeeklyManifest.ts`](./b2cWeeklyManifest.ts) — loads manifest, validates unit IDs in dev.

UI: [`../WeeklyAdventurePage.tsx`](../WeeklyAdventurePage.tsx), home teaser on [`../HomePage.tsx`](../HomePage.tsx), parent strip on [`../ParentDashboard.tsx`](../ParentDashboard.tsx).
