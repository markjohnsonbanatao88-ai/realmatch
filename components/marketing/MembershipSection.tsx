import Link from "next/link";
import { membership } from "@/content/site";
import { serviceConfig } from "@/lib/config/site";

export function MembershipSection() {
  const terms = membership.terms.map((term) => {
    if (!serviceConfig.identityVerificationEnabled && term.startsWith("If identity verification")) {
      return "The planned live process requires identity verification before membership begins; the final refund terms will be shown before any payment is offered.";
    }
    return term;
  });
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{membership.eyebrow}</p>
          <h2>{membership.heading}</h2>
          <p className="lede">{membership.intro}</p>
        </div>

        <div className="membership-grid">
          <div className="membership-card">
            <h3>Matchmaking membership</h3>
            <p className="membership-price">
              £{serviceConfig.membershipFee}{" "}
              <span className="per">· {serviceConfig.membershipDurationMonths} months</span>
            </p>
            <ul>
              {membership.covers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="terms-list">
              {terms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fee-note">
              The fee pays for our work. It never buys an introduction, a relationship, or
              another member&apos;s attention — no member can pay to make someone view, reply
              to, or meet them.
              {serviceConfig.paymentsEnabled
                ? ""
                : serviceConfig.applicationsEnabled
                  ? " Payments are not yet being processed."
                  : " Payments are not yet being processed, and the application page is a fictional preview."}
            </p>
            <div style={{ marginTop: 28 }}>
              <Link className="button primary" href="/apply">
                Begin private application
              </Link>
            </div>
          </div>

          <div className="concierge-card">
            <h3>{membership.concierge.title}</h3>
            <p className="concierge-price">
              £{serviceConfig.conciergeFee} <span className="per">· optional</span>
            </p>
            <p>{membership.concierge.body}</p>
            <p className="fee-note">{membership.concierge.caveat}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
