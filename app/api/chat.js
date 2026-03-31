import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const MAX_MESSAGES = 20;
const MAX_SYSTEM_PROMPT_LENGTH = 5000;
const MAX_MESSAGE_LENGTH = 2000;

export const config = { maxDuration: 30 };

export async function POST(request) {
  // Auth check (same pattern as evaluate.js)
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

  const { messages, systemPrompt } = body;

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
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ error: "Message too long" }, { status: 400 });
    }
  }
  if (!systemPrompt || typeof systemPrompt !== "string" || systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
    return Response.json({ error: "Invalid systemPrompt" }, { status: 400 });
  }

  const stream = getClient().messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    signal: request.signal,
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
