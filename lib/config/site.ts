/**
 * Single source of truth for business claims and operational state.
 *
 * Rule: the UI must never display a capability, number, or promise that is
 * not backed by a value here — and values here must never be set to
 * something the business has not actually implemented.
 */

export type ServiceStatus = "preview" | "pilot" | "live";

function resolveStatus(): ServiceStatus {
  const raw = process.env.NEXT_PUBLIC_SERVICE_STATUS;
  if (raw === "pilot" || raw === "live") {
    return raw;
  }
  return "preview";
}

export const serviceConfig = {
  /** preview: marketing visible, nothing processed. pilot/live gated below. */
  status: resolveStatus(),

  market: "United Kingdom",
  currency: "GBP" as const,

  /** One primary membership offer. */
  membershipFee: 299,
  membershipDurationMonths: 12,

  /** Optional service, offered only after mutual interest. */
  conciergeFee: 600,

  /**
   * Capability flags. Set to true only when the capability is genuinely
   * implemented, tested, and operationally staffed. See
   * PRODUCTION_READINESS.md for the gate checklist.
   */
  applicationsEnabled: false, // requires: backend intake, consent storage, review workflow
  paymentsEnabled: false, // requires: payment provider, webhooks, refund policy, legal review
  identityVerificationEnabled: false, // requires: approved verification provider integration
  conciergeEnabled: false, // requires: operational playbook and staff

  /**
   * Do not state a review turnaround publicly until one is measured and
   * staffed. Keep null until then.
   */
  reviewTimeStatement: null as string | null,

  /**
   * Real founder/team content only. Keep null until a real, verifiable
   * person consents to being named. Never populate with a persona.
   */
  founder: null as null | {
    name: string;
    role: string;
    bio: string;
    imageSrc: string;
  }
};

/** Version labels stored with every submitted consent record. */
export const consentVersions = {
  terms: "2026-07-preview-1",
  privacy: "2026-07-preview-1",
  conduct: "2026-07-preview-1",
  marketing: "2026-07-preview-1"
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const statusBannerCopy: Record<ServiceStatus, string | null> = {
  preview:
    "Private preview — Real Match is not yet accepting applications or payments. Nothing you enter on this site is saved or transmitted.",
  pilot:
    "Pilot programme — Real Match is operating with a limited first group of members.",
  live: null
};
