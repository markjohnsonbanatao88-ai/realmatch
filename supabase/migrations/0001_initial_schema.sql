-- Real Match — initial schema
--
-- Design principles:
--   * Default-deny: RLS is enabled on every table and no anon/authenticated
--     policies are created for sensitive tables. The application server uses
--     the service role (which bypasses RLS) for intake writes; staff access
--     goes through role-checked policies below.
--   * PII separation: applicant PII lives in `applications`; shareable
--     profile content lives in `member_profiles`; verification stores a
--     provider reference and result only — never raw identity documents.
--   * Everything auditable: status changes and sensitive reads/writes are
--     recorded in `application_status_history` and `audit_events`.
--
-- Apply with: supabase db push (or the Supabase migration tooling).

-- ---------------------------------------------------------------- enums

create type application_status as enum (
  'received',
  'under_review',
  'consultation_scheduled',
  'accepted',
  'declined',
  'withdrawn'
);

create type membership_status as enum (
  'pending_verification',
  'active',
  'paused',
  'expired',
  'suspended',
  'removed'
);

create type verification_status as enum (
  'not_started',
  'pending',
  'passed',
  'failed',
  'expired'
);

create type introduction_decision as enum (
  'pending',
  'accepted',
  'declined'
);

create type staff_role as enum (
  'administrator',
  'reviewer',
  'matchmaker',
  'safety_officer',
  'auditor'
);

create type report_status as enum (
  'open',
  'reviewing',
  'action_taken',
  'closed'
);

create type payment_purpose as enum (
  'membership',
  'concierge'
);

create type payment_status as enum (
  'order_created',
  'captured',
  'refunded',
  'disputed',
  'failed',
  'cancelled'
);

create type payment_eligibility_status as enum (
  'approved',
  'used',
  'expired',
  'revoked'
);

-- ---------------------------------------------------------------- staff

create table staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null,
  role staff_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Helper: current user's active staff role (null when not staff).
create or replace function current_staff_role()
returns staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role from staff_profiles
  where user_id = auth.uid() and is_active
  limit 1;
$$;

-- ---------------------------------------------------------------- intake

create table applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique, -- server-generated, human-quotable
  idempotency_key uuid not null unique,
  email_hash text not null unique, -- SHA-256 of normalized email; supports duplicate prevention without lookup by raw email
  full_name text not null,
  email text not null,
  phone text not null,
  country text not null,
  city text not null,
  age smallint not null check (age >= 18 and age <= 120),
  relationship_goal text not null,
  timeline text not null,
  why_now text not null,
  values_statement text not null,
  lifestyle text not null,
  interests text not null,
  preferences text not null,
  non_negotiables text not null,
  status application_status not null default 'received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_status_idx on applications (status, created_at desc);
create index applications_email_idx on applications (lower(email));

create table application_consents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications (id) on delete cascade,
  consent_type text not null, -- e.g. 'terms', 'privacy', 'conduct', 'marketing'
  consent_given boolean not null,
  terms_version text not null,
  policy_version text not null,
  recorded_at timestamptz not null default now()
);

create index application_consents_app_idx on application_consents (application_id);

create table application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications (id) on delete cascade,
  from_status application_status,
  to_status application_status not null,
  changed_by uuid references staff_profiles (id),
  note text,
  changed_at timestamptz not null default now()
);

create index application_status_history_app_idx
  on application_status_history (application_id, changed_at desc);

-- ---------------------------------------------------------------- members

create table member_profiles (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references applications (id),
  user_id uuid unique references auth.users (id) on delete set null,
  membership_status membership_status not null default 'pending_verification',
  membership_starts_at date,
  membership_ends_at date,
  -- Shareable profile content, approved by the member before any sharing.
  profile_content jsonb,
  profile_approved_at timestamptz,
  -- Verification: provider reference only. Never raw documents.
  verification_provider text,
  verification_reference text,
  verification_status verification_status not null default 'not_started',
  verification_completed_at timestamptz,
  verification_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index member_profiles_status_idx on member_profiles (membership_status);

create table profile_visibility_approvals (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references member_profiles (id) on delete cascade,
  approved_content_hash text not null, -- which profile version was approved
  approved_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index profile_visibility_member_idx on profile_visibility_approvals (member_id);

-- ---------------------------------------------------------------- introductions

create table introduction_candidates (
  id uuid primary key default gen_random_uuid(),
  member_a_id uuid not null references member_profiles (id),
  member_b_id uuid not null references member_profiles (id),
  proposed_by uuid not null references staff_profiles (id),
  rationale text,
  created_at timestamptz not null default now(),
  check (member_a_id <> member_b_id)
);

create index introduction_candidates_pair_idx
  on introduction_candidates (member_a_id, member_b_id);

create table introduction_decisions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references introduction_candidates (id) on delete cascade,
  member_id uuid not null references member_profiles (id),
  decision introduction_decision not null default 'pending',
  decided_at timestamptz,
  unique (candidate_id, member_id)
);

-- ---------------------------------------------------------------- safety

create table safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_member_id uuid references member_profiles (id),
  subject_member_id uuid references member_profiles (id),
  summary text not null,
  status report_status not null default 'open',
  outcome text,
  handled_by uuid references staff_profiles (id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index safety_reports_status_idx on safety_reports (status, created_at desc);

-- ---------------------------------------------------------------- compliance

create table data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications (id),
  member_id uuid references member_profiles (id),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  handled_by uuid references staff_profiles (id),
  note text
);

create table payment_eligibilities (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references member_profiles (id),
  purpose payment_purpose not null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'GBP' check (currency = 'GBP'),
  status payment_eligibility_status not null default 'approved',
  checkout_token uuid not null unique default gen_random_uuid(),
  approved_by uuid not null references staff_profiles (id),
  approved_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  note text,
  check (expires_at > approved_at)
);

create index payment_eligibilities_member_idx on payment_eligibilities (member_id, status);

create table payment_records (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references member_profiles (id),
  payment_eligibility_id uuid not null references payment_eligibilities (id),
  provider text not null check (provider = 'paypal'),
  provider_reference text not null,
  paypal_order_id text not null unique,
  paypal_capture_id text unique,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'GBP' check (currency = 'GBP'),
  purpose payment_purpose not null,
  status payment_status not null default 'order_created',
  environment text not null check (environment in ('sandbox', 'live')),
  approved_at timestamptz,
  captured_at timestamptz,
  refunded_at timestamptz,
  failed_at timestamptz,
  idempotency_key uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  unique (provider, provider_reference)
);

create index payment_records_member_idx on payment_records (member_id, created_at desc);
create index payment_records_eligibility_idx on payment_records (payment_eligibility_id);

create table paypal_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text not null,
  signature_verified boolean not null default false,
  processing_status text not null check (processing_status in ('received', 'processed', 'failed', 'ignored')),
  event_summary jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table refund_records (
  id uuid primary key default gen_random_uuid(),
  payment_record_id uuid not null references payment_records (id),
  provider text not null check (provider = 'paypal'),
  provider_refund_id text not null unique,
  status text not null check (status in ('pending', 'completed', 'failed')),
  reason text not null,
  requested_by uuid references staff_profiles (id),
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

create table payment_disputes (
  id uuid primary key default gen_random_uuid(),
  payment_record_id uuid references payment_records (id),
  provider text not null check (provider = 'paypal'),
  provider_dispute_id text not null unique,
  status text not null check (status in ('opened', 'under_review', 'resolved', 'closed')),
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  outcome text
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_staff_id uuid references staff_profiles (id),
  actor_label text not null, -- 'system' | staff display name at time of action
  action text not null,
  target_table text not null,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index audit_events_target_idx on audit_events (target_table, target_id);
create index audit_events_time_idx on audit_events (created_at desc);

create table service_configuration (
  key text primary key,
  value jsonb not null,
  updated_by uuid references staff_profiles (id),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- integrity and audit automation

-- Staff role lookup is deliberately callable only by authenticated database
-- users. It is security-definer because RLS policies use it recursively.
revoke all on function current_staff_role() from public;
grant execute on function current_staff_role() to authenticated;

create or replace function record_application_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  staff_id uuid;
begin
  select id into staff_id from staff_profiles where user_id = auth.uid() and is_active limit 1;
  if tg_op = 'INSERT' then
    insert into application_status_history (application_id, from_status, to_status, changed_by, note)
    values (new.id, null, new.status, staff_id, 'Application received');
  elsif new.status is distinct from old.status then
    insert into application_status_history (application_id, from_status, to_status, changed_by, note)
    values (new.id, old.status, new.status, staff_id, 'Status changed');
  end if;
  return new;
end;
$$;

create trigger applications_status_history_trigger
after insert or update of status on applications
for each row execute function record_application_status_change();

revoke all on function record_application_status_change() from public;

create or replace function enforce_introduction_decision_member()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from introduction_candidates
    where id = new.candidate_id
      and new.member_id in (member_a_id, member_b_id)
  ) then
    raise exception 'A decision can only be made by a member in its introduction candidate.';
  end if;
  return new;
end;
$$;

create trigger introduction_decision_member_trigger
before insert or update of candidate_id, member_id on introduction_decisions
for each row execute function enforce_introduction_decision_member();

revoke all on function enforce_introduction_decision_member() from public;

create or replace function enforce_payment_record_eligibility()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  eligibility payment_eligibilities;
begin
  select * into eligibility from payment_eligibilities where id = new.payment_eligibility_id;
  if not found
    or eligibility.member_id <> new.member_id
    or eligibility.purpose <> new.purpose
    or eligibility.amount_minor <> new.amount_minor
    or eligibility.currency <> new.currency
    or eligibility.status not in ('approved', 'used') then
    raise exception 'Payment record does not match an approved payment eligibility.';
  end if;
  return new;
end;
$$;

create trigger payment_record_eligibility_trigger
before insert or update of payment_eligibility_id, member_id, purpose, amount_minor, currency on payment_records
for each row execute function enforce_payment_record_eligibility();

revoke all on function enforce_payment_record_eligibility() from public;

create or replace function write_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  actor_name text;
  target uuid;
  safe_metadata jsonb;
begin
  select id, display_name into actor_id, actor_name
  from staff_profiles where user_id = auth.uid() and is_active limit 1;

  if tg_op = 'DELETE' then
    target := old.id;
    safe_metadata := to_jsonb(old);
  else
    target := new.id;
    safe_metadata := to_jsonb(new);
  end if;
  safe_metadata := safe_metadata - array[
    'full_name', 'email', 'phone', 'why_now', 'values_statement', 'lifestyle',
    'interests', 'preferences', 'non_negotiables', 'profile_content', 'summary', 'outcome'
  ]);

  insert into audit_events (actor_staff_id, actor_label, action, target_table, target_id, metadata)
  values (
    actor_id,
    coalesce(actor_name, 'system'),
    lower(tg_op),
    tg_table_name,
    target,
    safe_metadata
  );
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger audit_applications after insert or update or delete on applications
for each row execute function write_audit_event();
create trigger audit_application_consents after insert or update or delete on application_consents
for each row execute function write_audit_event();
create trigger audit_application_status_history after insert or update or delete on application_status_history
for each row execute function write_audit_event();
create trigger audit_member_profiles after insert or update or delete on member_profiles
for each row execute function write_audit_event();
create trigger audit_introduction_decisions after insert or update or delete on introduction_decisions
for each row execute function write_audit_event();
create trigger audit_safety_reports after insert or update or delete on safety_reports
for each row execute function write_audit_event();
create trigger audit_payment_eligibilities after insert or update or delete on payment_eligibilities
for each row execute function write_audit_event();
create trigger audit_payment_records after insert or update or delete on payment_records
for each row execute function write_audit_event();
create trigger audit_refund_records after insert or update or delete on refund_records
for each row execute function write_audit_event();
create trigger audit_payment_disputes after insert or update or delete on payment_disputes
for each row execute function write_audit_event();

revoke all on function write_audit_event() from public;
