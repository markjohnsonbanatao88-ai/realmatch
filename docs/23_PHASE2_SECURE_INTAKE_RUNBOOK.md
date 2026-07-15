# Phase 2 secure intake operations runbook

This runbook records what is already provisioned and what must still be completed before Real Match can move from `preview` to a controlled `pilot`.

## Provisioned Supabase project

- Project name: `realmatch`
- Project reference: `ijqivgnlqndddftgazxc`
- Region: `ap-northeast-1`
- Status at provisioning check: `ACTIVE_HEALTHY`
- Applied operational migrations:
  - `initial_schema_core`
  - `initial_schema_operations`
  - `initial_schema_integrity`
  - `row_level_security`
  - `atomic_application_intake`
  - `function_execution_hardening`
  - `harden_staff_role_helper`
  - `add_foreign_key_indexes`

The canonical repository migration chain is now `0001` through `0006`. The original `0001` schema was applied to the empty production project in controlled segments because the remote migration executor rejected an earlier hand-assembled payload before any DDL was committed. Migrations `0004` through `0006` explicitly record the post-provisioning security and indexing changes so a fresh environment converges on the same schema.

## Verified database behaviour

The following tests were executed inside rolled-back transactions against the real Supabase project:

- first application submission creates one application
- four consent records are stored atomically
- initial status history is created
- an audit event is generated
- retrying the same idempotency key returns the original reference
- a second application using the same email fingerprint is rejected
- an ordinary authenticated user cannot read applications
- a reviewer can read and update an application

No test applicant, staff account, or test PII remained after rollback.

## Supabase security-advisor position

Trigger and intake functions were explicitly stripped of anon/authenticated API execution. Only the service role may execute the atomic intake RPC.

The staff-role helper now lives in the non-exposed `private` schema. Authenticated users may execute it only because RLS policies need to resolve the caller's own active role; it returns that role or null and is not exposed as a public REST RPC.

One informational advisor notice remains by design: `application_submission_attempts` has RLS enabled with no client policy because it is a server-only throttling ledger.

Performance advisor notices about unused indexes are expected in an empty database. The foreign-key support indexes in migration `0006` must not be removed before production query data exists. Multiple permissive-policy notices should be revisited after real workload profiling; they currently express intentional staff-or-owner access paths.

Review both security and performance advisors after every DDL change.

## Required Vercel environment configuration

Configure these values separately for Preview and Production. Never commit server secrets.

```env
NEXT_PUBLIC_SUPABASE_URL=https://ijqivgnlqndddftgazxc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<current publishable key from Supabase>
SUPABASE_SERVICE_ROLE_KEY=<server-only service role key>
APPLICATION_HASH_SECRET=<random 32+ character server-only secret>
NEXT_PUBLIC_SERVICE_STATUS=preview
```

After setting them:

1. Redeploy the project.
2. Inspect the browser bundle and deployment logs to confirm the service-role key and hash secret do not appear.
3. Keep `applicationsEnabled` and `paymentsEnabled` false.

## Staff bootstrap

Do not create generic shared accounts.

For each real staff user:

1. Create or invite the user through Supabase Auth.
2. Insert one matching `staff_profiles` record using the Auth user UUID.
3. Assign the least-privileged role required.
4. Confirm magic-link authentication.
5. Confirm the user can access only their permitted admin views and actions.
6. Confirm every sensitive read/write generates an audit event.

Required role tests:

- administrator
- reviewer
- matchmaker
- safety officer
- auditor
- ordinary authenticated non-staff user
- linked member user

## Intake proof before pilot

With protected environment variables configured, run an end-to-end application using fictional test data:

1. Submit from the deployed application form.
2. Confirm a server-generated reference is returned.
3. Confirm one application, four consents, one initial status-history row, and audit events exist.
4. Retry the same request and verify no duplicate application is created.
5. Retry with the same email and a new idempotency key and verify duplicate blocking.
6. Exercise the hourly request limit.
7. Verify oversized and malformed requests fail without logging submitted PII.
8. Withdraw and delete the test application through the approved operational path.

## Stop conditions

Do not enable real intake when any of these is true:

- legal terms or privacy notice are still drafts
- no monitored contact address exists
- no staff reviewer is assigned
- email delivery is untested
- deletion and incident procedures are untested
- backups have not been restored in a test
- any role can read data beyond its defined scope
- secrets appear in a client bundle, repository, log, or screenshot
