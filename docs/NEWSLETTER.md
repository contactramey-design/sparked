## Parent updates newsletter (v1)

This repo includes:

- `POST /api/newsletter-optin`: accepts a parent email opt-in (best-effort).
- `POST /api/newsletter-send-digest`: sends a simple digest to all opt-ins (cron-ready).

### Supabase table

Create this table in Supabase (SQL editor):

```sql
create table if not exists public.newsletter_optins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null default 'en',
  source text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Required env vars

For storing opt-ins:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

For sending email via Resend:

- `RESEND_API_KEY`
- `NEWSLETTER_FROM` (example: `Sparki Academy <hello@sparkiedu.com>`)
- `SITE_URL` (optional; defaults to `https://sparkiedu.com`)

### Cron (weekly)

Call `POST /api/newsletter-send-digest` from Vercel Cron (weekly) once the env vars above are set.

