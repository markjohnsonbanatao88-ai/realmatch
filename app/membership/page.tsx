import type { Metadata } from "next";
import { FaqList } from "@/components/marketing/FaqList";
import { MembershipSection } from "@/components/marketing/MembershipSection";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "One clear membership with defined terms. Payment only after acceptance, a defined twelve-month period, and no outcome ever guaranteed."
};

export default function MembershipPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Membership</p>
          <h1>Clear fees. Defined terms.</h1>
          <p className="lede">
            You pay for our time and judgment — review, consultation, profile preparation,
            and curated introductions. Never for an outcome, and never for another person.
          </p>
        </div>
      </section>
      <MembershipSection />
      <section className="section section-deep">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Before you decide</p>
            <h2>The details, plainly.</h2>
          </div>
          <FaqList />
        </div>
      </section>
    </>
  );
}
