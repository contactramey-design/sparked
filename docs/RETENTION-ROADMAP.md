# Retention roadmap (Phase 2+)

## Shipped in this pass

- **Daily Spark Quest hub** at [`/daily`](../src/DailySparkQuestPage.tsx): static entry points to AI Tutor, safety track, homework, and practice (replace with a rotating “quest of the day” when content exists).
- **Home card** on [`HomePage`](../src/HomePage.tsx) linking to `/daily`.
- **Streaks + sparkles** already on the home page for logged-in learners; tie future rewards to homework completion and tutor/practice engagement.

## Next (daily systems)

1. **Daily quest:** Pick one unit/activity server- or config-driven; store `lastDailyQuestDate` in localStorage to rotate once per calendar day.
2. **Meaningful sparkles:** Award bonus sparkles when a homework job completes with story + visuals, and when tutor or practice milestones are hit.

## Phase 3

- Sharpen paywalls after free safety tier; parent checklist after Academy subscribe (partially done in [`ParentDashboard`](../src/ParentDashboard.tsx)).
