import type { Metadata } from "next";
import { PrivacyPillars } from "@/components/safety/PrivacyPillars";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy & safety",
  description:
    "How Real Match is designed around controlled profile access, mutual approval, conduct standards, and honest limits."
};

export default function SafetyPage() {
  const safetyProcess = serviceConfig.identityVerificationEnabled
    ? "The operating service verifies identity before membership begins, controls who sees what, requires mutual agreement before contact, and acts on every report."
    : "The planned live service requires identity verification before membership begins, controlled profile visibility, mutual agreement before contact, and a documented report process.";

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Privacy &amp; safety</p>
          <h1>Built around consent.</h1>
          <p className="lede">Safety here is a set of working rules, not a slogan. This page describes those rules and is honest about what no service can absolutely promise.</p>
        </div>
      </section>
      <PrivacyPillars />
      <section className="section section-deep">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Member conduct standards</p>
            <h2>What every member agrees to.</h2>
          </div>
          <div className="prose">
            <ul>
              <li>Everyone joins on equal terms, whoever they are and whoever they hope to meet.</li>
              <li>Respectful, honest communication at every stage.</li>
              <li>Truthful identity, photos, and profile information.</li>
              <li>No coercion, harassment, pressure, or transactional expectations.</li>
              <li>Independent, mutual consent before any introduction or meeting.</li>
              <li>Immediate respect for declines, pauses, and blocks.</li>
            </ul>
            <h2>Reports and complaints</h2>
            <p>Members will be able to raise a concern about any interaction. Every report is documented and reviewed against these standards, and outcomes can include a warning, suspension, or removal. The person who reported is told the outcome.</p>
            <h2>Honest limits</h2>
            <p>No service can absolutely prevent someone from misrepresenting themselves, taking a screenshot, or behaving badly in person. {safetyProcess} We will not promise more than that, because nobody honestly can.</p>
          </div>
        </div>
      </section>
    </>
  );
}
