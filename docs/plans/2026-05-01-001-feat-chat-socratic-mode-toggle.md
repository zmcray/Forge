---
Created: 2026-05-01
Tier: 2
Linear Project: Forge
Linear Issue: MCR-16
Linear Branch: zack/mcr-16-llm-chat-for-concept-deep-dives
Task: Add Direct/Socratic mode toggle to the Learn chat drawer. Socratic asks guiding questions instead of giving direct answers (Khanmigo pattern). Mode is a user preference persisted in localStorage; system prompt and suggested questions branch on mode.
PRD: docs/strategy/2026-04-29-forge-backfill-prd.md (F7, M2 milestone)
Predecessor: docs/plans/2026-03-30-001-feat-llm-chat-concept-deep-dives-plan.md (v1 chat, shipped)
Source TODO: TODOS.md ... "Socratic Mode Toggle for Chat" (P2, S effort)
---

# feat: Chat Socratic Mode Toggle (MCR-16 follow-up)

## Overview

Extend the shipped Learn chat drawer with a Direct/Socratic mode toggle. In Socratic mode the LLM does not answer the question outright; instead, it asks 1-2 probing questions per turn that lead the learner toward the insight. The mode is a user preference (localStorage), applies globally across every drawer instance, and is reflected in both the system prompt and the suggested-question chips.

## Problem Statement

The v1 chat (shipped 2026-03-30) is excellent for "I don't understand X" friction, but it shortcuts the struggle. The CEO review for v1 explicitly called out this risk: open-ended Q&A can let learners skip the productive struggle that produces durable understanding. The deferred Socratic mode is the answer to that risk: same surface, opposite pedagogy. Khanmigo and a body of cognitive-science research show this produces deeper retention, but it can frustrate users who just want a fast answer. The toggle resolves this by giving learners the choice.

## Proposed Solution

A pill-segmented toggle in the chat drawer header: "Direct | Socratic". Default is Direct. Mode is persisted in localStorage as a global user preference (`forge-chat-mode`). When mode changes mid-conversation, an inline system note appears in the chat ("Switched to Socratic mode.") and subsequent assistant responses follow the new prompt; prior responses are not retro-edited.

The system prompt branches inside `useChatContext`:
- **Direct (current):** explanatory tutor, concise answers with Summit numbers as examples.
- **Socratic:** guide-by-questioning, never gives away the conclusion in turn 1, asks 1-2 probing questions per turn, after ~3 rounds of stuck-ness offers a partial scaffold then asks another question.

Suggested questions also branch:
- **Direct:** "Why does X matter?" / "Can you give me a real-world example?" (current behavior)
- **Socratic:** "Test my understanding of X" / "Challenge me on X" (new seed list, optionally per-subsection)

## Technical Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| D1 | Toggle UI | Pill segmented control "Direct \| Socratic" in `ChatDrawer` header next to close button | Compact, two-state, fits the existing header. Clear and one-tap. |
| D2 | Mode persistence | localStorage key `forge-chat-mode`, value `"direct"` or `"socratic"`, default `"direct"` | Single user preference applies everywhere. Survives reload + drawer close/reopen + navigation. No per-subsection state. |
| D3 | Mode hook ownership | New `useChatMode()` hook called inside `ChatDrawer`, return shape `{ mode, setMode }` (matches `useTheme`) | Encapsulates persistence. Reusable for future Practice-mode chat. No prop drilling. Object return matches existing localStorage-preference hook (`useTheme`) for codebase consistency. |
| D4 | Prompt variants | Two complete prompt strings inside `useChatContext`, branched by `mode` arg | Cleaner than building one prompt with inline conditionals. Each variant is self-contained and reviewable. |
| D5 | Suggested questions | `mode === "socratic"` returns generic Socratic seeds. Gap-derived in Socratic = "Want me to test you on \"{gap}\"?". Per-subsection `socraticSuggestions` deferred to follow-up PR. | Same data path, different framing. Per-subsection seeds get tuned after smoke-testing real use, not guessed up-front. |
| D6 | Mid-conversation mode change | No retro-edit of past messages. Insert a synthetic divider message rendered as an inline italic line. Subsequent fetches use the new prompt. | Preserves chat history fidelity. |
| D7 | Synthetic mode-change message wire format | Use `{ role: "assistant", kind: "mode-change", content: "Switched to Socratic mode." }` (plain content, italic via className). Filtered from `/api/chat` payload by ChatDrawer before fetch. | Anthropic API rejects `role: "system"` inside `messages`. Plain content avoids regex stripping in render. The filter at fetch time keeps the chat history clean for the LLM. |
| D8 | Toggle effect on streaming | If user flips mode mid-stream, the in-flight response is allowed to finish under the OLD prompt (systemPrompt is captured in closure when fetch starts). Only the next user-initiated message uses the new prompt. | Mid-stream prompt swaps don't work technically. Visual marker appears immediately; behavioral change applies on next turn. **Tested explicitly (T1) since this is load-bearing.** |
| D9 | Empty-state copy in Socratic | "I'll guide you with questions. Ask me to test you on {subsectionTitle}." replaces the default "Ask a question about ..." copy | Sets the right expectation. Prevents the "why isn't it answering my question?" frustration. |
| D10 | Telemetry | Defer. No analytics infra exists yet in Forge. Add when cost/usage monitoring is built (separate task). | Keeps scope contained. |
| D11 | Magic strings | Export `CHAT_MODES = { DIRECT: "direct", SOCRATIC: "socratic" }` from `useChatMode.js`. Import where needed. | Prevents typo bugs across 4 files. Cheap. |
| D12 | API role validation | Add explicit allowlist (`role === "user" \|\| role === "assistant"`) to `app/api/chat.js` validation loop | Defensive: catches future kind-leaks. Existing validation only checks `!msg.role`. |
| D13 | Rapid mode toggles | N flips produce N dividers. No debouncing. | Truthful representation of user action. Debouncing adds state machine complexity for an unrealistic UX. |
| D14 | Prompt size budget | Lock empirical baseline: longest subsection text = 1972 chars (`s4h`). Socratic intro = ~600 chars. Total Socratic prompt for `s4h` ≈ 2802 chars. Test asserts ≤ 4500. | Headroom of 1700 chars. Test catches any future subsection that bloats past the budget. |

## Architecture

### Files (3 new, 4 modified)

**New:**
| File | Purpose |
|------|---------|
| `app/src/hooks/useChatMode.js` | localStorage-backed mode state. Exports `CHAT_MODES` constant. Returns `{ mode, setMode }`. |
| `app/src/test/useChatMode.test.js` | Round-trip + default + invalid-value + read-failure tests. |
| `app/src/test/socraticPrompt.test.js` | Length budget assertion (≤4500), Socratic content rules, gap clause coexistence. |

**Modified:**
| File | Changes |
|------|---------|
| `app/src/hooks/useChatContext.js` | Accept `mode` arg (default `"direct"`). Branch system prompt + suggested questions on mode. Add Socratic prompt variant. |
| `app/src/components/learn/ChatDrawer.jsx` | Mount `useChatMode`, render pill toggle in header, pass `mode` to `useChatContext`, insert mode-change divider on flip, filter dividers from API payload, swap empty-state copy by mode. |
| `app/src/components/learn/ChatMessage.jsx` | Detect `message.kind === "mode-change"` (early return BEFORE role-based render) and emit italic centered divider. |
| `app/api/chat.js` | Add explicit role allowlist (`role === "user" \|\| role === "assistant"`) to validation loop (D12). |

### `useChatMode` contract

```javascript
// app/src/hooks/useChatMode.js
import { useState, useCallback } from "react";

const STORAGE_KEY = "forge-chat-mode";

export const CHAT_MODES = Object.freeze({
  DIRECT: "direct",
  SOCRATIC: "socratic",
});

const VALID_MODES = [CHAT_MODES.DIRECT, CHAT_MODES.SOCRATIC];
const DEFAULT_MODE = CHAT_MODES.DIRECT;

export default function useChatMode() {
  const [mode, setModeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return VALID_MODES.includes(stored) ? stored : DEFAULT_MODE;
    } catch {
      return DEFAULT_MODE;
    }
  });

  const setMode = useCallback((next) => {
    if (!VALID_MODES.includes(next)) return;
    setModeState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* quota or denied */ }
  }, []);

  return { mode, setMode };
}
```

### `useChatContext` mode branch (sketch)

```javascript
const directIntro = `You are a PE deal analysis tutor helping a learner understand ${subsection.title}.
Keep responses concise (2-3 paragraphs max). Use Summit Mechanical Services numbers when giving examples. Format with markdown for clarity.`;

const socraticIntro = `You are a Socratic PE deal analysis tutor helping a learner understand ${subsection.title}.

Rules:
- Do not give direct answers. Lead the learner to the insight by asking 1-2 probing questions per turn.
- Each turn: ask, do not lecture. Maximum 3 sentences before your question(s).
- Ground questions in concrete numbers from the lesson when possible (Summit Mechanical Services or other companies referenced below).
- After ~3 rounds where the learner is clearly stuck, offer a small scaffold (one sentence of direction) and then ask another question.
- If the learner asks "just tell me the answer," respond with one focused question that points at the key insight; do not capitulate.
- Format with markdown for clarity. Bold the question.`;

const intro = mode === "socratic" ? socraticIntro : directIntro;
// ... rest of prompt (CURRENT LESSON, COMPANY DATA, LEARNER PROGRESS, RECENT EXERCISE) is identical
```

### Suggested questions branch

```javascript
const socraticSeeds = [
  `Test my understanding of ${subsection.title}`,
  `Walk me through the reasoning behind ${subsection.title}`,
];

const directSeeds = [
  `What's the most important concept in ${subsection.title}?`,
  "Can you give me a real-world example?",
];

if (mode === "socratic") {
  if (subsection.socraticSuggestions) questions.push(...subsection.socraticSuggestions);
  if (llmResult?.gaps) for (const gap of llmResult.gaps) questions.push(`Want me to test you on "${gap}"?`);
  if (questions.length === 0) questions.push(...socraticSeeds);
} else {
  // existing behavior
}
```

### `ChatDrawer` toggle

```jsx
// In header, between title and close button
<div className="flex items-center gap-1 rounded-full bg-surface-container-low p-0.5 mr-2">
  <button
    onClick={() => handleModeChange("direct")}
    className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
      mode === "direct"
        ? "bg-primary text-on-primary"
        : "text-on-surface-variant hover:opacity-80"
    }`}
    aria-pressed={mode === "direct"}
  >
    Direct
  </button>
  <button
    onClick={() => handleModeChange("socratic")}
    className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
      mode === "socratic"
        ? "bg-primary text-on-primary"
        : "text-on-surface-variant hover:opacity-80"
    }`}
    aria-pressed={mode === "socratic"}
  >
    Socratic
  </button>
</div>
```

`handleModeChange(next)`:
1. If `next === mode`, no-op.
2. Call `setMode(next)`.
3. If `messages.length > 0`, push a synthetic divider: `{ role: "assistant", kind: "mode-change", content: \`Switched to ${next === CHAT_MODES.SOCRATIC ? "Socratic" : "Direct"} mode.\` }`. Plain content (no markdown), italic applied via className in ChatMessage.
4. Empty-state and suggested questions automatically re-derive via `useChatContext` mode arg.

Rapid flips: N mode flips on a non-empty conversation produce N dividers (D13). No debouncing.

### `ChatMessage` divider rendering

**Critical ordering:** the `kind === "mode-change"` check must be the FIRST check in the component, before `isUser` is computed and before any role-based render path. This prevents a future avatar/header change to the assistant render from accidentally rendering on the divider.

```jsx
export default function ChatMessage({ message, isStreaming, noteId, getNoteText, setNoteText }) {
  // EARLY RETURN: mode-change dividers are not chat bubbles.
  if (message.kind === "mode-change") {
    return (
      <div className="text-xs text-on-surface-variant text-center my-2 italic">
        {message.content}
      </div>
    );
  }

  const [saved, setSaved] = useState(false);
  const isUser = message.role === "user";
  // ... existing render path unchanged
}
```

The `kind` field is also stripped before sending to `/api/chat` (the API only accepts `role` + `content`). Strip happens in `sendMessage` before the fetch payload is built.

### API payload sanitization

In `ChatDrawer.sendMessage`, the `updated` array (sent to `/api/chat`) must filter out mode-change markers since they're a UI concept, not chat history:

```javascript
const apiMessages = updated
  .filter(m => m.kind !== "mode-change")
  .map(m => ({ role: m.role, content: m.content }));

// fetch body uses apiMessages, not updated
body: JSON.stringify({ messages: apiMessages, systemPrompt }),
```

This is the single most important detail to get right. Forgetting this would send `kind` as an unknown field (Anthropic ignores it) BUT the divider message itself is `role: "assistant"` content reading "_Switched to Socratic mode._", which would confuse the model. Filter it out entirely.

## Acceptance Criteria

### Functional
- [ ] Pill toggle "Direct | Socratic" visible in chat drawer header
- [ ] Toggle defaults to "Direct" on first use
- [ ] Selected mode persists across drawer close/reopen, navigation, and full page reload
- [ ] In Socratic mode, the assistant's first response asks a question rather than giving an answer
- [ ] Mid-conversation mode flip inserts an inline italic divider ("Switched to Socratic mode.") between messages
- [ ] Past messages are not modified by a mode flip
- [ ] Empty-state copy changes by mode ("Ask a question about X" vs "I'll guide you with questions. Ask me to test you on X.")
- [ ] Suggested questions change by mode (Direct seeds vs Socratic seeds)
- [ ] Gap-derived suggestions in Socratic mode use "Want me to test you on \"{gap}\"?" framing
- [ ] Mid-stream toggle does not interrupt the in-flight response; mode applies to next message
- [ ] Mode-change markers are NOT sent to `/api/chat` (filtered before fetch)

### Non-Functional
- [ ] Socratic prompt fits within existing 5000-char `MAX_SYSTEM_PROMPT_LENGTH` for all subsections (longest current subsection text + Socratic preamble must measure ≤4500 chars to leave headroom; verify with a test)
- [ ] No additional API calls; prompt assembly stays client-side
- [ ] Toggle is keyboard-accessible (Tab focus, Enter/Space activation, `aria-pressed`)
- [ ] Toggle works in dark mode (uses design tokens)
- [ ] Toggle works on mobile drawer overlay

### Quality Gates
- [ ] All existing tests pass (no regressions)
- [ ] New tests: `useChatMode.test.js`, `socraticPrompt.test.js`, plus extensions to `useChatContext.test.js` and `ChatDrawer.test.jsx`
- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds
- [ ] Manual smoke: open drawer, send "What is EBITDA?" in Direct mode (gets answer), flip to Socratic, send same question (gets question back), reload page, drawer remembers Socratic mode

## Test Plan

### `useChatMode.test.js` (new)
- Default mode is `"direct"` when localStorage is empty
- `setMode("socratic")` updates state and writes to localStorage
- Mounting a fresh hook reads the persisted value
- Invalid stored value (`"foo"`) falls back to `"direct"`
- `setMode("invalid")` is a no-op (does not write, does not update state)
- localStorage WRITE failure (mock throw on `setItem`) does not crash the hook
- localStorage READ failure (mock throw on `getItem`) initializer falls back to default (T3)
- `CHAT_MODES` exports `DIRECT` and `SOCRATIC` as the canonical strings

### `useChatContext.test.js` (extend)
- `mode === "direct"` produces the existing prompt (snapshot pinned)
- `mode === "socratic"` produces a prompt containing "Do not give direct answers" and "ask 1-2 probing questions"
- Direct mode keeps existing default suggestions
- Socratic mode returns generic Socratic seeds when no gap data
- Socratic + `llmResult.gaps`: dynamic suggestions use "Want me to test you on" framing
- Both modes include `CURRENT LESSON`, `COMPANY DATA`, `LEARNER PROGRESS` blocks identically
- Trim notification appended in both modes when conversation is long
- `mode` arg `undefined` defaults to Direct (T2)

### `socraticPrompt.test.js` (new)
- Socratic prompt for the longest existing subsection (`s4h`, 1972 chars text) stays under 4500 chars total. Empirical baseline ≈ 2802 chars. Test asserts `<4500`.
- Socratic prompt always includes the "Do not give direct answers" rule and the "1-2 probing questions" rule
- Socratic prompt + grading-gaps clause coexists when `llmResult` is present

### `ChatDrawer.test.jsx` (extend)
- Pill toggle renders both options with correct `aria-pressed` state
- Clicking "Socratic" calls `setMode("socratic")` and updates the pressed state
- Toggle no-op when clicking the already-active mode (no divider inserted)
- Mode flip with `messages.length > 0` inserts `{ kind: "mode-change", ... }` into messages
- Mode flip with empty `messages` does NOT insert a divider
- Empty-state copy changes by mode
- `ChatMessage` renders mode-change marker as italic centered divider, not a chat bubble
- API call body excludes any message with `kind: "mode-change"`
- Mode persists across drawer unmount/remount (verifies hook + localStorage path)
- **T1 (CRITICAL):** Mid-stream mode flip preserves the in-flight prompt. Mock `/api/chat` with a slow stream. Send a message under Direct. Mid-stream, flip to Socratic. Assert: (a) the in-flight `fetch` was called with the Direct system prompt; (b) on send of the next user message, fetch is called with the Socratic system prompt.

## Phased Execution (Micro-Tasks)

Each task is 2-5 min, with exact files and verification. Ordered for safe incremental commits.

### Phase 1: Hook + Persistence (foundation)
1. **Create `useChatMode.js`** with localStorage backing, `CHAT_MODES` constant, default `"direct"`, validation. Object return shape `{ mode, setMode }` (matches `useTheme`). Files: `app/src/hooks/useChatMode.js`. Verify: file exists, exports default + named `CHAT_MODES`.
2. **Write `useChatMode.test.js`** with 8 cases (default, set, persist, invalid stored, invalid set, write-failure, read-failure, CHAT_MODES export). Files: `app/src/test/useChatMode.test.js`. Verify: `npm test useChatMode` passes.
3. **Commit:** `feat(chat): add useChatMode hook for persisted Direct/Socratic toggle [MCR-16]`

### Phase 2: Prompt Variants (core logic)
4. **Add Socratic prompt branch to `useChatContext.js`**. Accept `mode` arg with default `"direct"`. Branch the intro string. Keep the lesson/company/progress/grading sections identical. Files: `app/src/hooks/useChatContext.js`. Verify: existing `useChatContext.test.js` still passes (Direct path unchanged).
5. **Add Socratic suggested-question branch**. Direct seeds (existing) vs Socratic seeds. Gap-derived "Want me to test you on" in Socratic. (No per-subsection `socraticSuggestions` ... deferred to follow-up PR.) Verify: read each branch by hand; existing tests still green.
6. **Extend `useChatContext.test.js`** with the 8 new cases listed in Test Plan. Verify: `npm test useChatContext` passes.
7. **Add `socraticPrompt.test.js`** for length budget + content assertions. Verify: passes.
8. **Commit:** `feat(chat): branch system prompt and suggested questions on Socratic mode [MCR-16]`

### Phase 3: Drawer UI + Integration
9. **Wire `useChatMode` into `ChatDrawer`**. Read `{ mode, setMode }`. Pass `mode` to `useChatContext`. Verify: drawer still renders, both prompt variants are reachable by manually toggling localStorage.
10. **Render pill toggle in drawer header**. Two buttons, design tokens, `aria-pressed`. Files: `ChatDrawer.jsx`. Verify: visible in `npm run dev`, both modes selectable, persists across reload.
11. **Add `kind: "mode-change"` divider insertion** in `handleModeChange`. Skip if same mode or empty messages. Plain content (no markdown). Verify in dev: send a message, flip mode, see divider; flip mode at start (no messages), no divider.
12. **Render mode-change divider in `ChatMessage`**. Add early return for `message.kind === "mode-change"` BEFORE `isUser` is computed and BEFORE any role-based render path (D7 + ordering note). Render as italic centered text via className (no markdown stripping). Files: `ChatMessage.jsx`. Verify visually.
13. **Filter mode-change markers from API payload** in `ChatDrawer.sendMessage`. Build `apiMessages = updated.filter(m => m.kind !== "mode-change").map(m => ({ role: m.role, content: m.content }))`. Send `apiMessages`, not `updated`. Verify: open DevTools network panel, send a message after a mode flip, confirm the request body excludes the divider.
14. **Branch empty-state copy by mode**. "Ask a question about" vs "I'll guide you with questions. Ask me to test you on". Verify visually in both modes with empty messages.
15. **Add explicit role allowlist to `app/api/chat.js`** (D12). In the validation loop, after the existing `!msg.role` check, add `if (msg.role !== "user" && msg.role !== "assistant") return Response.json({ error: "Invalid message role" }, { status: 400 });`. Verify with a unit test or curl.
16. **Commit:** `feat(chat): add Direct/Socratic toggle UI with mode-change divider [MCR-16]`

### Phase 4: Tests + Polish
17. **Extend `ChatDrawer.test.jsx`** with the 10 new cases listed (including T1 mid-stream test). Verify: `npm test ChatDrawer` passes.
18. **Update TODOS.md.** Move "Socratic Mode Toggle for Chat" from `## Remaining` to `## Completed` with a one-line summary of what shipped. Files: `TODOS.md`. Verify: section moves cleanly.
19. **Run full test suite + lint + build.** Fix any regressions. Verify: `npm test && npm run lint && npm run build` clean.
20. **Manual smoke test** the full acceptance criteria checklist above in `npm run dev`. Capture findings in plan if anything surprises.
21. **Commit:** `test(chat): cover Socratic toggle behavior + close TODO [MCR-16]`

### Phase 5: Wrap
22. **Run `/codex:rescue` review** against the branch. Address P1/P2 findings.
23. **Update Linear MCR-16:** post a comment summarizing scope ("v1 chat shipped + Socratic toggle added"). Mark MCR-16 **Done** ... bundling here is a scope expansion that ships within MCR-16.
24. **Run `/zmcray:wrap`** to sync Linear, capture compound learnings, sync PROJECT.md, commit.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Socratic prompt rambles or asks bad questions | Medium | Tight prompt rules: max 3 sentences before question, must be grounded in numbers, must bold the question. Iterate prompt during smoke testing. |
| Users flip Socratic on, get frustrated, never see Direct | Low | Default is Direct. Mode is one tap to flip. Empty-state copy in Socratic explicitly says "I'll guide you with questions." |
| API rejects messages with `kind` field | Verified-Low | We filter mode-change markers from the API payload entirely (D7 + Phase 3 step 13). Anthropic only sees clean role/content pairs. |
| localStorage write failure breaks toggle | Low | Hook wraps writes in try/catch. UI still updates state in memory; persistence is best-effort. |
| Socratic prompt + long lesson exceeds 5000-char limit | Medium | `socraticPrompt.test.js` asserts <4500 chars for the longest subsection. If a future subsection blows this, the test fails before merge. |
| Mid-stream mode flip causes user confusion | Low | D8: in-flight response finishes under old prompt. Divider appears immediately so user sees the change took effect; it just applies on the next turn. |

## Out of Scope

- Practice-mode chat extension (separate deferred TODO)
- Conversation persistence across sessions (intentional, per v1 plan)
- Telemetry / cost tracking (separate task)
- Per-section mode override (one global preference is enough)
- Chat history / recall (still no)
- Voice mode, audio, etc.
- Three+ modes (Direct, Socratic, "Examiner", etc.). If demand emerges, the toggle becomes a select; not now.
- **Per-subsection `socraticSuggestions` seeds** (cut from this PR per eng review Issue 1). Will be tuned in a follow-up after observing real Socratic-mode usage. Generic seeds + gap-derived seeds cover the empty state.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | deferred | running post-implementation per Issue 2 decision |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | issues_found→resolved | Step 0: 1 scope reduction (cut socraticSuggestions). Architecture: 4 issues, 0 critical. Code Quality: 4 issues, all auto-applied. Test Review: 4 gaps (1 critical regression-risk T1 added, 2 defensive added, 1 load-bearing test added). Performance: 0 issues. All folded into plan. |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** ENG CLEARED — ready to implement. Codex challenge deferred to post-code review per user decision.
