import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTables";
import { adminViews } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  return <AdminLayout title="Audit logs"><AdminTable rows={await adminViews.audit()} /></AdminLayout>;
}
