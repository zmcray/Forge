---
title: "feat: LLM Chat for Concept Deep-Dives"
type: feat
status: completed
date: 2026-03-30
origin: ~/.gstack/projects/zmcray-Forge/ceo-plans/2026-03-30-llm-chat-deep-dives.md
---

# feat: LLM Chat for Concept Deep-Dives

## Overview

Add a contextual chat drawer to the Learn module that lets users ask questions about the concept they are currently studying. The drawer slides out from the right side of the content area, streams AI responses via Server-Sent Events, and includes a post-exercise "dig deeper" trigger that pre-populates suggested questions derived from LLM grading gaps. Users can save individual AI responses to their subsection notes.

This is the foundation for Forge's AI tutor trajectory. The chat infrastructure (streaming endpoint, context injection, conversation state) enables future features: Socratic mode, Practice mode chat, and argument attack mode.

## Problem Statement / Motivation

Forge's commit-first pedagogy is strong for structured practice, but when a user encounters an unfamiliar concept (e.g., "why is D&A added back to EBITDA?"), they have no way to get a contextual explanation without leaving the app. The current Learn module is static text + exercises. Adding contextual chat turns Forge from a practice tool into a learning companion.

The CEO review (see origin) identified an eureka insight: open-ended AI chat can hurt learning by letting students skip the struggle. Forge's commit-first architecture is already the right pedagogy. The chat should extend that pattern with contextual, just-in-time explanations triggered by learning moments, not replace it with a general Q&A box.

## Proposed Solution

**Contextual Chat Drawer** (Approach A from CEO review): Slide-out panel on right side of Learn content. Opens per-subsection with pre-loaded context. Suggested questions + free-form input. Streaming responses via new `/api/chat` endpoint.

Alternatives considered and rejected:
- **Inline Section** (bottom of page): simpler but user scrolls away from content
- **Floating Button + Modal**: most polished but highest complexity and scope creep risk

## Accepted Scope (from CEO review)

- Core chat drawer with streaming, suggested questions, context injection
- Markdown rendering in chat messages via react-markdown + remark-gfm
- Post-exercise trigger: "Want to dig deeper?" after LLM grading, with gap-derived questions
- Save to Notes button on individual AI responses (appends to subsection notes block)

## NOT in Scope

- **Socratic Mode Toggle** (deferred to TODOS.md): Direct vs Socratic chat mode. Good idea, but adds prompt complexity. Do after v1 validates chat usage.
- **Practice Mode Integration** (deferred to TODOS.md): Extend chat to /practice/:companyId with company financials context. Learn first, extend after validating the pattern.
- **Chat conversation persistence** (intentional): Conversations are ephemeral. No localStorage. Navigating away clears them. This keeps the feature simple and avoids localStorage growth concerns.
- **Chat history/recall**: No ability to view past conversations.

## Technical Approach

### Architecture

The chat feature adds 3 layers: a streaming API endpoint, a context-building hook, and a drawer UI component.

```
                                    +------------------+
                                    |  LearnModule.jsx |
                                    |  (drawer state)  |
                                    +--------+---------+
                                             |
                          +------------------+------------------+
                          |                  |                  |
                   +------+------+    +------+------+   +------+------+
                   | LearnSection|    | LearnExercise|  | ChatDrawer  |
                   | (toggle btn)|    | (dig deeper) |  | (messages,  |
                   +-------------+    +--------------+  |  input,     |
                                                        |  streaming) |
                                                        +------+------+
                                                               |
                                              +----------------+----------------+
                                              |                                 |
                                       +------+------+                   +------+------+
                                       | ChatMessage |                   |useChatContext|
                                       | (markdown,  |                   | (system     |
                                       |  save btn)  |                   |  prompt)    |
                                       +-------------+                   +------+------+
                                                                                |
                                                                         +------+------+
                                                                         | /api/chat   |
                                                                         | (SSE stream)|
                                                                         +-------------+
```

### Data Flow (Happy Path)

```
User types message
       |
       v
ChatDrawer: disable input, add user message to state
       |
       v
fetch("/api/chat", { method: "POST", body: { messages, systemPrompt } })
       |
       v
/api/chat: validate input, build Anthropic messages
       |
       v
client.messages.stream() -> async iterable of text chunks
       |
       v
SSE: res.write("data: {chunk}\n\n") per token
       |
       v
Client: ReadableStream reader, append chunks to assistant message
       |
       v
Stream complete -> SSE: res.write("data: {"type":"done"}\n\n") + res.end()
       |
       v
ChatDrawer: re-enable input, finalize assistant message in state
```

### Data Flow (Shadow Paths)

```
INPUT -----> VALIDATION -----> TRANSFORM -----> STREAM -----> RENDER
  |              |                 |               |             |
  v              v                 v               v             v
[empty msg?]  [too long?]     [SDK error?]   [timeout?]    [XSS in
  -> disable   -> 400          -> 502         -> show        markdown?]
  send btn     -> show error   -> show error   partial +    -> rehype-
[nil context?]                                "(interrupted)" sanitize
  -> fallback                  [429?]        [client abort?]
  generic PE                   -> "Too many"  -> AbortController
  context                                      .abort()
```

### Streaming Implementation

**API side** (`api/chat.js`):
- Uses `client.messages.stream()` from `@anthropic-ai/sdk`
- Returns a `ReadableStream` response with `Content-Type: text/event-stream`
- Each text delta chunk written as `data: {"type":"delta","text":"..."}\n\n`
- Stream completion signaled by `data: {"type":"done"}\n\n`
- Errors mid-stream: `data: {"type":"error","message":"..."}\n\n`

**Dev middleware** (`vite.config.js`):
- New `server.middlewares.use("/api/chat", ...)` entry
- Sets SSE headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`
- Reads request body, constructs Web API Request
- Dynamic import of `./api/chat.js`
- Calls handler, gets back a Response with ReadableStream body
- Pipes ReadableStream chunks to `res.write()` via async iterator
- Handles `req.on('close')` to signal client disconnect via AbortController

**Client side** (`ChatDrawer.jsx`):
- Uses `fetch()` with `AbortController.signal` for cancellation
- Reads `response.body.getReader()` as a `ReadableStream`
- Decodes chunks with `TextDecoder`, parses SSE `data:` lines
- Appends text deltas to the in-progress assistant message in state
- On `{"type":"done"}` event, finalizes the message

### Conversation Lifecycle

- Conversation state: `useState` in `LearnModule` as `chatMessages: [{ role, content }]`, passed to ChatDrawer as props.
- **State ownership (from eng review):** Messages are lifted to LearnModule so that closing and reopening the drawer preserves the conversation. ChatDrawer unmounts/remounts but messages persist in the parent.
- `useNotes` is also lifted to LearnModule so ChatMessage saves and NotesBlock edits share the same hook instance (no state divergence).
- Navigation to a different subsection clears messages via `useEffect` (setChatMessages([])).
- Max 10 turns (20 messages). When exceeded, oldest user+assistant pair is dropped. System prompt includes a trim notification so the model knows earlier context was removed.
- Staying on the same subsection preserves the conversation.
- Browser refresh clears it (no localStorage persistence, by design).
- Closing the drawer preserves the conversation (same subsection). Reopening on the same subsection resumes it (messages live in parent).

### System Prompt Template

```
You are a PE deal analysis tutor helping a learner understand {subsectionTitle}.
Keep responses concise (2-3 paragraphs max). Use Summit Mechanical Services
numbers when giving examples. Format with markdown for clarity.

CURRENT LESSON:
{subsection text content blocks joined}

COMPANY DATA (if applicable):
{company financials for referenced companyId, or "N/A"}

LEARNER PROGRESS:
Completed: {list of completed subsection IDs}
Current: {current subsection ID and title}

{IF post-exercise trigger}
RECENT EXERCISE RESULT:
Score: {llmResult.score}/5
Gaps identified: {llmResult.gaps joined}
The learner clicked "dig deeper" after this result. Focus your
explanations on the gaps above.
{END IF}
```

### Context Budget

- System prompt: ~1000 tokens (subsection text + company data + progress + grading)
- Conversation history: ~3000 tokens (max 10 turns)
- Well within claude-haiku-4-5's context window

## Technical Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Streaming protocol | SSE via fetch + ReadableStream | Native browser API, no dependency. EventSource doesn't support POST bodies. |
| 2 | Model | claude-haiku-4-5 | Same as evaluate.js. Optimized for speed + cost. |
| 3 | Conversation persistence | None (ephemeral) | Avoids localStorage growth. Chat is contextual, not archival. |
| 4 | Markdown rendering | react-markdown + remark-gfm | Standard React markdown renderer. GFM for tables and code blocks. |
| 5 | XSS protection | rehype-sanitize + disallowedElements={["script"]} | Explicitly disable raw HTML in markdown output. |
| 6 | Drawer state location | LearnModule useState | Parent owns drawer state; passes toggle callback to children. |
| 7 | Chat context builder | useChatContext hook | Builds system prompt from subsection data, progress, and grading. Pluggable for future Practice mode. |
| 8 | Client disconnect handling | AbortController on fetch + req.on('close') on server | Prevents orphaned Anthropic streams on navigation or drawer close. |

## System-Wide Impact

- **Interaction graph:** User click -> ChatDrawer sends message -> fetch to /api/chat -> Anthropic SDK streams response -> SSE chunks piped to client -> ChatMessage renders markdown. Save to Notes: ChatMessage -> useNotes.setNoteText() -> localStorage write.
- **Error propagation:** Anthropic SDK errors caught in api/chat.js, sent as SSE error events. Client reads error event, displays inline message, re-enables input. No silent failures.
- **State lifecycle risks:** Conversation state is ephemeral (useState only). No persistence means no orphaned state risk. The only persistent write is Save to Notes, which appends to existing localStorage notes (atomic write via JSON.stringify).
- **API surface parity:** New endpoint /api/chat follows exact same patterns as /api/evaluate (auth, validation, Anthropic SDK, Vercel serverless config). No divergence.
- **Bundle impact:** react-markdown + remark-gfm + rehype-sanitize add to client bundle. Anthropic SDK stays external (rollupOptions.external).

## Implementation Phases

### Phase 1: API + Streaming Infrastructure

**Step 1: Create `/api/chat.js` endpoint**

New file: `app/api/chat.js`

```javascript
// Follows evaluate.js patterns exactly:
// - Module-level Anthropic client init
// - Conditional auth via x-forge-token / FORGE_AUTH_TOKEN
// - Input validation (messages array, systemPrompt string, length limits)
// - export const config = { maxDuration: 30 }

export async function POST(request) {
  // Auth check (same as evaluate.js lines 40-46)
  // Parse body: { messages: [{role, content}], systemPrompt: string }
  // Validate: messages is array, each has role + content string
  // Validate: systemPrompt is string, under 5000 chars
  // Validate: messages.length <= 20 (10 turns)

  // Pass request.signal to the SDK to abort the Anthropic stream on client disconnect.
  // Without this, a disconnected client still consumes tokens server-side.
  const stream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: messages,
    signal: request.signal,
  });

  // Return SSE ReadableStream response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta?.text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Chat unavailable" })}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

**Step 2: Add SSE dev middleware to `vite.config.js`**

Modify: `app/vite.config.js`

Add a new `server.middlewares.use("/api/chat", ...)` block inside `apiDevPlugin()`. This is the primary implementation complexity.

```javascript
server.middlewares.use("/api/chat", async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  // Parse body (same pattern as /api/evaluate)
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  // SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  // AbortController for client disconnect
  const ac = new AbortController();
  req.on("close", () => ac.abort());

  try {
    const { POST } = await import("./api/chat.js");
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", ...Object.fromEntries(
        Object.entries(req.headers).filter(([k]) => k.startsWith("x-"))
      )},
      body: JSON.stringify(body),
      signal: ac.signal,
    });

    const response = await POST(request);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (ac.signal.aborted) { reader.cancel(); break; }
      res.write(decoder.decode(value, { stream: true }));
    }
  } catch (err) {
    if (!ac.signal.aborted) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Chat unavailable" })}\n\n`);
    }
  } finally {
    res.end();
  }
});
```

**Gotcha:** Use `{ signal: abortController.signal }` when piping the Anthropic stream to avoid orphaned streams on client disconnect. Test AbortController cancellation explicitly in dev mode.

### Phase 2: Context Building

**Step 3: Create `useChatContext` hook**

New file: `app/src/hooks/useChatContext.js`

Builds the system prompt from:
1. Current subsection's text content blocks (joined)
2. Company data for any `companyData` blocks in the subsection
3. Learner progress from `useLearnProgress` (completed subsection IDs)
4. Recent exercise grading result (if post-exercise trigger)

```javascript
export default function useChatContext({
  subsection,     // Current subsection object from LEARN_CONTENT
  completedIds,   // Array of completed exercise IDs from useLearnProgress
  llmResult,      // Recent LLM grading result (or null)
  messageCount,   // Current message count (for trim notification)
}) {
  // Extract ONLY text blocks from subsection (exclude exercises, tables, companyData)
  // This keeps the system prompt within ~1000 tokens even for content-heavy subsections.
  // Filter: subsection.blocks.filter(b => b.type === "text").map(b => b.content).join("\n")
  // Look up company data for any companyData blocks (summary only, not full financials)
  // Build system prompt string from template
  // If messageCount > 18 (approaching 10-turn limit), append to system prompt:
  //   "Note: earlier messages in this conversation were trimmed for length. Do not reference information from trimmed messages."
  // Derive suggested questions:
  //   - Static: from subsection.suggestedQuestions (if defined in learnContent.js)
  //   - Dynamic: from llmResult.gaps (e.g., "Can you explain {gap} in more detail?")
  // Return { systemPrompt, suggestedQuestions }
}
```

Design as a pluggable function from the start. The TODOS already document extending chat to Practice mode, which requires different context (company financials instead of lesson content).

**Step 4: Add `suggestedQuestions` to `learnContent.js`**

Modify: `app/src/data/learnContent.js`

Add `suggestedQuestions` arrays to each subsection. 2-3 questions per subsection that guide curiosity:

```javascript
{
  id: "s1a",
  title: "1A. Gross Margin",
  suggestedQuestions: [
    "Why does gross margin matter more than revenue for PE investors?",
    "How would a 2% drop in COGS impact Summit's valuation?",
  ],
  blocks: [ ... ]
}
```

### Phase 3: Chat UI Components

**Step 5: Create `ChatMessage` component**

New file: `app/src/components/learn/ChatMessage.jsx`

Renders a single chat message with:
- Role indicator (user or assistant)
- Markdown rendering via react-markdown + remark-gfm for assistant messages
- rehype-sanitize for XSS protection
- "Save to Notes" button on assistant messages. Save logic: call `getNoteText(noteId)` to read existing note text, append the AI response with a `\n--- (from AI chat) ---\n` separator, then call `setNoteText(noteId, combinedText)`. This read-then-append pattern avoids overwriting user-authored notes. The `noteId` is derived from the subsection's notes block: `subsection.blocks.find(b => b.type === "notes")?.id` (e.g., `notes-s1a`). If no notes block exists in the subsection, the Save button is hidden.
- Streaming behavior: during active streaming, display response as plain text with blinking cursor. On stream completion, re-render with react-markdown for full formatting. This avoids expensive markdown re-parses on every token chunk.

Design tokens:
- User messages: `bg-surface-container-low` with `text-on-surface`
- Assistant messages: `bg-secondary-container` with `text-on-surface`
- Save button: `text-xs text-primary hover:opacity-80`

**Step 6: Create `ChatDrawer` component**

New file: `app/src/components/learn/ChatDrawer.jsx`

The main chat panel component. Manages:
- Message list with auto-scroll to bottom
- Text input with send button (Enter to send, Shift+Enter for newline)
- Suggested question chips (clickable, populate input and auto-send)
- Streaming state (input disabled while streaming)
- Error display inline in message list
- Close button

```
+-------------------------------------------+
| Chat: {subsectionTitle}            [X]    |
+-------------------------------------------+
| [Suggested Q chip] [Suggested Q chip]     |
+-------------------------------------------+
|                                           |
| User: Why is D&A added back?             |
|                                           |
| AI: Great question! Depreciation and...  |
|     [Save to Notes]                       |
|                                           |
+-------------------------------------------+
| [Type a question...]          [Send ->]   |
+-------------------------------------------+
```

State managed here (internal streaming state only; messages and useNotes are lifted to LearnModule):
- `isStreaming` (boolean, disables input)
- `streamingText` (partial assistant response being built)
- `error` (inline error message)

Props received from LearnModule:
- `messages` / `setMessages` (conversation array, lifted for close/reopen persistence)
- `getNoteText` / `setNoteText` (from useNotes, lifted for sync with NotesBlock)

Streaming logic:
```javascript
const sendMessage = async (text) => {
  const userMsg = { role: "user", content: text };
  const newMessages = [...messages, userMsg];
  setMessages(newMessages);
  setIsStreaming(true);
  setStreamingText("");

  const ac = new AbortController();
  abortRef.current = ac;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
      },
      body: JSON.stringify({ messages: newMessages, systemPrompt }),
      signal: ac.signal,
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    // SSE line parser: buffer incoming text, split on double-newline event boundaries.
    // ReadableStream chunks do NOT align with SSE events, so we must buffer partial lines.
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE events (separated by \n\n)
      const events = buffer.split("\n\n");
      buffer = events.pop(); // Keep incomplete trailing data for next iteration
      for (const event of events) {
        const dataLine = event.split("\n").find(l => l.startsWith("data: "));
        if (!dataLine) continue;
        let payload;
        try { payload = JSON.parse(dataLine.slice(6)); } catch { continue; } // Skip malformed events
        if (payload.type === "delta") {
          fullText += payload.text;
          setStreamingText(fullText);
        } else if (payload.type === "error") {
          setError(payload.message);
        }
        // payload.type === "done" handled by the while loop ending
      }
    }

    setMessages(prev => [...prev, { role: "assistant", content: fullText }]);
  } catch (err) {
    if (err.name !== "AbortError") {
      setError("Something went wrong. Try rephrasing your question.");
    }
  } finally {
    setIsStreaming(false);
    setStreamingText("");
  }
};
```

Responsive behavior:
- Desktop (>=1024px): Drawer slides from right, content area shrinks. `w-96` fixed width.
- Tablet (768-1023px): Drawer overlays as right-side panel with `bg-black/40` backdrop.
- Mobile (<768px): Full-screen overlay. Close button prominent. Same pattern as mobile sidebar in AppShell.

**Step 7: Wire drawer state in `LearnModule.jsx`**

Modify: `app/src/components/learn/LearnModule.jsx`

Add state:
```javascript
const [chatOpen, setChatOpen] = useState(false);
const [chatContext, setChatContext] = useState(null); // { llmResult, trigger }
const [chatMessages, setChatMessages] = useState([]);
const { getNoteText, setNoteText, clearNote } = useNotes();
```

**State ownership rationale (from eng review):** Messages and useNotes are lifted to LearnModule so that:
1. Closing and reopening the drawer preserves the conversation (ChatDrawer unmounts/remounts but messages persist in parent)
2. Save to Notes from ChatMessage and typing in NotesBlock share the same hook instance (no state divergence)

Pass `onOpenChat` callback to `LearnSection` (for toggle button) and `LearnExercise` (for dig deeper trigger). Pass drawer state, messages, and notes functions to `ChatDrawer`.

Layout change: wrap the content area in a flex container that accommodates the drawer:
```jsx
<div className="flex-1 min-w-0 flex gap-4">
  <div className={`${chatOpen ? "flex-1 min-w-0" : "w-full"} transition-all duration-200`}>
    {/* existing content card */}
  </div>
  {chatOpen && (
    <ChatDrawer
      subsection={activeSub}
      chatContext={chatContext}
      messages={chatMessages}
      setMessages={setChatMessages}
      getNoteText={getNoteText}
      setNoteText={setNoteText}
      onClose={() => { setChatOpen(false); setChatContext(null); }}
    />
  )}
</div>
```

Clear conversation when subsection changes:
```javascript
useEffect(() => {
  setChatOpen(false);
  setChatContext(null);
  setChatMessages([]);
}, [currentSection, currentSubsection]);
```

**Sidebar collapse (from outside voice review):** When chat drawer opens on screens <1400px, auto-collapse the nav sidebar to icons-only mode (w-16). The AppShell sidebar already supports collapsed mode. Add a `useEffect` that detects `chatOpen && window.innerWidth < 1400` and triggers collapse.

**Step 8: Add chat toggle to `LearnSection.jsx`**

Modify: `app/src/components/learn/LearnSection.jsx`

Accept new prop `onOpenChat` from `LearnModule`. Add a chat icon button next to the subsection title:
```jsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-bold text-on-surface">{subsection.title}</h2>
  <button
    onClick={onOpenChat}
    className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
    title="Ask about this concept"
  >
    <span className="material-symbols-outlined text-on-surface-variant text-xl">chat</span>
  </button>
</div>
```

Also forward `onOpenChat` to `LearnExercise` in the block render loop. In the `block.type === "exercise"` branch:
```jsx
<LearnExercise
  key={block.id}
  exercise={block}
  isComplete={isComplete(block.id)}
  onComplete={onExerciseComplete}
  onOpenChat={onOpenChat}  // Thread through for "dig deeper" trigger
/>
```

**Step 9: Add "dig deeper" trigger to `LearnExercise.jsx`**

Modify: `app/src/components/learn/LearnExercise.jsx`

After the LLM grading display block (the `{!isQuantitative && llmResult && <LLMGrading ... />}` section), add:
```jsx
{!isQuantitative && llmResult && (
  <button
    onClick={() => onOpenChat({ llmResult, trigger: "post-exercise" })}
    className="text-xs text-primary hover:opacity-80 mt-1"
  >
    Want to dig deeper?
  </button>
)}
```

This calls `onOpenChat` with the grading result, which LearnModule passes to ChatDrawer. The `useChatContext` hook uses `llmResult.gaps` to generate gap-derived suggested questions.

### Phase 4: Dependencies + Polish

**Step 10: Install dependencies**

```bash
cd app && npm install react-markdown remark-gfm rehype-sanitize
```

**Step 11: Verify bundle guard**

Confirm `@anthropic-ai/sdk` remains in `rollupOptions.external` in vite.config.js. Run `npm run build` and check bundle size delta from adding react-markdown.

**Step 12: Verify vercel.json**

Vercel serverless functions in `api/` take precedence over SPA rewrites by convention. This is already validated by the existing `/api/evaluate` endpoint working in production. Verify the `/api/chat` endpoint deploys correctly alongside `/api/evaluate` by testing in Vercel preview deployment before merging to main.

### Phase 5: Tests

**Step 13: ChatDrawer tests**

New file: `app/src/test/ChatDrawer.test.jsx`

- Renders with subsection title
- Displays suggested question chips
- Input disabled while streaming
- Send button disabled on empty input
- Close button calls onClose
- Error message displays on failed send
- Auto-scrolls on new message

**Step 14: ChatMessage tests**

New file: `app/src/test/ChatMessage.test.jsx`

- Renders user message (plain text)
- Renders assistant message (markdown)
- Save to Notes button appears on assistant messages
- Save to Notes appends to existing notes
- No Save button on user messages

**Step 15: useChatContext tests**

New file: `app/src/test/useChatContext.test.js`

- Builds system prompt with subsection text
- Includes company data when companyData blocks present
- Includes learner progress
- Includes LLM grading gaps when post-exercise trigger
- Returns static suggested questions from subsection
- Returns gap-derived questions when llmResult provided

**Step 16: ChatDrawer advanced tests (from eng review)**

New file: `app/src/test/ChatDrawerAdvanced.test.jsx`

- SSE buffer parsing: partial chunk across two reads reassembles correctly
- SSE buffer parsing: malformed JSON event is skipped (JSON.parse guard)
- Max turns trimming: oldest user+assistant pair dropped at 10 turns
- AbortController fires on drawer close during streaming
- Suggested question click sends immediately (not just populates input)
- Plain text displayed during streaming, markdown rendered on completion
- Double-click send prevention (isStreaming disables)
- Very long message shows char count warning

**Step 17: LearnModule drawer integration tests (from eng review)**

New file: `app/src/test/LearnModuleChat.test.jsx`

- Chat drawer opens when onOpenChat called
- Messages clear on subsection navigation
- Layout adjusts (flex container) when drawer is open
- Close and reopen drawer preserves messages (lifted state)
- useNotes shared between ChatDrawer and NotesBlock (no state divergence)

**Step 18: Modified component tests (from eng review)**

New file: `app/src/test/ChatTriggers.test.jsx`

- LearnSection: chat icon button renders and fires onOpenChat callback
- LearnExercise: "Dig deeper" button appears only after LLM grading
- LearnExercise: "Dig deeper" passes llmResult to onOpenChat
- ChatMessage: No Save button when subsection lacks notes block

**Step 19: API endpoint tests (from eng review)**

New file: `app/src/test/apiChat.test.js`

- Validates missing messages array returns 400
- Validates messages > 20 returns 400
- Validates systemPrompt > 5000 chars returns 400
- Auth check: valid token passes, invalid token returns 401, no token configured skips auth
- Note: Uses mock Anthropic SDK (same pattern as if evaluate.js had tests)

**Step 20: Run full test suite**

All existing 145 tests + new tests (~39 total new) must pass. Run `npm test`.

## Error Handling & Edge Cases

| Scenario | Behavior | Tested? |
|----------|----------|---------|
| API timeout (>25s) | Show "Response timed out. Try a shorter question." in chat | Yes |
| SSE connection drops mid-stream | Display partial response + "(interrupted)" suffix. Re-enable input. | Yes |
| User navigates away during stream | AbortController cancels fetch. Conversation state cleared. | Yes |
| User sends message while streaming | Disabled. Input + send button disabled during streaming. | Yes |
| Rate limiting (429) | Show "Too many requests. Wait a moment and try again." | Yes |
| Malformed/empty response | Show "Something went wrong. Try rephrasing your question." | Yes |
| No subsection context available | Fallback to generic PE learning context. Should not happen in normal flow. | No (defensive) |
| Double-click send | Disabled after first click (isStreaming = true). | Yes |
| Very long user message | API validates max 2000 chars. Client shows char count when over 1500. | Yes |
| Very long AI response | max_tokens: 1024. Markdown renders with scroll if needed. | Yes |
| Drawer close during streaming | AbortController.abort(). Partial response discarded. | Yes |
| Max turns exceeded (10) | Oldest user+assistant pair dropped. User notified: "Older messages trimmed." | Yes |
| Browser refresh | Conversation cleared (ephemeral). No data loss. | N/A |

## Mobile / Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>=1024px) | Drawer slides from right, content shrinks. Nav + content + drawer visible. |
| Tablet (768-1023px) | Drawer overlays as right panel with backdrop. Content visible but dimmed. |
| Mobile (<768px) | Full-screen overlay. Close button prominent. Same pattern as mobile sidebar. |

## Save to Notes Integration

Save button appears on each AI response message (only if the subsection has a `notes` block). On click:
- Derive noteId from `subsection.blocks.find(b => b.type === "notes")?.id` (e.g., `notes-s1a`)
- Read existing text: `const existing = getNoteText(noteId)`
- Append: `setNoteText(noteId, existing ? existing + "\n--- (from AI chat) ---\n" + aiText : aiText)`
- This read-then-append pattern avoids overwriting user-authored notes. The `useNotes` hook only has `setNoteText` (replace), not an append method, so the ChatMessage component must handle the concatenation.
- Brief inline "Saved!" confirmation (fades after 2s)
- If the subsection has no `notes` block, the Save button is hidden

## Acceptance Criteria

### Functional Requirements

- [ ] Chat icon button appears in subsection header; clicking it opens the chat drawer
- [ ] Chat drawer shows subsection title, suggested questions, message input
- [ ] User can type a question and receive a streaming AI response
- [ ] AI responses render with markdown formatting (headers, code blocks, tables, lists)
- [ ] "Want to dig deeper?" link appears after LLM exercise grading
- [ ] Clicking "dig deeper" opens drawer with gap-derived suggested questions
- [ ] Clicking a suggested question sends it immediately
- [ ] "Save to Notes" button on AI responses appends to subsection notes
- [ ] Navigating to a different subsection clears the conversation
- [ ] Input is disabled during streaming
- [ ] Drawer works on desktop (side panel), tablet (overlay), and mobile (full screen)
- [ ] Dark mode: all new components use design tokens correctly
- [ ] Max 10 conversation turns; older messages trimmed with notice

### Non-Functional Requirements

- [ ] Streaming response starts rendering within 500ms of send
- [ ] No visible UI jank when drawer opens/closes (transition-all duration-200)
- [ ] Bundle size increase from react-markdown < 50KB gzipped
- [ ] No XSS vulnerability from markdown rendering (rehype-sanitize)
- [ ] AbortController cancels in-flight requests on navigation and drawer close

### Quality Gates

- [ ] All existing 145 tests pass (no regressions)
- [ ] New tests for ChatDrawer, ChatMessage, useChatContext
- [ ] `npm run build` succeeds with no warnings
- [ ] Manual smoke test: open drawer, send message, see streaming response, save to notes

## Dependencies & Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SSE streaming in Vite dev middleware is tricky | Medium | Pattern well-documented in CEO plan. Test AbortController explicitly. |
| react-markdown bundle bloat | Low | Library is ~30KB gzipped. Monitor with build output. |
| Anthropic SDK streaming API changes | Low | SDK version pinned at ^0.80.0. stream() API is stable. |
| Vercel SSE timeout | Low | maxDuration: 30 matches evaluate.js. Chat responses finish in <10s. |
| localStorage growth from Save to Notes | Low | Notes are small text appends. Existing useNotes handles this. |

## New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `react-markdown` | Render markdown in chat messages | ~25KB gzip |
| `remark-gfm` | GitHub Flavored Markdown (tables, strikethrough, code) | ~5KB gzip |
| `rehype-sanitize` | XSS protection for rendered HTML | ~3KB gzip |

## Files Summary

### New Files (11)

| File | Purpose |
|------|---------|
| `app/api/chat.js` | Streaming chat endpoint with Anthropic SDK, SSE response format |
| `app/src/components/learn/ChatDrawer.jsx` | Slide-out panel: messages, input, suggested questions, responsive |
| `app/src/components/learn/ChatMessage.jsx` | Message bubble: react-markdown rendering + Save to Notes button |
| `app/src/hooks/useChatContext.js` | Builds system prompt from subsection + progress + grading gaps |
| `app/src/test/ChatDrawer.test.jsx` | Tests for ChatDrawer rendering, input behavior, streaming states |
| `app/src/test/ChatMessage.test.jsx` | Tests for markdown rendering, Save to Notes read-append-write |
| `app/src/test/useChatContext.test.js` | Tests for system prompt building, suggested question derivation |
| `app/src/test/ChatDrawerAdvanced.test.jsx` | Tests for SSE buffer parsing, max turns, abort, plain-text streaming |
| `app/src/test/LearnModuleChat.test.jsx` | Tests for drawer state, message persistence, useNotes sharing |
| `app/src/test/ChatTriggers.test.jsx` | Tests for chat button, dig deeper trigger, conditional Save button |
| `app/src/test/apiChat.test.js` | Tests for endpoint validation, auth, error responses |

### Modified Files (5)

| File | Changes |
|------|---------|
| `app/src/components/learn/LearnModule.jsx` | Chat drawer state (open/close), toggle callback, layout adjustment for drawer, clear on navigation |
| `app/src/components/learn/LearnSection.jsx` | Chat toggle icon button in subsection header, accept onOpenChat prop |
| `app/src/components/learn/LearnExercise.jsx` | "Dig deeper" trigger link after LLM grading, accept onOpenChat prop |
| `app/src/data/learnContent.js` | `suggestedQuestions` arrays per subsection |
| `app/vite.config.js` | SSE-compatible dev middleware for /api/chat endpoint |

## Existing Code to Reuse

| What | Where | How |
|------|-------|-----|
| Anthropic SDK client init | `api/evaluate.js:1-3` | Same pattern: module-level `const client = new Anthropic()` |
| Auth check | `api/evaluate.js:40-46` | Same conditional token check |
| Input validation | `api/evaluate.js:58-77` | Same type/length checks adapted for messages array |
| Vite middleware body parsing | `vite.config.js:28-37` | Same chunk reading + JSON.parse |
| Design tokens | `index.css` | `bg-surface-container-low`, `bg-secondary-container`, `text-on-surface-variant` |
| useNotes hook | `hooks/useNotes.js` | Save to Notes integration, same getNoteText/setNoteText API |
| LLMFeedbackSkeleton pattern | `components/LLMFeedback.jsx` | Skeleton shimmer pattern for "AI is typing" indicator |
| AppShell overlay pattern | `components/AppShell.jsx` | Mobile overlay + backdrop pattern for responsive drawer |
| evaluateAnswer fetch pattern | `utils/evaluateAnswer.js` | Auth header, AbortSignal patterns |

## Verification

1. `npm test` ... all existing 145 tests + new tests pass
2. `npm run dev` ... verify:
   - Chat icon appears in subsection headers
   - Click opens drawer, suggested questions visible
   - Type question, send, streaming response appears
   - Markdown renders correctly (try "explain with a table")
   - Post-exercise: complete an exercise, see "Want to dig deeper?"
   - Click dig deeper, gap-derived questions appear
   - Save to Notes works (check NotesBlock shows appended text)
   - Navigate to different subsection, conversation clears
   - Mobile viewport: drawer becomes full-screen overlay
   - Dark mode: all tokens render correctly
3. `npm run build` ... production build succeeds, bundle size reasonable

## Sources & References

### Origin

- **Origin document:** [CEO Plan: LLM Chat for Concept Deep-Dives](~/.gstack/projects/zmcray-Forge/ceo-plans/2026-03-30-llm-chat-deep-dives.md). Key decisions carried forward: Contextual Chat Drawer approach, SSE streaming, claude-haiku-4-5, ephemeral conversation state, post-exercise trigger, save to notes, markdown rendering.

### Internal References

- Existing API pattern: `app/api/evaluate.js`
- Vite dev middleware: `app/vite.config.js:17-61`
- Learn module hierarchy: `app/src/components/learn/LearnModule.jsx`
- Notes hook: `app/src/hooks/useNotes.js`
- LLM feedback UI: `app/src/components/LLMFeedback.jsx`
- Design tokens: `app/src/index.css`

## Eng Review Decisions

Decisions incorporated from `/plan-eng-review` on 2026-03-30:

1. **Plain text during streaming**: Display response as plain text during active streaming. Render with react-markdown only on stream completion. Avoids expensive markdown re-parses on every token chunk.
2. **Lift useNotes to LearnModule**: Call `useNotes()` once in LearnModule, pass functions to both ChatDrawer and LearnSection. Prevents state divergence between Save to Notes and NotesBlock.
3. **Lift messages to LearnModule**: `chatMessages` state lives in LearnModule. ChatDrawer receives as props. Closing/reopening drawer preserves conversation. Navigation clears via useEffect.
4. **JSON.parse guard in SSE parser**: Wrap `JSON.parse(dataLine.slice(6))` in try/catch with `continue`. Prevents crash on malformed server events.
5. **Filter text blocks in useChatContext**: Only include `text` type blocks in system prompt. Exclude exercises, tables, companyData. Keeps context within budget.
6. **Trim notification**: When messages are trimmed (oldest pair dropped), add note to system prompt so model knows earlier context was removed.
7. **Sidebar auto-collapse**: Auto-collapse nav sidebar (w-16) when chat opens on screens <1400px. Prevents content area from being crushed.
8. **Comprehensive test coverage**: 4 additional test files (39 total new tests) covering SSE parser edge cases, drawer state persistence, component triggers, and API validation.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAR | 5 proposals, 3 accepted, 2 deferred |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | -- | -- |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 3 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | -- | -- |
| Outside Voice | (claude subagent) | Independent plan challenge | 1 | issues_found | 3 valid catches incorporated |

**VERDICT:** CEO + ENG CLEARED -- ready to implement.
