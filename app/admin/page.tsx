import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminViews } from "@/lib/admin/queries";
import { canAccess, requireStaffPage, type StaffRole } from "@/lib/auth/staff";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const staff = await requireStaffPage();
  const available = [
    { label: "Recent applications", roles: ["administrator", "reviewer", "auditor"], load: adminViews.applications },
    { label: "Recent members", roles: ["administrator", "reviewer", "matchmaker", "safety_officer", "auditor"], load: adminViews.members },
    { label: "Recent introductions", roles: ["administrator", "matchmaker", "auditor"], load: adminViews.introductions },
    { label: "Verification records", roles: ["administrator", "reviewer", "auditor"], load: adminViews.verification },
    { label: "Payment records", roles: ["administrator", "auditor"], load: adminViews.payments },
    { label: "Safety reports", roles: ["administrator", "safety_officer", "auditor"], load: adminViews.complaints },
    { label: "Audit events", roles: ["administrator", "auditor"], load: adminViews.audit }
  ] satisfies Array<{ label: string; roles: StaffRole[]; load: () => Promise<Record<string, unknown>[]> }>;
  const visible = available.filter((view) => canAccess(staff, view.roles));
  const results = await Promise.all(visible.map((view) => view.load()));
  const stats = visible.map((view, index) => ({ label: view.label, value: results[index].length }));

  return (
    <AdminLayout title="Matchmaker console overview">
      <div className="card-grid three">
        {stats.map((stat) => (
          <article className="card" key={stat.label}>
            <p className="eyebrow">{stat.label}</p>
            <p className="price">{stat.value}</p>
          </article>
        ))}
      </div>
      <p className="scope-note">Counts are limited to the most recent 100 records in each staff-authorized view.</p>
    </AdminLayout>
  );
}
