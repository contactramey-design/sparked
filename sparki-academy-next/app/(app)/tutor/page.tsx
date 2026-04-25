import { Suspense } from "react";
import { TutorPageClient } from "./tutor-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparki AI Tutor | Voice-Interactive Learning for Kids Ages 3–11",
  description:
    "Talk with Sparki — a COPPA-safe, voice-interactive AI tutor in English and Spanish. Free to try.",
};

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
          Loading tutor…
        </div>
      }
    >
      <TutorPageClient />
    </Suspense>
  );
}
