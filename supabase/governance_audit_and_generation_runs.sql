-- Optional operational logging for county/district conversations and pilot debugging.
-- Run in Supabase SQL editor after school_weekly_generators.sql.
--
-- RLS: teachers insert/select their own rows only (server-side API uses teacher JWT).

create table if not exists public.governance_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_uid uuid not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists governance_audit_log_actor_idx on public.governance_audit_log (actor_uid, created_at desc);

alter table public.governance_audit_log enable row level security;

create policy "teacher_insert_own_audit"
on public.governance_audit_log
for insert
with check (auth.uid() = actor_uid);

create policy "teacher_select_own_audit"
on public.governance_audit_log
for select
using (auth.uid() = actor_uid);

comment on table public.governance_audit_log is 'Lightweight teacher-scoped events (e.g. weekly generation); avoid student PII in metadata.';

create table if not exists public.weekly_generation_runs (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null,
  class_id uuid not null references public.school_classes(id) on delete cascade,
  generator_id uuid null,
  pdf_text_hash text not null default '',
  model text not null default 'gpt-4o',
  prompt_version text not null default 'v1',
  locale text not null default 'en',
  status text not null default 'started',
  error_message text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weekly_generation_runs_teacher_idx on public.weekly_generation_runs (teacher_id, created_at desc);
create index if not exists weekly_generation_runs_class_idx on public.weekly_generation_runs (class_id, created_at desc);

alter table public.weekly_generation_runs enable row level security;

create policy "teacher_manage_own_generation_runs"
on public.weekly_generation_runs
for all
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

comment on table public.weekly_generation_runs is 'One row per weekly generator API attempt from the teacher dashboard.';
