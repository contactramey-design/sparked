-- Extend student join RPC to return class_id + age_band (for client age-band sync).
-- Run after school_mode.sql and age_band_school_classes.sql.
--
-- Breaking change: `student_join_class` now returns jsonb `{"class_id":"<uuid>","age_band":"kids"}`
-- instead of a bare uuid. Update the app (SchoolJoinCard) when applying this migration.

create or replace function public.student_join_class(
  p_class_code text,
  p_student_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_id uuid;
  v_code text;
  v_student_code text;
  v_age text;
begin
  v_code := btrim(p_class_code);
  v_student_code := btrim(p_student_code);

  if v_code is null or v_code = '' then
    raise exception 'CLASS_CODE_REQUIRED';
  end if;
  if v_student_code is null or v_student_code = '' then
    raise exception 'STUDENT_CODE_REQUIRED';
  end if;

  select c.id, lower(coalesce(c.age_band::text, 'kids'))
  into v_class_id, v_age
  from public.school_classes c
  where c.class_code = v_code
  limit 1;

  if v_class_id is null then
    raise exception 'CLASS_CODE_NOT_FOUND';
  end if;

  if v_age not in ('tots', 'kids', 'crew') then
    v_age := 'kids';
  end if;

  insert into public.school_student_progress (class_id, student_uid, student_code, progress)
  values (v_class_id, auth.uid(), v_student_code, '{}'::jsonb)
  on conflict (class_id, student_uid) do update
  set
    student_code = excluded.student_code,
    updated_at = now();

  return jsonb_build_object(
    'class_id', v_class_id::text,
    'age_band', v_age
  );
end;
$$;

grant execute on function public.student_join_class(text, text) to anon, authenticated;
