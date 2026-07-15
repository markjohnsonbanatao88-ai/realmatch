import { NextResponse } from "next/server";
import { serviceConfig } from "@/lib/config/site";
import { getApplicationHashSecret, requireRuntimeSettings } from "@/lib/env";
import { submitApplication } from "@/lib/applications/server";
import { requestFingerprint } from "@/lib/security/fingerprint";
import { requestClientKey, takeRateLimit } from "@/lib/security/rate-limit";
import { readJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/security/request";
import { SupabaseRequestError } from "@/lib/supabase/http";
import { parseApplicationDraft, validateAll } from "@/lib/validation/application";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!serviceConfig.applicationsEnabled) {
    return NextResponse.json({ error: "Applications are not open." }, { status: 403 });
  }
  const limit = takeRateLimit(requestClientKey(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await readJsonWithinLimit(request, 32_000);
  } catch (error) {
    const message = error instanceof RequestBodyTooLargeError
      ? "This submission is too large."
      : "We could not read this submission.";
    return NextResponse.json({ error: message }, { status: error instanceof RequestBodyTooLargeError ? 413 : 400 });
  }
  const input = payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : {};
  const draft = parseApplicationDraft(input.draft);
  const idempotencyKey = typeof input.idempotencyKey === "string" ? input.idempotencyKey : "";
  if (!draft || !UUID.test(idempotencyKey)) {
    return NextResponse.json({ error: "We could not read this submission." }, { status: 400 });
  }

  const errors = validateAll(draft);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please correct the highlighted fields.", fieldErrors: errors }, { status: 422 });
  }

  try {
    requireRuntimeSettings("applicationIntake");
    const requestHash = requestFingerprint(request.headers, getApplicationHashSecret());
    const result = await submitApplication(draft, idempotencyKey, requestHash);
    if (result.duplicateEmail) {
      return NextResponse.json(
        { error: "An application using this email address is already in review." },
        { status: 409 }
      );
    }
    return NextResponse.json({ reference: result.reference, duplicate: result.duplicate }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseRequestError && error.message.includes("RATE_LIMITED")) {
      return NextResponse.json(
        { error: "Please wait before trying again." },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }
    // Never log request bodies or expose database/provider errors containing personal data.
    return NextResponse.json(
      { error: "We could not save your application. Please try again shortly." },
      { status: 503 }
    );
  }
}
