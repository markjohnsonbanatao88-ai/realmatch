-- Real Match — Row Level Security
--
-- Every public-schema table is default-deny. The service role is reserved for
-- server routes; it never enters a browser bundle. Authenticated staff access
-- is constrained to an active role, while members can only read their own
-- linked records.

alter table staff_profiles enable row level security;
alter table applications enable row level security;
alter table application_consents enable row level security;
alter table application_status_history enable row level security;
alter table member_profiles enable row level security;
alter table profile_visibility_approvals enable row level security;
alter table introduction_candidates enable row level security;
alter table introduction_decisions enable row level security;
alter table safety_reports enable row level security;
alter table data_deletion_requests enable row level security;
alter table payment_eligibilities enable row level security;
alter table payment_records enable row level security;
alter table paypal_webhook_events enable row level security;
alter table refund_records enable row level security;
alter table payment_disputes enable row level security;
alter table audit_events enable row level security;
alter table service_configuration enable row level security;

-- Staff
create policy staff_read_own on staff_profiles
  for select to authenticated
  using (user_id = (select auth.uid()) or current_staff_role() = 'administrator');

create policy staff_admin_write on staff_profiles
  for all to authenticated
  using (current_staff_role() = 'administrator')
  with check (current_staff_role() = 'administrator');

-- Applications and consents
create policy applications_staff_read on applications
  for select to authenticated
  using (current_staff_role() in ('administrator', 'reviewer', 'matchmaker', 'safety_officer', 'auditor'));

create policy applications_staff_update on applications
  for update to authenticated
  using (current_staff_role() in ('administrator', 'reviewer'))
  with check (current_staff_role() in ('administrator', 'reviewer'));

create policy consents_staff_read on application_consents
  for select to authenticated
  using (current_staff_role() in ('administrator', 'reviewer', 'auditor'));

create policy history_staff_read on application_status_history
  for select to authenticated
  using (current_staff_role() in ('administrator', 'reviewer', 'auditor'));

-- Member records and profiles
create policy members_staff_read on member_profiles
  for select to authenticated
  using (current_staff_role() in ('administrator', 'reviewer', 'matchmaker', 'safety_officer', 'auditor'));

create policy members_staff_update on member_profiles
  for update to authenticated
  using (current_staff_role() in ('administrator', 'matchmaker'))
  with check (current_staff_role() in ('administrator', 'matchmaker'));

create policy members_staff_insert on member_profiles
  for insert to authenticated
  with check (current_staff_role() in ('administrator', 'reviewer'));

create policy members_read_own on member_profiles
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy visibility_staff_read on profile_visibility_approvals
  for select to authenticated
  using (current_staff_role() in ('administrator', 'matchmaker', 'auditor'));

-- Introductions
create policy intro_candidates_staff_read on introduction_candidates
  for select to authenticated
  using (current_staff_role() in ('administrator', 'matchmaker', 'auditor'));

create policy intro_candidates_matchmaker_insert on introduction_candidates
  for insert to authenticated
  with check (current_staff_role() in ('administrator', 'matchmaker'));

create policy intro_decisions_staff_read on introduction_decisions
  for select to authenticated
  using (current_staff_role() in ('administrator', 'matchmaker', 'auditor'));

create policy intro_decisions_member_read_own on introduction_decisions
  for select to authenticated
  using (
    exists (
      select 1 from member_profiles
      where member_profiles.id = introduction_decisions.member_id
        and member_profiles.user_id = (select auth.uid())
    )
  );

-- Safety and compliance
create policy safety_staff_read on safety_reports
  for select to authenticated
  using (current_staff_role() in ('administrator', 'safety_officer', 'auditor'));

create policy safety_staff_write on safety_reports
  for update to authenticated
  using (current_staff_role() in ('administrator', 'safety_officer'))
  with check (current_staff_role() in ('administrator', 'safety_officer'));

create policy deletion_staff_read on data_deletion_requests
  for select to authenticated
  using (current_staff_role() in ('administrator', 'auditor'));

-- Payment and PayPal records. Browser clients have no write access to these
-- tables; all provider writes use the server-only service role.
create policy payment_eligibilities_staff_read on payment_eligibilities
  for select to authenticated
  using (current_staff_role() in ('administrator', 'auditor'));

create policy payment_eligibilities_admin_write on payment_eligibilities
  for all to authenticated
  using (current_staff_role() = 'administrator')
  with check (current_staff_role() = 'administrator');

create policy payments_staff_read on payment_records
  for select to authenticated
  using (current_staff_role() in ('administrator', 'auditor'));

create policy payments_member_read_own on payment_records
  for select to authenticated
  using (
    exists (
      select 1 from member_profiles
      where member_profiles.id = payment_records.member_id
        and member_profiles.user_id = (select auth.uid())
    )
  );

create policy refunds_staff_read on refund_records
  for select to authenticated
  using (current_staff_role() in ('administrator', 'auditor'));

create policy disputes_staff_read on payment_disputes
  for select to authenticated
  using (current_staff_role() in ('administrator', 'auditor'));

create policy webhook_events_admin_read on paypal_webhook_events
  for select to authenticated
  using (current_staff_role() = 'administrator');

-- Audit records are append-only. The service role writes automatic trigger
-- entries and controlled server routes log staff reads; no ordinary database
-- user can insert, update, or delete an event.
create policy audit_staff_read on audit_events
  for select to authenticated
  using (current_staff_role() in ('administrator', 'auditor'));

-- Configuration
create policy config_admin on service_configuration
  for all to authenticated
  using (current_staff_role() = 'administrator')
  with check (current_staff_role() = 'administrator');

create policy config_staff_read on service_configuration
  for select to authenticated
  using (current_staff_role() is not null);
