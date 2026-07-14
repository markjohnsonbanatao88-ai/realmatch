import { NextResponse } from "next/server";
import { serviceConfig } from "@/lib/config/site";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createPayPalOrder } from "@/lib/paypal/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Eligibility = {
  id: string;
  member_id: string;
  purpose: "membership" | "concierge";
  amount_minor: number;
  currency: string;
  status: "approved" | string;
  expires_at: string;
};

type ExistingOrder = { paypal_order_id: string; status: string };

export async function POST(request: Request) {
  if (!serviceConfig.paymentsEnabled) {
    return NextResponse.json({ error: "Payments are not open." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const checkoutToken = typeof body?.checkoutToken === "string" ? body.checkoutToken : "";
  if (!/^[0-9a-f-]{36}$/i.test(checkoutToken)) {
    return NextResponse.json({ error: "Invalid payment link." }, { status: 400 });
  }

  try {
    const db = createSupabaseAdminClient();
    const eligibility = (await db.select<Eligibility>(
      "payment_eligibilities",
      `select=id,member_id,purpose,amount_minor,currency,status,expires_at&checkout_token=eq.${encodeURIComponent(checkoutToken)}&limit=1`
    ))[0];
    if (!eligibility || eligibility.status !== "approved" || Date.parse(eligibility.expires_at) <= Date.now()) {
      return NextResponse.json({ error: "This payment link is no longer available." }, { status: 403 });
    }

    const existing = (await db.select<ExistingOrder>(
      "payment_records",
      `select=paypal_order_id,status&payment_eligibility_id=eq.${eligibility.id}&status=eq.order_created&limit=1`
    ))[0];
    if (existing?.paypal_order_id) {
      return NextResponse.json({ id: existing.paypal_order_id, status: "CREATED" });
    }

    const description = eligibility.purpose === "membership"
      ? "Real Match membership service"
      : "Real Match optional concierge support";
    const order = await createPayPalOrder({
      requestId: eligibility.id,
      referenceId: eligibility.id,
      amountMinor: eligibility.amount_minor,
      currency: eligibility.currency,
      description
    });
    if (order.status !== "CREATED" && order.status !== "PAYER_ACTION_REQUIRED") {
      return NextResponse.json({ error: "The payment provider did not create an order." }, { status: 502 });
    }

    await db.insert("payment_records", {
      member_id: eligibility.member_id,
      payment_eligibility_id: eligibility.id,
      provider: "paypal",
      provider_reference: order.id,
      paypal_order_id: order.id,
      amount_minor: eligibility.amount_minor,
      currency: eligibility.currency,
      purpose: eligibility.purpose,
      status: "order_created",
      environment: process.env.PAYPAL_ENVIRONMENT
    });
    return NextResponse.json({ id: order.id, status: order.status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not create a payment order." }, { status: 503 });
  }
}
