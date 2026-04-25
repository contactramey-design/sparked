# Subprocessors and pilot DPA (outline)

**Not legal advice.** Have counsel review before signing with a district.

## Typical subprocessors (when features are enabled)

| Provider | Role | Data touched (examples) |
|----------|------|-------------------------|
| **Vercel** | Hosting, serverless APIs, Blob storage | App traffic, uploaded homework media (if stored in Blob), PDFs policy-dependent |
| **Supabase** | Auth, Postgres, Storage (school PDFs) | Teacher accounts, class codes, student anonymous IDs, progress JSON, optional PDFs |
| **OpenAI** | Homework image → story JSON | Image bytes in memory for request (see your privacy policy) |
| **ElevenLabs** | TTS audio | Text sent to `/api/tts` |
| **Stripe** | Payments (if used) | Billing metadata; not student lesson content |
| **Railway / Render / Fly** (optional) | Video worker | Adventure script text, TTS, composited video → Blob |

Adjust the list to match **your** production configuration.

## Short “pilot terms” checklist

1. **Purpose:** Limited-time evaluation of Sparki Academy (describe grades / subjects).
2. **School responsibilities:** Consent, COPPA/FERPA alignment, acceptable use, point of contact.
3. **Your responsibilities:** Security practices in good faith, support channel, incident notification window.
4. **Data:** What you collect, retention, deletion on request (define process).
5. **Subprocessors:** Attach table above + right to object / notice of change (as counsel advises).
6. **Termination:** How pilot ends and what happens to school data.

## In-app disclosure

Ensure [PrivacyPage](../src/PrivacyPage.tsx), [CompliancePage](../src/CompliancePage.tsx), and [ComplianceContent](../src/components/ComplianceContent.tsx) match what you actually run in production (especially homework + Supabase).
