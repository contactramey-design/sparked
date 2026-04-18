/**
 * Resolves public Supabase credentials for client/server initialization.
 * Placeholders allow `next build` to complete when `.env` is not present;
 * set real values in `.env.local` or your host’s environment.
 */
export function getPublicSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (url && anonKey) {
    return { url, anonKey };
  }

  return {
    url: "https://placeholder.supabase.co",
    anonKey: "placeholder-anon-key",
  };
}
