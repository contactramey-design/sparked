import Link from "next/link";
import type { ReactNode } from "react";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Sparki Academy
          </Link>
          <nav className="flex gap-4 text-sm text-slate-600">
            <Link href="/tutor" className="hover:text-slate-900">
              Tutor
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
