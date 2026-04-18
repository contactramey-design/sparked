import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./env";

/**
 * Service-role client for server-only operations (bypasses RLS).
 * Used when SUPABASE_SERVICE_ROLE_KEY is set; otherwise returns null.
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const { url } = getPublicSupabaseConfig();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
