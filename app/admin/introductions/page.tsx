import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTable } from "@/components/admin/AdminTables";
import { adminViews } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function IntroductionsPage() {
  return <AdminLayout title="Introductions"><AdminTable rows={await adminViews.introductions()} /></AdminLayout>;
}
