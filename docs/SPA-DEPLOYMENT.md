# SPA routing (deep links)

This app is a **Vite + React SPA** with `BrowserRouter`. Direct URLs such as `/teacher/dashboard` or `/homework` must return **`index.html`** so the client router can run.

## Vercel

[`vercel.json`](../vercel.json) includes a catch-all rewrite to `/index.html`. Vercel still resolves **`/api/*`** serverless routes and static assets under `/assets/` first.

After deploy, verify in a private window:

- A deep path (e.g. `/schools/parent`) returns 200 and loads the app.
- A sample API route still responds as before.

## Other hosts

Apply the same rule:

| Host | Approach |
|------|----------|
| **Netlify** | `_redirects`: `/* /index.html 200` (or `SPA` redirect rule in `netlify.toml`) |
| **CloudFront + S3** | Custom error response: 403/404 → `/index.html` with 200 |
| **nginx** | `try_files $uri /index.html` |
| **GitHub Pages** | Build `404.html` as a copy of `index.html`, or use a SPA workaround |

Do not commit environment-specific secrets; only routing rules.
