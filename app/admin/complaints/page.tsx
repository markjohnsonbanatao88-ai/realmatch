import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTables";
import { adminViews } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function ComplaintRecordsPage() {
  return <AdminLayout title="Complaint records"><AdminTable rows={await adminViews.complaints()} /></AdminLayout>;
}
