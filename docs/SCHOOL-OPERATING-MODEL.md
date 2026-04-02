# Sparki School — operating model

How the school pilot is meant to work for **teachers**, **students**, and **families**, what data is authoritative, and what Sparki is **not**. Pair with [HOW-SPARKI-FITS-CALIFORNIA-PILOTS.md](./HOW-SPARKI-FITS-CALIFORNIA-PILOTS.md) and [SCHOOL-CSV-EXPORT.md](./SCHOOL-CSV-EXPORT.md).

## Audiences and primary surfaces

| Audience | Primary job | Main surfaces |
|----------|-------------|----------------|
| **Teacher** | Create class, share code, assign weekly PDF unit, see who is stuck | [`/teacher/dashboard`](../src/TeacherDashboardPage.tsx), [`/teacher/generator`](../src/TeacherWeeklyGeneratorPage.tsx) |
| **Student** | Join once, do this week’s work + optional subject practice | School Mode → [`/schools`](../src/SchoolsPage.tsx), weekly track, subject lessons |
| **Family (school)** | Understand class setup, teacher note, links—without consumer Safety Pass noise | [`/schools/parent`](../src/SchoolParentPage.tsx) |
| **Family (home)** | Safety tracks, homework, Safety Pass, sparkles | [`/?view=parent`](../src/ParentDashboard.tsx) |

## Data truth (what syncs where)

- **`school_classes`** — One row per teacher class: name, join `class_code`, age band, optional **class bulletin** (teacher → class/family message). Teachers own rows via Supabase auth.
- **`school_student_progress`** — One row per `(class_id, anonymous student_uid)` after join. `progress` is JSON: main Academy **unit** mastery (when synced from [`progress.ts`](../src/progress.ts)), optional **`sparkiSubjectTracks`** snapshot (subject-lesson quiz/practice when class session is active), optional **`sparkiEngagement`** (e.g. last “I’m here” ping). **`updated_at`** is the row’s last write—useful as **last Sparki activity**, not official ADA attendance.
- **Device-only** — If the device never joins a class, subject-track data may stay in [`schoolSubjectProgress.ts`](../src/school/subjects/schoolSubjectProgress.ts) only until sync runs.

## What Sparki is not (without a district program)

- **Not** your SIS or official attendance system. Engagement pings and `updated_at` are **supplemental signals** for teachers, not legal attendance.
- **Not** a full LMS gradebook unless you explicitly import CSV into another tool.
- **Not** roster-authenticated student identity in pilot v1 (anonymous labels by design).

## Communication model (lean)

1. **Class bulletin** — Short text on the class row; shown on school parent hub and (where configured) student flows. Complements email/Remind; copy-to-clipboard can be added later.
2. **Printables** — Parent letter and teacher guide from For Schools.
3. **Roadmap** — Deeper messaging (email, SIS roster) is a **district** workstream, not implied by pilot UI alone.

## Pilot success metrics (examples)

- Time to first class + join code shared  
- Share of class devices joined  
- Weekly PDF generator used at least once per week  
- Teacher CSV exports (signals reliance for reporting)  
- Optional: subject-track keys present in `progress.sparkiSubjectTracks` (hands-on practice visible to teachers)

## Related docs

- [SCHOOL-CSV-EXPORT.md](./SCHOOL-CSV-EXPORT.md) — export column contract  
- [SCHOOL-SUBJECT-SYNC.md](./SCHOOL-SUBJECT-SYNC.md) — subject progress mirror  
- [SCHOOL-CLASS-BULLETIN.md](./SCHOOL-CLASS-BULLETIN.md) — bulletin schema & behavior  
- [SCHOOL-ENGAGEMENT-SIGNALS.md](./SCHOOL-ENGAGEMENT-SIGNALS.md) — engagement vs attendance  
