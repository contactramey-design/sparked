# Class bulletin (teacher → class / families)

## Purpose

One short, **non-sensitive** message per class (e.g. “This week finish unit 2 quiz by Friday”) visible on the **school parent hub** and available for student-side surfaces without building email infrastructure.

## Schema

Applied in [`supabase/school_class_bulletin_and_engagement.sql`](../supabase/school_class_bulletin_and_engagement.sql):

- `school_classes.bulletin_text` — `text`, default `''`
- `school_classes.bulletin_updated_at` — `timestamptz`, nullable

Teachers **update** via existing RLS on `school_classes` (`teacher_id = auth.uid()`).

## Read path

RPC **`public_bulletin_for_class(p_class_id uuid)`** — `SECURITY DEFINER`, returns `{ bulletin_text, bulletin_updated_at }` only. Callable by `anon` and `authenticated` so a device with **class UUID** in localStorage (after join) can show the note on `/schools/parent` even without sharing the student JWT with the grown-up view.

**Warning:** Do not put PII or passwords in the bulletin; treat class UUID as a capability token on shared devices.

## UI

- **Teacher:** Bulletin editor on [`TeacherDashboardPage`](../src/TeacherDashboardPage.tsx) when a class is selected.
- **Family:** [`SchoolParentPage`](../src/SchoolParentPage.tsx) loads bulletin when `classId` exists in session.
