# Avatar APIs — live tutor vs batch lessons

Sparki uses **two different product shapes**:

1. **Live / interactive tutor** in the app — **HeyGen Streaming Avatar** (`@heygen/streaming-avatar` + `streaming.create_token`). Low-latency, WebRTC-style delivery; cost scales with **connected streaming time**.
2. **Pre-rendered “course” or marketing video** (automation / n8n) — **HeyGen Generate Video** and/or **Synthesia** batch APIs — cost scales with **output seconds** and queue time; not suitable for turn-by-turn child chat without changing UX to async “wait for clip.”

## Synthesia (batch-oriented)

- Strengths: polished talking-head **exports**, template workflows, enterprise quotas.
- Limits: typical integration is **job-based** (create → poll/webhook → download). Not a drop-in replacement for **live** HeyGen streaming in `InteractiveTutor.tsx`.
- Action: Re-read official **rate limits** (Write vs Read) and **max duration per render** before sizing weekly automation.

## HeyGen (both families)

- **Streaming / Interactive**: matches current tutor implementation — see [AI-TUTOR-ARCHITECTURE.md](./AI-TUTOR-ARCHITECTURE.md).
- **Video generation (non-streaming)**: separate price card in HeyGen docs (per-second, engine III vs IV). Use for **weekly drip** or long-form renders; lock `use_avatar_iv_model` (or equivalent) intentionally — Engine IV is materially more expensive than III on PAYG.

## Decision summary

| Use case | Preferred API family |
| -------- | -------------------- |
| Child speaks; avatar answers in-session | HeyGen **streaming** |
| Monday published 20-minute “episode” | HeyGen **generate** or Synthesia — pick one pipeline after a **one-video** prototype |
