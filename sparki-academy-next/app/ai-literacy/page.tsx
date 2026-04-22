import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI literacy",
  description:
    "AI literacy for kids ages 3–11 — start a guided Sparki Academy tutor session on how AI learns, makes mistakes, and how to verify.",
};

export default function AiLiteracyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
          Sparki Academy
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          AI literacy
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          This page is a placeholder for a tutor-led AI literacy landing.
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

