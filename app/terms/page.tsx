import type { Metadata } from "next";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Draft Terms of Service for the planned Real Match service."
};

export default function TermsPage() {
  const isOperating = serviceConfig.applicationsEnabled;
  return (
    <section className="section">
      <div className="wrap"><div className="prose">
        <p className="eyebrow">Terms</p>
        <h1>Terms of Service</h1>
        <p className="legal-warning">Draft for legal review — not final.</p>
        <h2>What Real Match is</h2>
        <p>{isOperating
          ? "Real Match is a personal matchmaking and introduction service for adults. We consider applications, consult with accepted members, prepare private profiles, and make curated introductions between members who we believe may be compatible."
          : "Real Match is preparing a personal matchmaking and introduction service for adults. The planned operating process includes human application review, consultation, private-profile preparation, and curated introductions."}</p>
        <h2>What we do not do</h2>
        <p>We do not guarantee a match, an introduction, a relationship, marriage, or any romantic outcome. We do not arrange marriages, assign partners, or sell access to any member. Fees pay for matchmaking work only.</p>
        <h2>Mutual consent</h2>
        <p>The planned live process requires both members to independently agree before contact is opened. Members may decline, pause, or block at any time, without explanation and without penalty.</p>
        <h2>Membership</h2>
        <p>{serviceConfig.paymentsEnabled
          ? "Membership runs for a defined period stated at acceptance. Payment is requested only after an application is accepted."
          : "Membership and payment are not currently offered. The final terms will state the service period and payment conditions before either is available."}</p>
        <h2>Member conduct</h2>
        <p>Members must provide truthful information, treat others with respect, never pressure or coerce, and follow the published conduct standards. Breaches can lead to suspension or removal.</p>
        <h2>Fees and refunds</h2>
        <p>Fees, the service period, and refund terms will be stated clearly before payment and in the final published refund policy. Nothing in these terms removes rights you have under applicable consumer law.</p>
        <h2>Current service status</h2>
        <p>The current operational status is displayed on this site. While in preview, no applications are processed and no payments are taken.</p>
      </div></div>
    </section>
  );
}
