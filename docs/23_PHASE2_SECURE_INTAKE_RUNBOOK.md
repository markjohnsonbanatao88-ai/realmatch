# Phase 2 secure intake operations runbook

This runbook records what is already provisioned and what must still be completed before Real Match can move from `preview` to a controlled `pilot`.

## Provisioned Supabase project

- Project name: `realmatch`
- Project reference: `ijqivgnlqndddftgazxc`
- Region: `ap-northeast-1`
- Status at provisioning check: `ACTIVE_HEALTHY`
- Applied migrations:
  - `initial_schema_core`
  - `initial_schema_operations`
  - `initial_schema_integrity`
  - `row_level_security`
  - `atomic_application_intake`
  - `function_execution_hardening`

The repository migration chain remains `0001` through `0004`; the first repository migration was applied in controlled operational segments because the remote migration executor rejected the initial hand-assembled payload before any DDL was committed.

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

The trigger and intake functions were explicitly stripped of anon/authenticated API execution. Only the service role may execute the atomic intake RPC.

Two advisor notices remain by design:

1. `application_submission_attempts` has RLS enabled with no client policy because it is a server-only throttling ledger.
2. `current_staff_role()` is a `SECURITY DEFINER` function callable by authenticated users because RLS policies need it to resolve the caller's own active role. It returns only that caller's role or null.

Review the current security advisor after every DDL change.

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
