import Anthropic from "@anthropic-ai/sdk";
import { rateLimitResponse } from "./_lib/rateLimit.js";
import { buildChatSystemPrompt, ChatValidationError } from "./_lib/chatPrompt.js";

// Case-insensitive env lookup (Vercel dashboard may have non-standard casing)
function getEnv(name) {
  if (process.env[name]) return process.env[name];
  const lower = name.toLowerCase();
  const key = Object.keys(process.env).find(k => k.toLowerCase() === lower);
  return key ? process.env[key] : undefined;
}

function getClient() {
  return new Anthropic({ apiKey: getEnv("ANTHROPIC_API_KEY") });
}

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

export const config = { maxDuration: 30 };

export async function POST(request) {
  // Best-effort per-instance rate limit; Vercel WAF is the stronger layer.
  const limited = rateLimitResponse(request);
  if (limited) return limited;

  // Optional shared-token gate (same pattern as evaluate.js). Note this is
  // obfuscation, not auth: the matching VITE_FORGE_AUTH_TOKEN ships in the
  // public client bundle, so anyone can read it out of the deployed JS.
  // Use exact match here -- gate is opt-in and client/server must agree on casing.
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

  const { messages, mode, params } = body;

  // MCR-390: system prompts are assembled server-side from `mode` + `params`.
  // Reject any client attempting to supply its own prompt.
  if ("systemPrompt" in body) {
    return Response.json(
      { error: "systemPrompt is not accepted; send mode and params" },
      { status: 400 }
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Invalid messages" }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Too many messages" }, { status: 400 });
  }
  for (const msg of messages) {
    if (!msg.role || !msg.content || typeof msg.content !== "string") {
      return Response.json({ error: "Invalid message format" }, { status: 400 });
    }
    if (msg.role !== "user" && msg.role !== "assistant") {
      return Response.json({ error: "Invalid message role" }, { status: 400 });
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ error: "Message too long" }, { status: 400 });
    }
  }

  let systemPrompt;
  try {
    systemPrompt = buildChatSystemPrompt({ mode, params, messageCount: messages.length });
  } catch (err) {
    if (err instanceof ChatValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("Chat prompt assembly failed:", err);
    return Response.json({ error: "Chat unavailable" }, { status: 500 });
  }

  const stream = getClient().messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta?.text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "delta", text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch (err) {
        if (err.name !== "AbortError") {
          const message = err.status === 429
            ? "Too many requests. Wait a moment and try again."
            : "Chat unavailable";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`)
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
