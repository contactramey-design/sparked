import { createClient } from "@/lib/supabase/server";
import { fetchRecentTutorSessionsForMemory } from "@/lib/tutor-session-memory";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * LITE-mode tutor chat (OpenAI-backed text) is not wired in this deployment.
 * When you add it, load prior sessions and **prepend** `memoryContext` to the
 * model system prompt, for example:
 *
 * ```ts
 * import { buildMemoryContextString } from "@/lib/tutor-session-memory";
 * const rows = await fetchRecentTutorSessionsForMemory(supabase, { ... });
 * const memoryContext = buildMemoryContextString(rows);
 * const systemPrompt = `${memoryContext}\n\nYou are Sparki, a friendly tutor…`;
 * ```
 */

const TutorChatBodySchema = z.object({
  childId: z.string().uuid(),
  childDisplayName: z.string().min(1).max(120).optional(),
  messages: z.array(z.unknown()).optional(),
});

export async function POST(request: Request) {
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

  const parsed = TutorChatBodySchema.safeParse(jsonBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { childId, childDisplayName } = parsed.data;

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id, tutor_enabled")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError || !child) {
    return NextResponse.json(
      { error: "Child not found or access denied" },
      { status: 403 },
    );
  }

  if ((child as { tutor_enabled?: boolean | null }).tutor_enabled !== true) {
    return NextResponse.json(
      { error: "Tutor is not enabled for this child" },
      { status: 403 },
    );
  }

  const rows = await fetchRecentTutorSessionsForMemory(supabase, {
    childId,
    parentUserId: user.id,
    childDisplayName: childDisplayName ?? null,
  });

  return NextResponse.json(
    {
      error: "LITE mode tutor chat is not configured on this deployment.",
      prior_session_count: rows.length,
    },
    { status: 501 },
  );
}
