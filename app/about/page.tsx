import type { Metadata } from "next";
import Link from "next/link";
import { Philosophy } from "@/components/marketing/Philosophy";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Real Match exists: human review over endless swiping, and introductions made with intention."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">About Real Match</p>
          <h1>Human review, not endless swiping.</h1>
          <p className="lede">
            Real Match exists for people who are done treating their love life like a
            numbers game — and would rather be introduced thoughtfully, by a person, to
            someone looking for the same things.
          </p>
        </div>
      </section>

      <Philosophy />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Who we are</p>
            <h2>People, named when it is true.</h2>
          </div>
          <div className="prose">
            {serviceConfig.founder ? (
              <p>{serviceConfig.founder.bio}</p>
            ) : (
              <>
                <p>
                  We believe a matchmaking service should be as honest about itself as it
                  asks its members to be. So rather than invent a founder story or borrow a
                  stock-photo team, this page will introduce the real people behind Real
                  Match — with their consent, their real names, and their real backgrounds —
                  once the service moves out of preview.
                </p>
                <p>
                  Until then, what you can judge us on is written down: our{" "}
                  <Link className="text-link" href="/how-it-works">
                    process
                  </Link>
                  , our{" "}
                  <Link className="text-link" href="/membership">
                    terms
                  </Link>
                  , and our{" "}
                  <Link className="text-link" href="/safety">
                    standards
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
