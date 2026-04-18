import { resolveLiveAvatarEnv } from "./liveavatar-env";

const LIVEAVATAR_API_URL = "https://api.liveavatar.com/v1/sessions/token";

export type LiveAvatarSessionCredentials = {
  sessionId: string;
  sessionToken: string;
};

type LiveAvatarApiSuccess = {
  code: number;
  data: {
    session_id: string;
    session_token: string;
  };
  message?: string;
};

type LiveAvatarApiErrorBody = {
  detail?: unknown;
  message?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseSuccess(json: unknown): LiveAvatarApiSuccess | null {
  if (!isRecord(json)) return null;
  const data = json["data"];
  if (!isRecord(data)) return null;
  const sessionId = data["session_id"];
  const sessionToken = data["session_token"];
  if (typeof sessionId !== "string" || typeof sessionToken !== "string") {
    return null;
  }
  const code = json["code"];
  return {
    code: typeof code === "number" ? code : 100,
    data: { session_id: sessionId, session_token: sessionToken },
    message: typeof json["message"] === "string" ? json["message"] : undefined,
  };
}

/**
 * Creates a LiveAvatar SDK session token (server-side only).
 * Uses LIVEAVATAR_* vars, or falls back to HEYGEN_API_KEY / HEYGEN_TUTOR_AVATAR_ID.
 */
export async function createLiveAvatarSessionToken(): Promise<LiveAvatarSessionCredentials> {
  const { apiKey, avatarId } = resolveLiveAvatarEnv();

  const response = await fetch(LIVEAVATAR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      mode: "LITE",
      avatar_id: avatarId,
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  let parsed: unknown;
  try {
    parsed = rawText ? (JSON.parse(rawText) as unknown) : null;
  } catch {
    throw new Error(
      `LiveAvatar API returned non-JSON (${response.status}): ${rawText.slice(0, 200)}`,
    );
  }

  if (!response.ok) {
    const err = isRecord(parsed) ? (parsed as LiveAvatarApiErrorBody) : {};
    const msg =
      typeof err.message === "string"
        ? err.message
        : `LiveAvatar token request failed (${response.status})`;
    throw new Error(msg);
  }

  const success = parseSuccess(parsed);
  if (!success) {
    throw new Error("LiveAvatar API response missing session_id or session_token");
  }

  return {
    sessionId: success.data.session_id,
    sessionToken: success.data.session_token,
  };
}
