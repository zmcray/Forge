// Shared SSE chat contract fixture (MCR-468).
//
// api/chat.js emits `data: {json}\n\n` frames with type "delta" | "done" |
// "error", and maps upstream 429s to a specific user-facing message. Both the
// server tests (apiChat.test.js) and the client tests (ChatDrawerAdvanced.test.jsx)
// build their expected/mocked frames from THIS module, so renaming an event
// type or error message on either side of the wire breaks tests on both sides.

export const SSE_EVENT_TYPES = {
  DELTA: "delta",
  DONE: "done",
  ERROR: "error",
};

export const CHAT_ERROR_MESSAGES = {
  rateLimited: "Too many requests. Wait a moment and try again.",
  unavailable: "Chat unavailable",
};

export const deltaFrame = text =>
  `data: ${JSON.stringify({ type: SSE_EVENT_TYPES.DELTA, text })}\n\n`;

export const doneFrame = () =>
  `data: ${JSON.stringify({ type: SSE_EVENT_TYPES.DONE })}\n\n`;

export const errorFrame = message =>
  `data: ${JSON.stringify({ type: SSE_EVENT_TYPES.ERROR, message })}\n\n`;

// Drain a Response SSE body to its raw string, exactly as sent on the wire.
export async function readSSEBody(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    raw += decoder.decode(value, { stream: true });
  }
  return raw;
}
