-- Support joins, deletes, and operational lookups across foreign-key columns.
-- These indexes mirror the provisioned Real Match Supabase project.

create index if not exists application_status_history_changed_by_idx
  on application_status_history (changed_by);

create index if not exists audit_events_actor_staff_idx
  on audit_events (actor_staff_id);

create index if not exists data_deletion_requests_application_idx
  on data_deletion_requests (application_id);
create index if not exists data_deletion_requests_member_idx
  on data_deletion_requests (member_id);
create index if not exists data_deletion_requests_handled_by_idx
  on data_deletion_requests (handled_by);

create index if not exists introduction_candidates_member_b_idx
  on introduction_candidates (member_b_id);
create index if not exists introduction_candidates_proposed_by_idx
  on introduction_candidates (proposed_by);
create index if not exists introduction_decisions_member_idx
  on introduction_decisions (member_id);

create index if not exists payment_disputes_payment_record_idx
  on payment_disputes (payment_record_id);
create index if not exists payment_eligibilities_approved_by_idx
  on payment_eligibilities (approved_by);

create index if not exists refund_records_payment_record_idx
  on refund_records (payment_record_id);
create index if not exists refund_records_requested_by_idx
  on refund_records (requested_by);

create index if not exists safety_reports_reporter_member_idx
  on safety_reports (reporter_member_id);
create index if not exists safety_reports_subject_member_idx
  on safety_reports (subject_member_id);
create index if not exists safety_reports_handled_by_idx
  on safety_reports (handled_by);

create index if not exists service_configuration_updated_by_idx
  on service_configuration (updated_by);
