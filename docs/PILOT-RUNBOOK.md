# Pilot runbook (v1)

Short operational guide for **you** and **pilot schools**. Keep this aligned with what is actually enabled in production.

## Product URLs (replace with your domain)

| Audience | URL | Notes |
|----------|-----|--------|
| Home / kids | `https://YOUR_DOMAIN/` | Main app |
| For schools | `https://YOUR_DOMAIN/for-schools` | Marketing + compliance links |
| Schools hub | `https://YOUR_DOMAIN/schools` | Class join |
| Teacher dashboard | `https://YOUR_DOMAIN/teacher/dashboard` | Requires Supabase login |
| Weekly generator | `https://YOUR_DOMAIN/teacher/generator` | PDF → generated units |
| Homework Adventure | `https://YOUR_DOMAIN/homework` | Needs OpenAI + (prod) Stripe bundle |
| Health | `https://YOUR_DOMAIN/api/setup-status` | Pre-flight check |

## Pre-flight (same day as pilot)

1. Complete [PILOT-INFRA-CHECKLIST.md](./PILOT-INFRA-CHECKLIST.md) (`schemaVersion: 3`, TTS key accepted if using Listen).
2. If using **school features:** [SUPABASE-PILOT-SETUP.md](./SUPABASE-PILOT-SETUP.md) (anon auth on, SQL applied).
3. Review [BILLING-AND-QUOTAS.md](./BILLING-AND-QUOTAS.md) — ElevenLabs + OpenAI have budget.

## Teacher script (school weekly path)

1. Open **Teacher dashboard** → sign in (email magic link or your auth method).
2. **Create class** → copy **class code** for students.
3. Open **Weekly generator** → select class → upload **PDF** → submit.
4. Wait for success (may take minutes if video generation per unit is on).
5. Share with students: **site URL** + **class code** (and student “first name code” rules if you use them).

## Student script (shared iPad / browser)

1. Open **Schools** → enter **class code** (and student code if prompted).
2. Open **Weekly track** → pick a unit.
3. Read / listen → finish material → **quiz** → confirm completion.

## What to tell schools is **in scope** for pilot v1

Check only what you have verified end-to-end:

- [ ] Core curriculum units (tracks) — list track names.
- [ ] School weekly PDF generator + student view.
- [ ] Homework Adventure (image upload + story + optional video).
- [ ] Listen / TTS (ElevenLabs).
- [ ] Spanish toggle.

## What is **out of scope** unless tested

- Paid checkout / Safety Pass (unless Stripe tested).
- Offline-first guarantees (PWA caches; network still needed for APIs).
- Custom per-unit MP4s (may use placeholder videos until assets exist).

## If something breaks

1. **Support:** [Contact](../src/ContactPage.tsx) — **hello@sparkiedu.com** (change in code if needed).
2. **Listen / TTS:** Check `setup-status` → `tts.keyAcceptedByElevenLabs` and ElevenLabs quota.
3. **Homework:** Check `homeworkAdventure.configured` and OpenAI billing.
4. **Video:** Cold worker — retry after 60s; check `VIDEO_WORKER_URL` and worker logs.

## Latency expectations

- **Create video (homework):** 30–90s common (worker cold start + TTS + ffmpeg).
- **ElevenLabs Listen:** usually a few seconds; can fail on quota — falls back to device voice.

## Legal / trust

- Privacy & compliance pages linked from footer and For Schools hub.
- Formal pilots: see [PILOT-SUBPROCESSORS-AND-DPA.md](./PILOT-SUBPROCESSORS-AND-DPA.md) for subprocessors and a short DPA outline.
