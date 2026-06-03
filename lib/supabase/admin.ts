import { createClient } from "@supabase/supabase-js";
import { env, requireSupabasePublicEnv } from "@/lib/env";

/**
 * Service-role client. Server-only. Bypasses RLS — use sparingly.
 * Only call from route handlers / server actions that already authorize the user.
 */
export function createAdminClient() {
  const { url } = requireSupabasePublicEnv();
  if (!env.supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  }
  return createClient(url, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
