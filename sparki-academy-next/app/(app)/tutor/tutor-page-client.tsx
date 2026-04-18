"use client";

import { TutorSession, type TutorAgeBand } from "@/components/tutor/TutorSession";
import { useRouter, useSearchParams } from "next/navigation";

function parseAgeBand(raw: string | null): TutorAgeBand {
  if (raw === "tots_3_5" || raw === "kids_6_8" || raw === "crew_9_11") {
    return raw;
  }
  return "kids_6_8";
}

export function TutorPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("child")?.trim() ?? "";
  const childName = searchParams.get("name")?.trim() || "Friend";
  const ageBand = parseAgeBand(searchParams.get("band"));

  if (!childId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Human Tutor</h1>
        <p className="mt-4 text-slate-600">
          Add a child id to the URL, for example{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            /tutor?child=YOUR_CHILD_UUID&amp;name=Alex&amp;band=kids_6_8
          </code>
        </p>
        <p className="mt-2 text-sm text-slate-500">
          <code className="rounded bg-slate-100 px-1">band</code> is one of{" "}
          <code>tots_3_5</code>, <code>kids_6_8</code>, <code>crew_9_11</code>.
        </p>
      </div>
    );
  }

  return (
    <TutorSession
      childId={childId}
      childName={childName}
      ageBand={ageBand}
      onSessionEnd={() => {
        router.push("/dashboard");
      }}
      onParentExit={() => {
        router.push("/");
      }}
    />
  );
}
