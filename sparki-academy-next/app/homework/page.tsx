import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Homework Adventure Generator | Sparki Academy",
  description:
    "Turn your child's real homework into a Sparki adventure. Free with Sparki Academy.",
};

export default function HomeworkPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
          Sparki Academy
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Homework adventures
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Turn a worksheet into a guided story quest — sign in on the consumer app to
          upload homework, or continue to the tutor from here.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/tutor"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          Human Tutor
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Parent dashboard
        </Link>
      </div>
    </main>
  );
}
