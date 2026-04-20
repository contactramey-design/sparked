# CSTA / ISTE / AI4K12 — Sparki tutor & curriculum mapping

This document maps **Sparki Academy** surfaces to commonly cited K–12 computer science and AI literacy frameworks. It is a **product alignment aid**, not a certification or legal guarantee. Districts should verify fit with local standards adoption.

## Framework references (abbreviated)

- **CSTA K–12 CS Standards** — core concepts (devices, networks, data, algorithms, programming, impacts) and practices.
- **ISTE Standards for Students** — empowered learner, digital citizen, knowledge constructor, computational thinker, creative communicator, global collaborator.
- **AI4K12 Five Big Ideas** — perception, representation & reasoning, learning, natural interaction, societal impact.

## Tutor focus slugs (`/ai-tutor?focus=…`)

| Focus slug | Intent | CSTA (examples) | ISTE (examples) | AI4K12 (examples) |
|------------|--------|-----------------|-----------------|-------------------|
| `ai-literacy` | Training data, mistakes, bias, human responsibility; Socratic tutoring | Impacts of computing; Modeling & simulation | Knowledge constructor; Computational thinker | Learning; Societal impact |
| `internet-safety` | Scenarios: privacy, strangers, links, uncomfortable asks | Safe computing practices; Laws & ethics (age-appropriate) | Digital citizen | Societal impact |
| `ai-media-trust` | Generated media, voice cloning, ads; verify with adults | Digital citizenship; Impacts | Digital citizen; Knowledge constructor | Perception; Societal impact |
| `coding-challenge` | Sequence, events, loops via blocks + tutor challenges | Algorithms & programming | Computational thinker | Representation & reasoning |

Server resolution lives in `api/tutor/lib/focusPacks.js` (allowlist only).

## Consumer curriculum tracks (`src/curriculum.ts` + `src/locales/curriculum-*.json`)

| Track / unit (examples) | CSTA themes | AI4K12 |
|-------------------------|-------------|--------|
| **ai-coding** — What Is AI, Coding as Games, Software Explorers, AI in Our World, Kind & Fair Coding | Computing systems; Algorithms; Impacts | Learning; Societal impact; Representation & reasoning |
| **social-safety** — per-platform units + 2026 AI media / privacy notes | Digital citizenship; Safe practices | Societal impact; Perception |
| **early-foundations** — colors, shapes, numbers, letters, patterns | Early algorithmic / pattern thinking (precursor) | (Foundational pattern recognition) |

## Human Tutor (text / LiveAvatar)

- Cross-cutting **CSTA practices**: collaboration (with parent), testing, communication — embedded in tutor system prompts (`api/tutor/lib/prompts.js`).
- **Homework Adventure handoff** (`homework_quest`) reinforces problem decomposition and perseverance without replacing student work.

## Coding Lab (`/coding-lab`)

- External embeds (Blockly demo, Scratch sample project) support **algorithms & programming** exposure; pairing with `coding-challenge` tutor focus aligns **ISTE Computational Thinker** and **CSTA** algorithm constructs at an introductory level.

## Maintenance

When adding a tutor focus slug, update:

1. `api/tutor/lib/focusPacks.js`
2. `src/ai-tutor/tutorFocusStorage.ts` (`KNOWN` set)
3. This matrix
4. Any parent-facing copy in `src/locales/*.json`
