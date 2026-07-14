import { NextResponse } from "next/server";
import { serviceConfig } from "@/lib/config/site";
import { verifyPayPalWebhook } from "@/lib/paypal/server";
import { SupabaseRequestError } from "@/lib/supabase/http";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PayPalEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    supplementary_data?: { related_ids?: { order_id?: string; capture_id?: string } };
    dispute_id?: string;
  };
};

function orderId(event: PayPalEvent) {
  return event.resource?.supplementary_data?.related_ids?.order_id ||
    (event.event_type?.startsWith("CHECKOUT.ORDER") ? event.resource?.id : undefined);
}

function captureId(event: PayPalEvent) {
  return event.resource?.supplementary_data?.related_ids?.capture_id;
}

export async function POST(request: Request) {
  if (!serviceConfig.paymentsEnabled) return new NextResponse(null, { status: 404 });
  const raw = await request.text();
  let event: PayPalEvent;
  try {
    event = JSON.parse(raw) as PayPalEvent;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!event.id || !event.event_type) return new NextResponse(null, { status: 400 });

  try {
    if (!(await verifyPayPalWebhook(event, request.headers))) return new NextResponse(null, { status: 400 });
    const db = createSupabaseAdminClient();
    const relatedOrderId = orderId(event);
    try {
      await db.insert("paypal_webhook_events", {
        event_id: event.id,
        event_type: event.event_type,
        signature_verified: true,
        processing_status: "received",
        event_summary: { resource_id: event.resource?.id || null, order_id: relatedOrderId || null }
      });
    } catch (error) {
      if (error instanceof SupabaseRequestError && error.status === 409) return NextResponse.json({ ok: true, duplicate: true });
      throw error;
    }

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && relatedOrderId && event.resource?.id) {
      const payment = (await db.select<{ payment_eligibility_id: string }>(
        "payment_records",
        `select=payment_eligibility_id&paypal_order_id=eq.${encodeURIComponent(relatedOrderId)}&limit=1`
      ))[0];
      await db.update("payment_records", `paypal_order_id=eq.${encodeURIComponent(relatedOrderId)}`, {
        status: "captured",
        paypal_capture_id: event.resource.id,
        captured_at: new Date().toISOString()
      });
      if (payment) {
        await db.update("payment_eligibilities", `id=eq.${payment.payment_eligibility_id}`, { status: "used" });
      }
    } else if (event.event_type === "PAYMENT.CAPTURE.REFUNDED" && captureId(event)) {
      await db.update("payment_records", `paypal_capture_id=eq.${encodeURIComponent(captureId(event)!)}`, {
        status: "refunded",
        refunded_at: new Date().toISOString()
      });
    } else if (event.event_type === "CUSTOMER.DISPUTE.CREATED" && event.resource?.id) {
      await db.insert("payment_disputes", {
        provider: "paypal",
        provider_dispute_id: event.resource.id,
        status: "opened",
        opened_at: new Date().toISOString()
      });
    }
    await db.update("paypal_webhook_events", `event_id=eq.${encodeURIComponent(event.id)}`, {
      processing_status: "processed",
      processed_at: new Date().toISOString()
    });
    return NextResponse.json({ ok: true });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
