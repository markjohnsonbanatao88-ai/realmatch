-- Explicitly harden API execution grants after provisioning.
-- Trigger functions are database-internal; only the service role may call intake.

revoke execute on function current_staff_role() from anon;
revoke execute on function record_application_status_change() from anon, authenticated;
revoke execute on function write_audit_event() from anon, authenticated;
revoke execute on function submit_application_atomic(
  jsonb, uuid, text, text, text, text, text, text
) from anon, authenticated;

grant execute on function current_staff_role() to authenticated;
grant execute on function submit_application_atomic(
  jsonb, uuid, text, text, text, text, text, text
) to service_role;

comment on table application_submission_attempts is
  'Server-only durable intake throttling ledger. RLS intentionally has no client policies.';
