import { Suspense } from "react";
import { TutorPageClient } from "./tutor-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Human Tutor",
  description:
    "Start a Sparki Academy Human Tutor session (voice-interactive) with COPPA-aligned parent controls.",
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
