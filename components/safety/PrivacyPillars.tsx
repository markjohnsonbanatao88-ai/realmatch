import { privacyPillars } from "@/content/site";
import { serviceConfig } from "@/lib/config/site";

export function PrivacyPillars() {
  const isOperating = serviceConfig.applicationsEnabled;
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Privacy &amp; safety</p>
          <h2>Designed around consent, not exposure.</h2>
          <p className="lede">
            These are the working rules the service is built on. Where a capability is still
            being implemented, we say so — the current service status is always shown at the
            top of this site.
          </p>
        </div>
        <div className="pillar-grid">
          {privacyPillars.map((pillar) => (
            <article className="pillar" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{isOperating ? pillar.body : `Planned live safeguard: ${pillar.body}`}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
