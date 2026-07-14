import Link from "next/link";
import { hero } from "@/content/site";
import { ImageSlot } from "@/components/marketing/ImageSlot";
import { serviceConfig } from "@/lib/config/site";

export function Hero() {
  const isOperating = serviceConfig.applicationsEnabled;
  const points = isOperating
    ? hero.trustPoints
    : ["Private process by design", "Planned mutual approval", "Planned human review"];
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.headline}</h1>
          <p className="lede">{hero.body}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/apply">
              {isOperating ? hero.primaryCta : "View application preview"}
            </Link>
            <Link className="button secondary" href="/how-it-works">
              {hero.secondaryCta}
            </Link>
          </div>
          <ul className="hero-points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <ImageSlot
          requirement="Hero editorial relationship image — two adults in warm, natural conversation; candid, unstaged, no direct camera gaze."
          ratio="portrait"
          priority
        />
      </div>
    </section>
  );
}
