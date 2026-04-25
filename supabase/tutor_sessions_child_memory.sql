-- Per-child tutor memory (links telemetry rows to Academy children; optional parent_summary line).
-- Apply after `tutor_telemetry.sql` and after `public.children` exists (Sparki Academy).

alter table public.tutor_sessions
  add column if not exists child_id uuid;

alter table public.tutor_sessions
  add column if not exists parent_summary text;

comment on column public.tutor_sessions.child_id is 'Academy child UUID for per-child tutor memory; optional for legacy rows.';
comment on column public.tutor_sessions.parent_summary is 'Denormalized one-line summary for tutor memory (mirrors summary_bullets when set by API).';

create index if not exists tutor_sessions_child_created_idx
  on public.tutor_sessions (child_id, created_at desc)
  where child_id is not null;
