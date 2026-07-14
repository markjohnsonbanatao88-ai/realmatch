import type { Metadata } from "next";
import Link from "next/link";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { Comparison } from "@/components/marketing/Comparison";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Five steps from private application to a mutually agreed introduction — human review, curated introductions, and consent at every stage."
};

export default function HowItWorksPage() {
  const isOperating = serviceConfig.applicationsEnabled;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">The process</p>
          <h1>How it works</h1>
          <p className="lede">
            {isOperating
              ? "No public profiles. No browsing. A person reads your application, gets to know what you are looking for, and introduces you only when both sides say yes."
              : "This page describes the planned live process. Applications are not being processed in preview, and no personal information is collected here."}
          </p>
        </div>
      </section>
      <ProcessSteps />
      <Comparison />
      <section className="section">
        <div className="wrap">
          <h2>Ready when you are.</h2>
          <p className="lede" style={{ margin: "18px 0 30px" }}>
            {isOperating ? "Applying costs nothing, and there is no obligation at any stage." : "You can review the fictional application preview without submitting personal information."}
          </p>
          <Link className="button primary" href="/apply">
            {isOperating ? "Begin private application" : "View application preview"}
          </Link>
        </div>
      </section>
    </>
  );
}
