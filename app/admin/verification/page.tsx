import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTables";
import { adminViews } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  return <AdminLayout title="Verification"><AdminTable rows={await adminViews.verification()} /></AdminLayout>;
}
