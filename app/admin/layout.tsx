import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireStaffPage } from "@/lib/auth/staff";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

/** Server-side staff authorization; middleware is only an outer redirect. */
export default async function AdminSectionLayout({ children }: { children: ReactNode }) {
  await requireStaffPage();
  return <>{children}</>;
}
