import "server-only";

type RequiredRuntimeSetting =
  | "supabase"
  | "paypal"
  | "paypalWebhook";

function nonEmpty(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function hasRuntimeSettings(setting: RequiredRuntimeSetting) {
  const supabase =
    nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
    nonEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const paypal =
    nonEmpty(process.env.PAYPAL_CLIENT_ID) &&
    nonEmpty(process.env.PAYPAL_CLIENT_SECRET) &&
    (process.env.PAYPAL_ENVIRONMENT === "sandbox" || process.env.PAYPAL_ENVIRONMENT === "live");

  if (setting === "supabase") return supabase;
  if (setting === "paypal") return paypal;
  return paypal && nonEmpty(process.env.PAYPAL_WEBHOOK_ID);
}

export function requireRuntimeSettings(setting: RequiredRuntimeSetting) {
  if (!hasRuntimeSettings(setting)) {
    throw new Error(`Required ${setting} environment settings are not configured.`);
  }
}

export function getSupabaseUrl() {
  if (!nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
}

export function getSupabasePublishableKey() {
  if (!nonEmpty(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured.");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
}

export function getSupabaseServiceRoleKey() {
  requireRuntimeSettings("supabase");
  return process.env.SUPABASE_SERVICE_ROLE_KEY!;
}
