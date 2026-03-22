# Curriculum age bands (authors)

Sparky Academy uses **one unit id** per lesson (same videos, games, and structure in code). **Copy and delivery** can vary by **age band**: `tots`, `kids`, `crew`.

## Anchor band: **Kids (6–8)**

The **Kids** band is the **baseline** in `curriculum-en.json` / `curriculum-es.json` under each `units.<unitId>` (title, summary, `contentBlocks`, activity, quiz, think prompts). **Do not** add `bands.kids` in plug-ins—`useTranslatedCurriculum` uses this base when the learner picks Sparki Kids.

## Tots & Crew plug-ins (10-unit scope)

Age-specific “plug-in” copy for **Sparki Tots (3–5)** and **Sparki Crew (9–11)** lives in:

- `src/locales/curriculum-band-plugin-en.json`
- `src/locales/curriculum-band-plugin-es.json`

These files are merged at runtime with the base curriculum via `src/locales/mergeCurriculumBands.ts` (see `LocaleContext.tsx`).

**Regenerate** (after editing the generator):

```bash
node scripts/generate-curriculum-band-plugins.mjs
```

The generator script is `scripts/generate-curriculum-band-plugins.mjs`. It writes professional, age-leveled scripts, activities, quizzes (options aligned with `correctIndex` in `src/curriculum.ts`), and parent guides for:

- AI track: `ai-1-what-is-ai` … `ai-5-ethical-coding`
- Safety track (mapped to themes): Instagram → privacy, TikTok → kindness/bullying, Roblox → strangers, Snapchat → screen time & balance, Fortnite → voice/team boundaries, Reddit → safety hero / leadership

Same **unit order and ids** for every band; only text changes.

### Spanish (`es`)

- Unit **`ai-1-what-is-ai`** has full Spanish `tots` / `crew` in the ES plug-in.
- Remaining units: the ES plug-in currently **mirrors English** for `tots`/`crew` until full localization is added (regenerate after extending `esAi1()` / companion functions in the generator).

## Merge rules (runtime)

- `src/hooks/useTranslatedCurriculum.ts` merges **base** unit strings with **`bands.<tots|kids|crew>`** when present in the merged locale curriculum object.
- **`kids`**: uses base `curriculum.units.<id>.*` from locale JSON (no plug-in override).
- **`tots` / `crew`**: use plug-in + any inline `bands` in `curriculum-*.json` if present (plug-in wins on merge for overlapping keys).

## What you can override per band

- `title`, `summary`
- `contentBlocks` (array of strings — replaces the whole list when the band provides a non-empty array)
- `activity.title`, `activity.description`
- `quizQuestions` (same length as in `curriculum.ts`; **keep correct answers at the same option index**)
- `thinkPrompts`

Use prefixes so the unit page parses well: `Story:`, `Idea:`, `Pause:`, `Rule:` (parent guide), etc.

## Testing

- Switch **Sparki Tots / Kids / Crew** on the home hero or track list, then open the **same unit**—text should change; routes and media stay the same.
