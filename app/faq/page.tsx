import type { Metadata } from "next";
import { FaqList } from "@/components/marketing/FaqList";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Plain answers about eligibility, privacy, membership terms, introductions, declining, reporting, and deleting your information."
};

export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">FAQ</p>
          <h1>Questions, answered plainly.</h1>
          <p className="lede">
            If something you want to know is not covered here, ask us directly — the
            contact page explains how.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <FaqList />
        </div>
      </section>
    </>
  );
}
