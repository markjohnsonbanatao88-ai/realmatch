-- Keep the SECURITY DEFINER helper available to RLS without exposing it through
-- the public PostgREST RPC surface.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

alter function public.current_staff_role() set schema private;
revoke all on function private.current_staff_role() from public;
grant execute on function private.current_staff_role() to authenticated, service_role;
