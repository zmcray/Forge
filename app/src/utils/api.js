/**
 * Shared client for the Forge serverless API ({error} body contract).
 *
 * Owns the auth header, JSON headers, timeout/abort composition, and non-OK
 * handling so evaluate/generate/chat callers cannot drift apart.
 */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function composeSignal(signal, timeoutMs) {
  if (!timeoutMs) return signal ?? undefined;
  const timeout = AbortSignal.timeout(timeoutMs);
  if (!signal) return timeout;
  return AbortSignal.any([signal, timeout]);
}

/**
 * POST `body` as JSON to `path`.
 *
 * Options:
 * - stream: return the raw Response (for SSE) instead of parsed JSON.
 * - timeoutMs: abort via AbortSignal.timeout; composed with `signal` if both.
 * - signal: caller-provided AbortSignal (abort lifecycles stay caller-owned).
 * - fallbackError: message used when a non-OK response carries no {error}.
 *
 * Non-OK responses parse the {error} body and throw a typed ApiError with
 * `.status`. Abort and timeout rejections propagate untouched, so callers
 * keep their `err.name === "AbortError"` checks.
 */
export async function forgeFetch(
  path,
  body,
  { stream = false, timeoutMs, signal, fallbackError } = {}
) {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // VITE_FORGE_AUTH_TOKEN is obfuscation, not auth: it ships in the
      // public JS bundle. Real abuse protection is server-side (rate
      // limiting + server-owned prompts).
      "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
    },
    body: JSON.stringify(body ?? {}),
    signal: composeSignal(signal, timeoutMs),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new ApiError(
      errData.error || fallbackError || `Request failed (${res.status})`,
      res.status
    );
  }

  return stream ? res : res.json();
}
