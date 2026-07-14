# Public Readiness Roadmap

## Purpose

This roadmap converts the conversion, UX, trust, and legal research into a staged implementation plan for moving Real Match from static MVP to controlled public launch.

## Current phase

Real Match is currently a static MVP deployed to Vercel.

Allowed current use:

- internal review
- stakeholder review
- copy review
- legal-positioning review
- controlled demo

Not allowed yet:

- paid traffic
- real applicant intake
- payment collection
- live admin operations
- identity review workflow
- member discovery
- messaging
- production launch

## Phase 1 — Static MVP hardening

Status: mostly complete.

Required items:

- Live Vercel deployment.
- CI passing.
- package-lock.json present.
- Apply page clearly marked as static.
- Terms and Privacy clearly marked as counsel-review placeholders.
- Admin mock pages clearly marked as internal demo only.
- Legal disclaimers visible on key pages.
- Public copy avoids prohibited framing.

Remaining items:

- Replace Terms and Privacy placeholders with counsel-review drafts.
- Add FAQ page.
- Add Trust page or Trust module.
- Improve pricing section with deliverables and exclusions.
- Decide whether to gate, remove, or interstitial the admin mock before custom domain.

## Phase 2 — Conversion polish

Goal: make the site feel premium, clear, trustworthy, and conversion-ready without implying outcomes.

Tasks:

- Rewrite hero toward discretion and private review.
- Add trust micro-strip under hero.
- Add what Real Match is / is not section.
- Add FAQ page.
- Add Trust and Safety page/module.
- Add operator/company note.
- Add complaint route placeholder.
- Add refund summary placeholder.
- Add pricing exclusions.
- Improve CTA consistency.

Primary CTA should become:

> Request a Private Assessment

Secondary CTA should become:

> See How Review Works

Boundary microcopy should appear near CTA:

> No assigned partners. No outcome promises. Fees cover review, profile support, and coordination work, not romantic outcomes.

## Phase 3 — Legal readiness

Goal: make the legal surface suitable for counsel review and later production approval.

Tasks:

- Replace Terms page with counsel-review Terms draft.
- Replace Privacy page with counsel-review Privacy draft.
- Add Refund Policy draft.
- Add Complaint Policy draft.
- Add Consent Policy draft.
- Add Data Retention Policy draft.
- Add Marketing Policy draft.
- Add Admin Access Policy draft.
- Add Incident Response Policy draft.

Launch gate:

No real applicant data or paid services until Terms, Privacy, refund, consent, and retention policies are reviewed by qualified counsel.

## Phase 4 — Analytics without PII

Goal: measure conversion without collecting personal data.

Tasks:

- Add Vercel Analytics.
- Add Vercel Speed Insights.
- Prepare PostHog event plan for future backend stages.
- Track CTA clicks, page views, apply starts, FAQ interactions, and consent checkbox interactions without sending personally identifiable information.

Launch gate:

No PII should be sent to analytics.

## Phase 5 — Secure intake architecture

Goal: design the backend before building it.

Recommended stack:

- Vercel frontend.
- Supabase database and auth.
- Supabase row-level security.
- Stripe Checkout or Payment Links.
- Resend transactional email.
- PostHog analytics.
- Cloudflare Turnstile for bot protection.

Design first:

- applicants
- consent_events
- admin_users
- admin_roles
- review_cases
- payments
- complaints
- audit_logs
- contact_events

Do not build member discovery yet.

## Phase 6 — Backend application intake

Goal: collect application data safely.

Tasks:

- Add server-side form submission.
- Add validation.
- Add consent-event logging.
- Add privacy acknowledgement tracking.
- Add conduct agreement tracking.
- Add admin review status.
- Add Turnstile or other bot protection.
- Add confirmation email.
- Add admin notification.

Launch gate:

Backend intake requires secure storage, access control, consent logs, privacy copy, and retention rules.

## Phase 7 — Admin authentication and review queue

Goal: make admin operations private and auditable.

Tasks:

- Add admin authentication.
- Add role-based access.
- Protect `/admin` routes.
- Add review queue.
- Add applicant status transitions.
- Add risk notes.
- Add complaint queue.
- Add audit logs for every admin action.

Launch gate:

No live admin data should be accessible without authentication.

## Phase 8 — Payment readiness

Goal: introduce payment only after terms/refunds are ready.

Tasks:

- Define exact payment timing.
- Add Stripe Checkout or Payment Links.
- Add payment status tracking.
- Add refund workflow.
- Add receipt email.
- Add payment processor description aligned with service boundaries.

Required fee labels:

- Verification & Profile Consultation — £299.
- Optional Concierge Coordination — £600.

Do not use:

- success fee
- match fee
- access fee
- outcome fee

## Phase 9 — Controlled soft launch

Goal: test with a small controlled group.

Allowed:

- warm leads
- referral leads
- controlled private review
- manual operator review

Not allowed:

- mass cold outreach
- paid traffic at scale
- unclear consent
- vague payment terms
- live member discovery without safety workflow

Metrics:

- apply-start rate
- apply-completion rate
- qualified applicant rate
- rejection rate
- response time
- complaint rate
- refund requests
- consultation conversion

## Phase 10 — Member discovery and optional coordination

Only after intake, admin auth, consent, audit logs, safety workflows, and payment tracking are stable.

Tasks:

- member-controlled visibility
- private profile review
- interest expression
- mutual acceptance
- block/report controls
- optional coordination request
- coordination status tracking

Boundary:

The system must never assign partners or guarantee outcomes.

## Go / no-go gates

Go for controlled stakeholder review:

- static site live
- disclaimers visible
- legal placeholders honest
- admin mock labeled
- no live data collected

No-go for production:

- placeholder Terms/Privacy
- public admin mock without auth
- no backend privacy controls
- no consent records
- no refund policy
- no real complaint route
- no admin audit logs

## Final rule

Real Match should scale only after the legal, trust, intake, consent, and audit layers are stable. Building discovery or payments too early is operational negligence, not speed.
