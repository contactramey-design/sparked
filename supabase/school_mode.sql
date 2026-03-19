-- School Mode (pilot) schema for Supabase
-- Creates: classes + anonymous student progress + teacher-only read access.
--
-- 1) Run this in Supabase SQL editor.
-- 2) Ensure Auth has "Enable anonymous sign-ins" enabled (Auth → Providers).
-- 3) Optionally add "teacher" role to a user via app_metadata or a profiles table.

create table if not exists public.school_classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null,
  name text not null,
  class_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists school_classes_teacher_id_idx on public.school_classes (teacher_id);

create table if not exists public.school_student_progress (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_uid uuid not null,
  student_code text not null,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (class_id, student_uid)
);

create index if not exists school_student_progress_class_id_idx on public.school_student_progress (class_id);

alter table public.school_classes enable row level security;
alter table public.school_student_progress enable row level security;

-- Teachers can manage their own classes
create policy "teacher_manage_own_classes"
on public.school_classes
for all
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

-- Students (anonymous auth) can upsert only their own progress row (by auth.uid).
create policy "student_upsert_own_progress"
on public.school_student_progress
for insert
with check (auth.uid() = student_uid);

create policy "student_update_own_progress"
on public.school_student_progress
for update
using (auth.uid() = student_uid)
with check (auth.uid() = student_uid);

-- Teachers can read progress for their classes
create policy "teacher_read_class_progress"
on public.school_student_progress
for select
using (
  exists (
    select 1
    from public.school_classes c
    where c.id = class_id
      and c.teacher_id = auth.uid()
  )
);

-- Teachers can delete progress for their classes (optional)
create policy "teacher_delete_class_progress"
on public.school_student_progress
for delete
using (
  exists (
    select 1
    from public.school_classes c
    where c.id = class_id
      and c.teacher_id = auth.uid()
  )
);

-- =========================
-- Strict student join (RPC)
-- =========================
-- Rationale (development & pilot safety):
--  - Students should NOT need SELECT access to `public.school_classes`.
--  - Instead, they call an RPC that validates `class_code` server-side and creates/ensures
--    the student's `school_student_progress` row.
--
-- This function is used by the frontend `SchoolJoinCard`.

drop policy if exists "students_can_select_school_classes" on public.school_classes;
drop policy if exists "students_can_select_school_classes_debug" on public.school_classes;

create or replace function public.student_join_class(
  p_class_code text,
  p_student_code text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_id uuid;
  v_code text;
  v_student_code text;
begin
  v_code := btrim(p_class_code);
  v_student_code := btrim(p_student_code);

  if v_code is null or v_code = '' then
    raise exception 'CLASS_CODE_REQUIRED';
  end if;
  if v_student_code is null or v_student_code = '' then
    raise exception 'STUDENT_CODE_REQUIRED';
  end if;

  select c.id into v_class_id
  from public.school_classes c
  where c.class_code = v_code
  limit 1;

  if v_class_id is null then
    raise exception 'CLASS_CODE_NOT_FOUND';
  end if;

  insert into public.school_student_progress (class_id, student_uid, student_code, progress)
  values (v_class_id, auth.uid(), v_student_code, '{}'::jsonb)
  on conflict (class_id, student_uid) do update
  set
    student_code = excluded.student_code,
    updated_at = now();

  return v_class_id;
end;
$$;

grant execute on function public.student_join_class(text, text) to anon, authenticated;

