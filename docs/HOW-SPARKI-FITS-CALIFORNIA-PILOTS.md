# How Sparki fits — California pilots

Short reference for curriculum leads, principals, and IT when discussing **supplemental** use of Sparki Academy alongside district scope-and-sequence. This is product positioning and technical transparency, not legal advice.

## Where to find it in the app

| Need | Where |
|------|--------|
| **Parent / grown-up dashboard** (progress on device, prompts, Safety Pass) | Signed in: footer link **Parent dashboard**, or **Academy → Grown-ups → Parent dashboard** (`/?view=parent`). With kid lock: footer **Grown-up?** |
| **Teacher roster & tracking** (anonymous codes, CSV) | **Academy → Teacher sign in** (school theme: **Academy → Teacher tools → Teacher dashboard**) → tab **Roster & tracking**. Requires Supabase + teacher role. |
| **Class join** (students) | **School Mode** on → **School hub** → enter class + student label. |

## What Sparki is in pilot v1

- **Supplemental practice**: Short subject tracks (math, English, science, history) with California framework metadata (PTKLF, CCSS, NGSS, HSS) and printable alignment tables — not a full-year replacement curriculum or LMS.
- **Teacher-generated weekly units**: PDF-based weekly tracks from the teacher dashboard complement subject lessons; they do not replace your adopted core program.
- **Class join with anonymous codes**: Students can participate with a class code and a simple label; designed for minimal extra accounts in pilots.

## Instructional loop (student-facing)

Subject lessons are intentionally short: **Learn → Practice → Quick check → Real world** so the flow reads as teaching, not a disconnected quiz.

## Progress and visibility (honest limits)

- **Subject-track quiz mastery** on student browsers is stored in **device localStorage** (`schoolSubjectProgress.ts`) unless you implement additional sync. Parents see a note in the parent dashboard when local subject-track activity exists.
- **Teacher dashboard CSV / Supabase** reflects progress for flows tied to **school class sessions** (e.g. weekly track, configured class join). Subject-track “struggle” detail on a personal device is **not** automatically in the teacher export unless you later wire sync or assign those lessons through a class flow.

## California / CDE positioning

- Use Sparki as **California-aligned supplemental** material: cite framework codes on lessons and the printable standard maps; pair with your district pacing guide and adoption.

## Roadmap (not pilot v1)

- SSO / roster / SIS integration  
- District-wide analytics beyond anonymous class progress  
- Deeper LMS replacement features  

For deployment steps, see `PILOT-RUNBOOK.md`, `SUPABASE-PILOT-SETUP.md`, and the compliance overview linked from **For Schools** in the app.
