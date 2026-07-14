import { philosophy } from "@/content/site";
import { ImageSlot } from "@/components/marketing/ImageSlot";
import { serviceConfig } from "@/lib/config/site";

export function Philosophy() {
  const paragraphs = serviceConfig.applicationsEnabled
    ? philosophy.paragraphs
    : [
        philosophy.paragraphs[0],
        "The planned live service is designed around a human review of values, lifestyle, communication style, readiness, relationship intentions, and what each person says they are looking for.",
        "That process is not operating in preview. We are showing the intended service model plainly, without claiming that applications are currently being reviewed."
      ];
  return (
    <section className="section section-deep">
      <div className="wrap split">
        <ImageSlot
          requirement="Discreet consultation environment — a calm, warmly lit sitting room or study; two chairs, no faces required."
          ratio="portrait"
        />
        <div>
          <p className="eyebrow">{philosophy.eyebrow}</p>
          <h2>{philosophy.heading}</h2>
          <div className="prose" style={{ marginTop: 22 }}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
