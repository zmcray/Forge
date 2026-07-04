// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
  resetRateLimiter,
} from "../../api/_lib/rateLimit.js";

describe("api/_lib/rateLimit", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("allows requests under the limit", () => {
    for (let i = 0; i < 20; i += 1) {
      expect(checkRateLimit("1.1.1.1", { now: 1000 }).ok).toBe(true);
    }
  });

  it("blocks the request over the limit with a retry hint", () => {
    for (let i = 0; i < 20; i += 1) checkRateLimit("1.1.1.1", { now: 1000 });
    const result = checkRateLimit("1.1.1.1", { now: 1000 });
    expect(result.ok).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks buckets per IP independently", () => {
    for (let i = 0; i < 20; i += 1) checkRateLimit("1.1.1.1", { now: 1000 });
    expect(checkRateLimit("1.1.1.1", { now: 1000 }).ok).toBe(false);
    expect(checkRateLimit("2.2.2.2", { now: 1000 }).ok).toBe(true);
  });

  it("refills tokens over time", () => {
    for (let i = 0; i < 20; i += 1) checkRateLimit("1.1.1.1", { now: 1000 });
    expect(checkRateLimit("1.1.1.1", { now: 1000 }).ok).toBe(false);
    // A full window later the bucket is full again.
    expect(checkRateLimit("1.1.1.1", { now: 61_000 }).ok).toBe(true);
  });

  it("respects a custom limit", () => {
    expect(checkRateLimit("1.1.1.1", { limit: 1, now: 1000 }).ok).toBe(true);
    expect(checkRateLimit("1.1.1.1", { limit: 1, now: 1000 }).ok).toBe(false);
  });

  it("derives the client IP from the first x-forwarded-for hop", () => {
    const req = new Request("http://localhost/api/chat", {
      headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.9");
  });

  it("falls back to unknown without forwarding headers", () => {
    const req = new Request("http://localhost/api/chat");
    expect(getClientIp(req)).toBe("unknown");
  });

  it("rateLimitResponse returns a 429 Response with Retry-After when limited", async () => {
    const req = new Request("http://localhost/api/chat", {
      headers: { "x-forwarded-for": "203.0.113.10" },
    });
    for (let i = 0; i < 20; i += 1) expect(rateLimitResponse(req)).toBeNull();
    const res = rateLimitResponse(req);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    const data = await res.json();
    expect(data.error).toContain("Too many requests");
  });
});
