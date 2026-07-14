export type ApplicationStatus =
  | "New"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Awaiting Verification"
  | "Verified"
  | "Paid Consultation"
  | "Profile Completed"
  | "Mutual Interest"
  | "Concierge Requested"
  | "Meeting Scheduled"
  | "Closed"
  | "Suspended";

export type RiskLevel = "Low" | "Medium" | "High";

export interface Application {
  id: string;
  fullName: string;
  email: string;
  country: string;
  status: ApplicationStatus;
  consentStatus: string;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface Member {
  id: string;
  displayName: string;
  country: string;
  verificationStatus: string;
  visibilityStatus: string;
  riskLevel: RiskLevel;
}

export interface VerificationEvent {
  id: string;
  memberId: string;
  verificationType: string;
  reviewer: string;
  result: string;
  documentDeletedAt: string | null;
  deletionProofReference: string | null;
  notes: string;
}

export interface ConsentEvent {
  id: string;
  personId: string;
  consentType: string;
  consentValue: boolean;
  source: string;
  timestamp: string;
  termsVersion: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  currency: "GBP";
  feeType: "Matchmaking Membership" | "Dedicated Concierge";
  status: string;
}

export type IntroductionStatus =
  | "Suggested"
  | "One Side Accepted"
  | "Both Accepted"
  | "In Conversation"
  | "Meeting Planned"
  | "Closed";

export interface Introduction {
  id: string;
  memberAId: string;
  memberBId: string;
  matchmaker: string;
  status: IntroductionStatus;
  mutualConsent: boolean;
  createdAt: string;
}

export interface Complaint {
  id: string;
  complainantId: string;
  issueType: string;
  severity: RiskLevel;
  actionTaken: string;
  status: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}
