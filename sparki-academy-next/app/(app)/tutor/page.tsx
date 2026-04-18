import { Suspense } from "react";
import { TutorPageClient } from "./tutor-page-client";

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
