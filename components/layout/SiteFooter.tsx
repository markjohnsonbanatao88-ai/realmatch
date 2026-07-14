import Link from "next/link";
import { footerNote } from "@/content/site";

const columns = [
  {
    heading: "Service",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/membership", label: "Membership" },
      { href: "/apply", label: "Apply privately" },
      { href: "/faq", label: "FAQ" }
    ]
  },
  {
    heading: "Trust",
    links: [
      { href: "/safety", label: "Privacy & safety" },
      { href: "/about", label: "About" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Notice" },
      { href: "/refunds", label: "Refund Policy" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label="Real Match home">
              Real<span className="brand-mark">&nbsp;Match</span>
            </Link>
            <p>
              Private, human-led introductions for adults looking for a serious
              relationship.
            </p>
          </div>
          {columns.map((column) => (
            <nav className="footer-col" key={column.heading} aria-label={column.heading}>
              <h4>{column.heading}</h4>
              {column.links.map((link) => (
                <Link key={link.href + link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <p className="footer-note">{footerNote}</p>
        <p className="footer-meta">© {new Date().getFullYear()} Real Match. All rights reserved.</p>
      </div>
    </footer>
  );
}
