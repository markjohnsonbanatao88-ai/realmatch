import Link from "next/link";
import { Comparison } from "@/components/marketing/Comparison";
import { FaqList } from "@/components/marketing/FaqList";
import { Hero } from "@/components/marketing/Hero";
import { MembershipSection } from "@/components/marketing/MembershipSection";
import { Philosophy } from "@/components/marketing/Philosophy";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { DemonstrationProfileSection } from "@/components/profiles/DemonstrationProfile";
import { PrivacyPillars } from "@/components/safety/PrivacyPillars";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Comparison />
      <Philosophy />
      <ProcessSteps />
      <DemonstrationProfileSection />
      <MembershipSection />
      <PrivacyPillars />
      <section className="section section-deep">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Common questions</p>
            <h2>Asked before applying.</h2>
          </div>
          <FaqList limit={4} />
          <p style={{ marginTop: 28 }}>
            <Link className="text-link" href="/faq">
              Read all questions and answers
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
