// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the Anthropic SDK before importing the module
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = {
        stream: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]() {
            let done = false;
            return {
              next() {
                if (!done) {
                  done = true;
                  return Promise.resolve({
                    value: { type: "content_block_delta", delta: { text: "Hello" } },
                    done: false,
                  });
                }
                return Promise.resolve({ done: true, value: undefined });
              },
            };
          },
        }),
      };
    },
  };
});

describe("api/chat", () => {
  let POST;

  beforeEach(async () => {
    // Clear module cache to get fresh env each test
    vi.resetModules();
    delete process.env.FORGE_AUTH_TOKEN;
    const mod = await import("../../api/chat.js");
    POST = mod.POST;
  });

  afterEach(() => {
    delete process.env.FORGE_AUTH_TOKEN;
  });

  function makeRequest(body, headers = {}) {
    return new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  }

  it("returns 400 when messages array is missing", async () => {
    const req = makeRequest({ systemPrompt: "test" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("messages");
  });

  it("returns 400 when messages is not an array", async () => {
    const req = makeRequest({ messages: "not-array", systemPrompt: "test" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when messages exceed max limit", async () => {
    const messages = Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `msg ${i}`,
    }));
    const req = makeRequest({ messages, systemPrompt: "test" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("messages");
  });

  it("returns 400 when systemPrompt exceeds max length", async () => {
    const req = makeRequest({
      messages: [{ role: "user", content: "hi" }],
      systemPrompt: "x".repeat(5001),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("systemPrompt");
  });

  it("returns 400 when systemPrompt is missing", async () => {
    const req = makeRequest({
      messages: [{ role: "user", content: "hi" }],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 401 when auth token is configured but not provided", async () => {
    process.env.FORGE_AUTH_TOKEN = "secret-token";
    // Re-import to pick up env change
    vi.resetModules();
    const mod = await import("../../api/chat.js");

    const req = makeRequest(
      { messages: [{ role: "user", content: "hi" }], systemPrompt: "test" },
      {}
    );
    const res = await mod.POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 when auth token is wrong", async () => {
    process.env.FORGE_AUTH_TOKEN = "secret-token";
    vi.resetModules();
    const mod = await import("../../api/chat.js");

    const req = makeRequest(
      { messages: [{ role: "user", content: "hi" }], systemPrompt: "test" },
      { "x-forge-token": "wrong-token" }
    );
    const res = await mod.POST(req);
    expect(res.status).toBe(401);
  });

  it("passes auth when correct token is provided", async () => {
    process.env.FORGE_AUTH_TOKEN = "secret-token";
    vi.resetModules();
    const mod = await import("../../api/chat.js");

    const req = makeRequest(
      { messages: [{ role: "user", content: "hi" }], systemPrompt: "test" },
      { "x-forge-token": "secret-token" }
    );
    const res = await mod.POST(req);
    // Should return 200 SSE stream, not 401
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
  });

  it("skips auth check when no FORGE_AUTH_TOKEN is configured", async () => {
    const req = makeRequest({
      messages: [{ role: "user", content: "hi" }],
      systemPrompt: "test",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
  });

  it("returns SSE stream with correct headers", async () => {
    const req = makeRequest({
      messages: [{ role: "user", content: "hi" }],
      systemPrompt: "test",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    expect(res.headers.get("Cache-Control")).toBe("no-cache");
  });

  it("exports maxDuration config", async () => {
    const mod = await import("../../api/chat.js");
    expect(mod.config.maxDuration).toBe(30);
  });
});
