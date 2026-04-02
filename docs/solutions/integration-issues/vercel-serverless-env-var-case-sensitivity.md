---
title: Vercel Serverless Functions Unable to Access Environment Variables Due to Case Sensitivity
category: integration-issues
date: 2026-03-31
severity: high
tags: [vercel, environment-variables, case-sensitivity, serverless-functions, vite, anthropic-sdk, api-key-validation]
affected_components: [app/api/evaluate.js, app/api/chat.js, vercel-deployment-config]
resolution_type: code-fix-and-config
time_to_resolve: ~3 hours
---

# Vercel Serverless Functions Unable to Access Environment Variables Due to Case Sensitivity

## Problem

Both `/api/chat` and `/api/evaluate` serverless endpoints returned 502 errors ("Chat unavailable", "AI grading unavailable") on the deployed Vercel site. The Anthropic API key was confirmed present in the Vercel dashboard, and local testing via curl worked fine. Custom environment variables were completely invisible to the serverless function runtime.

## Investigation Steps

1. Confirmed API key was set in Vercel dashboard (verified ending in YQAA, matching Anthropic console)
2. Confirmed API key worked locally via direct curl test against Anthropic API
3. Created temporary debug endpoint (`api/debug-env.js`) to inspect `process.env` at runtime
4. Initial debug output showed ONLY 29 VERCEL_ system variables, zero custom variables
5. Changed from module-level Anthropic client to lazy `getClient()` factory function. Didn't help since the env var was completely absent from process.env
6. Enhanced debug endpoint to dump ALL environment variable keys (unfiltered) and Vercel deployment context (project name, env, URL)
7. **Breakthrough:** Full env dump revealed environment variables with incorrect casing:
   - `Anthropic_API_Key` instead of `ANTHROPIC_API_KEY`
   - `Forge_Auth_Token` instead of `FORGE_AUTH_TOKEN`
   - `Vite_Forge_Auth_Token` instead of `VITE_FORGE_AUTH_TOKEN`
8. Added case-insensitive `getEnv()` helper. API key was now found, but Anthropic API returned `authentication_error: invalid x-api-key`
9. The case-insensitive lookup accidentally enabled auth check by finding `Forge_Auth_Token`, but the client couldn't send a matching token because Vite's `VITE_` prefix is case-sensitive at build time. Fixed by keeping exact match for auth token only.

## Root Cause

Two independent issues compounded the problem:

1. **Environment variable naming:** Variables in Vercel dashboard had non-standard casing. Linux is case-sensitive, so `Anthropic_API_Key` is a completely different variable from `ANTHROPIC_API_KEY`. Code checking `process.env.ANTHROPIC_API_KEY` found nothing.

2. **Invalid API key value:** Even after resolving the casing issue, the API key value stored in Vercel was corrupted or invalid. Anthropic returned `authentication_error: invalid x-api-key`.

## Solution

### Code fix: case-insensitive env var lookup (permanent safety net)

Added to both `app/api/evaluate.js` and `app/api/chat.js`:

```javascript
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
```

### Auth token: exact match only

The auth token check uses exact casing because the client-side Vite env var (`VITE_FORGE_AUTH_TOKEN`) is case-sensitive at build time. Server and client must agree on exact casing:

```javascript
// Use exact match -- auth is opt-in and client/server must agree on casing
if (process.env.FORGE_AUTH_TOKEN) {
  const token = request.headers.get("x-forge-token");
  if (token !== process.env.FORGE_AUTH_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

### Dashboard fix required

Delete incorrectly-cased env vars and recreate with `SCREAMING_SNAKE_CASE`:
- `Anthropic_API_Key` -> `ANTHROPIC_API_KEY` (fresh key from Anthropic console)
- `Forge_Auth_Token` -> `FORGE_AUTH_TOKEN`
- `Vite_Forge_Auth_Token` -> `VITE_FORGE_AUTH_TOKEN`

## Key Insight

The initial debug endpoint only filtered for env keys containing "ANTHROPIC" or "FORGE", which DID match the incorrectly-cased names. But the check `!!process.env.ANTHROPIC_API_KEY` returned false because that exact key didn't exist. The breakthrough came from dumping ALL env var keys unfiltered, which revealed the casing mismatch immediately. Lesson: when debugging missing env vars, always dump the full list of keys first.

## Prevention Strategies

### 1. Use .env.example as source of truth
Document all required env vars with correct SCREAMING_SNAKE_CASE in `.env.example`:
```
# Server-side (Vercel serverless functions)
ANTHROPIC_API_KEY=sk-...         # Claude API key from console.anthropic.com
FORGE_AUTH_TOKEN=                # Optional: request auth token

# Client-side (Vite, exposed in bundle at build time)
VITE_FORGE_AUTH_TOKEN=           # Must match FORGE_AUTH_TOKEN value
```

### 2. Verify casing when entering env vars
Copy variable names directly from `.env.example`, not from memory. Vercel's dashboard does not enforce casing conventions.

### 3. Test API key validity before deploying
```bash
curl -s -H "x-api-key: YOUR_KEY" -H "anthropic-version: 2023-06-01" \
  https://api.anthropic.com/v1/messages \
  -d '{"model":"claude-haiku-4-5","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}'
```

### 4. Diagnostic checklist for future env var issues
1. Check Vercel dashboard: are all required vars present?
2. **Check casing**: copy var names to a text editor, compare against `.env.example`
3. Check scope: vars set for correct environments (Production, Preview)?
4. Deploy a debug endpoint that dumps `Object.keys(process.env)` unfiltered
5. Test the API key value independently (curl or SDK test)

## Related Files

- `app/api/evaluate.js` - LLM evaluation endpoint (fixed)
- `app/api/chat.js` - Chat streaming endpoint (fixed)
- `app/src/utils/evaluateAnswer.js` - Client-side fetch handler
- `docs/plans/2026-03-24-001-feat-llm-qualitative-answer-evaluation-plan.md` - Original plan with env var requirements

## Cross-References

- CLAUDE.md: Environment Variables section documents required vars
- GETTING-STARTED.md: Needs update with Vercel env var setup instructions
