import {
  childDisplayName,
  isMissingTableError,
  type ChildDataExportV1,
} from "@/lib/dashboard-coppa";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function uuidParam(raw: string | null): string | null {
  if (!raw || typeof raw !== "string") {
    return null;
  }
  const t = raw.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)
    ? t
    : null;
}

/**
 * COPPA: parent-downloadable JSON for one child (sessions + optional tables).
 * GET /api/dashboard/export-data?childId=[uuid]
 */
export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const childId = uuidParam(url.searchParams.get("childId"));
  if (!childId) {
    return NextResponse.json(
      { error: "Valid childId query parameter (UUID) is required." },
      { status: 400 },
    );
  }

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id, display_name, name, nickname")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError) {
    console.error("[export-data] children", childError.message);
    return NextResponse.json(
      { error: "Could not verify child access." },
      { status: 500 },
    );
  }

  if (!child) {
    return NextResponse.json(
      { error: "Child not found or access denied." },
      { status: 403 },
    );
  }

  const name = childDisplayName(child as Record<string, string | null | undefined>);

  const { data: tutorSessions, error: tsErr } = await supabase
    .from("tutor_sessions")
    .select("*")
    .eq("child_id", childId)
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false });

  if (tsErr) {
    console.error("[export-data] tutor_sessions", tsErr.message);
    return NextResponse.json(
      { error: "Could not load session data." },
      { status: 500 },
    );
  }

  let sessionsTableRows: unknown[] = [];
  const sessionsProbe = await supabase
    .from("sessions")
    .select("*")
    .eq("child_id", childId);
  if (sessionsProbe.error) {
    if (!isMissingTableError(sessionsProbe.error)) {
      console.error("[export-data] sessions", sessionsProbe.error.message);
    }
  } else {
    sessionsTableRows = sessionsProbe.data ?? [];
  }

  let adventureProgress: unknown[] = [];
  const ap = await supabase
    .from("adventure_progress")
    .select("*")
    .eq("child_id", childId);
  if (ap.error) {
    if (!isMissingTableError(ap.error)) {
      console.error("[export-data] adventure_progress", ap.error.message);
    }
  } else {
    adventureProgress = ap.data ?? [];
  }

  const payload: ChildDataExportV1 = {
    export_version: 1,
    exported_at: new Date().toISOString(),
    child: { id: childId, display_name: name },
    sessions: tutorSessions ?? [],
    sessions_table_rows: sessionsTableRows,
    adventure_progress: adventureProgress,
  };

  const body = JSON.stringify(payload, null, 2);
  const filename = `sparki-child-${childId}-export.json`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
