-- Keep the SECURITY DEFINER role helper outside the exposed public API schema.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.current_staff_role()
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

revoke all on function private.current_staff_role() from public, anon;
grant execute on function private.current_staff_role() to authenticated;

alter policy staff_read_own on staff_profiles using (user_id = (select auth.uid()) or private.current_staff_role() = 'administrator');
alter policy staff_admin_write on staff_profiles using (private.current_staff_role() = 'administrator') with check (private.current_staff_role() = 'administrator');
alter policy applications_staff_read on applications using (private.current_staff_role() in ('administrator','reviewer','matchmaker','safety_officer','auditor'));
alter policy applications_staff_update on applications using (private.current_staff_role() in ('administrator','reviewer')) with check (private.current_staff_role() in ('administrator','reviewer'));
alter policy consents_staff_read on application_consents using (private.current_staff_role() in ('administrator','reviewer','auditor'));
alter policy history_staff_read on application_status_history using (private.current_staff_role() in ('administrator','reviewer','auditor'));
alter policy members_staff_read on member_profiles using (private.current_staff_role() in ('administrator','reviewer','matchmaker','safety_officer','auditor'));
alter policy members_staff_update on member_profiles using (private.current_staff_role() in ('administrator','matchmaker')) with check (private.current_staff_role() in ('administrator','matchmaker'));
alter policy members_staff_insert on member_profiles with check (private.current_staff_role() in ('administrator','reviewer'));
alter policy visibility_staff_read on profile_visibility_approvals using (private.current_staff_role() in ('administrator','matchmaker','auditor'));
alter policy intro_candidates_staff_read on introduction_candidates using (private.current_staff_role() in ('administrator','matchmaker','auditor'));
alter policy intro_candidates_matchmaker_insert on introduction_candidates with check (private.current_staff_role() in ('administrator','matchmaker'));
alter policy intro_decisions_staff_read on introduction_decisions using (private.current_staff_role() in ('administrator','matchmaker','auditor'));
alter policy safety_staff_read on safety_reports using (private.current_staff_role() in ('administrator','safety_officer','auditor'));
alter policy safety_staff_write on safety_reports using (private.current_staff_role() in ('administrator','safety_officer')) with check (private.current_staff_role() in ('administrator','safety_officer'));
alter policy deletion_staff_read on data_deletion_requests using (private.current_staff_role() in ('administrator','auditor'));
alter policy payment_eligibilities_staff_read on payment_eligibilities using (private.current_staff_role() in ('administrator','auditor'));
alter policy payment_eligibilities_admin_write on payment_eligibilities using (private.current_staff_role() = 'administrator') with check (private.current_staff_role() = 'administrator');
alter policy payments_staff_read on payment_records using (private.current_staff_role() in ('administrator','auditor'));
alter policy refunds_staff_read on refund_records using (private.current_staff_role() in ('administrator','auditor'));
alter policy disputes_staff_read on payment_disputes using (private.current_staff_role() in ('administrator','auditor'));
alter policy webhook_events_admin_read on paypal_webhook_events using (private.current_staff_role() = 'administrator');
alter policy audit_staff_read on audit_events using (private.current_staff_role() in ('administrator','auditor'));
alter policy config_admin on service_configuration using (private.current_staff_role() = 'administrator') with check (private.current_staff_role() = 'administrator');
alter policy config_staff_read on service_configuration using (private.current_staff_role() is not null);

drop function if exists public.current_staff_role();
