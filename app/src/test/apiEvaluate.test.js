// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockParse, mockJsonSchemaOutputFormat } = vi.hoisted(() => ({
  mockParse: vi.fn(),
  mockJsonSchemaOutputFormat: vi.fn((schema) => ({ type: "json_schema", schema })),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = {
      parse: mockParse,
    };
  },
}));

vi.mock("@anthropic-ai/sdk/helpers/json-schema", () => ({
  jsonSchemaOutputFormat: mockJsonSchemaOutputFormat,
}));

function makeRequest(body, headers = {}) {
  return new Request("http://localhost/api/evaluate", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const validBody = {
  userAnswer:
    "Customer concentration is the primary risk because the top account is 35% of revenue.",
  modelAnswer: "The key risk is customer concentration, plus contract renewal quality.",
  questionText: "What are the key risks?",
  questionType: "risk",
  companyContext: "Coastal Fresh Foods",
};

const validFeedback = {
  score: 4,
  strengths: ["Identified customer concentration"],
  gaps: ["Could discuss contract renewal terms"],
  suggestion: "Quantify the exposure and name the diligence item.",
};

describe("api/evaluate", () => {
  let POST;

  beforeEach(async () => {
    vi.resetModules();
    mockParse.mockReset();
    mockJsonSchemaOutputFormat.mockClear();
    delete process.env.FORGE_AUTH_TOKEN;
    delete process.env.ANTHROPIC_API_KEY;
    const mod = await import("../../api/evaluate.js");
    POST = mod.POST;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.FORGE_AUTH_TOKEN;
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("returns 429 with Retry-After after a per-IP burst", async () => {
    mockParse.mockResolvedValue({ parsed_output: validFeedback });
    let lastRes;
    for (let i = 0; i < 21; i += 1) {
      lastRes = await POST(makeRequest(validBody, { "x-forwarded-for": "203.0.113.50" }));
    }
    expect(lastRes.status).toBe(429);
    expect(Number(lastRes.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("returns parsed structured feedback for a valid qualitative answer", async () => {
    mockParse.mockResolvedValueOnce({ parsed_output: validFeedback });

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(validFeedback);
    expect(mockJsonSchemaOutputFormat).toHaveBeenCalledOnce();
    expect(mockParse).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-haiku-4-5",
        messages: [
          expect.objectContaining({
            role: "user",
            content: expect.stringContaining(validBody.questionText),
          }),
        ],
        output_config: expect.objectContaining({ format: expect.any(Object) }),
      }),
    );
  });

  it("returns 400 for quantitative question types", async () => {
    const res = await POST(makeRequest({ ...validBody, questionType: "metric" }));

    expect(res.status).toBe(400);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it("returns 400 for oversized questionText", async () => {
    const res = await POST(
      makeRequest({ ...validBody, questionText: "q".repeat(5001) }),
    );

    expect(res.status).toBe(400);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it("returns 400 for non-string companyContext", async () => {
    const res = await POST(makeRequest({ ...validBody, companyContext: { name: "x" } }));

    expect(res.status).toBe(400);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it("returns 400 for oversized companyContext", async () => {
    const res = await POST(
      makeRequest({ ...validBody, companyContext: "c".repeat(501) }),
    );

    expect(res.status).toBe(400);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it("accepts a request with companyContext omitted", async () => {
    mockParse.mockResolvedValueOnce({ parsed_output: validFeedback });
    const { companyContext: _omit, ...bodyWithoutContext } = validBody;

    const res = await POST(makeRequest(bodyWithoutContext));

    expect(res.status).toBe(200);
  });

  it("returns 401 when auth token is configured but missing", async () => {
    process.env.FORGE_AUTH_TOKEN = "secret-token";

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(401);
    expect(mockParse).not.toHaveBeenCalled();
  });

  it("returns 502 when parsed feedback has an invalid shape", async () => {
    mockParse.mockResolvedValueOnce({
      parsed_output: { ...validFeedback, score: 6 },
    });

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("Evaluation unavailable");
  });
});
