import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Parent dashboard</h1>
      <p className="mt-2 text-slate-600">
        Overview of progress and account settings will appear here.
      </p>
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Signed in as
        </h2>
        <p className="mt-2 font-medium text-slate-900">
          {user?.email ?? user?.id ?? "Unknown user"}
        </p>
      </section>
    </div>
  );
}
