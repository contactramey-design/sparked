"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshDashboardButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      className="min-h-[44px] rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
      onClick={() => {
        setBusy(true);
        router.refresh();
        window.setTimeout(() => setBusy(false), 600);
      }}
    >
      Refresh data
    </button>
  );
}
