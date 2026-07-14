begin;

create extension if not exists pgtap with schema extensions;
set local search_path to extensions, public;

select plan(10);

select ok((select relrowsecurity from pg_class where oid = 'public.applications'::regclass),
  'applications has row-level security enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.member_profiles'::regclass),
  'member_profiles has row-level security enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.payment_records'::regclass),
  'payment_records has row-level security enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.audit_events'::regclass),
  'audit_events has row-level security enabled');

select policies_are(
  'public',
  'applications',
  array['applications_staff_read', 'applications_staff_update'],
  'applications expose only staff read and update policies'
);
select policies_are(
  'public',
  'payment_records',
  array['payments_member_read_own', 'payments_staff_read'],
  'payment records expose only own-member and staff read policies'
);

select has_column('public', 'member_profiles', 'user_id',
  'member profiles are linked to authenticated users');
select has_table('public', 'payment_eligibilities',
  'payment eligibility is recorded separately from a provider payment');
select has_table('public', 'paypal_webhook_events',
  'verified webhook deliveries have an idempotency record');
select has_function('public', 'enforce_introduction_decision_member', array[]::text[],
  'introduction decisions are guarded by a database function');

select * from finish();
rollback;
