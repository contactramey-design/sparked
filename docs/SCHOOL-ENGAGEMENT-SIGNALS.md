# Sparki engagement signals (not attendance)

## Intent

Give teachers a **lightweight** “did this device check in for Sparki today?” signal without claiming **official attendance** (ADA) or replacing the SIS.

## Mechanism

- Optional **“Sparki check-in”** on the school hub ([`SchoolsPage`](../src/SchoolsPage.tsx)) when the device is joined to a class.
- Client merges `progress.sparkiEngagement.lastPingAt = ISO timestamp` into `school_student_progress` (same merge pattern as subject sync).
- CSV column `engagement_last_ping_at` ([SCHOOL-CSV-EXPORT.md](./SCHOOL-CSV-EXPORT.md)).

## Policy language

Product copy and docs must say **engagement** or **Sparki activity**, not “attendance,” unless a district contract explicitly scopes Sparki as an attendance source.

## Roadmap

District-grade attendance would require legal review, SIS integration, and clocks—**Phase E** in the strategic plan, not pilot defaults.
