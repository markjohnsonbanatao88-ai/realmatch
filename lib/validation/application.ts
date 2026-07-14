/**
 * Dependency-free, typed validation for the application form.
 *
 * Written as pure functions so the same rules can run client-side and
 * server-side, and can be unit-tested without a DOM. When a build
 * environment is available, these rules can be ported to Zod without
 * changing the form component's contract.
 */

export type ApplicationDraft = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  age: string;
  relationshipGoal: string;
  timeline: string;
  whyNow: string;
  values: string;
  lifestyle: string;
  interests: string;
  preferences: string;
  nonNegotiables: string;
  ageConfirmed: boolean;
  truthfulInfo: boolean;
  termsAgreed: boolean;
  privacyAcknowledged: boolean;
  conductAgreed: boolean;
  marketingOptIn: boolean;
};

export const emptyDraft: ApplicationDraft = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  age: "",
  relationshipGoal: "",
  timeline: "",
  whyNow: "",
  values: "",
  lifestyle: "",
  interests: "",
  preferences: "",
  nonNegotiables: "",
  ageConfirmed: false,
  truthfulInfo: false,
  termsAgreed: false,
  privacyAcknowledged: false,
  conductAgreed: false,
  marketingOptIn: false
};

/** Clearly fictional values used whenever the service is not accepting data. */
export const previewDraft: ApplicationDraft = {
  fullName: "Alex Morgan (fictional example)",
  email: "alex.example@invalid.test",
  phone: "00000 000000",
  country: "Example country",
  city: "Example city",
  age: "31",
  relationshipGoal: "long-term",
  timeline: "ready-now",
  whyNow: "This fictional answer illustrates the application review screen.",
  values: "Kindness, honesty, and showing up for the people I care about.",
  lifestyle: "A fictional example for the private-preview form.",
  interests: "Reading, cooking, and long walks.",
  preferences: "Someone kind, grounded, and looking for a serious partnership.",
  nonNegotiables: "None for this fictional example.",
  ageConfirmed: true,
  truthfulInfo: true,
  termsAgreed: true,
  privacyAcknowledged: true,
  conductAgreed: true,
  marketingOptIn: false
};

export const relationshipGoalLabels: Record<string, string> = {
  "long-term": "A long-term partnership",
  "marriage-minded": "A partnership heading toward marriage",
  open: "Open to either, taken seriously"
};

export const timelineLabels: Record<string, string> = {
  "ready-now": "Ready now — this is a priority in my life",
  "ready-soon": "Getting ready — serious, but not rushing",
  exploring: "Exploring whether this service is right for me"
};

export type FieldErrors = Partial<Record<keyof ApplicationDraft, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function requireText(value: string, message: string, max = 2000): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return message;
  }
  if (trimmed.length > max) {
    return `Please keep this under ${max} characters.`;
  }
  return null;
}

export function validateStep(step: number, draft: ApplicationDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1) {
    const name = requireText(draft.fullName, "Please enter your full name.", 200);
    if (name) errors.fullName = name;

    if (draft.email.trim().length === 0) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(draft.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const phone = requireText(draft.phone, "Please enter a phone number.", 40);
    if (phone) errors.phone = phone;

    const country = requireText(draft.country, "Please enter your country of residence.", 100);
    if (country) errors.country = country;

    const city = requireText(draft.city, "Please enter your city or region.", 100);
    if (city) errors.city = city;

    const ageValue = Number(draft.age);
    if (draft.age.trim().length === 0) {
      errors.age = "Please enter your age.";
    } else if (!Number.isInteger(ageValue) || ageValue < 18 || ageValue > 120) {
      errors.age = "Applicants must be at least 18. Please enter your age in years.";
    }
  }

  if (step === 2) {
    if (draft.relationshipGoal === "") {
      errors.relationshipGoal = "Please choose the option closest to what you are looking for.";
    }
    if (draft.timeline === "") {
      errors.timeline = "Please choose the option that best describes your readiness.";
    }
    const whyNow = requireText(draft.whyNow, "A sentence or two is enough.");
    if (whyNow) errors.whyNow = whyNow;
  }

  if (step === 3) {
    const values = requireText(draft.values, "Please tell us a little about your values.");
    if (values) errors.values = values;
    const lifestyle = requireText(draft.lifestyle, "Please describe your day-to-day life briefly.");
    if (lifestyle) errors.lifestyle = lifestyle;
    const interests = requireText(draft.interests, "Please share a few interests.");
    if (interests) errors.interests = interests;
  }

  if (step === 4) {
    const preferences = requireText(
      draft.preferences,
      "Please describe the kind of person you hope to meet."
    );
    if (preferences) errors.preferences = preferences;
    const nonNegotiables = requireText(
      draft.nonNegotiables,
      "Please note anything that is essential for you. Writing “none” is fine."
    );
    if (nonNegotiables) errors.nonNegotiables = nonNegotiables;
  }

  if (step === 5) {
    if (!draft.ageConfirmed) errors.ageConfirmed = "You must confirm you are at least 18.";
    if (!draft.truthfulInfo) errors.truthfulInfo = "You must confirm your information is truthful.";
    if (!draft.termsAgreed) errors.termsAgreed = "You must agree to the Terms of Service.";
    if (!draft.privacyAcknowledged)
      errors.privacyAcknowledged = "You must acknowledge the Privacy Notice.";
    if (!draft.conductAgreed)
      errors.conductAgreed = "You must agree to the member conduct standards.";
  }

  return errors;
}

export function validateAll(draft: ApplicationDraft): FieldErrors {
  return {
    ...validateStep(1, draft),
    ...validateStep(2, draft),
    ...validateStep(3, draft),
    ...validateStep(4, draft),
    ...validateStep(5, draft)
  };
}

const textFields = [
  "fullName",
  "email",
  "phone",
  "country",
  "city",
  "age",
  "relationshipGoal",
  "timeline",
  "whyNow",
  "values",
  "lifestyle",
  "interests",
  "preferences",
  "nonNegotiables"
] as const;

const booleanFields = [
  "ageConfirmed",
  "truthfulInfo",
  "termsAgreed",
  "privacyAcknowledged",
  "conductAgreed",
  "marketingOptIn"
] as const;

/** Converts untrusted JSON into the exact client/server validation contract. */
export function parseApplicationDraft(input: unknown): ApplicationDraft | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const draft = { ...emptyDraft };

  for (const field of textFields) {
    if (typeof source[field] !== "string") return null;
    draft[field] = source[field];
  }
  for (const field of booleanFields) {
    if (typeof source[field] !== "boolean") return null;
    draft[field] = source[field];
  }
  return draft;
}

export function normalizedDraft(draft: ApplicationDraft): ApplicationDraft {
  return {
    ...draft,
    fullName: draft.fullName.trim(),
    email: draft.email.trim().toLowerCase(),
    phone: draft.phone.trim(),
    country: draft.country.trim(),
    city: draft.city.trim(),
    age: draft.age.trim(),
    whyNow: draft.whyNow.trim(),
    values: draft.values.trim(),
    lifestyle: draft.lifestyle.trim(),
    interests: draft.interests.trim(),
    preferences: draft.preferences.trim(),
    nonNegotiables: draft.nonNegotiables.trim()
  };
}
