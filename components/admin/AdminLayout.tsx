import Link from "next/link";
import type { ReactNode } from "react";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/introductions", label: "Introductions" },
  { href: "/admin/verification", label: "Verification" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/complaints", label: "Complaints" },
  { href: "/admin/audit-logs", label: "Audit logs" }
];

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-page">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <h2>Matchmaker console</h2>
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>{link.label}</Link>
        ))}
      </aside>
      <div className="admin-content">
        <p className="eyebrow">Internal console</p>
        <h1>{title}</h1>
        <div className="admin-warning" role="note">
          <strong>Staff-only operational view.</strong>
          <span>
            Access is checked server-side against an active staff role. Records are drawn from the configured service database; do not enter or display live data until the readiness gates are complete.
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}
