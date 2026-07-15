# Supabase provisioning report

Date: 2026-07-16
Project: `realmatch`
Project ref: `ijqivgnlqndddftgazxc`
Region: `ap-northeast-1`
Status at verification: `ACTIVE_HEALTHY`

## Applied database foundation

The live Supabase project now contains:

- application, consent, status-history, staff, member, introduction, safety, deletion, PayPal, refund, dispute, audit, and service-configuration tables
- RLS enabled on every public table
- default-deny access for anonymous and ordinary authenticated users
- active staff-role policies
- atomic application intake with durable request controls, idempotency, and duplicate-email prevention
- automatic application status history and audit triggers
- integrity triggers for introduction decisions and payment eligibility
- a private-schema staff-role helper that is not exposed as a public RPC
- covering indexes for foreign keys reported by the Supabase performance advisor

## Rollback-safe verification performed

The following tests were executed inside transactions and rolled back so no test applicant remained:

1. First atomic application submission generated a reference.
2. Repeating the same idempotency key returned the same reference as a duplicate retry.
3. A different request using the same email hash was rejected as a duplicate email.
4. Exactly one application and four consent records were created inside the test transaction.
5. Status-history and audit triggers fired.
6. Anonymous users could not read the test application.
7. Authenticated non-staff users could not read the test application.
8. Default-deny behavior remained intact after moving the staff-role helper to the private schema.

## Advisor status

Security advisor:

- No warning-level security findings remain.
- `application_submission_attempts` intentionally has RLS enabled with no client policies because only the server service role may use it.

Performance advisor:

- Missing foreign-key indexes were added.
- Unused-index notices are expected while the production database is empty and are not grounds for removing planned operational indexes.
- Multiple permissive-policy notices remain as optimization opportunities; they do not weaken access controls.

## Remaining before pilot intake

- Configure Vercel with the Supabase URL, publishable key, service-role key, and a protected 32+ character `APPLICATION_HASH_SECRET`.
- Create real staff Auth users and matching `staff_profiles` rows.
- Test administrator, reviewer, matchmaker, safety officer, and auditor access separately.
- Configure transactional email.
- Complete legal, retention, deletion, incident-response, backup/restore, and accessibility gates.
- Keep applications and payments disabled until those gates are complete.
