# Retention roadmap (Phase 2+)

## Shipped in this pass

- **Daily Spark Quest hub** at [`/daily`](../src/DailySparkQuestPage.tsx): static entry points to weekly adventure, safety track, homework, and practice (replace with a rotating “quest of the day” when content exists).
- **Home card** on [`HomePage`](../src/HomePage.tsx) linking to `/daily`.
- **Streaks + sparkles** already on the home page for logged-in learners; tie future rewards to homework completion and weekly opens.

## Next (real weekly + daily systems)

1. **Weekly adventure drop:** Drive [`WeeklyAdventurePage`](../src/WeeklyAdventurePage.tsx) from dated content (JSON or CMS) with clear “new this week” affordance.
2. **Daily quest:** Pick one unit/activity server- or config-driven; store `lastDailyQuestDate` in localStorage to rotate once per calendar day.
3. **Meaningful sparkles:** Award bonus sparkles when a homework job completes with story + visuals, and when weekly video is opened.

## Phase 3

- Sharpen paywalls after free safety tier; parent checklist after Academy subscribe (partially done in [`ParentDashboard`](../src/ParentDashboard.tsx)).
