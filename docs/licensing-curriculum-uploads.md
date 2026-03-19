## Licensing feature: Teacher-uploaded home curriculum

### What it is
Schools that license Sparki can upload **at-home learning packets** (PDF/ZIP) per class. Students access them using **anonymous class join** (no student names).

### Why it matters
- Makes school learning “come alive” at home (same curriculum, same language toggle).
- Supports a **paid licensing tier** without changing the free family experience.

### MVP scope (recommended)
Teacher dashboard:
- Select class
- Upload a packet (PDF) with a title
- List uploaded packets
- Copy a “Student link” that opens `/schools` and prompts class join

Student (school mode):
- After joining a class, show “At-home packets” list
- Open packet (PDF) inside the in-app viewer
- Offline support: packets work after first open (cached)

### Data + storage
Use:
- Table: `public.school_home_packets`
- Storage bucket (private): `school-home-packets`

Store uploads under a deterministic path:\n
`teacher/<teacher_id>/class/<class_id>/<upload_id>/<filename>`

### Security
- **RLS**: teachers can only manage packets for their classes.\n
- **Students** can only read packets for the class they joined (based on `school_student_progress`).\n
- Storage policies must mirror table policies.

### Implementation notes
- Add a feature flag (e.g. `VITE_ENABLE_SCHOOL_LICENSING=true`) to hide this UI until pricing is ready.\n
- You can gate it behind Stripe by storing a licensing entitlement in Supabase (teacher profile) or checking a Stripe customer subscription server-side.

