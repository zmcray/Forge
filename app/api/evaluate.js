import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const VALID_TYPES = ["risk", "diagnostic", "thesis"];
const MAX_FIELD_LENGTH = 5000;

const feedbackSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
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

export async function POST(request) {
  // Skip auth check in dev (no FORGE_AUTH_TOKEN configured)
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

  const { userAnswer, modelAnswer, questionText, questionType, companyContext } =
    body;

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
    const response = await client.messages.create({
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
        format: { type: "json_schema", schema: feedbackSchema },
      },
    });

    const feedback = JSON.parse(response.content[0].text);
    return Response.json(feedback);
  } catch (err) {
    console.error("Evaluation failed:", err.message);
    return Response.json({ error: "Evaluation unavailable" }, { status: 502 });
  }
}
