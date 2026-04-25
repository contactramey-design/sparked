/** Generic `sessions` table (if present) alongside `tutor_sessions` telemetry. */
export type ChildDataExportV1 = {
  export_version: 1;
  exported_at: string;
  child: { id: string; display_name: string };
  /** Tutor / tab session telemetry (Supabase `tutor_sessions`). */
  sessions: unknown[];
  /** Optional `sessions` rows if table exists in project. */
  sessions_table_rows: unknown[];
  adventure_progress: unknown[];
};

export function childDisplayName(row: {
  display_name?: string | null;
  name?: string | null;
  nickname?: string | null;
}): string {
  const a = row.display_name?.trim();
  if (a) {
    return a;
  }
  const b = row.name?.trim();
  if (b) {
    return b;
  }
  const c = row.nickname?.trim();
  if (c) {
    return c;
  }
  return "Child";
}

export function isMissingTableError(
  err: { code?: string; message?: string } | null,
): boolean {
  if (!err) {
    return false;
  }
  const msg = (err.message ?? "").toLowerCase();
  return (
    err.code === "PGRST205" ||
    err.code === "42P01" ||
    msg.includes("could not find the table") ||
    msg.includes("schema cache") ||
    msg.includes("does not exist")
  );
}
