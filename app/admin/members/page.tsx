import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTables";
import { adminViews } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function MemberRecordsPage() {
  return <AdminLayout title="Member records"><AdminTable rows={await adminViews.members()} /></AdminLayout>;
}
