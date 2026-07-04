// Lightweight per-IP token-bucket rate limiter shared by the API endpoints.
//
// IMPORTANT: this is in-memory and therefore per-serverless-instance,
// best-effort protection only. On Vercel, concurrent invocations may land on
// different instances with independent buckets, and instances recycle. It
// raises the cost of casual abuse (free-Claude-proxy scraping, MCR-390) but is
// not a hard guarantee; Vercel WAF rate-limiting rules are the stronger,
// platform-level layer for that.

const DEFAULT_LIMIT = 20; // requests
const DEFAULT_WINDOW_MS = 60_000; // per minute
const MAX_BUCKETS = 10_000; // memory cap; oldest-seen entries evicted

const buckets = new Map();

// First hop of x-forwarded-for is the client IP as seen by Vercel's edge.
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}

// Token bucket: `limit` tokens refilled continuously over `windowMs`.
// Returns { ok: true } or { ok: false, retryAfterSeconds }.
export function checkRateLimit(ip, { limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS, now = Date.now() } = {}) {
  let bucket = buckets.get(ip);
  const refillRate = limit / windowMs; // tokens per ms

  if (!bucket) {
    if (buckets.size >= MAX_BUCKETS) {
      // Evict the oldest entry (Map preserves insertion order).
      buckets.delete(buckets.keys().next().value);
    }
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(ip, bucket);
  } else {
    bucket.tokens = Math.min(limit, bucket.tokens + (now - bucket.lastRefill) * refillRate);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { ok: true };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((1 - bucket.tokens) / refillRate / 1000));
  return { ok: false, retryAfterSeconds };
}

// Convenience: run the check against a Request and return a 429 Response
// (with Retry-After) when limited, or null when the request may proceed.
export function rateLimitResponse(request, options) {
  const result = checkRateLimit(getClientIp(request), options);
  if (result.ok) return null;
  return Response.json(
    { error: "Too many requests. Wait a moment and try again." },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } }
  );
}

// Test hook.
export function resetRateLimiter() {
  buckets.clear();
}
