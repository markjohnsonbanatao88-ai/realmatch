# Analytics and Conversion Tracking Plan

## Purpose

This document defines how Real Match should measure conversion, trust, and product readiness without collecting or leaking personally identifiable information.

## Current rule

Do not send applicant names, emails, phone numbers, free-text intent, values, or other personal details to analytics tools.

The static MVP currently does not collect real applicant data. Analytics should begin with page and click events only.

## Recommended analytics stack

Start with:

- Vercel Analytics
- Vercel Speed Insights

Add later:

- PostHog for funnel analysis
- Server-side analytics for backend events

## Public-site events

Track these once analytics is added:

- page_view_home
- page_view_how_it_works
- page_view_pricing
- page_view_safety
- page_view_apply
- page_view_terms
- page_view_privacy
- page_view_contact
- hero_primary_cta_click
- hero_secondary_cta_click
- pricing_view
- pricing_apply_click
- safety_view
- trust_section_view
- footer_terms_click
- footer_privacy_click
- contact_click

## Apply-flow events

Track only non-PII intent events:

- apply_form_view
- apply_start
- apply_age_confirmed
- apply_service_consent_checked
- apply_marketing_consent_checked
- apply_conduct_agreement_checked
- apply_submit_preview
- apply_preview_confirmation_view

Do not send field values to analytics.

## Future backend events

Only after secure backend exists:

- assessment_submitted
- assessment_review_started
- assessment_approved
- assessment_declined
- assessment_waitlisted
- consultation_payment_started
- consultation_payment_succeeded
- consultation_payment_failed
- consultation_completed
- coordination_requested
- complaint_submitted
- complaint_resolved

## Core KPIs

Track:

- Homepage CTA click-through rate.
- Pricing-to-apply click-through rate.
- Apply-start rate.
- Apply-preview completion rate.
- Terms and Privacy view rate.
- Mobile bounce rate.
- Time on pricing page.
- Qualified applicant rate, once backend exists.
- Consultation payment conversion, once payments exist.
- Refund rate, once payments exist.
- Complaint rate, once operations exist.

## Conversion questions to answer

The first analytics setup should answer:

1. Do visitors understand the offer?
2. Do visitors reach Pricing before Apply?
3. Do visitors trust the disclaimer or does it create anxiety?
4. Does the Apply CTA feel too heavy?
5. Are users abandoning because legal placeholders feel unfinished?
6. Are mobile users able to navigate and start the application flow?

## A/B testing roadmap

### Test 1: Hero headline

Variant A:

> Private Verified Social Introductions

Variant B:

> Private, Verified Introductions for Adults Who Value Discretion

Metric:

- hero_primary_cta_click rate

### Test 2: Primary CTA

Variant A:

> Apply for a Private Assessment

Variant B:

> Request a Private Assessment

Metric:

- apply_start rate

### Test 3: Pricing structure

Variant A:

- Current card copy

Variant B:

- Deliverables plus exclusions

Metric:

- pricing_apply_click rate

### Test 4: Trust module position

Variant A:

- Trust module below hero

Variant B:

- Trust module above pricing

Metric:

- apply_start rate

### Test 5: Apply format

Variant A:

- One-page form

Variant B:

- Multi-step form

Metric:

- apply_preview_confirmation_view rate

## Guardrails

Never optimize conversion by weakening the legal boundary.

Do not test copy that implies:

- guaranteed meetings
- guaranteed relationships
- assigned partners
- buying access to people
- romantic success
- marriage outcomes
- member inventory

## Implementation order

1. Add Vercel Analytics.
2. Add Vercel Speed Insights.
3. Add event constants.
4. Add CTA click events.
5. Add non-PII apply flow events.
6. Add PostHog only after privacy review.
7. Add backend event tracking only after secure intake exists.
