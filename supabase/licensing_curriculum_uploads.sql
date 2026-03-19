-- Licensing-tier: teacher-uploaded home learning packets
--
-- This schema is designed for a future paid “School Licensing” tier.
-- It lets teachers upload at-home curriculum packets (PDF/ZIP) per class.
--
-- Storage recommendation:
-- - Create a private bucket: `school-home-packets`
-- - Store files under: `teacher/<teacher_id>/class/<class_id>/<upload_id>/<filename>`
--
-- IMPORTANT: Supabase Storage policies are separate from table policies.
-- This file includes table + RLS. Add storage policies in Supabase dashboard.

create table if not exists public.school_home_packets (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null,
  class_id uuid not null references public.school_classes(id) on delete cascade,
  title text not null,
  description text null,
  storage_bucket text not null default 'school-home-packets',
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists school_home_packets_teacher_id_idx on public.school_home_packets (teacher_id);
create index if not exists school_home_packets_class_id_idx on public.school_home_packets (class_id);

alter table public.school_home_packets enable row level security;

-- Teachers can manage packets for their own classes
create policy "teacher_manage_own_home_packets"
on public.school_home_packets
for all
using (
  auth.uid() = teacher_id
  and exists (
    select 1 from public.school_classes c
    where c.id = class_id and c.teacher_id = auth.uid()
  )
)
with check (
  auth.uid() = teacher_id
  and exists (
    select 1 from public.school_classes c
    where c.id = class_id and c.teacher_id = auth.uid()
  )
);

-- Students can read packets only for their class (requires anonymous auth + class join)
-- This assumes student sessions are stored in `school_student_progress` keyed by auth.uid().
create policy "student_read_class_home_packets"
on public.school_home_packets
for select
using (
  exists (
    select 1 from public.school_student_progress sp
    where sp.class_id = class_id and sp.student_uid = auth.uid()
  )
);

