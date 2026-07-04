import { describe, it, expect, vi, beforeEach } from "vitest";
import { forgeFetch, ApiError } from "./api";

const okJson = (data) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(data),
});

describe("forgeFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs JSON with content-type and x-forge-token headers", async () => {
    global.fetch = vi.fn().mockResolvedValue(okJson({ hello: "world" }));

    const result = await forgeFetch("/api/evaluate", { a: 1 });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("/api/evaluate");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers).toHaveProperty("x-forge-token");
    expect(JSON.parse(init.body)).toEqual({ a: 1 });
    expect(result).toEqual({ hello: "world" });
  });

  it("serializes an empty body when none is given", async () => {
    global.fetch = vi.fn().mockResolvedValue(okJson({}));
    await forgeFetch("/api/generate");
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({});
  });

  it("throws ApiError with the parsed {error} body message on non-ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.resolve({ error: "Upstream sad" }),
    });

    const err = await forgeFetch("/api/generate", {}).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.name).toBe("ApiError");
    expect(err.status).toBe(502);
    expect(err.message).toBe("Upstream sad");
  });

  it("falls back to a status message when the error body is unparseable", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("not json")),
    });

    const err = await forgeFetch("/api/evaluate", {}).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(500);
    expect(err.message).toBe("Request failed (500)");
  });

  it("uses the caller's fallbackError when the body has no error message", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: () => Promise.resolve({}),
    });

    const err = await forgeFetch("/api/chat", {}, { fallbackError: "Chat unavailable" }).catch(
      (e) => e
    );
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe("Chat unavailable");
  });

  it("prefers the server {error} message over fallbackError", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: "Too many requests" }),
    });

    const err = await forgeFetch("/api/chat", {}, { fallbackError: "Chat unavailable" }).catch(
      (e) => e
    );
    expect(err.message).toBe("Too many requests");
    expect(err.status).toBe(429);
  });

  it("stream: true returns the raw Response on ok without consuming the body", async () => {
    const res = { ok: true, status: 200, body: {}, json: vi.fn() };
    global.fetch = vi.fn().mockResolvedValue(res);

    const result = await forgeFetch("/api/chat", {}, { stream: true });
    expect(result).toBe(res);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("stream: true still throws ApiError on non-ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: "Unauthorized" }),
    });

    const err = await forgeFetch("/api/chat", {}, { stream: true }).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(401);
  });

  it("passes a timeout signal when timeoutMs is set", async () => {
    global.fetch = vi.fn().mockResolvedValue(okJson({}));
    await forgeFetch("/api/evaluate", {}, { timeoutMs: 15000 });
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it("passes the caller signal through when no timeout is set", async () => {
    global.fetch = vi.fn().mockResolvedValue(okJson({}));
    const controller = new AbortController();
    await forgeFetch("/api/generate", {}, { signal: controller.signal });
    expect(fetch.mock.calls[0][1].signal).toBe(controller.signal);
  });

  it("composes caller signal and timeout: caller abort still aborts", async () => {
    global.fetch = vi.fn().mockResolvedValue(okJson({}));
    const controller = new AbortController();
    await forgeFetch("/api/evaluate", {}, { signal: controller.signal, timeoutMs: 60000 });
    const signal = fetch.mock.calls[0][1].signal;
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal).not.toBe(controller.signal);
    expect(signal.aborted).toBe(false);
    controller.abort();
    expect(signal.aborted).toBe(true);
  });

  it("sends no signal when neither signal nor timeoutMs is provided", async () => {
    global.fetch = vi.fn().mockResolvedValue(okJson({}));
    await forgeFetch("/api/chat", {});
    expect(fetch.mock.calls[0][1].signal).toBeUndefined();
  });
});
