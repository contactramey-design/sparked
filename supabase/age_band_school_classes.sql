-- Age band for school classes (Sparki Tots / Kids / Crew).
-- Run after school_mode.sql. Teachers pick a band when creating a class; weekly PDF generation uses it for prompts.

alter table public.school_classes
  add column if not exists age_band text not null default 'kids';

alter table public.school_classes
  drop constraint if exists school_classes_age_band_check;

alter table public.school_classes
  add constraint school_classes_age_band_check
  check (age_band in ('tots', 'kids', 'crew'));

comment on column public.school_classes.age_band is 'Target learner band: tots (3-5), kids (6-8), crew (9-11).';
