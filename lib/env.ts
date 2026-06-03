// IMPORTANT: NEXT_PUBLIC_* env vars are inlined into the client bundle by
// Next.js, but ONLY when accessed via static property access
// (`process.env.NEXT_PUBLIC_FOO`). Dynamic indexing (`process.env[name]`)
// is treated as runtime-only and is `undefined` on the client.
// See: https://nextjs.org/docs/app/api-reference/next-config-js/env

function nonEmpty(v: string | undefined): string | undefined {
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  supabaseUrl: nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: nonEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY),
  anthropicApiKey: nonEmpty(process.env.ANTHROPIC_API_KEY),
} as const;

export function requireSupabasePublicEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }
  return { url: env.supabaseUrl, anonKey: env.supabaseAnonKey };
}

export function requireAnthropicKey() {
  if (!env.anthropicApiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY in .env.local.");
  }
  return env.anthropicApiKey;
}

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);
