"use client";

import { FormEvent, useState } from "react";

export default function StaffSignInPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/staff/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const body = (await response.json()) as { error?: string };
      setMessage(response.ok ? "If that address belongs to active staff, a sign-in link is on its way." : body.error || "Unable to request a sign-in link.");
    } catch {
      setMessage("Unable to request a sign-in link. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 620 }}>
        <p className="eyebrow">Staff access</p>
        <h1>Sign in to the internal console.</h1>
        <p className="lede">Use your active staff email address. Access is role-restricted and activity is recorded.</p>
        <form className="form-shell" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="staff-email">Work email</label>
            <input id="staff-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          {message ? <p className="notice" role="status">{message}</p> : null}
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send sign-in link"}</button>
        </form>
      </div>
    </section>
  );
}
