import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online Safety for Kids | Sparki Academy",
  description:
    "Free online safety ebooks and interactive adventures teaching children ages 3–11 to stay safe online.",
};

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
          Sparki Academy
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Internet safety
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          This page is a placeholder for tutor-led safety scenarios and ebooks.
        </p>
      </div>
      <Link
        href="/tutor"
        className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
      >
        Start Human Tutor
      </Link>
    </main>
  );
}

