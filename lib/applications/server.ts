import "server-only";

import { consentVersions } from "@/lib/config/site";
import { getApplicationHashSecret } from "@/lib/env";
import { privacyFingerprint } from "@/lib/security/fingerprint";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ApplicationDraft, normalizedDraft } from "@/lib/validation/application";

type AtomicSubmissionResult = {
  reference: string | null;
  duplicate: boolean;
  duplicate_email: boolean;
};

export async function submitApplication(
  draftInput: ApplicationDraft,
  idempotencyKey: string,
  requestHash: string
) {
  const draft = normalizedDraft(draftInput);
  const db = createSupabaseAdminClient();
  const emailHash = privacyFingerprint(getApplicationHashSecret(), draft.email);

  const result = await db.rpc<AtomicSubmissionResult[]>("submit_application_atomic", {
    p_application: draft,
    p_idempotency_key: idempotencyKey,
    p_email_hash: emailHash,
    p_request_hash: requestHash,
    p_terms_version: consentVersions.terms,
    p_privacy_version: consentVersions.privacy,
    p_conduct_version: consentVersions.conduct,
    p_marketing_version: consentVersions.marketing
  });

  const stored = result[0];
  if (!stored) throw new Error("The application could not be recorded.");

  return {
    reference: stored.reference,
    duplicate: stored.duplicate,
    duplicateEmail: stored.duplicate_email
  };
}
