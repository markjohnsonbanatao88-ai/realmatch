# Real Match canonical build roadmap

This is the implementation source of truth. The approved public design is preserved. Runtime code is not permission to make a public claim: every capability remains disabled until its technical, legal, and operating gates are complete.

## Current foundation

The repository contains preview-safe public pages, secure application and staff foundations, PayPal Orders/capture/webhook/refund routes, a default-deny Supabase schema, consent records, payment eligibility, and audit structures. The service remains in `preview` because no production Supabase, PayPal, staff, legal, or operating environment has been approved.

## Phase 1 — Provision and prove secure intake

- Apply migrations `0001` through `0003` to the real Supabase project.
- Configure a 32+ character `APPLICATION_HASH_SECRET` in protected server settings.
- Verify the atomic intake RPC, durable request controls, idempotency, and duplicate handling.
- Test every RLS policy with separate role accounts.
- Replace all mock or placeholder operational views with database-backed views.
- Configure transactional email, corrections, withdrawal, export, deletion, retention, and incident procedures.

## Phase 2 — Staff review and payment eligibility

- Enforce allowed status transitions and reviewer assignment.
- Record consultation outcomes and restricted internal notes.
- Accept or decline applications using audited staff actions.
- Issue time-limited, single-use payment eligibility only after acceptance.
- Separate reviewer, finance, matchmaker, safety, and auditor permissions.

## Phase 3 — PayPal sandbox proof

- Rotate every credential previously exposed outside protected secrets.
- Configure PayPal sandbox credentials and the verified webhook ID.
- Prove server-created order amount, currency, and purpose.
- Prove capture verification, duplicate delivery handling, reconciliation, refunds, reversals, and disputes.
- Activate membership only after a verified capture.
- Keep concierge quotes and payments separate from membership.

## Phase 4 — Identity verification

- Select and contract an approved provider.
- Store minimal provider references and results, not casual raw identity documents.
- Implement callback verification, expiry, failure, refund, and reverification paths.

## Phase 5 — Member portal and introductions

- Member authentication, profile approval, and controlled visibility.
- Matchmaker workspace and documented compatibility rationale.
- Independent bilateral decisions.
- Release contact only after both members consent.
- Blocking, reporting, and safety escalation.

## Phase 6 — Concierge operations

- Defined scope, written quote, scheduling, venue, accessibility, cancellation, and refund workflows.
- Separate payment eligibility and full audit history.

## Phase 7 — Privacy, safety, and resilience

- Safety cases, suspensions, appeals, legal holds, and retention automation.
- Backup and restoration tests, incident response, access reviews, and compliance exports.

## Phase 8 — Pilot and live launch

- Final legal approval and licensed photography.
- Accessibility, load, security, payment, refund, and incident drills.
- Measured pilot metrics and kill criteria.
- Explicit written sign-off before changing status or capability flags.
