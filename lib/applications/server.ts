import "server-only";

import { createHash, randomUUID } from "crypto";
import { consentVersions } from "@/lib/config/site";
import { SupabaseRequestError } from "@/lib/supabase/http";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ApplicationDraft, normalizedDraft } from "@/lib/validation/application";

type StoredApplication = { id: string; reference: string };

function emailHash(email: string) {
  return createHash("sha256").update(email).digest("hex");
}

function reference() {
  return `RM-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function submitApplication(draftInput: ApplicationDraft, idempotencyKey: string) {
  const draft = normalizedDraft(draftInput);
  const db = createSupabaseAdminClient();

  const existingRequest = await db.select<StoredApplication>(
    "applications",
    `select=id,reference&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
  );
  if (existingRequest[0]) return { reference: existingRequest[0].reference, duplicate: true };

  const duplicateEmail = await db.select<{ id: string }>(
    "applications",
    `select=id&email_hash=eq.${emailHash(draft.email)}&limit=1`
  );
  if (duplicateEmail[0]) {
    return { reference: null, duplicate: false, duplicateEmail: true };
  }

  const application = {
    reference: reference(),
    idempotency_key: idempotencyKey,
    email_hash: emailHash(draft.email),
    full_name: draft.fullName,
    email: draft.email,
    phone: draft.phone,
    country: draft.country,
    city: draft.city,
    age: Number(draft.age),
    relationship_goal: draft.relationshipGoal,
    timeline: draft.timeline,
    why_now: draft.whyNow,
    values_statement: draft.values,
    lifestyle: draft.lifestyle,
    interests: draft.interests,
    preferences: draft.preferences,
    non_negotiables: draft.nonNegotiables
  };

  let stored: StoredApplication | undefined;
  try {
    stored = (await db.insert<StoredApplication>("applications", application))[0];
  } catch (error) {
    if (error instanceof SupabaseRequestError && error.status === 409) {
      const retried = await db.select<StoredApplication>(
        "applications",
        `select=id,reference&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
      );
      if (retried[0]) return { reference: retried[0].reference, duplicate: true };
    }
    throw error;
  }

  if (!stored) throw new Error("The application could not be recorded.");

  await Promise.all([
    db.insert("application_consents", {
      application_id: stored.id,
      consent_type: "terms",
      consent_given: true,
      terms_version: consentVersions.terms,
      policy_version: consentVersions.terms
    }),
    db.insert("application_consents", {
      application_id: stored.id,
      consent_type: "privacy",
      consent_given: true,
      terms_version: consentVersions.terms,
      policy_version: consentVersions.privacy
    }),
    db.insert("application_consents", {
      application_id: stored.id,
      consent_type: "conduct",
      consent_given: true,
      terms_version: consentVersions.terms,
      policy_version: consentVersions.conduct
    }),
    db.insert("application_consents", {
      application_id: stored.id,
      consent_type: "marketing",
      consent_given: draft.marketingOptIn,
      terms_version: consentVersions.terms,
      policy_version: consentVersions.marketing
    })
  ]);

  return { reference: stored.reference, duplicate: false, duplicateEmail: false };
}
