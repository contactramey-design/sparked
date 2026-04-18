/**
 * Resolves LiveAvatar REST credentials from env, with fallbacks to the same
 * names used by the Vite app (`HEYGEN_*`).
 *
 * LiveAvatar uses `https://api.liveavatar.com` — not `streaming.create_token`.
 * Your HeyGen/LiveAvatar API key may work for both after account migration; if
 * token requests fail with 401, create a LiveAvatar API key in the LiveAvatar dashboard.
 */
function firstNonEmpty(
  ...candidates: readonly (string | undefined)[]
): string | undefined {
  for (const c of candidates) {
    const t = c?.trim();
    if (t) {
      return t;
    }
  }
  return undefined;
}

export type ResolvedLiveAvatarEnv = {
  apiKey: string;
  avatarId: string;
};

export function resolveLiveAvatarEnv(): ResolvedLiveAvatarEnv {
  const apiKey = firstNonEmpty(
    process.env.LIVEAVATAR_API_KEY,
    process.env.HEYGEN_API_KEY,
  );
  const avatarId = firstNonEmpty(
    process.env.LIVEAVATAR_AVATAR_ID,
    process.env.HEYGEN_TUTOR_AVATAR_ID,
  );

  if (!apiKey) {
    throw new Error(
      "Missing API key: set LIVEAVATAR_API_KEY or HEYGEN_API_KEY (server only).",
    );
  }

  if (!avatarId) {
    throw new Error(
      "Missing avatar id: set LIVEAVATAR_AVATAR_ID or HEYGEN_TUTOR_AVATAR_ID (Interactive / LiveAvatar avatar id).",
    );
  }

  if (avatarId === "default") {
    throw new Error(
      'Avatar id cannot be "default" for LiveAvatar — use a real avatar id from HeyGen / LiveAvatar (see dashboard Interactive Avatar or LiveAvatar avatars).',
    );
  }

  return { apiKey, avatarId };
}
