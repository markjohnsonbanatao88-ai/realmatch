import { faqItems } from "@/content/faq";
import { serviceConfig } from "@/lib/config/site";

export function FaqList({ limit }: { limit?: number }) {
  const statusAwareItems = faqItems.map((item) => {
    const previewItem = !serviceConfig.applicationsEnabled
      ? { ...item, answer: `For the planned live service: ${item.answer}` }
      : item;
    if (item.question === "What information is verified?" && !serviceConfig.identityVerificationEnabled) {
      return {
        ...previewItem,
        answer: "The planned live process requires identity verification through an approved third-party provider before membership begins. Verification is not operating in the current service status."
      };
    }
    if (item.question === "What does the membership fee cover?" && !serviceConfig.paymentsEnabled) {
      return {
        ...previewItem,
        answer: "The planned membership fee is designed to cover review, consultation, private-profile preparation, and consideration for curated introductions. Payments are not being processed in the current service status."
      };
    }
    return previewItem;
  });
  const items = typeof limit === "number" ? statusAwareItems.slice(0, limit) : statusAwareItems;

  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p className="faq-answer">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
