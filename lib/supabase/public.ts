import { SupabaseHttpClient } from "@/lib/supabase/http";

function publicSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase public settings are not configured.");
  return { url, key };
}

/** A browser-safe client that can only use the Supabase publishable key. */
export function createSupabaseBrowserClient() {
  const { url, key } = publicSettings();
  return new SupabaseHttpClient(url, key);
}
