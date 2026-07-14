import { NextResponse } from "next/server";
import { serviceConfig } from "@/lib/config/site";
import { capturePayPalOrder } from "@/lib/paypal/server";
import { verifiedCapture } from "@/lib/paypal/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaymentRecord = { id: string; payment_eligibility_id: string; amount_minor: number; currency: string; status: string };

export async function POST(request: Request) {
  if (!serviceConfig.paymentsEnabled) {
    return NextResponse.json({ error: "Payments are not open." }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const orderId = typeof body?.orderId === "string" ? body.orderId : "";
  if (!/^[A-Z0-9]{8,}$/i.test(orderId)) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }

  try {
    const db = createSupabaseAdminClient();
    const payment = (await db.select<PaymentRecord>(
      "payment_records",
      `select=id,payment_eligibility_id,amount_minor,currency,status&paypal_order_id=eq.${encodeURIComponent(orderId)}&limit=1`
    ))[0];
    if (!payment) return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
    if (payment.status === "captured") return NextResponse.json({ ok: true, alreadyCaptured: true });

    const order = await capturePayPalOrder(orderId);
    const capture = verifiedCapture(order, payment.amount_minor, payment.currency);
    if (!capture) {
      return NextResponse.json({ error: "The payment could not be verified." }, { status: 422 });
    }

    await db.update("payment_records", `id=eq.${payment.id}`, {
      status: "captured",
      paypal_capture_id: capture.id,
      captured_at: new Date().toISOString()
    });
    await db.update("payment_eligibilities", `id=eq.${payment.payment_eligibility_id}`, {
      status: "used"
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not verify this payment." }, { status: 503 });
  }
}
