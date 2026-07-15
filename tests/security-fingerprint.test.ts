import assert from "node:assert/strict";
import test from "node:test";
import { privacyFingerprint, requestFingerprint } from "../lib/security/fingerprint";

const SECRET = "0123456789abcdef0123456789abcdef";

test("privacy fingerprints are stable and normalized", () => {
  assert.equal(
    privacyFingerprint(SECRET, " Applicant@Example.com "),
    privacyFingerprint(SECRET, "applicant@example.com")
  );
});

test("privacy fingerprints change with a different secret", () => {
  assert.notEqual(
    privacyFingerprint(SECRET, "applicant@example.com"),
    privacyFingerprint("abcdef0123456789abcdef0123456789", "applicant@example.com")
  );
});

test("request fingerprints do not expose the source address", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.7, 10.0.0.1",
    "user-agent": "test-agent"
  });
  const fingerprint = requestFingerprint(headers, SECRET);
  assert.equal(fingerprint.length, 64);
  assert.equal(fingerprint.includes("203.0.113.7"), false);
});
