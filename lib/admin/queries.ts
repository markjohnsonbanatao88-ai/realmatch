import "server-only";

import { canAccess, requireStaffPage, type StaffRole } from "@/lib/auth/staff";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRow = Record<string, unknown>;

export async function getAdminRows(table: string, query: string, roles: StaffRole[]) {
  const staff = await requireStaffPage(roles);
  if (!canAccess(staff, roles)) return [];
  const client = createSupabaseServerClient(staff.accessToken);
  const rows = await client.select<AdminRow>(table, query);
  await createSupabaseAdminClient().insert("audit_events", {
    actor_staff_id: staff.id,
    actor_label: staff.displayName,
    action: "read",
    target_table: table,
    metadata: { route_view: true, returned_rows: rows.length }
  });
  return rows;
}

export const adminViews = {
  applications: () =>
    getAdminRows(
      "applications",
      "select=reference,status,country,city,created_at&order=created_at.desc&limit=100",
      ["administrator", "reviewer", "auditor"]
    ),
  members: () =>
    getAdminRows(
      "member_profiles",
      "select=id,membership_status,verification_status,membership_starts_at,membership_ends_at,created_at&order=created_at.desc&limit=100",
      ["administrator", "reviewer", "matchmaker", "safety_officer", "auditor"]
    ),
  introductions: () =>
    getAdminRows(
      "introduction_candidates",
      "select=id,member_a_id,member_b_id,proposed_by,created_at&order=created_at.desc&limit=100",
      ["administrator", "matchmaker", "auditor"]
    ),
  verification: () =>
    getAdminRows(
      "member_profiles",
      "select=id,verification_provider,verification_status,verification_completed_at,verification_expires_at&order=created_at.desc&limit=100",
      ["administrator", "reviewer", "auditor"]
    ),
  payments: () =>
    getAdminRows(
      "payment_records",
      "select=id,purpose,status,amount_minor,currency,paypal_order_id,paypal_capture_id,captured_at,created_at&order=created_at.desc&limit=100",
      ["administrator", "auditor"]
    ),
  complaints: () =>
    getAdminRows(
      "safety_reports",
      "select=id,status,created_at,resolved_at&order=created_at.desc&limit=100",
      ["administrator", "safety_officer", "auditor"]
    ),
  audit: () =>
    getAdminRows(
      "audit_events",
      "select=created_at,actor_label,action,target_table,target_id&order=created_at.desc&limit=100",
      ["administrator", "auditor"]
    )
};
