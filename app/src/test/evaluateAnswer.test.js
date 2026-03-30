import { describe, it, expect, vi, beforeEach } from "vitest";
import { evaluateAnswer } from "../utils/evaluateAnswer";

describe("evaluateAnswer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends POST request with correct payload", async () => {
    const mockResponse = { score: 4, strengths: ["Good"], gaps: [], suggestion: null };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await evaluateAnswer({
      userAnswer: "My analysis here",
      modelAnswer: "Model answer here",
      questionText: "What is the EBITDA margin?",
      questionType: "diagnostic",
      companyContext: "Summit HVAC",
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const call = fetch.mock.calls[0];
    expect(call[0]).toBe("/api/evaluate");
    expect(call[1].method).toBe("POST");

    const body = JSON.parse(call[1].body);
    expect(body.userAnswer).toBe("My analysis here");
    expect(body.modelAnswer).toBe("Model answer here");
    expect(body.questionText).toBe("What is the EBITDA margin?");
    expect(body.questionType).toBe("diagnostic");
    expect(body.companyContext).toBe("Summit HVAC");

    expect(result).toEqual(mockResponse);
  });

  it("rejects on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(
      evaluateAnswer({
        userAnswer: "test",
        modelAnswer: "test",
        questionText: "test",
        questionType: "diagnostic",
      })
    ).rejects.toBe(500);
  });

  it("includes auth header", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ score: 3, strengths: [], gaps: [], suggestion: null }),
    });

    await evaluateAnswer({
      userAnswer: "test",
      modelAnswer: "test",
      questionText: "test",
      questionType: "diagnostic",
    });

    const headers = fetch.mock.calls[0][1].headers;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers).toHaveProperty("x-forge-token");
  });
});
