import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTables";
import { adminViews } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  return <AdminLayout title="Applications"><AdminTable rows={await adminViews.applications()} /></AdminLayout>;
}
