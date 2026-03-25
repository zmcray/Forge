---
title: "feat: Add LLM-Powered Qualitative Answer Evaluation"
type: feat
status: active
date: 2026-03-24
---

# feat: Add LLM-Powered Qualitative Answer Evaluation

## Enhancement Summary

**Deepened on:** 2026-03-24
**Sections enhanced:** 7
**Research agents used:** security-sentinel, performance-oracle, architecture-strategist, julik-frontend-races-reviewer, code-simplicity-reviewer, SDK docs researcher, UX patterns researcher

### Key Improvements
1. **Revised UX flow**: Self-score FIRST, then reveal AI feedback as "Calibration" (prevents anchoring bias per research on AI-assisted evaluation)
2. **Simplified architecture**: Collapsed from 3 new files to 1 (api/evaluate.js). Fetch logic + display component inlined in QuestionCard.jsx following existing KeywordFeedback pattern.
3. **Security hardening**: Input validation, .env in .gitignore, try/catch around API call, CORS/preflight handling
4. **Performance**: Restructured prompt for effective caching, function warmup on session start, bundle contamination guard

### New Considerations Discovered
- Anchoring bias: showing AI score before self-assessment degrades learning (research-backed)
- Store selfScore + aiScore + finalScore separately to enable calibration tracking
- `@anthropic-ai/sdk` must be excluded from Vite client bundle (rollupOptions.external safety net)
- Prompt caching only works when system prompt is identical across calls; dynamic content must go in user message

---

## Overview

Replace the current keyword substring matching in QuestionCard's qualitative feedback with Claude Haiku 4.5 evaluation via a Vercel serverless function. The LLM evaluates the user's answer against the model answer and returns structured feedback (score, strengths, gaps, improvement suggestion). Quantitative evaluation (delta bands) stays as-is. Keyword matching remains as instant fallback when the API is unavailable.

## Problem Statement / Motivation

The current `KeywordFeedback` component (`app/src/components/QuestionCard.jsx:181-201`) does simple `toLowerCase().includes()` matching against a list of 5-8 keywords per question. This produces shallow, binary feedback ("you mentioned X" / "you missed Y") that doesn't assess the quality or depth of analysis. For qualitative PE skills (risk assessment, diagnostics, investment thesis), the difference between mentioning a keyword and actually analyzing it is the whole point of the exercise.

LLM evaluation provides:
- **Nuanced scoring**: Distinguishes between surface-level mentions and genuine analysis
- **Specific feedback**: "You identified key-person risk but didn't propose a mitigation plan"
- **Learning acceleration**: Targeted gaps help the user focus practice on weak areas

## Proposed Solution

### Architecture

```
User types answer (50+ chars)
    |
    v
Click "Reveal Answer"
    |
    +--> Show model answer immediately (no delay)
    +--> Fire async POST /api/evaluate (fire-and-forget)
    |
    v
User self-scores 1-5 (BEFORE seeing AI feedback)
    |
    v
AI Calibration card appears (after self-score OR when API returns, whichever is later)
    +--> Strengths list (green)
    +--> Gaps / Areas to develop (amber)
    +--> AI Assessment score (muted, secondary)
    +--> "Keep [your score]" (primary) or "Adjust to [AI score]" (secondary)
```

### Key Design Decisions

1. **Fire-and-forget on reveal**: The model answer displays instantly. LLM evaluation runs in background. No blocking.
2. **Self-score FIRST, AI feedback SECOND**: Research on anchoring bias shows that exposing an AI score before self-assessment degrades learning. The user self-scores 1-5 first. AI feedback appears as a "Calibration" panel after, not a "Grade."
3. **Keyword matching as fallback**: If the API call fails or times out (15s), fall back to existing `KeywordFeedback`. The user always gets feedback.
4. **Suggested score with user override**: LLM suggests a score. "Keep [your score]" is the primary/default action. User can adjust to AI score or pick any 1-5. This prevents passive acceptance of AI scores.
5. **Company context in prompt**: Pass company name, industry, and revenue so the LLM can evaluate answers in context.

### Research Insights: UX Flow

**Anchoring Bias Prevention (research-backed):**
- Study of 775 managers found AI recommendations significantly anchor subsequent human ratings regardless of actual performance
- Self-assessment accuracy improves *only when learners self-assess first and then receive feedback*
- Frame as "Calibration" not "Grading" ... the language matters
- AI score should appear muted/secondary (gray, small font) next to user's score which stays primary/bold
- Use "AI Assessment" not "Correct Score"

**Visual Hierarchy:**
- Lead with strengths (green-50 background), gaps second (amber-50, NOT red)
- 60/40 visual weight favoring strengths
- Gaps should be actionable ("Could quantify the revenue-at-risk %") not just labels
- Loading state: layout-matching skeleton shimmer (not spinner, not chat-typing dots)

**Score Override Interaction:**
- Default: user's original self-score stays selected
- Two quick-action buttons: "Keep [4]" (primary) and "Adjust to [3]" (secondary)
- Full 1-5 scale also available
- Store selfScore, aiScore, finalScore separately for calibration tracking

**References:**
- [Anchoring bias in AI-assisted decision making](https://www.sciencedirect.com/science/article/pii/S0268401225000076)
- [Self-assessment accuracy with LLM-generated feedback](https://www.sciencedirect.com/science/article/pii/S0360131525001538)
- [Nielsen Norman Group: Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/)

## Technical Approach

### 1. Serverless Function: `app/api/evaluate.js`

**Vercel auto-deploys** any file in `/api` as a serverless function. Uses the named `POST` export (Vercel convention).

```javascript
// app/api/evaluate.js
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const VALID_TYPES = ["risk", "diagnostic", "thesis"];
const MAX_FIELD_LENGTH = 5000;

const feedbackSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      description: "1=way off, 2=significant gaps, 3=partial/right direction, 4=solid with minor gaps, 5=comprehensive"
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "Key concepts the user correctly identified or analyzed well (2-4 items)"
    },
    gaps: {
      type: "array",
      items: { type: "string" },
      description: "Important concepts missed or areas needing deeper analysis (1-3 items)"
    },
    suggestion: {
      type: "string",
      description: "One actionable sentence on what to focus on next time"
    }
  },
  required: ["score", "strengths", "gaps", "suggestion"],
  additionalProperties: false
};

export const config = { maxDuration: 30 };

export async function POST(request) {
  // Auth check
  const token = request.headers.get("x-forge-token");
  if (token !== process.env.FORGE_AUTH_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Input validation
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userAnswer, modelAnswer, questionText, questionType, companyContext } = body;

  if (!userAnswer || typeof userAnswer !== "string" || userAnswer.length > MAX_FIELD_LENGTH) {
    return Response.json({ error: "Invalid userAnswer" }, { status: 400 });
  }
  if (!modelAnswer || typeof modelAnswer !== "string" || modelAnswer.length > MAX_FIELD_LENGTH) {
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
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [
        {
          role: "user",
          content: `Question type: ${questionType}\nCompany: ${companyContext || "N/A"}\n\nQuestion: ${questionText}\n\nModel Answer: ${modelAnswer}\n\nUser's Answer: ${userAnswer}`
        }
      ],
      output_config: {
        format: { type: "json_schema", schema: feedbackSchema }
      }
    });

    const feedback = JSON.parse(response.content[0].text);
    return Response.json(feedback);
  } catch (err) {
    console.error("Evaluation failed:", err.message);
    return Response.json({ error: "Evaluation unavailable" }, { status: 502 });
  }
}
```

### Research Insights: Serverless Function

**Security hardening (from security-sentinel):**
- Input validation on all 5 fields with type checks, length caps, and allowed questionType values
- try/catch around Anthropic API call prevents stack trace leakage
- Clean 502 response triggers client fallback correctly

**Performance (from performance-oracle):**
- **Prompt caching fix**: Static instruction in system prompt, dynamic content (questionType, companyContext) in user message. This ensures the system prompt is identical across ALL evaluations, maximizing cache hits. With the original plan, each unique (questionType, companyContext) combo produced a different system prompt = zero cache hits.
- First-request schema compilation: 100-300ms overhead, cached 24h by Anthropic
- Module-level `new Anthropic()` initialization (correct; paid once per cold start)

**SDK details (from docs research):**
- `output_config.format` (not old beta `output_format`) is GA
- `additionalProperties: false` required on all object types in schema
- SDK auto-retries 429s with exponential backoff (2 retries default)

### 2. QuestionCard Integration (Inline, No Separate Hook)

**Simplification (from code-simplicity-reviewer):** The original plan had a separate `useEvaluation.js` hook and `LLMFeedback.jsx` component. Since the evaluation fetch is tightly coupled to QuestionCard's reveal flow and will never be reused elsewhere, inline the fetch logic (~15 lines) directly in QuestionCard.

Similarly, the LLM feedback display should be a local function component in QuestionCard.jsx, following the existing `KeywordFeedback` pattern (already defined as a local function at line 181).

**Changes to `app/src/components/QuestionCard.jsx`:**

- Add `companyContext` prop to QuestionCard
- Add 3 state variables: `llmResult`, `llmLoading`, `llmError`
- In `handleReveal()`, fire fetch for qualitative questions (fire-and-forget)
- In reveal phase: show keyword feedback immediately; show AI skeleton below
- In scored phase: show AI Calibration card with strengths, gaps, score comparison, override buttons
- Define `LLMFeedback` and `AICalibrationCard` as local functions alongside `KeywordFeedback`

```javascript
// Added state in QuestionCard
const [llmResult, setLlmResult] = useState(null);
const [llmLoading, setLlmLoading] = useState(false);

// In handleReveal, after setPhase("reveal"):
if (!isQuantitative) {
  setLlmLoading(true);
  fetch("/api/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
    },
    body: JSON.stringify({
      userAnswer: textAnswer,
      modelAnswer: question.answer,
      questionText: question.q,
      questionType: question.type,
      companyContext,
    }),
    signal: AbortSignal.timeout(15000),
  })
    .then((r) => r.ok ? r.json() : Promise.reject(r.status))
    .then(setLlmResult)
    .catch(() => {}) // fallback to keyword matching
    .finally(() => setLlmLoading(false));
}
```

### Research Insights: Frontend Patterns

**Race condition handling (from frontend-races-reviewer):**
- Phase state and evaluation state are **orthogonal axes**. The LLM result arriving should NOT trigger a phase transition. Render LLM feedback in both `reveal` and `scored` phases.
- The evaluation may arrive before or after the user self-scores. Both scenarios must display correctly:
  - User in `reveal`, LLM returns: show skeleton -> results below model answer
  - User self-scores (phase -> `scored`), LLM still loading: show skeleton in scored phase
  - User self-scores, then LLM returns: results appear in scored phase as Calibration card

**Simplification (from code-simplicity-reviewer):**
- `AbortSignal.timeout(15000)` alone is sufficient. No AbortController needed since `handleReveal` cannot re-trigger (button disappears after click).
- No `cancel()` function needed since there is no cancel UI.

**Re-render optimization (from performance-oracle):**
- The 3 state vars (llmResult, llmLoading, llmError) could use `useReducer` for atomic transitions, but for this case the simplicity of useState is preferred. React 19 batches the synchronous setState calls.

### 3. Updated Score Flow

The scoring buttons in QuestionCard need modification to support the calibration flow:

**Before (current):**
1. User clicks 1-5 -> `setSelfScore(n)` -> `setPhase("scored")` -> `onScore(type, n, {...})`

**After (with LLM):**
1. User clicks 1-5 -> `setSelfScore(n)` -> `setPhase("scored")` -> score NOT yet persisted
2. AI Calibration card appears (if llmResult available, or when it arrives)
3. "Keep [n]" (primary) or "Adjust to [aiScore]" (secondary) or pick 1-5
4. -> `onScore(type, finalScore, { selfScore: n, aiScore: llmResult?.score, ... })`

For quantitative questions, the flow is unchanged (no LLM eval).

**Scoring data shape extension:**
```javascript
onScore(question.type, finalScore, {
  delta: isQuantitative && committedNumeric !== null && modelExtracted
    ? committedNumeric - modelExtracted.value : null,
  unit: modelExtracted?.unit || null,
  selfScore: n,          // original self-assessment
  aiScore: llmResult?.score || null,  // AI suggestion (null if API failed)
});
```

### 4. Company Context

**Architecture improvement (from architecture-strategist):** Instead of threading a `companyContext` prop from App.jsx through PracticeScreen, create a utility function and call it at the point of use.

```javascript
// app/src/utils/buildCompanyContext.js
export function buildCompanyContext(company) {
  if (!company) return "";
  return `${company.name} (${company.industry}, $${company.revenue}M revenue)`;
}
```

In App.jsx's PracticeScreen, pass `companyContext={buildCompanyContext(selectedCompany)}` to QuestionCard. This is a single prop addition, not a chain.

### 5. Dependencies & Environment

**Install:**
```bash
cd app && npm install @anthropic-ai/sdk
```

**Bundle contamination guard (from performance-oracle):**
The `@anthropic-ai/sdk` is only imported in `app/api/evaluate.js` (serverless function, not bundled by Vite). However, add a safety net in `vite.config.js`:

```javascript
build: {
  rollupOptions: {
    external: ["@anthropic-ai/sdk"]
  }
}
```

After implementation, verify: run `npm run build` and confirm output stays near the current 424 KB (130 KB gzipped).

**Environment variables (Vercel dashboard):**
- `ANTHROPIC_API_KEY` - Anthropic API key (server-side only, no VITE_ prefix)
- `FORGE_AUTH_TOKEN` - random token for endpoint auth (server-side)

**Local dev (.env.local, git-ignored):**
```
VITE_FORGE_AUTH_TOKEN=<same token as FORGE_AUTH_TOKEN on Vercel>
```

**Add `.env` to `.gitignore` (from security-sentinel, HIGH priority):**
The current `.gitignore` has `*.local` (covers `.env.local`) but NOT `.env` itself. Add it before implementing:
```
.env
.env.local
.env.*.local
```

**Local API testing:** Use `vercel dev` (not `npm run dev`) to test API routes locally. Or add a Vite proxy:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### 6. Function Warmup (from performance-oracle)

Worst-case first-evaluation latency: cold start (500ms-2s) + Haiku call (1-3s) + network (100-300ms) = 3-5s.

**Mitigation:** Warm the function when a practice session starts. In `startPractice()` in App.jsx, fire a lightweight ping:

```javascript
// Fire-and-forget warmup on session start
fetch("/api/evaluate", { method: "OPTIONS" }).catch(() => {});
```

The serverless function's OPTIONS handler (or just the cold start) warms the instance. By the time the user answers their first qualitative question (2-5 minutes later), the function is warm.

## Acceptance Criteria

### Functional

- [ ] Qualitative questions (risk, diagnostic, thesis) receive LLM evaluation on reveal
- [ ] Quantitative questions (metric, adjustment, valuation) are unchanged (delta bands)
- [ ] User self-scores 1-5 BEFORE seeing AI feedback (prevents anchoring)
- [ ] AI Calibration card displays: strengths (green), gaps (amber), suggestion, score comparison
- [ ] "Keep [your score]" is primary action; "Adjust to [AI score]" is secondary
- [ ] Keyword matching still shows as instant feedback; AI feedback supplements it
- [ ] Loading skeleton appears while LLM evaluation is in flight
- [ ] Model answer displays immediately on reveal (no waiting for LLM)
- [ ] Graceful fallback: if API fails, keyword feedback is the only feedback (no error UI needed)

### Non-Functional

- [ ] API response < 5s for 95th percentile (Haiku typical: 1-3s)
- [ ] 15s client-side timeout with graceful fallback to keyword matching
- [ ] Auth token prevents unauthorized API access
- [ ] Input validation on all API request fields
- [ ] `ANTHROPIC_API_KEY` never exposed to client bundle
- [ ] `@anthropic-ai/sdk` not included in Vite client bundle (verify with build output)
- [ ] `.env` added to `.gitignore`
- [ ] Existing tests continue to pass

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `app/api/evaluate.js` | Create | Vercel serverless function with Claude Haiku, input validation, error handling |
| `app/src/components/QuestionCard.jsx` | Modify | Inline fetch logic, add LLMFeedback/AICalibrationCard local components, add companyContext prop, updated score flow |
| `app/src/utils/buildCompanyContext.js` | Create | Small utility: company -> context string |
| `app/src/App.jsx` | Modify | Pass companyContext to QuestionCard, add function warmup ping on startPractice |
| `app/vite.config.js` | Modify | Add rollupOptions.external for SDK, optional dev proxy |
| `app/package.json` | Modify | Add @anthropic-ai/sdk dependency |
| `.gitignore` | Modify | Add .env |
| `app/.env.local` | Create | VITE_FORGE_AUTH_TOKEN (git-ignored) |

**Files NOT created (simplification):**
- ~~`app/src/hooks/useEvaluation.js`~~ - Inlined in QuestionCard
- ~~`app/src/components/LLMFeedback.jsx`~~ - Local function in QuestionCard (like KeywordFeedback)
- ~~`app/vercel.json` modification~~ - Vercel filesystem precedence handles /api routing

## Cost Estimate

| Metric | Value |
|--------|-------|
| Input tokens per eval | ~800 (system prompt + question + answers) |
| Output tokens per eval | ~150-200 |
| Cost per evaluation | ~$0.002 |
| Monthly estimate (100 evals/week) | ~$0.80 |
| With prompt caching (fixed system prompt) | ~$0.50 |

**Prompt caching note:** With the restructured prompt (static system message, dynamic content in user message), ALL evaluations within a 5-min window hit the cache after the first. This saves ~70-80% of input token cost for cached requests.

## Success Metrics

- User gets specific, actionable feedback on qualitative answers instead of binary keyword pills
- Self-score first, then AI calibration enables genuine self-assessment development
- Track selfScore vs aiScore divergence over time (calibration accuracy)
- API reliability > 95% (keyword fallback covers the rest)
- No perceptible delay in revealing the model answer

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Anthropic API downtime | Keyword matching fallback always available |
| Haiku gives inconsistent scores | Constrained schema + specific rubric in system prompt |
| Auth token exposed in client JS | Acceptable for single-user app; set Anthropic monthly spending limit |
| Vercel serverless cold starts | Warmup ping on session start; Haiku fast enough for warm calls |
| Cost creep | Haiku 4.5 at $0.002/eval; cap at Anthropic dashboard |
| Bundle contamination | rollupOptions.external safety net + build size verification |
| .env accidentally committed | Add .env to .gitignore before any env files exist |

## Scope Boundaries (Not in Scope)

- LearnExercise module (drag-and-drop exercises) - different surface, binary completion
- Quantitative question evaluation - delta bands work well already
- Multi-user auth (Clerk, Auth0) - single-user app
- Evaluation history persistence - future enhancement (but data shape supports it)
- Streaming responses - evaluation is short enough that non-streaming is fine
- Rate limiting - acceptable risk for single-user; Anthropic spending limit is sufficient

## Sources & References

- Anthropic structured outputs: `output_config.format` with `json_schema` (GA on Haiku 4.5)
- Anthropic SDK: `@anthropic-ai/sdk` v0.80.0, Node.js 20+
- Vercel serverless with Vite: `/api` directory auto-deployed, Web Standard `fetch` export
- Existing code: `app/src/components/QuestionCard.jsx:181-201` (KeywordFeedback)
- Existing code: `app/src/data/questionTypes.js` (qualitative types: risk, diagnostic, thesis)
- Related plan: `docs/plans/2026-03-23-002-feat-llm-dynamic-scenario-generation-plan.md` (deferred, shares serverless pattern)
- [Anchoring bias in AI-assisted decision making](https://www.sciencedirect.com/science/article/pii/S0268401225000076)
- [Self-assessment accuracy with LLM-generated feedback](https://www.sciencedirect.com/science/article/pii/S0360131525001538)
- [Nielsen Norman Group: Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/)
- [Claude Structured Outputs Documentation](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Vercel Functions Documentation](https://vercel.com/docs/functions)
