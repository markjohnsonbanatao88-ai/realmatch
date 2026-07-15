import { createHmac } from "node:crypto";

export function privacyFingerprint(secret: string, value: string): string {
  if (secret.length < 32) {
    throw new Error("APPLICATION_HASH_SECRET must contain at least 32 characters.");
  }
  return createHmac("sha256", secret).update(value.trim().toLowerCase()).digest("hex");
}

export function requestFingerprint(headers: Headers, secret: string): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = headers.get("x-real-ip") || forwarded || "unknown";
  const userAgent = headers.get("user-agent") || "unknown";
  return privacyFingerprint(secret, `${address}|${userAgent}`);
}
