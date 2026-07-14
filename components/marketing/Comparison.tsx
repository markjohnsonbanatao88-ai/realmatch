import { comparison } from "@/content/site";
import { serviceConfig } from "@/lib/config/site";

export function Comparison() {
  const isOperating = serviceConfig.applicationsEnabled;
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{comparison.eyebrow}</p>
          <h2>{comparison.heading}</h2>
          <p className="lede">{comparison.intro}</p>
        </div>
        <div className="compare-grid">
          <div className="compare-col">
            <h3>{comparison.typical.title}</h3>
            <ul>
              {comparison.typical.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="compare-col highlight">
            <h3>{isOperating ? comparison.realMatch.title : "Planned Real Match service"}</h3>
            <ul>
              {comparison.realMatch.points.map((point) => (
                <li key={point}>{isOperating ? point : `Planned: ${point}`}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
