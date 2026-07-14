# Real Match

Private, human-led introductions for adults looking for a serious relationship.

Real Match is a two-sided service: introductions are curated by people and contact opens only after both members independently agree. Fees pay for the matchmaking work — never for access to a person, and never for a romantic outcome.

## Current status: `preview`

The public site remains a private preview. In this status:

- Applications and payments are closed by `lib/config/site.ts`.
- The application route renders locked, fictional example data and transmits nothing.
- The checkout, refund, webhook, and staff routes reject operational actions until their matching capability flags are deliberately enabled.
- No live Supabase project, PayPal account, staff account, or production service is assumed by this repository.

The runtime work is present but not a launch claim:

- Server-only Supabase REST/Auth clients, application intake validation, consent-version records, duplicate protection, and idempotency keys.
- Staff magic-link sign-in with active-role checks on every admin request. The route has no mock data fallback.
- PayPal Orders, capture verification, signature-verified webhooks, staff-authorized refunds, and eligibility records. The fee is always tied to service work, never access to another member.
- Default-deny RLS, member/auth linkage, introduction-decision integrity, and database audit triggers in the initial migrations.
- Blocking CI security audit, security headers, a restrictive CSP, and a small automated validation test suite.

## Required configuration before operating anything

Copy `.env.example` to `.env.local`; do not commit it. Supabase requires a project URL, a publishable key, and a server-only service-role key. PayPal requires server-only client credentials, webhook ID, and an explicit sandbox/live environment.

For the staff magic-link callback, configure the Supabase email template to use the supplied callback URL with `token_hash` and `type=email`. Only existing, active staff accounts are allowed through; the sign-in response intentionally does not disclose whether an address belongs to staff.

The service flags in `lib/config/site.ts` remain `false` until every applicable item in [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) is complete. Setting an environment variable alone is not authorization to advance the service status.

## Database migrations

The project has not been provisioned, so `0001_initial_schema.sql` is the complete base schema and `0002_row_level_security.sql` applies its RLS policies. Apply both to a new Supabase project before configuring the app.

Once any environment has applied these migrations, do not edit them. Install the Supabase CLI in a working Node environment and create a new migration for every later schema change.

## Verification

When Node/npm are available:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:high
```

With the Supabase CLI and local database stack installed, also run `supabase start` followed by `npm run test:db` for the pgTAP RLS and integrity checks.

CI runs the same checks and treats high-severity dependency findings as failures. It never writes or commits lockfiles.

## Deployment safeguards

- Host only over HTTPS and set `NEXT_PUBLIC_SITE_URL` to the canonical URL.
- Enforce a durable, shared rate limit at the deployment edge before opening intake; the in-process limiter is only a local fallback.
- Configure PayPal webhook delivery to `/api/paypal/webhooks` and test signature verification, duplicate delivery, capture, refund, and dispute events in sandbox.
- Test every RLS policy with separate Supabase accounts before moving beyond preview.
- Keep the service-role key server-only. It must never use a `NEXT_PUBLIC_` name or enter a client component.
