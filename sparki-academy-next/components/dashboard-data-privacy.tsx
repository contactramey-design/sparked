"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export type DashboardChildOption = {
  id: string;
  name: string;
};

const DELETE_CONFIRM =
  "PERMANENTLY_DELETE_ALL_CHILD_DATA" as const;

type Props = {
  childrenList: DashboardChildOption[];
};

export function DashboardDataPrivacy({ childrenList }: Props) {
  const router = useRouter();
  const [selectedChildId, setSelectedChildId] = useState(
    () => childrenList[0]?.id ?? "",
  );
  const [busy, setBusy] = useState<"download" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const selectedName = useMemo(() => {
    const row = childrenList.find((c) => c.id === selectedChildId);
    return row?.name ?? "your child";
  }, [childrenList, selectedChildId]);

  const closeModal = useCallback(() => {
    setStep(0);
    setError(null);
  }, []);

  const onDownload = useCallback(async () => {
    if (!selectedChildId) {
      setError("Select a child first.");
      return;
    }
    setBusy("download");
    setError(null);
    try {
      const res = await fetch(
        `/api/dashboard/export-data?childId=${encodeURIComponent(selectedChildId)}`,
        { method: "GET", credentials: "same-origin" },
      );
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? `Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sparki-child-${selectedChildId}-export.json`;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setBusy(null);
    }
  }, [selectedChildId]);

  const onFinalDelete = useCallback(async () => {
    if (!selectedChildId) {
      return;
    }
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch("/api/dashboard/delete-child-data", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChildId,
          confirmation: DELETE_CONFIRM,
        }),
      });
      const j = (await res.json().catch(() => null)) as {
        error?: string;
        child_display_name?: string;
      } | null;
      if (!res.ok) {
        throw new Error(j?.error ?? `Delete failed (${res.status})`);
      }
      const deletedLabel =
        typeof j?.child_display_name === "string" && j.child_display_name.trim()
          ? j.child_display_name.trim()
          : selectedName;
      closeModal();
      router.push(
        `/dashboard?deleted=${encodeURIComponent(deletedLabel)}`,
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(null);
    }
  }, [closeModal, router, selectedChildId, selectedName]);

  if (childrenList.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Data &amp; Privacy</h2>
        <p className="mt-3 min-h-[20px] text-[15px] leading-relaxed text-slate-700 sm:text-base">
          As required by COPPA, you have the right to review, download, or
          permanently delete your child&apos;s data at any time. We do not sell
          or share your child&apos;s data.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Add a child profile in Sparki Academy to use download and deletion
          controls here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Data &amp; Privacy</h2>
      <p className="mt-3 min-h-[20px] text-[15px] leading-relaxed text-slate-700 sm:text-base">
        As required by COPPA, you have the right to review, download, or
        permanently delete your child&apos;s data at any time. We do not sell
        or share your child&apos;s data.
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:max-w-md">
        <label className="text-sm font-medium text-slate-800" htmlFor="coppa-child">
          Child
        </label>
        <select
          id="coppa-child"
          className="min-h-[48px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900"
          value={selectedChildId}
          onChange={(e) => setSelectedChildId(e.target.value)}
        >
          {childrenList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onDownload()}
          disabled={busy !== null || !selectedChildId}
          className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "download" ? "Preparing…" : "Download My Child\u2019s Data"}
        </button>
      </div>

      <div className="mt-24 border-t border-dashed border-slate-200 pt-16">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Irreversible erasure
        </p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep(1);
          }}
          disabled={busy !== null || !selectedChildId}
          className="mt-4 inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete My Child\u2019s Data
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {step === 1 ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coppa-del-title"
        >
          <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="coppa-del-title" className="text-lg font-bold text-slate-900">
              Delete all data for this child?
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-700 sm:text-base">
              This will permanently delete all of {selectedName}&apos;s sessions,
              progress, and learning history. This cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="min-h-[48px] rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="min-h-[48px] rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coppa-del-final-title"
        >
          <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-xl">
            <h3
              id="coppa-del-final-title"
              className="text-lg font-bold text-red-900"
            >
              Final confirmation
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-700 sm:text-base">
              You are about to permanently erase every stored record for{" "}
              <span className="font-semibold">{selectedName}</span>. This
              includes tutor session summaries and adventure progress.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="min-h-[48px] rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="min-h-[48px] rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                disabled={busy === "delete"}
                onClick={() => void onFinalDelete()}
              >
                {busy === "delete" ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
