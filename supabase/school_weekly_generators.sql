-- School-scoped temporary weekly curriculum generators (pilot)
--
-- Teacher uploads a PDF to create a temporary "weekly track" label + 3 generated units.
-- Students can read generated content for their class, and quiz progress is stored in
-- `public.school_student_progress.progress.units` keyed by generated `unit_id`.
--
-- Storage note (Supabase Storage policies are separate from table RLS):
--  - Create a private bucket: `school-generated-curriculum`
--  - Suggested object path:
--      teacher/<teacher_id>/class/<class_id>/generators/<generator_id>/source.pdf
--  - Add storage policies so:
--      - Teachers can insert/update objects for their own classes
--      - Students cannot list/read raw PDFs (only generated content tables are readable)

-- Bucket + object policies (optional to keep everything self-contained)
-- Safe to run repeatedly.
insert into storage.buckets (id, name, public)
values ('school-generated-curriculum', 'school-generated-curriculum', false)
on conflict (id) do nothing;

-- Helper casting is done inline to avoid hard errors when object paths don't match.
-- Object path layout (name):
--   teacher/<teacher_id>/class/<class_id>/generators/<generator_id>/source.pdf
create policy "teacher_can_write_school_generated_curriculum_pdfs"
on storage.objects
for insert
with check (
  bucket_id = 'school-generated-curriculum'
  and auth.uid() = (
    case
      when split_part(name, '/', 2) ~ '^[0-9a-fA-F\\-]{36}$' then split_part(name, '/', 2)::uuid
      else null
    end
  )
  and exists (
    select 1
    from public.school_classes c
    where c.id = (
      case
        when split_part(name, '/', 4) ~ '^[0-9a-fA-F\\-]{36}$' then split_part(name, '/', 4)::uuid
        else null
      end
    )
      and c.teacher_id = auth.uid()
  )
);

create policy "teacher_can_update_school_generated_curriculum_pdfs"
on storage.objects
for update
with check (
  bucket_id = 'school-generated-curriculum'
  and auth.uid() = (
    case
      when split_part(name, '/', 2) ~ '^[0-9a-fA-F\\-]{36}$' then split_part(name, '/', 2)::uuid
      else null
    end
  )
  and exists (
    select 1
    from public.school_classes c
    where c.id = (
      case
        when split_part(name, '/', 4) ~ '^[0-9a-fA-F\\-]{36}$' then split_part(name, '/', 4)::uuid
        else null
      end
    )
      and c.teacher_id = auth.uid()
  )
);

create policy "teacher_can_delete_school_generated_curriculum_pdfs"
on storage.objects
for delete
using (
  bucket_id = 'school-generated-curriculum'
  and auth.uid() = (
    case
      when split_part(name, '/', 2) ~ '^[0-9a-fA-F\\-]{36}$' then split_part(name, '/', 2)::uuid
      else null
    end
  )
  and exists (
    select 1
    from public.school_classes c
    where c.id = (
      case
        when split_part(name, '/', 4) ~ '^[0-9a-fA-F\\-]{36}$' then split_part(name, '/', 4)::uuid
        else null
      end
    )
      and c.teacher_id = auth.uid()
  )
);

create table if not exists public.school_weekly_generators (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  teacher_id uuid not null,
  weekly_track_label text not null,
  pdf_storage_bucket text not null default 'school-generated-curriculum',
  pdf_storage_path text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists school_weekly_generators_class_id_idx
  on public.school_weekly_generators (class_id);

create index if not exists school_weekly_generators_expires_at_idx
  on public.school_weekly_generators (expires_at);

create table if not exists public.school_weekly_generator_units (
  id uuid primary key default gen_random_uuid(),
  generator_id uuid not null references public.school_weekly_generators(id) on delete cascade,
  unit_id text not null,
  track_label text not null,
  unit_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (generator_id, unit_id)
);

create index if not exists school_weekly_generator_units_generator_id_idx
  on public.school_weekly_generator_units (generator_id);

alter table public.school_weekly_generators enable row level security;
alter table public.school_weekly_generator_units enable row level security;

-- Ensure students can "see" their own progress row for RLS policy checks.
-- Existing pilot schema only allows students to insert/update their progress.
create policy "student_select_own_progress"
on public.school_student_progress
for select
using (auth.uid() = student_uid);

-- Teachers manage their own generators
create policy "teacher_manage_own_weekly_generators"
on public.school_weekly_generators
for all
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

-- Students can read generators for classes they joined (presence of progress row)
create policy "student_read_generators_for_joined_class"
on public.school_weekly_generators
for select
using (
  exists (
    select 1
    from public.school_student_progress sp
    where sp.class_id = school_weekly_generators.class_id
      and sp.student_uid = auth.uid()
  )
);

-- Teacher manage + read units through their generator
create policy "teacher_manage_weekly_generator_units"
on public.school_weekly_generator_units
for all
using (
  exists (
    select 1
    from public.school_weekly_generators g
    where g.id = generator_id
      and g.teacher_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.school_weekly_generators g
    where g.id = generator_id
      and g.teacher_id = auth.uid()
  )
);

