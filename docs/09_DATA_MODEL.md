# Data Model Plan

Current status: mock data only. No live storage is implemented yet.

## Core records

### Application

Fields: id, name, email, country, status, service consent, optional marketing consent, conduct agreement, risk level, created date.

### Member

Fields: id, application id, display name, country, profile status, review status, visibility status, risk level.

### Review event

Fields: id, member id, review type, reviewer, result, notes, deletion date, deletion proof reference.

### Consent event

Fields: id, person id, consent type, consent value, source, timestamp, policy version, withdrawal date.

### Payment

Fields: id, member id, amount, currency, fee type, provider, status, refund status.

### Coordination request

Fields: id, requester id, other member id, mutual status, requested status, scheduled date, final status.

### Complaint

Fields: id, reporter id, reported member id, issue type, severity, action taken, status, resolved date.

### Audit log

Fields: id, actor, action, target, timestamp, metadata.

## Rule

Do not add live storage until authorization, audit logging, data retention, and privacy review are complete.
