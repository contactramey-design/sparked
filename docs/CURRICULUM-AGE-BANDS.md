# Curriculum age bands (authors)

Sparky Academy uses **one unit id** per lesson (same videos, games, and structure in code). **Copy and delivery** can vary by **age band**: `tots`, `kids`, `crew`.

## Where it lives

- English: `src/locales/curriculum-en.json`
- Spanish: `src/locales/curriculum-es.json`

Under each unit, optional:

```json
"units": {
  "your-unit-id": {
    "title": "…",
    "summary": "…",
    "contentBlocks": [],
    "activity": { "title": "…", "description": "…" },
    "quizQuestions": [],
    "thinkPrompts": [],
    "bands": {
      "tots": { … },
      "kids": { … },
      "crew": { … }
    }
  }
}
```

## Merge rules (runtime)

- `src/hooks/useTranslatedCurriculum.ts` merges **base** unit strings with **`bands.<currentAgeBand>`** when present.
- If a band **omits** a field, the **base** (or non-band `curriculum.units.<id>.*` overrides) is used.
- **`kids`** often matches the default “baseline” copy—you can omit `bands.kids` and only override `tots` and `crew` to reduce duplication.

## What you can override per band

- `title`, `summary`
- `contentBlocks` (array of strings — replaces the whole list when the band provides a non-empty array)
- `activity.title`, `activity.description`
- `quizQuestions` (same length as base unit; index-aligned)
- `thinkPrompts`

## Example

See **`ai-1-what-is-ai`** → `bands.tots` and `bands.crew` in `curriculum-en.json` / `curriculum-es.json`.

## Testing

- Switch age band on the home hero (or wherever `AgeBandSelector` appears) and open the same unit—the text should reflect the band without changing unit id or routes.
