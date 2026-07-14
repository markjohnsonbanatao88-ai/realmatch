import type { Metadata } from "next";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { serviceConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Apply privately",
  description: "A private application flow with no public profile and no sharing without approval."
};

export default function ApplyPage() {
  const isOpen = serviceConfig.applicationsEnabled;

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">{isOpen ? "Application" : "Application preview"}</p>
          <h1>{isOpen ? "Apply privately." : "See the private application flow."}</h1>
          <p className="lede">
            {isOpen
              ? "This is not a public profile. Take your time; every step can be revisited before you submit."
              : "Applications are not open. This uses fictional, locked answers so you can review the flow without sharing personal information."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <ApplicationForm />
        </div>
      </section>
    </>
  );
}
