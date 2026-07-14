# Terms and Privacy Counsel-Draft Requirements

## Purpose

This document converts the legal and compliance research into implementation requirements for the next Terms of Service and Privacy Policy drafting task.

These requirements are for counsel-review drafts only. They are not final legal advice and must be reviewed by qualified counsel before live applicants, paid services, or production launch.

## Product boundary to preserve

Real Match is a private verified social-introduction and cultural concierge platform for consenting adults.

The legal drafts must preserve these boundaries:

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

## Terms of Service draft requirements

The Terms page must include the following sections.

### 1. Counsel review warning

Required language:

> Draft for counsel review. Do not use for live applicants, paid services, or production launch until reviewed by qualified counsel.

### 2. Service description

Explain Real Match as a private review, profile support, standards, and optional coordination service.

Do not describe the service as a matchmaking agency, marriage agency, or outcome-guarantee service.

### 3. What Real Match is not

State clearly:

- Real Match is not a marriage agency.
- Real Match is not an outcome-guarantee service.
- Real Match does not assign partners.
- Real Match does not guarantee communication, meetings, relationships, marriage, companionship, or personal outcomes.
- Real Match does not sell access to people.

### 4. Eligibility

Must include:

- Adults only.
- User confirms they are at least 18 years old.
- User must provide truthful information.
- Real Match can reject, suspend, or remove applicants or members.

### 5. User-driven connections

Must say:

- Users independently express interest.
- Any connection must be mutually accepted.
- Declines must be respected immediately.
- Staff cannot pressure any member to communicate or meet.

### 6. Fees and service boundaries

Must explain:

- Private Assessment — Free.
- Verification & Profile Consultation — £299.
- Optional Concierge Coordination — £600.

Must state:

- Fees pay for service work, review readiness, consultation, profile support, administrative onboarding, and optional logistics.
- Fees do not buy introductions.
- Fees do not buy access to any person.
- Fees do not guarantee interest, communication, meetings, relationships, or outcomes.

### 7. Refund policy placeholder

Must include a clear placeholder for counsel review.

Questions to resolve:

- If an applicant is rejected before paid consultation, no fee should be charged.
- If £299 is paid, when is it refundable and when is it earned?
- If £600 coordination is paid, when is it refundable and when is it earned?
- What happens if mutual interest does not occur?
- What happens if a member cancels?

### 8. Member conduct

Must prohibit:

- coercion
- harassment
- pressure
- threats
- misrepresentation
- impersonation
- transactional demands
- expectation of special treatment
- attempting to bypass platform safeguards
- asking staff to force, assign, rank, or pressure another member

### 9. Safety and complaints

Must include:

- complaint route placeholder
- review process placeholder
- safety escalation placeholder
- suspension/removal rights
- no retaliation policy

### 10. Current MVP limitation

Must say:

- Current static MVP does not collect, store, process, or transmit real applicant data.
- No live backend, payment, review workflow, member discovery, or messaging service is active yet.

### 11. Limitation of liability placeholder

Must include counsel-review placeholder language for:

- service availability
- third-party conduct
- member-provided information
- meeting risks
- payment processor issues
- third-party vendors

### 12. Governing law placeholder

Leave as counsel placeholder until jurisdiction is finalized.

### 13. Contact placeholder

Must include future support/contact route.

Do not publish production Terms without a real contact route.

## Privacy Policy draft requirements

The Privacy page must include the following sections.

### 1. Counsel review warning

Required language:

> Draft for counsel review. Do not use for live applicants, paid services, or production launch until reviewed by qualified counsel.

### 2. Current MVP data-processing disclaimer

Must say:

- Current static MVP does not collect, store, process, or transmit real applicant data.
- The current form is a preview only.

### 3. Data categories for future phases

Potential future data categories:

- contact information
- age confirmation
- country of residence
- professional background
- service intent
- values and lifestyle preferences
- service-contact consent
- optional marketing consent
- conduct agreement
- review status
- payment status through processor
- complaint records
- audit logs

Avoid collecting unnecessary sensitive information.

### 4. Purpose of processing

Possible purposes:

- private assessment
- applicant communication
- service suitability review
- profile consultation
- safety and conduct review
- consent record keeping
- payment administration
- complaint handling
- legal compliance
- fraud and abuse prevention
- service improvement

### 5. Lawful basis placeholder

Must include counsel-review placeholder for lawful basis mapping.

Potential bases to review:

- contract or pre-contract steps
- consent for optional marketing
- legitimate interests for safety, abuse prevention, and service administration
- legal obligation where applicable

### 6. Service contact vs marketing consent

Must clearly separate:

- Service contact consent for assessment and operations.
- Optional marketing consent for future updates.

Marketing consent must not be bundled with service contact.

### 7. Sensitive information

Must say:

- Real Match should not collect sensitive information unless necessary and reviewed.
- Special category, biometric, criminal-offence, medical, financial, or highly sensitive preference data requires additional safeguards and legal review.

### 8. Identity review information

If identity review is later enabled, Privacy must explain:

- what is collected
- why it is collected
- who reviews it
- retention period
- deletion process
- access controls
- exceptions

### 9. Retention and deletion

Must include:

- retention schedule placeholder
- deletion process placeholder
- right to request deletion where applicable
- audit-log exceptions where legally necessary

### 10. Security controls

Must mention future controls:

- secure storage
- role-based access
- audit logs
- least-privilege admin access
- encryption where available
- vendor review
- incident response

### 11. Cross-border operations placeholder

Must explain that data may be processed or accessed across jurisdictions only with appropriate safeguards.

### 12. Third-party processors placeholder

Potential vendors:

- hosting provider
- database provider
- payment processor
- email provider
- analytics provider
- security/bot protection provider
- verification provider, if added

### 13. User rights placeholder

Must include placeholder for:

- access
- correction
- deletion
- objection
- withdrawal of marketing consent
- portability where applicable
- complaint to regulator where applicable

### 14. Contact placeholder

Do not publish production Privacy without a real contact channel.

## Prohibited legal drafting language

Do not use:

- matchmaking guarantee
- guaranteed match
- guaranteed relationship
- guaranteed partner
- success fee
- buy access
- handpicked women
- premium girls
- marriage agency
- spouse service
- romantic outcome guarantee

## Next implementation task

Create counsel-review Terms and Privacy drafts in:

- app/terms/page.tsx
- app/privacy/page.tsx

Then run:

- npm install
- npm run lint
- npm run typecheck
- npm run build

Commit message:

`chore: add counsel-review legal drafts`
