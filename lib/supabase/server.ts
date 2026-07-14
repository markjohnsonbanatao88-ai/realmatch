import "server-only";

import {
  getSupabasePublishableKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  requireRuntimeSettings
} from "@/lib/env";
import { SupabaseHttpClient } from "@/lib/supabase/http";

export type SupabaseUser = { id: string; email?: string | null };

export function createSupabaseServerClient(accessToken: string) {
  requireRuntimeSettings("supabase");
  return new SupabaseHttpClient(getSupabaseUrl(), getSupabasePublishableKey(), accessToken);
}

export function createSupabaseAdminClient() {
  requireRuntimeSettings("supabase");
  return new SupabaseHttpClient(getSupabaseUrl(), getSupabaseServiceRoleKey());
}

export async function getAuthenticatedSupabaseUser(accessToken: string) {
  return createSupabaseServerClient(accessToken).auth<SupabaseUser>("/user");
}

export async function requestStaffMagicLink(email: string, redirectTo: string) {
  return new SupabaseHttpClient(getSupabaseUrl(), getSupabasePublishableKey()).auth("/otp", {
    method: "POST",
    body: {
      email,
      create_user: false,
      options: { email_redirect_to: redirectTo, should_create_user: false }
    }
  });
}

export async function verifyStaffMagicLink(tokenHash: string) {
  return new SupabaseHttpClient(getSupabaseUrl(), getSupabasePublishableKey()).auth<{
    access_token: string;
  }>("/verify", {
    method: "POST",
    body: { token_hash: tokenHash, type: "email" }
  });
}
