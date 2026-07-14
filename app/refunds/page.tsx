import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Draft refund policy framework for Real Match membership."
};

export default function RefundsPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="prose">
          <p className="eyebrow">Refunds</p>
          <h1>Refund Policy</h1>
          <p className="legal-warning">Draft for legal review — not final.</p>

          <h2>Current status</h2>
          <p>
            Real Match is not yet processing payments, so no refund situation can currently
            arise. Before payments open, this page will publish the final,
            counsel-reviewed policy.
          </p>

          <h2>Commitments the final policy will honour</h2>
          <ul>
            <li>Payment is requested only after an application is accepted — never before.</li>
            <li>
              If identity verification cannot be completed, membership does not begin and
              any fee paid is returned in full.
            </li>
            <li>
              Statutory cancellation and refund rights under applicable consumer law are
              honoured in full and never waived by our terms.
            </li>
            <li>
              The exact service period, what the fee covers, and how to cancel will be
              stated on one page, before payment, in plain language.
            </li>
            <li>Refund requests will have a stated response time and a named process.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
