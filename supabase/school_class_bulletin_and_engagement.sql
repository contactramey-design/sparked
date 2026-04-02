-- Class bulletin (teacher message to class/families) + RPC for read by class UUID.
-- Run in Supabase SQL editor after school_mode.sql and age_band_school_classes.sql.
--
-- Teachers update bulletin_text via existing RLS on school_classes.
-- public_bulletin_for_class is intentionally limited to bulletin fields only (no roster).
-- Do not put PII in bulletin_text; class UUID is a capability token on shared devices.

alter table public.school_classes
  add column if not exists bulletin_text text not null default '';

alter table public.school_classes
  add column if not exists bulletin_updated_at timestamptz;

comment on column public.school_classes.bulletin_text is 'Short non-sensitive note for families/students; teacher-editable.';
comment on column public.school_classes.bulletin_updated_at is 'Last time bulletin_text was saved.';

create or replace function public.public_bulletin_for_class(p_class_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  select bulletin_text, bulletin_updated_at into r
  from public.school_classes
  where id = p_class_id
  limit 1;
  if not found then
    return jsonb_build_object('bulletin_text', '', 'bulletin_updated_at', null);
  end if;
  return jsonb_build_object(
    'bulletin_text', coalesce(r.bulletin_text, ''),
    'bulletin_updated_at', r.bulletin_updated_at
  );
end;
$$;

grant execute on function public.public_bulletin_for_class(uuid) to anon;
grant execute on function public.public_bulletin_for_class(uuid) to authenticated;
