# Codex Implementation Queue

## Purpose

This file translates the research source documents into practical Codex tasks. Use one task at a time. Do not ask Codex to implement the whole roadmap in one prompt.

## Global Codex rules

For every task:

- Work on branch `main` unless told otherwise.
- Do not add backend, auth, payments, data collection, or member discovery unless the task specifically asks for it.
- Preserve legal-safe positioning.
- Do not introduce prohibited framing.
- Run `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- Commit with the exact requested commit message.
- Push to main.
- Report commit SHA and test results.

## Prohibited framing

Do not use:

- matchmaking
- marriage agency
- guaranteed match
- guaranteed relationship
- assigned partner
- buying access to people
- outcome fee
- success fee
- sexualized framing
- member-as-inventory language

## Task 1 — Counsel-review Terms and Privacy drafts

Goal:

Replace placeholder legal pages with stronger counsel-review drafts.

Files:

- app/terms/page.tsx
- app/privacy/page.tsx
- docs/18_TERMS_PRIVACY_COUNSEL_DRAFT_REQUIREMENTS.md

Prompt summary:

- Use docs/18 as requirements.
- Terms must include service description, what Real Match is not, adults-only eligibility, no guarantees, fee boundaries, conduct, complaints, suspension/removal, refund placeholder, MVP disclaimer, limitation placeholder, governing law placeholder, contact placeholder.
- Privacy must include current MVP disclaimer, future data categories, purposes, consent separation, sensitive information handling, retention, deletion, security controls, processors, rights, cross-border placeholder, contact placeholder.

Commit message:

`chore: add counsel-review legal drafts`

## Task 2 — FAQ and Trust page

Goal:

Add missing trust-building conversion content.

Files to create:

- app/faq/page.tsx
- app/trust/page.tsx
- components/FaqList.tsx
- components/TrustPrinciples.tsx

Required FAQ topics:

- Is Real Match a dating app?
- Is Real Match a matchmaking agency?
- Does Real Match guarantee introductions?
- What does the £299 fee cover?
- What does the £600 fee cover?
- Can someone decline?
- Is the service adults-only?
- What happens if I am not accepted?
- How is my data handled?
- When does the platform collect real data?
- Can I opt out of marketing?
- How do complaints work?

Trust page sections:

- Adults-only service.
- Manual review.
- Mutual consent.
- No assigned partners.
- Complaint handling.
- Data minimization.
- Review records.
- Optional coordination only.
- No outcome promises.

Update navigation to include FAQ or Trust only if layout remains clean.

Commit message:

`feat: add FAQ and trust pages`

## Task 3 — Pricing conversion upgrade

Goal:

Make pricing more persuasive while keeping boundaries.

Files:

- components/PricingCards.tsx
- app/pricing/page.tsx

Requirements:

- Add deliverables and exclusions for each fee.
- Explain that fees cover work, not outcomes.
- Add timing questions as placeholders if final refund/payment timing is not settled.
- Do not call any fee a success fee.
- Do not imply payment buys an introduction or access to a person.

Commit message:

`copy: improve pricing clarity and exclusions`

## Task 4 — Admin exposure cleanup

Goal:

Reduce public-admin optics before custom domain.

Options:

A. Add hard interstitial to `/admin` and all admin routes.
B. Keep mock pages but require a `?demo=true` query parameter.
C. Remove admin pages from production navigation and add clearer demo labeling.

Preferred MVP action:

- Keep routes but show an interstitial above all admin content.
- Make it obvious this is not part of the public service.

Commit message:

`chore: strengthen admin demo boundary`

## Task 5 — Metadata and SEO foundation

Goal:

Prepare for custom domain and sharing.

Files:

- app/layout.tsx
- page metadata files as needed
- public metadata assets if created

Requirements:

- Page-specific titles.
- Page-specific descriptions.
- Canonical URL placeholder.
- Open Graph metadata.
- Twitter card metadata.
- Sitemap.
- robots rules.
- Favicon placeholder if not present.

Commit message:

`chore: add SEO metadata foundation`

## Task 6 — Analytics without PII

Goal:

Add basic analytics infrastructure without collecting personal data.

Files:

- app/layout.tsx
- lib/analytics.ts
- docs/20_ANALYTICS_AND_CONVERSION_TRACKING.md

Requirements:

- Add Vercel Analytics.
- Add Vercel Speed Insights.
- Add event constants for future non-PII tracking.
- Do not send form field values to analytics.

Commit message:

`feat: add privacy-safe analytics foundation`

## Task 7 — Contact route improvement

Goal:

Make contact page more useful without backend.

Files:

- app/contact/page.tsx

Requirements:

- Add operational contact placeholder.
- Add complaint route placeholder.
- Add privacy/legal contact placeholder.
- Make it clear no live support workflow exists until configured.

Commit message:

`copy: improve contact and support placeholders`

## Task 8 — Secure intake architecture document

Goal:

Design backend before implementation.

Files:

- docs/22_SECURE_INTAKE_ARCHITECTURE.md

Include:

- Supabase schema plan.
- consent_events.
- applicants.
- admin_users.
- admin_roles.
- audit_logs.
- complaints.
- review_cases.
- payments.
- retention_events.
- RLS rules overview.
- Server-side validation.
- Bot protection.
- Email notifications.

Commit message:

`docs: add secure intake architecture plan`

## Task 9 — Backend intake implementation

Do not start until Tasks 1–8 are complete.

Goal:

Implement secure application submission.

Prerequisites:

- Terms/Privacy counsel-review drafts exist.
- Admin exposure cleaned up.
- Contact route exists.
- Analytics is privacy-safe.
- Secure intake architecture is documented.

Commit message:

`feat: add secure application intake`

## Immediate recommended order

1. Task 1 — Counsel-review Terms and Privacy drafts.
2. Task 2 — FAQ and Trust pages.
3. Task 3 — Pricing clarity.
4. Task 4 — Admin exposure cleanup.
5. Task 5 — Metadata and SEO.
6. Task 6 — Analytics.
7. Task 7 — Contact route.
8. Task 8 — Secure intake architecture.
9. Task 9 — Backend intake.

## Final rule

Do not build the backend before the public trust, legal, and conversion surface is clean. That is not caution; that is basic operational discipline.
