"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  ApplicationDraft,
  FieldErrors,
  emptyDraft,
  previewDraft,
  relationshipGoalLabels,
  timelineLabels,
  validateStep
} from "@/lib/validation/application";
import { serviceConfig } from "@/lib/config/site";

const STEP_TITLES = [
  "Basic details",
  "Relationship goals",
  "Lifestyle and values",
  "Preferences and non-negotiables",
  "Privacy, terms, and consent",
  "Review and submit"
];

const FIELD_LABELS: Partial<Record<keyof ApplicationDraft, string>> = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  country: "Country of residence",
  city: "City or region",
  age: "Age",
  relationshipGoal: "What you are looking for",
  timeline: "Your readiness",
  whyNow: "Why now",
  values: "Values",
  lifestyle: "Day-to-day life",
  interests: "Interests",
  preferences: "The person you hope to meet",
  nonNegotiables: "Non-negotiables",
  ageConfirmed: "Age confirmation",
  truthfulInfo: "Truthful information",
  termsAgreed: "Terms of Service",
  privacyAcknowledged: "Privacy Notice",
  conductAgreed: "Conduct standards"
};

export function ApplicationForm() {
  const acceptsApplications = serviceConfig.applicationsEnabled;
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ApplicationDraft>(() =>
    acceptsApplications ? emptyDraft : previewDraft
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const idempotencyKeyRef = useRef<string | null>(null);

  const totalSteps = STEP_TITLES.length;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!acceptsApplications) return;
    const stored = window.sessionStorage.getItem("real-match-application-draft");
    if (!stored) return;

    let restored: ApplicationDraft;
    try {
      const parsed = JSON.parse(stored) as ApplicationDraft;
      restored = { ...emptyDraft, ...parsed };
    } catch {
      window.sessionStorage.removeItem("real-match-application-draft");
      return;
    }

    const frame = window.requestAnimationFrame(() => setDraft(restored));
    return () => window.cancelAnimationFrame(frame);
  }, [acceptsApplications]);

  useEffect(() => {
    if (acceptsApplications && !submitted) {
      window.sessionStorage.setItem("real-match-application-draft", JSON.stringify(draft));
    }
  }, [acceptsApplications, draft, submitted]);

  function set<K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function focusField(name: string) {
    document.getElementById(`field-${name}`)?.focus();
  }

  function goNext() {
    const stepErrors = validateStep(step, draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      summaryRef.current?.focus();
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, totalSteps));
  }

  function goBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < totalSteps) {
      goNext();
      return;
    }
    if (!acceptsApplications) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const idempotencyKey = idempotencyKeyRef.current ?? crypto.randomUUID();
      idempotencyKeyRef.current = idempotencyKey;
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, idempotencyKey })
      });
      const payload = (await response.json()) as {
        error?: string;
        reference?: string;
        fieldErrors?: FieldErrors;
      };
      if (!response.ok) {
        if (payload.fieldErrors) {
          setErrors(payload.fieldErrors);
          summaryRef.current?.focus();
        }
        setSubmissionError(payload.error || "We could not submit your application. Please try again.");
        return;
      }
      setReference(payload.reference || null);
      window.sessionStorage.removeItem("real-match-application-draft");
      setSubmitted(true);
    } catch {
      setSubmissionError("We could not submit your application. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="confirmation-panel" aria-live="polite">
        <h2>Thank you for walking through the application</h2>
        {acceptsApplications ? (
          <>
            <p>Your application has been received. Your reference is <strong>{reference}</strong>.</p>
            <p>Keep this reference for your records. We will only make contact through the details you provided.</p>
          </>
        ) : (
          <>
            <p>
              Real Match is in private preview, so <strong>nothing you entered has been
              saved or sent anywhere</strong> — the form is a demonstration of the real
              application experience.
            </p>
            <p>When applications open, this page will say so clearly before asking for personal information.</p>
          </>
        )}
        <Link className="text-link" href="/">
          Return home
        </Link>
      </section>
    );
  }

  return (
    <form className="application-form" onSubmit={handleSubmit} noValidate>
      <div className="form-progress" aria-label={`Step ${step} of ${totalSteps}`}>
        <span>Step {step} of {totalSteps}</span>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      <p ref={headingRef} className="form-step-title" tabIndex={-1}>
        {STEP_TITLES[step - 1]}
      </p>

      <ErrorSummary errors={errors} summaryRef={summaryRef} onSelect={focusField} />
      {submissionError ? <p className="field-error" role="alert">{submissionError}</p> : null}

      {step === 1 ? (
        <div className="form-grid two-column">
          <TextField label="Full name" name="fullName" value={draft.fullName} error={errors.fullName} autoComplete="name" onChange={(value) => set("fullName", value)} />
          <TextField label="Email" name="email" type="email" value={draft.email} error={errors.email} autoComplete="email" onChange={(value) => set("email", value)} />
          <TextField label="Phone" name="phone" type="tel" value={draft.phone} error={errors.phone} autoComplete="tel" onChange={(value) => set("phone", value)} />
          <TextField label="Age" name="age" type="number" value={draft.age} error={errors.age} autoComplete="off" onChange={(value) => set("age", value)} />
          <TextField label="Country of residence" name="country" value={draft.country} error={errors.country} autoComplete="country-name" onChange={(value) => set("country", value)} />
          <TextField label="City or region" name="city" value={draft.city} error={errors.city} autoComplete="address-level2" onChange={(value) => set("city", value)} />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="form-grid">
          <SelectField label="What are you looking for?" name="relationshipGoal" value={draft.relationshipGoal} error={errors.relationshipGoal} options={relationshipGoalLabels} onChange={(value) => set("relationshipGoal", value)} />
          <SelectField label="How ready are you?" name="timeline" value={draft.timeline} error={errors.timeline} options={timelineLabels} onChange={(value) => set("timeline", value)} />
          <TextAreaField label="Why does a serious relationship matter to you now?" name="whyNow" value={draft.whyNow} error={errors.whyNow} onChange={(value) => set("whyNow", value)} />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="form-grid">
          <TextAreaField label="What values guide your life?" name="values" value={draft.values} error={errors.values} onChange={(value) => set("values", value)} />
          <TextAreaField label="Describe your day-to-day life" name="lifestyle" value={draft.lifestyle} error={errors.lifestyle} onChange={(value) => set("lifestyle", value)} />
          <TextAreaField label="What interests and activities matter to you?" name="interests" value={draft.interests} error={errors.interests} onChange={(value) => set("interests", value)} />
        </div>
      ) : null}

      {step === 4 ? (
        <div className="form-grid">
          <TextAreaField label="Who do you hope to meet?" name="preferences" value={draft.preferences} error={errors.preferences} onChange={(value) => set("preferences", value)} />
          <TextAreaField label="What are your non-negotiables?" name="nonNegotiables" value={draft.nonNegotiables} error={errors.nonNegotiables} onChange={(value) => set("nonNegotiables", value)} />
        </div>
      ) : null}

      {step === 5 ? (
        <div className="consent-list">
          <CheckboxField name="ageConfirmed" checked={draft.ageConfirmed} error={errors.ageConfirmed} onChange={(checked) => set("ageConfirmed", checked)}>I confirm that I am at least 18 years old.</CheckboxField>
          <CheckboxField name="truthfulInfo" checked={draft.truthfulInfo} error={errors.truthfulInfo} onChange={(checked) => set("truthfulInfo", checked)}>I confirm that the information I provided is truthful.</CheckboxField>
          <CheckboxField name="termsAgreed" checked={draft.termsAgreed} error={errors.termsAgreed} onChange={(checked) => set("termsAgreed", checked)}>I agree to the <Link href="/terms">Terms of Service</Link>.</CheckboxField>
          <CheckboxField name="privacyAcknowledged" checked={draft.privacyAcknowledged} error={errors.privacyAcknowledged} onChange={(checked) => set("privacyAcknowledged", checked)}>I acknowledge the <Link href="/privacy">Privacy Notice</Link>.</CheckboxField>
          <CheckboxField name="conductAgreed" checked={draft.conductAgreed} error={errors.conductAgreed} onChange={(checked) => set("conductAgreed", checked)}>I agree to the <Link href="/safety">member conduct standards</Link>.</CheckboxField>
          <CheckboxField name="marketingOptIn" checked={draft.marketingOptIn} onChange={(checked) => set("marketingOptIn", checked)}>I would like occasional launch and service updates. This is optional.</CheckboxField>
        </div>
      ) : null}

      {step === 6 ? <Review draft={draft} /> : null}

      <div className="form-actions">
        {step > 1 ? (
          <button className="button secondary" type="button" onClick={goBack} disabled={isSubmitting}>
            Back
          </button>
        ) : <span />}
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {step < totalSteps
            ? "Continue"
            : isSubmitting
              ? "Submitting…"
              : acceptsApplications
                ? "Submit application"
                : "Complete preview"}
        </button>
      </div>
    </form>
  );
}

function ErrorSummary({ errors, summaryRef, onSelect }: { errors: FieldErrors; summaryRef: React.RefObject<HTMLDivElement | null>; onSelect: (name: string) => void }) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;
  return (
    <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
      <strong>Please correct the following:</strong>
      <ul>
        {entries.map(([name, message]) => (
          <li key={name}><button type="button" onClick={() => onSelect(name)}>{FIELD_LABELS[name as keyof ApplicationDraft] || name}: {message}</button></li>
        ))}
      </ul>
    </div>
  );
}

function TextField({ label, name, value, error, onChange, type = "text", autoComplete }: { label: string; name: keyof ApplicationDraft; value: string; error?: string; onChange: (value: string) => void; type?: string; autoComplete: string }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={String(name)} type={type} value={value} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)} />
      {error ? <small id={errorId} className="field-error">{error}</small> : null}
    </label>
  );
}

function TextAreaField({ label, name, value, error, onChange }: { label: string; name: keyof ApplicationDraft; value: string; error?: string; onChange: (value: string) => void }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} name={String(name)} value={value} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)} />
      {error ? <small id={errorId} className="field-error">{error}</small> : null}
    </label>
  );
}

function SelectField({ label, name, value, error, options, onChange }: { label: string; name: keyof ApplicationDraft; value: string; error?: string; options: Record<string, string>; onChange: (value: string) => void }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} name={String(name)} value={value} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)}>
        <option value="">Choose one</option>
        {Object.entries(options).map(([key, text]) => <option key={key} value={key}>{text}</option>)}
      </select>
      {error ? <small id={errorId} className="field-error">{error}</small> : null}
    </label>
  );
}

function CheckboxField({ name, checked, error, onChange, children }: { name: keyof ApplicationDraft; checked: boolean; error?: string; onChange: (checked: boolean) => void; children: ReactNode }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <div className="checkbox-field">
      <label htmlFor={id}>
        <input id={id} name={String(name)} type="checkbox" checked={checked} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.checked)} />
        <span>{children}</span>
      </label>
      {error ? <small id={errorId} className="field-error">{error}</small> : null}
    </div>
  );
}

function Review({ draft }: { draft: ApplicationDraft }) {
  const rows = [
    ["Name", draft.fullName],
    ["Email", draft.email],
    ["Phone", draft.phone],
    ["Location", `${draft.city}, ${draft.country}`],
    ["Age", draft.age],
    ["Relationship goal", relationshipGoalLabels[draft.relationshipGoal] || draft.relationshipGoal],
    ["Readiness", timelineLabels[draft.timeline] || draft.timeline],
    ["Why now", draft.whyNow],
    ["Values", draft.values],
    ["Lifestyle", draft.lifestyle],
    ["Interests", draft.interests],
    ["Preferences", draft.preferences],
    ["Non-negotiables", draft.nonNegotiables]
  ];
  return (
    <div className="review-list">
      {rows.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </div>
  );
}
