# Review SOP

The review process must prove identity readiness without creating unnecessary data risk.

## Static MVP status

No real review workflow is implemented in this repository yet. All current records are mock records.

## Future workflow

1. Confirm applicant has accepted terms and privacy notice.
2. Confirm service-contact consent is recorded.
3. Collect only required review material through approved secure tooling.
4. Review material only by authorized staff.
5. Record result, reviewer, timestamp, and risk notes.
6. Delete sensitive material within the approved retention window.
7. Store only status and deletion proof reference.

## Prohibited implementation

- Do not store sensitive files in public storage.
- Do not expose sensitive data to client-side code.
- Do not store documents without deletion policy.
- Do not let unapproved staff review sensitive material.

## Release gate

This workflow cannot go live until storage rules, audit logging, deletion logging, access control, and legal review are complete.
