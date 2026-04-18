import { createServiceRoleClient } from "./supabase/service-role";

const HOUR_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_CHILD_PER_HOUR = 3;

const RATE_TABLE = "tutor_liveavatar_requests";

type GlobalRateBuckets = Map<string, number[]>;

function getMemoryBuckets(): GlobalRateBuckets {
  const g = globalThis as typeof globalThis & {
    __sparkiTutorTokenBuckets?: GlobalRateBuckets;
  };
  if (!g.__sparkiTutorTokenBuckets) {
    g.__sparkiTutorTokenBuckets = new Map();
  }
  return g.__sparkiTutorTokenBuckets;
}

function pruneBucket(timestamps: number[], now: number): number[] {
  const cutoff = now - HOUR_MS;
  return timestamps.filter((t) => t > cutoff);
}

/**
 * Returns whether a new request is allowed (under limit before this request).
 * Does not record the request — call recordSuccessfulTutorTokenRequest after success.
 */
export async function assertTutorTokenRateLimit(
  childId: string,
): Promise<{ ok: true } | { ok: false; status: 429 | 503; message: string }> {
  const now = Date.now();
  const admin = createServiceRoleClient();

  if (admin) {
    const hourAgo = new Date(now - HOUR_MS).toISOString();
    const { count, error } = await admin
      .from(RATE_TABLE)
      .select("*", { count: "exact", head: true })
      .eq("child_id", childId)
      .gte("created_at", hourAgo);

    if (error) {
      console.error("[tutor-token] rate table query failed", error.message);
      return {
        ok: false,
        status: 503,
        message:
          "Rate limiting is misconfigured (could not query tutor_liveavatar_requests).",
      };
    }

    if ((count ?? 0) >= MAX_REQUESTS_PER_CHILD_PER_HOUR) {
      return {
        ok: false,
        status: 429,
        message: "Too many tutor sessions for this child. Try again later.",
      };
    }

    return { ok: true };
  }

  const buckets = getMemoryBuckets();
  const existing = buckets.get(childId) ?? [];
  const pruned = pruneBucket(existing, now);
  if (pruned.length >= MAX_REQUESTS_PER_CHILD_PER_HOUR) {
    return {
      ok: false,
      status: 429,
      message: "Too many tutor sessions for this child. Try again later.",
    };
  }

  buckets.set(childId, pruned);
  return { ok: true };
}

export async function recordSuccessfulTutorTokenRequest(
  childId: string,
): Promise<void> {
  const now = Date.now();
  const admin = createServiceRoleClient();

  if (admin) {
    const { error } = await admin.from(RATE_TABLE).insert({
      child_id: childId,
    });
    if (error) {
      console.error("[tutor-token] rate insert failed", error.message);
    }
    return;
  }

  const buckets = getMemoryBuckets();
  const pruned = pruneBucket(buckets.get(childId) ?? [], now);
  pruned.push(now);
  buckets.set(childId, pruned);
}
