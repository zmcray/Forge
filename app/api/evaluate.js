import Anthropic from "@anthropic-ai/sdk";
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import { rateLimitResponse } from "./_lib/rateLimit.js";

// Case-insensitive env lookup (Vercel dashboard may have non-standard casing)
function getEnv(name) {
  if (process.env[name]) return process.env[name];
  const lower = name.toLowerCase();
  const key = Object.keys(process.env).find((k) => k.toLowerCase() === lower);
  return key ? process.env[key] : undefined;
}

function getClient() {
  return new Anthropic({ apiKey: getEnv("ANTHROPIC_API_KEY") });
}

const VALID_TYPES = ["risk", "diagnostic", "thesis"];
const MAX_FIELD_LENGTH = 5000;

const feedbackSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      description:
        "1=way off, 2=significant gaps, 3=partial/right direction, 4=solid with minor gaps, 5=comprehensive",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description:
        "Key concepts the user correctly identified or analyzed well (2-4 items)",
    },
    gaps: {
      type: "array",
      items: { type: "string" },
      description:
        "Important concepts missed or areas needing deeper analysis (1-3 items)",
    },
    suggestion: {
      type: "string",
      description: "One actionable sentence on what to focus on next time",
    },
  },
  required: ["score", "strengths", "gaps", "suggestion"],
  additionalProperties: false,
};

export const config = { maxDuration: 30 };

function validateFeedback(feedback) {
  if (!feedback || typeof feedback !== "object" || Array.isArray(feedback)) {
    throw new Error("Invalid feedback shape");
  }
  if (!Number.isInteger(feedback.score) || feedback.score < 1 || feedback.score > 5) {
    throw new Error("Invalid feedback score");
  }
  if (
    !Array.isArray(feedback.strengths) ||
    !feedback.strengths.every((item) => typeof item === "string")
  ) {
    throw new Error("Invalid feedback strengths");
  }
  if (
    !Array.isArray(feedback.gaps) ||
    !feedback.gaps.every((item) => typeof item === "string")
  ) {
    throw new Error("Invalid feedback gaps");
  }
  if (typeof feedback.suggestion !== "string") {
    throw new Error("Invalid feedback suggestion");
  }
  return feedback;
}

export async function POST(request) {
  // Best-effort per-instance rate limit; Vercel WAF is the stronger layer.
  const limited = rateLimitResponse(request);
  if (limited) return limited;

  // Skip token gate in dev (no FORGE_AUTH_TOKEN configured). Note this is
  // obfuscation, not auth: the matching VITE_FORGE_AUTH_TOKEN ships in the
  // public client bundle.
  // Use exact match here -- gate is opt-in and client/server must agree on casing
  if (process.env.FORGE_AUTH_TOKEN) {
    const token = request.headers.get("x-forge-token");
    if (token !== process.env.FORGE_AUTH_TOKEN) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userAnswer, modelAnswer, questionText, questionType, companyContext } = body;

  if (
    !userAnswer ||
    typeof userAnswer !== "string" ||
    userAnswer.length > MAX_FIELD_LENGTH
  ) {
    return Response.json({ error: "Invalid userAnswer" }, { status: 400 });
  }
  if (
    !modelAnswer ||
    typeof modelAnswer !== "string" ||
    modelAnswer.length > MAX_FIELD_LENGTH
  ) {
    return Response.json({ error: "Invalid modelAnswer" }, { status: 400 });
  }
  if (!questionText || typeof questionText !== "string") {
    return Response.json({ error: "Invalid questionText" }, { status: 400 });
  }
  if (!VALID_TYPES.includes(questionType)) {
    return Response.json({ error: "Invalid questionType" }, { status: 400 });
  }

  try {
    const response = await getClient().messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: "You are evaluating a PE deal analysis trainee's answer. Compare the user's answer against the model answer. Be constructive but honest. Score 1-5 where 3 means 'right direction with notable gaps' and 5 means 'comprehensive, could present this in a deal memo.'",
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Question type: ${questionType}\nCompany: ${companyContext || "N/A"}\n\nQuestion: ${questionText}\n\nModel Answer: ${modelAnswer}\n\nUser's Answer: ${userAnswer}`,
        },
      ],
      output_config: {
        format: jsonSchemaOutputFormat(feedbackSchema),
      },
    });

    const feedback = validateFeedback(response.parsed_output);
    return Response.json(feedback);
  } catch (err) {
    console.error("Evaluation failed:", err);
    return Response.json({ error: "Evaluation unavailable" }, { status: 502 });
  }
}
