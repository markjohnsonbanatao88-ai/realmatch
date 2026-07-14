import { NextResponse } from "next/server";
import { canAccess, getCurrentStaff } from "@/lib/auth/staff";
import { serviceConfig } from "@/lib/config/site";
import { refundPayPalCapture } from "@/lib/paypal/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaymentRecord = { id: string; paypal_capture_id: string | null; status: string };

export async function POST(request: Request) {
  if (!serviceConfig.paymentsEnabled) return NextResponse.json({ error: "Payments are not open." }, { status: 403 });
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const staff = await getCurrentStaff();
  if (!staff || !canAccess(staff, ["administrator"])) {
    return NextResponse.json({ error: "Staff authorization is required." }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const paymentRecordId = typeof body?.paymentRecordId === "string" ? body.paymentRecordId : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 200) : "Refund approved by Real Match";
  if (!/^[0-9a-f-]{36}$/i.test(paymentRecordId)) return NextResponse.json({ error: "Invalid payment record." }, { status: 400 });

  try {
    const db = createSupabaseAdminClient();
    const payment = (await db.select<PaymentRecord>(
      "payment_records",
      `select=id,paypal_capture_id,status&id=eq.${paymentRecordId}&limit=1`
    ))[0];
    if (!payment?.paypal_capture_id || payment.status !== "captured") {
      return NextResponse.json({ error: "This payment is not eligible for a refund." }, { status: 422 });
    }
    const refund = await refundPayPalCapture(payment.paypal_capture_id, reason || "Refund approved by Real Match");
    if (refund.status !== "COMPLETED") return NextResponse.json({ error: "The payment provider did not complete the refund." }, { status: 422 });
    await db.insert("refund_records", {
      payment_record_id: payment.id,
      provider: "paypal",
      provider_refund_id: refund.id,
      status: "completed",
      reason: reason || "Refund approved by Real Match",
      requested_by: staff.id,
      completed_at: new Date().toISOString()
    });
    await db.update("payment_records", `id=eq.${payment.id}`, { status: "refunded", refunded_at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not process that refund." }, { status: 503 });
  }
}
