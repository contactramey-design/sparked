# Subject-track sync to `school_student_progress`

## Goal

When a device has an **active class session** (`class_id` + `student_code` in [`schoolSession`](../src/school/schoolSession.ts)) and the learner completes **subject-track** quiz or practice, mirror a snapshot of [`schoolSubjectProgress`](../src/school/subjects/schoolSubjectProgress.ts) into the Supabase row’s `progress` JSON under **`sparkiSubjectTracks`**, so teachers see hands-on practice in the same roster export as core track completion.

## Behavior

1. Triggers: after `recordSchoolSubjectQuizResult` and `recordSchoolSubjectPracticeComplete` persist local state.
2. Preconditions: `getSchoolSession()` has `classId` and `studentCode`; `supabase` configured; `ensureAnonymousSchoolAuth()` returns uid.
3. Merge: **read** current `school_student_progress.progress` for `(class_id, student_uid)`, shallow-merge top-level keys, set `sparkiSubjectTracks: { lessons: { ...full local snapshot... } }`, **upsert** with same conflict target as [`progress.ts`](../src/progress.ts).
4. Race: last write wins; acceptable for pilot.

## Implementation

[`src/school/syncSchoolProgress.ts`](../src/school/syncSchoolProgress.ts) — `syncSparkiSubjectTracksToSupabase()`.

## Teacher visibility

[`TeacherDashboardPage`](../src/TeacherDashboardPage.tsx) CSV and optional UI summaries use `subject_track_lessons_count` / `subject_track_mastered_count` derived from `sparkiSubjectTracks` ([SCHOOL-CSV-EXPORT.md](./SCHOOL-CSV-EXPORT.md)).
