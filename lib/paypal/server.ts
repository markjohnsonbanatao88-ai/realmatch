import "server-only";

import { randomUUID } from "crypto";
import { requireRuntimeSettings } from "@/lib/env";
import type { PayPalCaptureOrder } from "@/lib/paypal/validation";

export { captureFromOrder } from "@/lib/paypal/validation";

type PayPalErrorBody = { name?: string; message?: string; details?: unknown };

export class PayPalRequestError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: unknown) {
    super(message);
    this.name = "PayPalRequestError";
  }
}

function baseUrl() {
  requireRuntimeSettings("paypal");
  return process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function accessToken() {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID!}:${process.env.PAYPAL_CLIENT_SECRET!}`
  ).toString("base64");
  const response = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store"
  });
  const body = (await response.json().catch(() => undefined)) as { access_token?: string } | undefined;
  if (!response.ok || !body?.access_token) {
    throw new PayPalRequestError("Could not authenticate with the payment provider.", response.status, body);
  }
  return body.access_token;
}

export async function paypalRequest<T>(path: string, init: RequestInit = {}) {
  const token = await accessToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const response = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });
  const body = (await response.json().catch(() => undefined)) as T | PayPalErrorBody | undefined;
  if (!response.ok) {
    const error = body as PayPalErrorBody | undefined;
    throw new PayPalRequestError(error?.message || "Payment provider request failed.", response.status, error);
  }
  return body as T;
}

export type PayPalOrder = {
  id: string;
  status: string;
  links?: Array<{ href: string; rel: string; method: string }>;
};

export async function createPayPalOrder(input: {
  requestId: string;
  referenceId: string;
  amountMinor: number;
  currency: string;
  description: string;
}) {
  return paypalRequest<PayPalOrder>("/v2/checkout/orders", {
    method: "POST",
    headers: { "PayPal-Request-Id": input.requestId },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.referenceId,
          description: input.description,
          amount: {
            currency_code: input.currency,
            value: (input.amountMinor / 100).toFixed(2)
          }
        }
      ],
      application_context: { user_action: "PAY_NOW" }
    })
  });
}

export function capturePayPalOrder(orderId: string) {
  return paypalRequest<PayPalCaptureOrder>(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: { "PayPal-Request-Id": randomUUID() },
    body: "{}"
  });
}

export function refundPayPalCapture(captureId: string, note: string) {
  return paypalRequest<{ id: string; status: string }>(
    `/v2/payments/captures/${encodeURIComponent(captureId)}/refund`,
    {
      method: "POST",
      headers: { "PayPal-Request-Id": randomUUID() },
      body: JSON.stringify({ note_to_payer: note })
    }
  );
}

export async function verifyPayPalWebhook(event: unknown, headers: Headers) {
  requireRuntimeSettings("paypalWebhook");
  const verification = await paypalRequest<{ verification_status?: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: event
      })
    }
  );
  return verification.verification_status === "SUCCESS";
}
