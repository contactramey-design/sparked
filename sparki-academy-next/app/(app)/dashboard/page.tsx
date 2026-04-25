import { createClient } from "@/lib/supabase/server";
import { RefreshDashboardButton } from "@/components/refresh-dashboard-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent Dashboard | Sparki Academy",
  description:
    "See what your child learned with Sparki today. Session summaries, progress, and account controls.",
};

type TutorSessionRow = {
  created_at: string;
  duration_seconds: number | null;
  message_count: number | null;
  subject_tag: string | null;
  summary_bullets: unknown;
  revisit_note: string | null;
  sum_estimated_cost_usd: number | string | null;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let sessions: TutorSessionRow[] = [];
  if (user) {
    const { data } = await supabase
      .from("tutor_sessions")
      .select(
        "created_at, duration_seconds, message_count, subject_tag, summary_bullets, revisit_note, sum_estimated_cost_usd",
      )
      .order("created_at", { ascending: false })
      .limit(30);
    sessions = (data as TutorSessionRow[]) ?? [];
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parent dashboard</h1>
          <p className="mt-2 text-slate-600">
            Session summaries from the legacy consumer AI Tutor appear below when Supabase telemetry is enabled on that deployment.
          </p>
        </div>
        {user ? <RefreshDashboardButton /> : null}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Signed in as
        </h2>
        <p className="mt-2 font-medium text-slate-900">
          {user?.email ?? user?.id ?? "Unknown user"}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">AI Tutor sessions</h2>
        <p className="mt-1 text-sm text-slate-600">
          Short bullet summaries and duration after each tutor tab ends — not full child chat logs (COPPA-aligned v1).
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Requires <code className="rounded bg-slate-100 px-1">tutor_sessions</code> in Supabase and server{" "}
          <code className="rounded bg-slate-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> on the app that records sessions.
        </p>
        {!user ? (
          <p className="mt-4 text-sm text-slate-600">Sign in to load session summaries.</p>
        ) : sessions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No tutor sessions yet for this account.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-800">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Duration</th>
                  <th className="py-2 pr-4">Messages</th>
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Est. cost</th>
                  <th className="py-2 pr-4">Summary</th>
                  <th className="py-2">Revisit</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((row, idx) => {
                  const d = row.duration_seconds;
                  const dur =
                    typeof d === "number" && d >= 0
                      ? `${Math.floor(d / 60)}m ${d % 60}s`
                      : "—";
                  const bullets = Array.isArray(row.summary_bullets)
                    ? (row.summary_bullets as string[]).filter(
                        (b) => typeof b === "string" && b.trim(),
                      )
                    : [];
                  const costRaw = row.sum_estimated_cost_usd;
                  const costLabel =
                    typeof costRaw === "number"
                      ? `$${costRaw.toFixed(4)}`
                      : typeof costRaw === "string"
                        ? `$${costRaw}`
                        : "—";
                  return (
                    <tr key={`${row.created_at}-${idx}`} className="border-b border-slate-100">
                      <td className="py-2 pr-4 align-top whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 align-top">{dur}</td>
                      <td className="py-2 pr-4 align-top">{row.message_count ?? "—"}</td>
                      <td className="py-2 pr-4 align-top">{row.subject_tag || "—"}</td>
                      <td className="py-2 pr-4 align-top">{costLabel}</td>
                      <td className="max-w-xs py-2 pr-4 align-top">
                        {bullets.length ? (
                          <ul className="m-0 list-disc space-y-1 pl-4">
                            {bullets.slice(0, 3).map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-[10rem] py-2 align-top text-slate-700">
                        {row.revisit_note?.trim() || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
