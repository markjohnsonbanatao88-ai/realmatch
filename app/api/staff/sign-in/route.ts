import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/config/site";
import { requestClientKey, takeRateLimit } from "@/lib/security/rate-limit";
import { requestStaffMagicLink } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const limit = takeRateLimit(`staff-sign-in:${requestClientKey(request.headers)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Please wait before requesting another sign-in link." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Enter a valid work email address." }, { status: 400 });
  }

  try {
    await requestStaffMagicLink(email, `${siteUrl}/staff/callback`);
  } catch {
    // Do not reveal whether a particular address is a staff account.
  }

  return NextResponse.json({ ok: true });
}
