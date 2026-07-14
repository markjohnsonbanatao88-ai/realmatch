type LimitWindow = { count: number; resetsAt: number };

const windows = new Map<string, LimitWindow>();

/**
 * A conservative local fallback. It deliberately does not claim to be a
 * distributed production rate limiter; production deployment must enforce an
 * equivalent limit at the edge or through a shared store.
 */
export function takeRateLimit(key: string, limit = 3, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetsAt <= now) {
    windows.set(key, { count: 1, resetsAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetsAt - now) / 1000))
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function requestClientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  const address = headers.get("x-real-ip") || forwarded?.split(",")[0]?.trim() || "unknown";
  return `application:${address}`;
}
