-- Optional per-child learning progress for Sparki Academy (COPPA export / erasure).
-- Apply when `public.children` already exists.

create table if not exists public.adventure_progress (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  child_id uuid not null references public.children (id) on delete restrict,
  data jsonb not null default '{}'::jsonb
);

create index if not exists adventure_progress_child_idx
  on public.adventure_progress (child_id, created_at desc);

alter table public.adventure_progress enable row level security;

drop policy if exists "adventure_progress_parent_select" on public.adventure_progress;
create policy "adventure_progress_parent_select"
  on public.adventure_progress for select
  using (
    exists (
      select 1 from public.children c
      where c.id = adventure_progress.child_id
        and c.parent_id = auth.uid()
    )
  );

comment on table public.adventure_progress is 'Child-scoped adventure / learning progress blobs (no raw chat); COPPA export/delete.';
