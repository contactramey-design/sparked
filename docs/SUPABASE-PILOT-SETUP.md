# Supabase setup for school pilots

School flows use **Supabase** for teachers, classes, generated weekly units, student progress, and (optional) PDF storage. Frontend: [src/lib/supabaseClient.ts](../src/lib/supabaseClient.ts). Session helpers: [src/school/schoolSession.ts](../src/school/schoolSession.ts).

## 1. Create project and keys

1. [supabase.com](https://supabase.com) → New project.
2. **Settings → API:** copy **Project URL** and **anon public** key.

## 2. Vercel (or build host) — frontend env

These are **build-time** for Vite:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Add under Vercel → Project → Settings → Environment Variables for **Production** (and Preview if needed). **Redeploy** the app after saving.

If these are missing, `supabase` is `null` and teacher/school features will not work in production.

## 3. Run SQL migrations (order)

In Supabase → **SQL Editor**, run:

1. **[school_mode.sql](../supabase/school_mode.sql)** first — `school_classes`, `school_student_progress`, RLS for teachers and anonymous students.
2. **[age_band_school_classes.sql](../supabase/age_band_school_classes.sql)** — adds `age_band` (`tots` | `kids` | `crew`) on `school_classes` for teacher class setup and weekly PDF prompt targeting.
3. **[school_weekly_generators.sql](../supabase/school_weekly_generators.sql)** — weekly generators, generated units, storage bucket + policies for `school-generated-curriculum`.

(Optional) [licensing_curriculum_uploads.sql](../supabase/licensing_curriculum_uploads.sql) only if you use that licensing flow.

Read each file’s header comments. If a policy already exists, you may need to `DROP POLICY` before re-run or skip duplicates.

## 4. Storage bucket

[school_weekly_generators.sql](../supabase/school_weekly_generators.sql) documents bucket `school-generated-curriculum` (private). Confirm the bucket exists under **Storage** after running SQL.

## 5. Auth — anonymous sign-in (students)

Students on shared devices use **anonymous auth** ([ensureAnonymousSchoolAuth](../src/school/schoolSession.ts)):

1. Supabase → **Authentication → Providers**.
2. Enable **Anonymous sign-ins**.

Without this, school weekly track / generated units may fail to load progress for students.

## 6. Teacher access

[TeacherDashboardPage](../src/TeacherDashboardPage.tsx) and the weekly generator expect a **signed-in** user. [isTeacherUser](../src/lib/supabaseUserRole.ts) currently treats:

- `role === 'teacher'` in JWT metadata, **or**
- **Pilot fallback:** any non-anonymous signed-in user.

For a **closed pilot**, the fallback may be acceptable; for wider launch, set **`teacher`** (or equivalent) in Supabase Auth **custom claims** / app metadata and tighten the check.

## 7. Smoke test (manual)

1. **Teacher:** Sign up / sign in → `/teacher/dashboard` → create a class → note **class code**.
2. **Teacher:** `/teacher/generator` → pick class → upload a small PDF → wait for success.
3. **Student browser:** `/schools` → join with class code → `/schools/weekly-track` → open a generated unit → complete quiz.
4. **Teacher:** Confirm progress appears in dashboard (if implemented for your schema).

## 8. API route auth

`POST /api/schools/generate-weekly-units` uses the teacher’s **Bearer** token from Supabase. Ensure CORS and deployed URL match what teachers use.
