import type { Metadata } from "next";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Real Match."
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1>Talk to us.</h1>
          <p className="lede">
            Questions about the process, membership, or whether Real Match is right for you
            are always welcome.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="prose">
            {serviceConfig.status === "preview" ? (
              <>
                <p>
                  Real Match is in private preview, and a monitored contact channel is part
                  of launching properly — we will not publish an address until someone is
                  genuinely there to answer it.
                </p>
                <p>
                  A contact address and response commitment will be published on this page
                  before applications open.
                </p>
              </>
            ) : (
              <p>
                A contact address will be published here together with our response
                commitment.
              </p>
            )}
            <h2>Complaints and safety concerns</h2>
            <p>
              When the service is operating, this page will also carry a dedicated route
              for reports and complaints, handled under the process described on the
              privacy &amp; safety page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
