# Production Readiness Checklist

`NEXT_PUBLIC_SERVICE_STATUS` must remain `preview` until every gate in the
relevant section is met. Moving to `pilot` or `live` without these is a
truth-rules violation: the site's public claims derive from this status.

## Gate A — before accepting real applications (`pilot`)

- [ ] Legal entity verified and named in the site footer and terms
- [ ] Terms of Service reviewed and approved by qualified counsel
- [ ] Privacy Policy reviewed and approved by counsel (UK GDPR mapped)
- [ ] Supabase project provisioned; migrations `0001` + `0002` applied
- [ ] RLS policies tested with per-role test accounts (default-deny verified)
- [ ] Server-side intake implemented (validation, rate limiting, duplicate
      protection, server-generated reference, no sensitive-field logging)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` confirmed server-only (never in client bundle)
- [ ] Transactional email provider configured; deliverability tested
- [ ] Staff authentication + role-based admin access live; `/admin` protected
      server-side (mock console removed or replaced)
- [ ] Audit logging active for sensitive reads/writes
- [ ] Data-retention schedule approved and documented
- [ ] Deletion workflow implemented and tested end-to-end
- [ ] Complaint/report intake process tested with a dry run
- [ ] Monitored contact address published with a response commitment
- [ ] Incident response steps documented (who is called, what is disclosed)
- [ ] Backups enabled and a restore actually tested
- [ ] Accessibility pass: keyboard-only walkthrough + screen reader (NVDA or
      VoiceOver) on home, apply, FAQ, and navigation flows

## Gate B — before taking payments (`live`)

- [ ] Everything in Gate A
- [ ] Refund policy finalised by counsel and published
- [ ] Payment provider integrated server-side; webhook signatures verified
- [ ] Payment records reconciled against provider dashboard in a test run
- [ ] Identity verification provider selected, integrated, and tested
      (provider reference stored — no raw documents)
- [ ] Verification-failure refund path tested
- [ ] Service-delivery workflow staffed (who reviews, who consults, SLAs)
- [ ] Analytics (if any) privacy-reviewed; consent handled; privacy notice updated

## Standing rules

- No testimonials, member counts, or success statistics may be published
  until they are real, measurable, and consented.
- No founder/team content until real people consent to be named
  (`serviceConfig.founder`).
- `reviewTimeStatement` stays `null` until a turnaround is measured and staffed.
- CI must never auto-commit to `main` (the old lockfile workflow was removed
  deliberately — do not restore it).
