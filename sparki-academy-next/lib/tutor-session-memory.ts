/**
 * Human Tutor session memory: prior parent-facing summaries from Supabase.
 *
 * **LiveAvatar FULL mode:** pass the returned `dynamicVariables` map into
 * `POST /v1/sessions/token` as `dynamic_variables`. Your LiveAvatar **context**
 * (the one referenced by `LIVEAVATAR_CONTEXT_ID`) must include a placeholder
 * such as `${session_memory}` in its prompt / opening text so this value is
 * injected (keys not referenced by the context are ignored by the API).
 *
 * **LITE mode:** prepend `buildMemoryContextString(rows)` to your OpenAI (or
 * other) system prompt in `app/api/tutor/chat/route.ts` when you add chat.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type TutorSessionMemoryRow = {
  started_at: string | null;
  created_at?: string | null;
  duration_seconds: number | null;
  subject_tag: string | null;
  /** Denormalized parent-readable line (optional column). */
  parent_summary: string | null;
  summary_bullets: unknown;
  revisit_note: string | null;
};

const MAX_DYNAMIC_VALUE_LEN = 1000;

function bulletsToText(summaryBullets: unknown): string {
  if (!Array.isArray(summaryBullets)) {
    return "";
  }
  const parts = summaryBullets
    .filter((b): b is string => typeof b === "string" && b.trim().length > 0)
    .map((b) => b.trim());
  return parts.join(" · ");
}

/** Single-line summary for memory (prefers `parent_summary`, else bullets + revisit). */
export function rowToParentSummary(row: TutorSessionMemoryRow): string {
  const direct =
    typeof row.parent_summary === "string" ? row.parent_summary.trim() : "";
  if (direct) {
    return direct;
  }
  const fromBullets = bulletsToText(row.summary_bullets);
  const revisit =
    typeof row.revisit_note === "string" && row.revisit_note.trim()
      ? ` Revisit: ${row.revisit_note.trim()}`
      : "";
  return `${fromBullets}${revisit}`.trim();
}

export function buildMemoryContextString(
  rows: TutorSessionMemoryRow[] | null | undefined,
): string {
  const list = (rows ?? []).filter((r) => rowToParentSummary(r).length > 0);
  if (list.length === 0) {
    return "This is a new student — no previous session history.";
  }
  const lines = list.map((s, i) => {
    const whenRaw = s.started_at ?? s.created_at ?? null;
    const when = whenRaw
      ? new Date(whenRaw).toLocaleDateString()
      : "unknown date";
    const subject = (s.subject_tag ?? "general").trim() || "general";
    const summary = rowToParentSummary(s);
    return `Session ${i + 1} (${when}): ${subject} — ${summary}`;
  });
  return `Previous sessions with this child:
${lines.join("\n")}
Use this to personalize the session. Reference what was covered before. Build on what they already know.`;
}

/**
 * Truncate for LiveAvatar `dynamic_variables` values (max 1000 chars each).
 */
export function truncateForLiveAvatarDynamicVar(text: string): string {
  if (text.length <= MAX_DYNAMIC_VALUE_LEN) {
    return text;
  }
  return `${text.slice(0, MAX_DYNAMIC_VALUE_LEN - 1)}…`;
}

export function memoryDynamicVariables(
  memoryContext: string,
  variableKey: string,
): Record<string, string> {
  const key = variableKey.trim() || "session_memory";
  return { [key]: truncateForLiveAvatarDynamicVar(memoryContext) };
}

/**
 * Loads the last few tutor telemetry rows for this child (same table as the
 * legacy `tutor_sessions` dashboard). Prefer `child_id`; if none match, falls
 * back to `child_label` for older rows that predate `child_id`.
 */
export async function fetchRecentTutorSessionsForMemory(
  supabase: SupabaseClient,
  params: {
    childId: string;
    parentUserId: string;
    childDisplayName?: string | null;
    limit?: number;
  },
): Promise<TutorSessionMemoryRow[]> {
  const limit = params.limit ?? 3;
  const baseSelect =
    "parent_summary, subject_tag, started_at, duration_seconds, summary_bullets, revisit_note, created_at";

  const byChild = await supabase
    .from("tutor_sessions")
    .select(baseSelect)
    .eq("parent_user_id", params.parentUserId)
    .eq("child_id", params.childId)
    .or("parent_summary.not.is.null,summary_bullets.not.is.null")
    .order("started_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (byChild.error) {
    console.error("[tutor-memory] tutor_sessions by child_id", byChild.error.message);
    return [];
  }
  const primary = (byChild.data as TutorSessionMemoryRow[]) ?? [];
  if (primary.length > 0) {
    return primary;
  }

  const label = params.childDisplayName?.trim();
  if (!label) {
    return [];
  }

  const byLabel = await supabase
    .from("tutor_sessions")
    .select(baseSelect)
    .eq("parent_user_id", params.parentUserId)
    .is("child_id", null)
    .ilike("child_label", label)
    .or("parent_summary.not.is.null,summary_bullets.not.is.null")
    .order("started_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (byLabel.error) {
    console.error("[tutor-memory] tutor_sessions by child_label", byLabel.error.message);
    return [];
  }
  return (byLabel.data as TutorSessionMemoryRow[]) ?? [];
}
