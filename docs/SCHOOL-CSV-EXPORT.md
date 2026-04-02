# Sparki class roster CSV — column contract

Export is generated in [`TeacherDashboardPage`](../src/TeacherDashboardPage.tsx) when a class is selected and the roster has at least one row. File name: `sparki-{CLASS_CODE}.csv` (class code from the selected class).

**Version:** v2 (subject + engagement columns added for pilot alignment). Consumers of the CSV should tolerate **additional columns** in future versions.

## Columns (stable names)

| Column | Type | Meaning |
|--------|------|---------|
| `class_code` | string | Join code for the class (same for every row in the file). |
| `student_code` | string | Anonymous label the student chose at join (not a legal name). |
| `internet_safety_percent` | 0–100 | Estimated completion of **Internet / social safety** track units in the synced `progress` JSON. |
| `ai_coding_percent` | 0–100 | Estimated completion of **AI & coding** track units. |
| `homework_percent` | 0–100 | Completion of **teacher-generated weekly homework units** currently active for this class (0 if none active). |
| `subject_track_lessons_count` | integer | Number of subject-track lesson keys present in `progress.sparkiSubjectTracks.lessons` (any progress recorded while class session sync was active). |
| `subject_track_mastered_count` | integer | Subset of those lessons with best quiz score ≥ 100% (stored as ratio 1 in JSON). |
| `engagement_last_ping_at` | ISO 8601 or empty | Last time the student tapped **Sparki check-in** on the school hub (if any). **Not** official attendance. |
| `progress_row_updated_at` | ISO 8601 | `school_student_progress.updated_at` — last time any synced progress was written for this row. |
| `overall_percent` | 0–100 | Average of `internet_safety_percent`, `ai_coding_percent`, and `homework_percent` (legacy composite; subject columns are additive detail). |

## Semantics for schools

- Use this file for **instructional awareness** and optional import into tools your district allows. Do not treat `engagement_last_ping_at` as ADA attendance without explicit policy.
- Map `student_code` to real names only in systems you control (FERPA/COPPA as applicable).

## `progress` JSON keys (reference)

- `units` — Main Academy unit ids → `{ mastered, postScore, ... }` (shape from app progress).
- `sparkiSubjectTracks.lessons` — Keys `subjectId::lessonId` → `{ quizBestScore, quizAttempts, completedAt?, practiceCompletedAt? }`.
- `sparkiEngagement.lastPingAt` — ISO timestamp of last optional check-in.
