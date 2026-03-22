# SpArki's Adventures Academy (SparkiEdU)

React + TypeScript + Vite — kids’ curriculum, school pilot tools (Supabase), homework adventure, and optional video worker.

## Pilot programs (schools / districts)

Operator docs in **`docs/`**:

| Doc | Purpose |
|-----|---------|
| [docs/PILOT-RUNBOOK.md](docs/PILOT-RUNBOOK.md) | Teacher/student scripts, URLs, scope |
| [docs/PILOT-INFRA-CHECKLIST.md](docs/PILOT-INFRA-CHECKLIST.md) | Vercel deploy + `/api/setup-status` (`schemaVersion: 3`) |
| [docs/SUPABASE-PILOT-SETUP.md](docs/SUPABASE-PILOT-SETUP.md) | DB, RLS, anon auth, storage |
| [docs/BILLING-AND-QUOTAS.md](docs/BILLING-AND-QUOTAS.md) | ElevenLabs, OpenAI, Stripe |
| [docs/PILOT-SUBPROCESSORS-AND-DPA.md](docs/PILOT-SUBPROCESSORS-AND-DPA.md) | Subprocessors + DPA outline |

API wiring checklist: [docs/CONNECTED-ACCOUNTS-SETUP.md](docs/CONNECTED-ACCOUNTS-SETUP.md).

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Adding videos or images to the site

Place files in the **`public`** folder. They are served from the site root (e.g. `/my-video.mp4`). No `import` needed for public assets.

**Course and track videos:** Unit videos and track intro videos are configured in **`src/curriculum.ts`**. See **[VIDEOS.md](VIDEOS.md)** for where to plug in unit `videoUrl` and track `introVideoUrl`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
