# Real Match — Conversion, UX, Trust, Legal, and Growth Research Source

## Purpose

This document consolidates research and strategic recommendations for improving Real Match across conversion, UX/UI, trust-building, pricing, legal-readiness, funnel structure, backend readiness, and launch prioritization.

Use this as a project source for future product, design, legal, and engineering work.

## Current project state

Live MVP: https://real-match-delta.vercel.app/

Real Match is live as a static MVP with public pages for homepage, how-it-works, pricing, safety, apply, terms, privacy, and contact. It also includes admin mock routes, a static form preview, legal disclaimers, placeholder legal pages, public pricing, Vercel deployment, GitHub CI, and a build workflow.

Current verdict:

- Acceptable for internal review, stakeholder review, copy review, legal-positioning review, and controlled demo.
- Not ready for real applicants, paid traffic, payment collection, public custom-domain launch, live admin operations, real verification, real member discovery, production intake, or production legal reliance.

## Core positioning

Real Match is a private verified social-introduction and cultural concierge platform for consenting adults.

Required product boundaries:

- Real Match does not arrange marriages.
- Real Match does not assign partners.
- Real Match does not guarantee meetings.
- Real Match does not guarantee relationships.
- Real Match does not guarantee chemistry.
- Real Match does not guarantee marriage.
- Real Match does not guarantee companionship.
- Real Match does not broker romantic outcomes.
- Real Match does not sell access to people.
- All connections must be independently initiated and mutually accepted by verified adult members.

Recommended stronger positioning:

> Private, verified introductions for adults who value discretion.

Supporting copy:

> Real Match is a selective review-and-introduction service built for adults who prefer privacy, identity checks, respectful communication, and optional concierge support when interest is already mutual.

## Conversion diagnosis

What works now:

- Clear compliance-safe positioning.
- Transparent pricing.
- Strong disclaimer language.
- Respectful safety framing.
- No obvious exploitative language.
- Clear no-guarantee language.
- Honest static-MVP warnings.
- Public legal placeholder warnings.
- Good base for premium-service positioning.

Main blockers:

- Legal pages are still placeholders.
- Apply form does not process real data.
- Contact page has no live route.
- Admin mock is publicly accessible.
- No visible operator/company trust layer.
- No visible complaint process.
- No founder/operator note.
- No refund explanation.
- No FAQ.
- No analytics event tracking.
- No secure backend intake.
- No real next step after user intent.
- Pricing is clear but not fully justified.
- Trust proof is weak.
- Site feels like a careful prototype rather than a complete premium service.

Brutal summary:

> The site is safe, but not yet persuasive enough. It feels responsible, but not fully real.

## Benchmark learnings

Premium matchmaking and adjacent social platforms generally use four conversion levers:

1. High-touch consultation funnels.
2. Emotional proof and testimonials.
3. Authority claims.
4. Selectivity and application gating.

Real Match should not copy relationship-outcome claims. It should copy seriousness, proof density, trust structure, process clarity, and funnel discipline.

Relevant benchmark lessons:

- Tawkify: proof density and qualification framing.
- Selective Search: authority positioning and quantified proof, only after evidence exists.
- Three Day Rule: testimonial structure and multiple funnel entry points, but not outcome-heavy framing.
- It's Just Lunch: professional high-touch process explanation.
- Inner Circle: curated community and apply/waitlist mechanics.
- eharmony: quiz-first onboarding and self-understanding framing, not algorithmic promises.
- Match: safety center, privacy help, and trust resources.
- Timeleft: best adjacent model for logistics and coordination without emotional guarantees.

## Recommended site architecture

Public routes:

- `/`
- `/how-it-works`
- `/pricing`
- `/safety`
- `/trust`
- `/faq`
- `/apply`
- `/terms`
- `/privacy`
- `/contact`

Internal routes:

- `/admin`
- `/admin/applications`
- `/admin/members`
- `/admin/verification`
- `/admin/payments`
- `/admin/complaints`
- `/admin/audit-logs`

Admin must eventually be protected by authentication. Before true public launch, admin should be gated, removed from public deployment, or display a hard demo-only interstitial.

## Recommended homepage structure

Above the fold:

1. Eyebrow.
2. Strong H1.
3. Clear subheadline.
4. Trust micro-strip.
5. Primary CTA.
6. Secondary CTA.
7. Boundary microcopy.

Recommended hero:

Eyebrow:

> Private verified social introductions

H1:

> Private, verified introductions for adults who value discretion

Subhead:

> Real Match is a selective review-and-introduction service built for adults who prefer privacy, identity checks, respectful communication, and optional concierge support when interest is already mutual.

Primary CTA:

> Request a Private Assessment

Secondary CTA:

> See How Review Works

Boundary microcopy:

> No assigned partners. No outcome promises. Fees cover review, verification readiness, and coordination work, not romantic outcomes.

Trust micro-strip items:

- Adults only
- Manual review
- Mutual interest only
- No outcome promises
- Privacy-first process

## Recommended pricing rewrite

Section heading:

> Transparent fees for real work, not romantic promises.

Intro:

> Your fees cover review, verification readiness, profile support, and optional meeting coordination. They do not purchase access to people, guaranteed introductions, meetings, or outcomes.

Card 1:

> Private Assessment — Free
>
> A short initial review of identity, intent, location, lifestyle fit, and service suitability.

Card 2:

> Verification & Profile Consultation — £299
>
> A one-time service fee covering review readiness, profile consultation, standards briefing, and administrative onboarding work. This fee does not guarantee interest, communication, a meeting, or a relationship.

Card 3:

> Optional Concierge Coordination — £600
>
> Available only after two verified adults independently agree they want logistical support. Covers scheduling, venue coordination, timing assistance, and cultural/logistical guidance. It does not buy an introduction or an outcome.

Pricing page should also explain:

- What each fee covers.
- What each fee does not cover.
- When payment is due.
- Refund logic.
- What happens if the applicant is rejected.
- What happens if mutual interest does not occur.
- Whether the £600 fee is charged before or after mutual agreement.

## Recommended apply flow

Future apply flow should become multi-step:

1. Eligibility.
2. Contact details.
3. Intent and values.
4. Service boundaries.
5. Consent.
6. Review submission.
7. Confirmation.

Eligibility fields:

- Age confirmation.
- Country of residence.
- Basic intent.
- Agreement that Real Match does not guarantee outcomes.

Contact fields:

- Name.
- Email.
- Phone / WhatsApp.
- Preferred contact method.

Intent and values fields:

- What kind of social connection are you seeking?
- What values matter most to you?
- What kind of communication style do you prefer?
- Are you open to a manual review process?

Boundary checkboxes:

- I understand Real Match does not arrange marriages.
- I understand Real Match does not assign partners.
- I understand Real Match does not guarantee meetings, relationships, or outcomes.
- I understand any connection must be independently initiated and mutually accepted.

Consent boxes:

- Service contact consent.
- Optional marketing consent.
- Terms acceptance.
- Privacy acknowledgement.
- Conduct agreement.

Confirmation should show:

- What happens next.
- Expected response time.
- No-guarantee reminder.
- Data handling summary.
- Contact route.

## Trust-building improvements

Add a Trust page or Trust module.

Trust module sections:

- Adults-only service.
- Manual review.
- Mutual consent.
- No assigned partners.
- Complaint handling.
- Data minimization.
- Review records.
- Optional coordination only.
- No outcome promises.

Add operator / company proof:

- company name
- registered entity, once available
- responsible operator
- contact email
- support response time
- complaint route

Add FAQ items:

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

## Legal and compliance readiness

Before collecting real applicant data, Real Match needs:

- Terms of Service.
- Privacy Policy.
- Refund Policy.
- Complaint Policy.
- Data Retention Policy.
- Consent Policy.
- Marketing Policy.
- Review SOP.
- Admin Access Policy.
- Incident Response Policy.

Terms must cover:

- Service description.
- What Real Match is not.
- Adults-only eligibility.
- User-driven connections.
- No outcome guarantees.
- Private assessment.
- £299 fee explanation.
- £600 fee explanation.
- Fee boundaries.
- Refund policy.
- Member conduct.
- Prohibited behavior.
- Complaints.
- Rejection/suspension/removal.
- Current MVP disclaimer.
- Liability limitation.
- Governing law placeholder.
- Contact details.

Privacy must cover:

- Current MVP data disclaimer.
- Data collected in future phases.
- Purposes of processing.
- Lawful basis.
- Service contact consent.
- Separate marketing consent.
- Data minimization.
- Identity review data.
- Sensitive information handling.
- Retention and deletion.
- Security controls.
- Role-based access.
- Cross-border operations.
- Third-party processors.
- User rights.
- Contact details.

Do not casually collect:

- criminal history
- biometric data
- medical data
- highly sensitive preference data
- financial data beyond payment processor needs
- third-party identity documents
- screenshots of private conversations

Identity review requires:

- secure upload
- access control
- audit log
- deletion log
- reviewer attribution
- retention schedule
- exception handling

## Admin-area risk

Current risk:

- Admin mock routes are publicly accessible.
- Warnings reduce risk but do not remove the amateur/public-admin optics.

Before custom domain:

- remove admin routes from public deployment,
- hard-gate with auth,
- or show only an interstitial page.

Recommended admin warning:

> Internal demo only. This area contains mock data and workflow previews only. No live user data, authentication, payments, verification actions, messaging, or member operations are active here.

## Design direction

Real Match should feel like:

- private banking
- premium hospitality
- discreet concierge
- professional trust service
- calm editorial publication

Real Match should not feel like:

- dating app
- casino
- social feed
- nightlife site
- romantic fantasy brand
- wedding service
- mail-order style directory
- influencer landing page

Use:

- restrained color palette
- whitespace
- editorial typography
- calm premium layout
- strong content hierarchy
- clear CTAs
- no sexualized imagery
- no catalog portraits
- no wedding imagery
- no stock romance photography

Recommended components:

- Hero with microproof.
- What Real Match is / is not.
- How review works.
- Pricing with deliverables and exclusions.
- Trust and safety module.
- FAQ.
- Operator note.
- Complaint route.
- Data handling preview.
- Footer trust layer.

## Analytics and measurement

Before paid traffic, add analytics.

Start with:

- Vercel Analytics.
- Vercel Speed Insights.
- PostHog later for deeper funnels.

Do not send PII to analytics.

Minimum events:

- hero_cta_click
- secondary_cta_click
- pricing_view
- safety_view
- terms_view
- privacy_view
- apply_start
- apply_step_complete
- apply_validation_error
- service_consent_checked
- marketing_consent_checked
- apply_submit_intent
- contact_click
- faq_expand
- complaint_info_view

Future backend events:

- assessment_submitted
- assessment_approved
- assessment_declined
- payment_started
- payment_succeeded
- consultation_completed
- coordination_requested

Core KPIs:

- homepage CTA click-through rate
- pricing-to-apply click-through rate
- apply-start rate
- apply-completion rate
- abandonment by form step
- percentage of qualified applicants
- accepted / rejected / waitlisted ratio
- consultation payment conversion
- refund rate
- complaint rate
- time to first response
- coordination request rate

## Recommended backend stack

Use:

- Vercel
- Supabase
- Stripe Checkout / Payment Links
- Resend
- PostHog
- Cloudflare Turnstile

Do not build matching first.

Build in this order:

1. consent
2. intake
3. admin review
4. audit logs
5. safety workflows
6. payment tracking
7. member discovery

## Data model roadmap

Future backend entities:

- applicants
- consent_events
- admin_users
- admin_roles
- review_cases
- profiles
- identity_review_events
- retention_events
- introductions
- coordination_requests
- payments
- refunds
- complaints
- audit_logs
- marketing_preferences
- contact_events

## Experiment plan

A/B tests:

- Hero framing: current vs discretion-led copy.
- CTA wording: Apply for a Private Assessment vs Request a Private Assessment.
- Pricing format: paragraph cards vs deliverables/exclusions bullets.
- Trust module placement: below hero vs above pricing.
- Apply format: one-page vs multi-step grouped flow.
- Admin visibility: public warning vs gated/removed.

## SEO and metadata improvements

Before custom domain:

- page-specific titles
- page-specific descriptions
- canonical URLs
- Open Graph image
- Twitter card metadata
- Organization schema
- robots rules
- sitemap
- favicon
- brand image assets

Suggested titles:

- Real Match — Private Verified Social Introductions
- Real Match Pricing — Assessment, Consultation, and Coordination Fees
- Real Match Safety — Consent, Standards, and Review Process
- Request a Private Assessment — Real Match
- Terms of Service — Real Match
- Privacy Policy — Real Match

## Accessibility improvements

Before production, test:

- keyboard navigation
- focus states
- form labels
- checkbox labels
- error messages
- color contrast
- mobile spacing
- heading hierarchy
- screen reader flow

Form improvements:

- explicit labels
- helper text
- grouped sections
- progress indicator
- inline validation
- clear error recovery
- no hidden required fields
- descriptive checkbox copy

## Roadmap

Days 1–7:

- Replace Terms and Privacy with counsel-review drafts.
- Remove or gate public admin mock.
- Add FAQ.
- Add Trust page or Trust module.
- Improve hero and pricing copy.
- Add event tracking plan.

Days 8–14:

- Add page-specific metadata.
- Add sitemap.
- Add OG image.
- Add Vercel Analytics.
- Add Speed Insights.
- Add Trust & Safety page improvements.
- Add contact route with real email forwarding.

Days 15–30:

- Design secure intake architecture.
- Define Supabase schema.
- Add consent_events design.
- Add admin role model.
- Add audit log model.
- Add complaint workflow model.
- Prepare Stripe payment flow design.
- Prepare legal review packet.

Days 31–60:

- Secure application submission.
- Consent logging.
- Admin authentication.
- Manual review queue.
- Email notifications.
- Complaint workflow.
- Retention/deletion model.
- Payment link tracking.
- Analytics events.

Days 61–90:

- Review workflow.
- Identity review logging.
- Payment workflow.
- Refund workflow.
- Controlled applicant soft launch.
- Invite/waitlist system.
- Private profile review.
- Mutual-interest workflow.
- Optional coordination request workflow.

## Immediate priorities

P0 before real use:

- Replace Terms with counsel-review draft.
- Replace Privacy with counsel-review draft.
- Remove/gate public admin mock.
- Add real contact channel.
- Add analytics without PII.
- Add secure intake architecture.
- Add consent records.
- Add admin auth.
- Add audit logging.

P1 conversion improvements:

- Rewrite hero.
- Rewrite pricing deliverables.
- Add FAQ.
- Add who-it-is-for / who-it-is-not-for.
- Add Trust module.
- Add operator note.
- Add refund summary.
- Add complaint route.
- Add service boundary explainer.

P2 production polish:

- Custom domain.
- Page-specific metadata.
- Open Graph image.
- Sitemap.
- Speed Insights.
- Accessibility QA.
- Mobile QA.
- Footer trust layer.
- Brand imagery.

P3 monetization and scale:

- Stripe Checkout.
- £299 consultation payment.
- £600 coordination payment.
- Manual review dashboard.
- Waitlist.
- Referral system.
- Private profile review.
- Mutual interest workflow.
- Coordination workflow.

## Non-negotiable rules

Real Match must never:

- sell people
- imply access to people
- guarantee relationships
- guarantee meetings
- arrange marriages
- assign partners
- imply romantic success
- hide legal disclaimers
- collect real data without backend controls
- accept payments without terms/refunds
- run cold marketing without consent rules
- expose admin data publicly
- treat women or members as inventory

## Final strategic recommendation

Real Match should evolve in this order:

1. Legal trust layer.
2. Public conversion polish.
3. Analytics.
4. Secure intake.
5. Admin auth.
6. Consent records.
7. Review workflow.
8. Payment links.
9. Complaint and audit workflows.
10. Member discovery.
11. Optional coordination.

The biggest mistake would be building backend features before the legal, trust, and conversion surface is finished.

The site is live now. The business must stop behaving like an idea and start behaving like a controlled service operation.
