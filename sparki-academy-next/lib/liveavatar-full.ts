import { z } from "zod";

const LIVEAVATAR_BASE = "https://api.liveavatar.com";

const SessionTokenEnvelopeSchema = z.object({
  code: z.number().optional(),
  data: z
    .object({
      session_id: z.string(),
      session_token: z.string(),
    })
    .nullable(),
  message: z.string().optional(),
});

const StartSessionEnvelopeSchema = z.object({
  code: z.number().optional(),
  data: z
    .object({
      session_id: z.string(),
      livekit_url: z.string(),
      livekit_client_token: z.string(),
    })
    .nullable(),
  message: z.string().optional(),
});

export type LiveAvatarStartPayload = {
  session_id: string;
  livekit_url: string;
  livekit_client_token: string;
};

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) {
    throw new Error(`${name} is not configured`);
  }
  return v;
}

function parseJsonResponse(rawText: string, status: number): unknown {
  if (!rawText) {
    throw new Error(`LiveAvatar returned empty body (HTTP ${status})`);
  }
  try {
    return JSON.parse(rawText) as unknown;
  } catch {
    throw new Error(
      `LiveAvatar returned non-JSON (HTTP ${status}): ${rawText.slice(0, 200)}`,
    );
  }
}

/**
 * Step 1: Create FULL-mode session token (server-only; uses X-API-KEY).
 */
export async function createLiveAvatarFullSessionToken(): Promise<{
  session_id: string;
  session_token: string;
}> {
  const apiKey = requireEnv("LIVEAVATAR_API_KEY");
  const avatarId = requireEnv("LIVEAVATAR_AVATAR_ID");
  const voiceId = requireEnv("LIVEAVATAR_VOICE_ID");
  const contextId = requireEnv("LIVEAVATAR_CONTEXT_ID");

  const response = await fetch(`${LIVEAVATAR_BASE}/v1/sessions/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      mode: "FULL",
      avatar_id: avatarId,
      avatar_persona: {
        voice_id: voiceId,
        context_id: contextId,
        language: "en",
      },
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  const parsed = parseJsonResponse(rawText, response.status);
  const envelope = SessionTokenEnvelopeSchema.safeParse(parsed);

  if (!envelope.success) {
    throw new Error("LiveAvatar token response had unexpected shape");
  }

  if (!response.ok) {
    throw new Error(
      envelope.data.message ??
        `LiveAvatar token request failed (HTTP ${response.status})`,
    );
  }

  const data = envelope.data.data;
  if (!data) {
    throw new Error(
      envelope.data.message ?? "LiveAvatar token response missing data",
    );
  }

  return {
    session_id: data.session_id,
    session_token: data.session_token,
  };
}

/**
 * Step 2: Start session with Bearer session_token.
 */
export async function startLiveAvatarSession(
  sessionToken: string,
): Promise<LiveAvatarStartPayload> {
  const response = await fetch(`${LIVEAVATAR_BASE}/v1/sessions/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  const rawText = await response.text();
  const parsed = parseJsonResponse(rawText, response.status);
  const envelope = StartSessionEnvelopeSchema.safeParse(parsed);

  if (!envelope.success) {
    throw new Error("LiveAvatar start response had unexpected shape");
  }

  if (!response.ok) {
    throw new Error(
      envelope.data.message ??
        `LiveAvatar start request failed (HTTP ${response.status})`,
    );
  }

  const data = envelope.data.data;
  if (!data) {
    throw new Error(
      envelope.data.message ?? "LiveAvatar start response missing data",
    );
  }

  return {
    session_id: data.session_id,
    livekit_url: data.livekit_url,
    livekit_client_token: data.livekit_client_token,
  };
}
