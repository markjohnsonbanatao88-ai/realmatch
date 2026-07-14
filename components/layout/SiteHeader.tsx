"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { serviceConfig } from "@/lib/config/site";

const navItems = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/membership", label: "Membership" },
  { href: "/safety", label: "Privacy & safety" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" }
];

function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Real Match home">
      Real<span className="brand-mark">&nbsp;Match</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const applicationLabel = serviceConfig.applicationsEnabled ? "Apply privately" : "Application preview";

  // Close the drawer whenever navigation occurs.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Focus trap, Escape handling, scroll lock, and focus restoration.
  useEffect(() => {
    if (!open) {
      return;
    }

    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }

    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const items = focusables();
      if (items.length === 0) {
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const toggle = toggleRef.current;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      toggle?.focus();
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button primary small" href="/apply">
            {applicationLabel}
          </Link>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-drawer"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div
          ref={drawerRef}
          id="site-drawer"
          className="nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="nav-drawer-head">
            <Brand />
            <button
              type="button"
              className="nav-toggle"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav aria-label="Primary mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="button primary drawer-cta"
              href="/apply"
              onClick={() => setOpen(false)}
            >
              {applicationLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
