import { childDisplayName, isMissingTableError } from "@/lib/dashboard-coppa";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const DeleteBodySchema = z.object({
  childId: z.string().uuid(),
  /** Second-step acknowledgment from the parent UI. */
  confirmation: z.literal("PERMANENTLY_DELETE_ALL_CHILD_DATA"),
});

/**
 * COPPA: permanent erasure of child-linked rows (hard delete).
 * DELETE /api/dashboard/delete-child-data
 */
export async function DELETE(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let jsonBody: unknown;
  try {
    jsonBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = DeleteBodySchema.safeParse(jsonBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { childId } = parsed.data;

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id, display_name, name, nickname")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError) {
    console.error("[delete-child-data] children", childError.message);
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

  const displayName = childDisplayName(
    child as Record<string, string | null | undefined>,
  );

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Server is not configured for permanent deletion. Set SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const { error: tsErr } = await admin
    .from("tutor_sessions")
    .delete()
    .eq("child_id", childId)
    .eq("parent_user_id", user.id);

  if (tsErr) {
    console.error("[delete-child-data] tutor_sessions", tsErr.message);
    return NextResponse.json(
      { error: "Could not delete session records." },
      { status: 500 },
    );
  }

  const sessionsDel = await admin
    .from("sessions")
    .delete()
    .eq("child_id", childId);
  if (sessionsDel.error && !isMissingTableError(sessionsDel.error)) {
    console.error("[delete-child-data] sessions", sessionsDel.error.message);
    return NextResponse.json(
      { error: "Could not delete generic session records." },
      { status: 500 },
    );
  }

  const apDel = await admin
    .from("adventure_progress")
    .delete()
    .eq("child_id", childId);
  if (apDel.error && !isMissingTableError(apDel.error)) {
    console.error("[delete-child-data] adventure_progress", apDel.error.message);
    return NextResponse.json(
      { error: "Could not delete adventure progress." },
      { status: 500 },
    );
  }

  const { error: chErr } = await admin
    .from("children")
    .delete()
    .eq("id", childId)
    .eq("parent_id", user.id);

  if (chErr) {
    console.error("[delete-child-data] children", chErr.message);
    return NextResponse.json(
      { error: "Could not delete child profile. Other data may have been removed." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    child_display_name: displayName,
  });
}
