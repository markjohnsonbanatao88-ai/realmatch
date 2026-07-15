-- Atomic, privacy-preserving application intake.
-- Apply only after 0001_initial_schema.sql and 0002_row_level_security.sql.

create table if not exists application_submission_attempts (
  id uuid primary key default gen_random_uuid(),
  request_hash text not null,
  email_hash text not null,
  idempotency_key uuid not null,
  accepted boolean not null default false,
  attempted_at timestamptz not null default now()
);

create index if not exists application_submission_attempts_request_idx
  on application_submission_attempts (request_hash, attempted_at desc);

alter table application_submission_attempts enable row level security;

create or replace function submit_application_atomic(
  p_application jsonb,
  p_idempotency_key uuid,
  p_email_hash text,
  p_request_hash text,
  p_terms_version text,
  p_privacy_version text,
  p_conduct_version text,
  p_marketing_version text
)
returns table(reference text, duplicate boolean, duplicate_email boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application_id uuid;
  v_reference text;
  v_attempts integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_email_hash, 0));

  select count(*) into v_attempts
  from application_submission_attempts
  where request_hash = p_request_hash
    and attempted_at > now() - interval '1 hour';

  if v_attempts >= 5 then
    raise exception 'RATE_LIMITED';
  end if;

  insert into application_submission_attempts (
    request_hash, email_hash, idempotency_key
  ) values (
    p_request_hash, p_email_hash, p_idempotency_key
  );

  select a.reference into v_reference
  from applications a
  where a.idempotency_key = p_idempotency_key
  limit 1;

  if v_reference is not null then
    return query select v_reference, true, false;
    return;
  end if;

  if exists (select 1 from applications a where a.email_hash = p_email_hash) then
    return query select null::text, false, true;
    return;
  end if;

  v_reference := 'RM-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into applications (
    reference,
    idempotency_key,
    email_hash,
    full_name,
    email,
    phone,
    country,
    city,
    age,
    relationship_goal,
    timeline,
    why_now,
    values_statement,
    lifestyle,
    interests,
    preferences,
    non_negotiables
  ) values (
    v_reference,
    p_idempotency_key,
    p_email_hash,
    p_application->>'fullName',
    lower(p_application->>'email'),
    p_application->>'phone',
    p_application->>'country',
    p_application->>'city',
    (p_application->>'age')::smallint,
    p_application->>'relationshipGoal',
    p_application->>'timeline',
    p_application->>'whyNow',
    p_application->>'values',
    p_application->>'lifestyle',
    p_application->>'interests',
    p_application->>'preferences',
    p_application->>'nonNegotiables'
  ) returning id into v_application_id;

  insert into application_consents (
    application_id, consent_type, consent_given, terms_version, policy_version
  ) values
    (v_application_id, 'terms', true, p_terms_version, p_terms_version),
    (v_application_id, 'privacy', true, p_terms_version, p_privacy_version),
    (v_application_id, 'conduct', true, p_terms_version, p_conduct_version),
    (
      v_application_id,
      'marketing',
      coalesce((p_application->>'marketingOptIn')::boolean, false),
      p_terms_version,
      p_marketing_version
    );

  update application_submission_attempts
  set accepted = true
  where id = (
    select id
    from application_submission_attempts
    where request_hash = p_request_hash
      and idempotency_key = p_idempotency_key
    order by attempted_at desc
    limit 1
  );

  return query select v_reference, false, false;
end;
$$;

revoke all on function submit_application_atomic(
  jsonb, uuid, text, text, text, text, text, text
) from public;
grant execute on function submit_application_atomic(
  jsonb, uuid, text, text, text, text, text, text
) to service_role;
