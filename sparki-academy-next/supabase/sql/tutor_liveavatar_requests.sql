-- Optional: distributed rate limit for POST /api/tutor/token (3 per child per hour).
-- Requires SUPABASE_SERVICE_ROLE_KEY in the Next.js server environment.
create table if not exists public.tutor_liveavatar_requests (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists tutor_liveavatar_requests_child_created_idx
  on public.tutor_liveavatar_requests (child_id, created_at desc);
