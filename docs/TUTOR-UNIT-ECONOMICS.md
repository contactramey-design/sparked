# Tutor unit economics — how to model cost

Do **not** treat fixed “$/session” figures from third-party writeups as accurate. Recompute from **your** meters after each billing period.

## Variables to track

| Variable | Source |
| -------- | ------ |
| HeyGen streaming minutes | HeyGen dashboard / invoices (product line may bill per second or credits — confirm in-account) |
| OpenAI tutor tokens | OpenAI usage API — model `gpt-4o` (or current tutor model) prompt + completion tokens per session |
| OpenAI classifier (if added) | Same — typically `gpt-4o-mini` |
| ElevenLabs characters | ElevenLabs usage — when TTS is not fully bundled in HeyGen for your configuration |

## Session cost (formula)

Approximate **variable cost per completed tutor session**:

\[
\text{cost} \approx c_{\text{HG}} \cdot t_{\text{min}} + c_{\text{4o}} \cdot T_{\text{in}} + c_{\text{4o-out}} \cdot T_{\text{out}} + c_{\text{EL}} \cdot N_{\text{chars}}
\]

Where:

- \(c_{\text{HG}}\) = effective $/minute (or $/credit × credits/min) **for your HeyGen streaming SKU**.
- \(t_{\text{min}}\) = avatar-connected minutes (not wall-clock alone).
- \(T_{\text{in}}, T_{\text{out}}\) = OpenAI token counts; use current list pricing for your model.
- \(c_{\text{EL}}\), \(N_{\text{chars}}\) = ElevenLabs only if billed separately for the paths you use.

## Spreadsheet discipline

1. Export one week of **actual** usage from each provider.
2. Divide cost by **count of tutor sessions** (define “session” consistently — e.g. tab open to disconnect, or message-count cap).
3. Compare to **ARPU** from Stripe (net of refunds) before changing limits (`MAX_MESSAGES` in `api/tutor-chat.js`, avatar default quality, etc.).

## Latency vs cost

Lowering latency often **raises** parallel calls (STT + LLM + TTS). Model **p95 latency** separately from **average cost**; they are not interchangeable.
