-- Optional: backfill class age band for students who joined before `student_join_class` returned jsonb.
-- Returns the age_band for the current user's joined class (first progress row), or null.

create or replace function public.student_my_class_age_band()
returns text
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_age text;
begin
  select lower(coalesce(c.age_band::text, 'kids'))
  into v_age
  from public.school_student_progress sp
  join public.school_classes c on c.id = sp.class_id
  where sp.student_uid = auth.uid()
  order by sp.updated_at desc
  limit 1;

  if v_age is null then
    return null;
  end if;

  if v_age not in ('tots', 'kids', 'crew') then
    v_age := 'kids';
  end if;

  return v_age;
end;
$$;

grant execute on function public.student_my_class_age_band() to anon, authenticated;
