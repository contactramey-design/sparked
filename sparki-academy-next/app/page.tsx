import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
          Sparki Academy
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Learn with confidence
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Human tutor sessions and a parent dashboard — sign in to continue to
          protected areas.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/tutor"
          className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          Human Tutor
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Parent dashboard
        </Link>
      </div>
    </main>
  );
}
