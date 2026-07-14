import { NextResponse } from "next/server";
import { canAccess, getCurrentStaff } from "@/lib/auth/staff";
import { serviceConfig } from "@/lib/config/site";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Member = { id: string; membership_status: string };

export async function POST(request: Request) {
  if (!serviceConfig.paymentsEnabled) return NextResponse.json({ error: "Payments are not open." }, { status: 403 });
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const staff = await getCurrentStaff();
  if (!staff || !canAccess(staff, ["administrator"])) {
    return NextResponse.json({ error: "Administrator authorization is required." }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const memberId = typeof body?.memberId === "string" ? body.memberId : "";
  const purpose = body?.purpose === "membership" || body?.purpose === "concierge" ? body.purpose : null;
  if (!/^[0-9a-f-]{36}$/i.test(memberId) || !purpose) {
    return NextResponse.json({ error: "A member and valid payment purpose are required." }, { status: 400 });
  }
  if (purpose === "concierge" && !serviceConfig.conciergeEnabled) {
    return NextResponse.json({ error: "Concierge payment is not enabled." }, { status: 403 });
  }

  try {
    const db = createSupabaseAdminClient();
    const member = (await db.select<Member>(
      "member_profiles",
      `select=id,membership_status&id=eq.${memberId}&limit=1`
    ))[0];
    if (!member || !["pending_verification", "active"].includes(member.membership_status)) {
      return NextResponse.json({ error: "This member is not eligible for payment." }, { status: 422 });
    }
    const amountMinor = purpose === "membership"
      ? serviceConfig.membershipFee * 100
      : serviceConfig.conciergeFee * 100;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const eligibility = (await db.insert<{ checkout_token: string; expires_at: string }>("payment_eligibilities", {
      member_id: member.id,
      purpose,
      amount_minor: amountMinor,
      currency: serviceConfig.currency,
      status: "approved",
      approved_by: staff.id,
      expires_at: expiresAt
    }))[0];
    return NextResponse.json({ checkoutToken: eligibility?.checkout_token, expiresAt: eligibility?.expires_at }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not create payment eligibility." }, { status: 503 });
  }
}
