import {
  createLiveAvatarFullSessionToken,
  startLiveAvatarSession,
} from "@/lib/liveavatar-full";
import { createClient } from "@/lib/supabase/server";
import {
  assertTutorTokenRateLimit,
  recordSuccessfulTutorTokenRequest,
} from "@/lib/tutor-token-rate-limit";
import {
  buildMemoryContextString,
  fetchRecentTutorSessionsForMemory,
  memoryDynamicVariables,
} from "@/lib/tutor-session-memory";
import { NextResponse } from "next/server";
import { z } from "zod";

const TutorTokenBodySchema = z.object({
  childId: z.string().uuid(),
  /** Used to match legacy `tutor_sessions.child_label` rows before `child_id` was stored. */
  childDisplayName: z.string().min(1).max(120).optional(),
});

/** Subscription values that block tutor access (Stripe-style wording). */
const BLOCKED_SUBSCRIPTION_STATUSES = new Set([
  "canceled",
  "cancelled",
  "past_due",
  "unpaid",
  "incomplete_expired",
]);

function subscriptionAllowsTutor(status: string | null | undefined): boolean {
  if (status == null || status === "") {
    return false;
  }
  return !BLOCKED_SUBSCRIPTION_STATUSES.has(status.toLowerCase());
}

type ProfileRow = {
  subscription_status: string | null;
};

type ChildRow = {
  id: string;
  tutor_enabled: boolean | null;
};

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

  const parsedBody = TutorTokenBodySchema.safeParse(jsonBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsedBody.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { childId, childDisplayName } = parsedBody.data;

  const rate = await assertTutorTokenRateLimit(childId);
  if (!rate.ok) {
    return NextResponse.json({ error: rate.message }, { status: rate.status });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[tutor-token] profiles", profileError.message);
    return NextResponse.json(
      { error: "Could not verify subscription" },
      { status: 500 },
    );
  }

  const subscriptionStatus = (profile as ProfileRow | null)
    ?.subscription_status;

  if (!subscriptionAllowsTutor(subscriptionStatus)) {
    return NextResponse.json(
      {
        error:
          "Active subscription required for the human tutor (subscription cancelled, past due, or missing).",
      },
      { status: 402 },
    );
  }

  const { data: child, error: childError } = await supabase
    .from("children")
    .select("id, tutor_enabled")
    .eq("id", childId)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (childError) {
    console.error("[tutor-token] children", childError.message);
    return NextResponse.json(
      { error: "Could not verify child access" },
      { status: 500 },
    );
  }

  if (!child) {
    return NextResponse.json(
      { error: "Child not found or access denied" },
      { status: 403 },
    );
  }

  const childRow = child as ChildRow;
  if (childRow.tutor_enabled !== true) {
    return NextResponse.json(
      { error: "Tutor is not enabled for this child" },
      { status: 403 },
    );
  }

  const recentSessions = await fetchRecentTutorSessionsForMemory(supabase, {
    childId,
    parentUserId: user.id,
    childDisplayName: childDisplayName ?? null,
    limit: 3,
  });

  const memoryContext = buildMemoryContextString(recentSessions);

  const memoryVarKey =
    process.env.LIVEAVATAR_MEMORY_DYNAMIC_VAR?.trim() || "session_memory";

  try {
    const tokenResult = await createLiveAvatarFullSessionToken({
      dynamicVariables: memoryDynamicVariables(memoryContext, memoryVarKey),
    });
    const started = await startLiveAvatarSession(tokenResult.session_token);

    if (started.session_id !== tokenResult.session_id) {
      console.warn(
        "[tutor-token] session_id mismatch between token and start responses",
      );
    }

    await recordSuccessfulTutorTokenRequest(childId);

    return NextResponse.json({
      session_id: started.session_id,
      livekit_url: started.livekit_url,
      livekit_client_token: started.livekit_client_token,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "LiveAvatar session failed";
    console.error("[tutor-token]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
