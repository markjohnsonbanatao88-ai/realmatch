import type { Metadata } from "next";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "Draft privacy notice for the planned Real Match service."
};

export default function PrivacyPage() {
  const isOperating = serviceConfig.applicationsEnabled;
  return (
    <section className="section"><div className="wrap"><div className="prose">
      <p className="eyebrow">Privacy</p>
      <h1>Privacy Notice</h1>
      <p className="legal-warning">Draft for legal review — not final.</p>
      <h2>The short version</h2>
      <p>{isOperating
        ? "We collect only what the service needs, show your profile to no one without your approval, never sell your data, and delete what we no longer need."
        : "No personal information is collected through this preview. The final notice will be reviewed with counsel and mapped to the live systems before real member data is collected."}</p>
      <h2>What the operating service will collect</h2>
      <p>Application details you choose to give us, consultation notes, your approved profile, consent records, and — once verification is live — a reference and result from an approved identity-verification provider. We do not intend to hold raw identity documents.</p>
      <h2>How information is shared</h2>
      <p>The planned live service keeps profiles private by default. A profile is shared only with a specific member being considered for an introduction, only after approval of its contents. Staff access is role-restricted and logged.</p>
      <h2>Retention and deletion</h2>
      <p>Information will be kept only as long as needed for the service, under a documented retention schedule. The live process will provide a deletion request route and documented completion period.</p>
      <h2>Consent</h2>
      <p>Service communication and marketing communication are consented to separately. Marketing consent is optional, never bundled, and can be withdrawn at any time.</p>
      <h2>Cookies and analytics</h2>
      <p>This public preview sets no analytics or tracking scripts. A configured staff-only sign-in uses an essential, short-lived session cookie; if privacy-respecting analytics are added later, this notice will be updated first and consent handled appropriately.</p>
      <h2>Current implementation scope</h2>
      <p>{isOperating
        ? "The live data handling described above must remain aligned with the configured service status and operational safeguards."
        : "While the service is in preview, this website does not collect, store, or transmit application data. The application form uses fictional, locked example answers."}</p>
    </div></div></section>
  );
}
