-- Tutor cost telemetry + parent-readable session summaries (no raw child chat stored).
-- Apply in Supabase SQL editor or via migration tooling.
-- Writes from Vercel APIs use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Parents read via anon key + JWT where RLS applies.

create table if not exists public.tutor_api_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null default 'tutor_chat',
  model text not null,
  prompt_tokens integer,
  completion_tokens integer,
  estimated_cost_usd numeric(14, 8),
  checkout_session_id text,
  client_session_id text,
  parent_user_id uuid references auth.users (id) on delete set null,
  age_band text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists tutor_api_events_parent_created_idx
  on public.tutor_api_events (parent_user_id, created_at desc);

create index if not exists tutor_api_events_client_created_idx
  on public.tutor_api_events (client_session_id, created_at desc);

create table if not exists public.tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_session_id text not null unique,
  checkout_session_id text,
  parent_user_id uuid references auth.users (id) on delete set null,
  child_label text,
  age_band text,
  state_code text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  message_count integer not null default 0,
  sum_estimated_cost_usd numeric(14, 8) not null default 0,
  summary_bullets jsonb,
  revisit_note text,
  subject_tag text,
  child_id uuid,
  parent_summary text
);

create index if not exists tutor_sessions_parent_created_idx
  on public.tutor_sessions (parent_user_id, created_at desc);

alter table public.tutor_api_events enable row level security;
alter table public.tutor_sessions enable row level security;

-- Parents read only their own session rows (inserts are service-role from API).
drop policy if exists "tutor_sessions_select_own" on public.tutor_sessions;
create policy "tutor_sessions_select_own"
  on public.tutor_sessions for select
  using (auth.uid() = parent_user_id);

drop policy if exists "tutor_api_events_select_own" on public.tutor_api_events;
create policy "tutor_api_events_select_own"
  on public.tutor_api_events for select
  using (auth.uid() = parent_user_id);

comment on table public.tutor_api_events is 'Per OpenAI (or other) tutor API call — token usage and estimated USD cost.';
comment on table public.tutor_sessions is 'One row per tutor tab session — aggregates cost; summary bullets only (no transcript).';
