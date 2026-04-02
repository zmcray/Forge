---
title: Anthropic SDK .stream() Rejects signal Parameter Passed in Request Body
category: integration-issues
date: 2026-04-01
severity: high
tags: [anthropic-sdk, sse-streaming, vercel, serverless-functions, api-integration, parameter-validation]
affected_components: [app/api/chat.js]
resolution_type: parameter-removal
time_to_resolve: ~15 minutes
---

# Anthropic SDK .stream() Rejects signal Parameter Passed in Request Body

## Problem

The `/api/chat` SSE streaming endpoint returned "Chat unavailable" on every request in production (Vercel). The `/api/evaluate` endpoint (non-streaming) worked fine after a prior env var casing fix. The chat endpoint's generic error handler swallowed the real error, making it appear as if the API key or network was the issue.

## Investigation Steps

1. Confirmed `/api/evaluate` was working after fixing environment variable casing, ruling out API key or SDK initialization issues
2. `/api/chat` still failed with "Chat unavailable" despite identical `getClient()` and `getEnv()` patterns
3. Added temporary debug output to the chat error handler: changed generic "Chat unavailable" to include `err.status` and `err.message`
4. **Breakthrough:** Debug output revealed the actual error:
   ```
   400 {"type":"error","error":{"type":"invalid_request_error","message":"signal: Extra inputs are not permitted"}}
   ```
5. Traced the `signal` parameter to the `.stream()` call: `signal: request.signal` was being passed alongside model parameters

## Root Cause

The Anthropic Node SDK's `.stream()` method does not intercept the `signal` parameter for internal AbortController use. Instead, it forwards all parameters directly into the API request body. The Anthropic API validates the request body strictly and rejects unknown fields, returning a 400 error.

`signal` is a standard Web API / Fetch API property for request cancellation. It belongs on `fetch()` calls, not on SDK method parameters. The SDK and the Fetch API have separate parameter namespaces, and mixing them causes this rejection.

The original chat plan (`docs/plans/2026-03-30-001-feat-llm-chat-concept-deep-dives-plan.md`) included `signal: request.signal` in the streaming call to prevent orphaned streams on client disconnect. The intent was correct (cancel server-side streaming when the client disconnects), but the implementation put the signal in the wrong layer.

## Solution

Remove `signal: request.signal` from the `.stream()` call in `app/api/chat.js`.

### Before (broken)

```javascript
const stream = getClient().messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    signal: request.signal,  // SDK sends this to API body, causes 400
});
```

### After (working)

```javascript
const stream = getClient().messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: messages.map(m => ({ role: m.role, content: m.content })),
});
```

## Key Insight

Generic error handlers in streaming endpoints hide the real problem. The catch block had `"Chat unavailable"` as the default message for any non-429, non-AbortError failure. Adding `err.status` and `err.message` to the error output immediately revealed the 400 parameter rejection. When debugging streaming endpoints, always surface the full error temporarily.

The broader lesson: SDK methods and Fetch API calls have separate parameter namespaces. `signal`, `headers`, `credentials`, `mode`, and `cache` are Fetch API concepts. `model`, `max_tokens`, `messages`, `system`, and `temperature` are SDK/API concepts. Never mix them in the same object.

## Prevention Strategies

### 1. Separate fetch params from SDK params in code comments

```javascript
// SDK parameters only (sent to Anthropic API)
const stream = getClient().messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [...],
    messages: [...],
    // Do NOT add: signal, headers, credentials, mode, cache
    // Those are fetch() params, not SDK params
});
```

### 2. Surface real errors during development

When writing SSE streaming error handlers, include error details in development:

```javascript
} catch (err) {
    if (err.name !== "AbortError") {
        const message = err.status === 429
            ? "Too many requests. Wait a moment and try again."
            : "Chat unavailable";
        console.error("Stream error:", err.status, err.message);
        controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`)
        );
    }
}
```

### 3. Test streaming endpoints with curl before deploying

```bash
curl -s -X POST "https://your-app.vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt":"Be concise.","messages":[{"role":"user","content":"hi"}]}'
```

If the response starts with `data: {"type":"error"...}` instead of `data: {"type":"delta"...}`, the stream setup itself is failing.

### 4. Diagnostic checklist for streaming endpoint failures

1. Does the non-streaming endpoint (`/api/evaluate`) work? If yes, API key is fine.
2. Add `err.status` and `err.message` to the error SSE event temporarily.
3. Check for 400 errors (parameter rejection) vs 401 (auth) vs 429 (rate limit).
4. If 400: inspect which parameters are being passed to the SDK method. Compare against the [Anthropic API reference](https://docs.anthropic.com/en/api/messages).
5. If streaming works locally but not on Vercel: check `vercel.json` config and function timeout.

## Related Files

- `app/api/chat.js` - Chat streaming endpoint (fixed)
- `app/api/evaluate.js` - Evaluation endpoint (uses `.create()`, not affected)
- `docs/plans/2026-03-30-001-feat-llm-chat-concept-deep-dives-plan.md` - Original plan that included `signal` in the stream call

## Cross-References

- `docs/solutions/integration-issues/vercel-serverless-env-var-case-sensitivity.md` - Prior fix for the same endpoints (env var casing issue, orthogonal to this)
- CLAUDE.md: API endpoint documentation
