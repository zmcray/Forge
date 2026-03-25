---
title: "refactor: Extract React Contexts to eliminate prop drilling"
type: refactor
status: completed
date: 2026-03-23
deepened: 2026-03-23
---

# refactor: Extract React Contexts to eliminate prop drilling

## Enhancement Summary

**Deepened on:** 2026-03-23
**Agents used:** Architecture Strategist, Performance Oracle, Code Simplicity Reviewer, Frontend Races Reviewer, Pattern Recognition Specialist, Framework Docs Researcher, Context7 (React 19)

### Key Changes from Deepening
1. **Reduced scope**: Only ScoringContext is mandatory. Theme and Search stay as props (simplicity review).
2. **Timer isolation**: Timer must NOT be in PracticeContext. Keep as a standalone hook or separate context (performance review).
3. **React 19 syntax**: Use `<Context value={}>` directly, not deprecated `<Context.Provider>` (framework docs).
4. **Race condition fix**: `finishPractice` must use refs to read selectedCompany before nulling it (races review).
5. **Memoize context values**: Without useMemo, ScoringContext re-renders all consumers on any state change (performance review).
6. **Fix existing bug**: `PracticeRedirect` misuses `useState` as a side effect; should be `useEffect` (pattern review).

### New Considerations Discovered
- React 19 Compiler can auto-memoize context consumers (investigate enabling)
- `useKeyboardShortcuts` re-attaches listener every render due to unstable handler object
- `BAND_COLORS` in `format.js` uses raw Tailwind classes instead of design tokens

---

## Overview

Replace the 18-prop forwarding pattern in `App.jsx` -> `AppShellWrapper` with a focused ScoringContext provider. This is the only context that earns its weight; theme, search, and practice state pass only 1 level and are better left as props. This unblocks the LLM Dynamic Scenarios feature and improves DX.

## Problem Statement / Motivation

`App.jsx` owns all application state and passes 18+ props through `AppShellWrapper`, which exists solely as a routing intermediary that forwards props to child routes (`src/App.jsx:172-196`). The scoring data is the worst offender: it's consumed across HomeScreen, PracticeScreen, ProgressDashboard, and AppShell (streak), requiring 8+ props threaded through 2 levels.

Other state (theme, search, practice) passes only 1 level and doesn't justify the ceremony of a full context.

## Proposed Solution

**Create 1 mandatory context + 1 optional refactor:**

| What | Action | Rationale |
|------|--------|-----------|
| `ScoringContext` | **Create** | Used across 4+ components, 2 levels deep, 8+ props eliminated |
| Theme (`useTheme`) | **Keep as props** | 2 props, 1 level deep (App -> AppShell). Net-negative LOC if contextualized. |
| Search (`searchOpen`) | **Keep as props** | 1 boolean, 1 level. Context is absurd for this. |
| Practice state | **Refactor in App.jsx** | Keep timer as standalone hook. Fix the `finishCompany` race condition with refs. |

### Research Insights: React 19 Context

**Use new React 19 syntax** (from Context7 / React 19.1.1 docs):
```jsx
// React 19: render Context directly (not .Provider, which is deprecated)
<ScoringContext value={scoring}>
  {children}
</ScoringContext>
```

**React Compiler optimization**: The React Compiler (babel-plugin-react-compiler) can auto-memoize context consumers. Consider enabling in `vite.config.js`:
```js
react({
  babel: {
    plugins: [['babel-plugin-react-compiler', {}]]
  }
})
```
This eliminates the need for manual `useMemo` on context values in many cases. Evaluate after the refactor.

## Technical Considerations

**Architecture:**
- ScoringProvider wraps app in `main.jsx` (outermost, changes infrequently)
- `AppShellWrapper` stays but with fewer props (reduced from 18 to ~10)
- Only scoring-related components switch to context consumption

**Performance (from Performance Oracle):**
- **CRITICAL: Memoize the ScoringContext value.** Without `useMemo`, the value object is a new reference every render, causing all consumers to re-render on any App state change.
- **Split state from dispatch**: Components that only call `addScore` (like `QuestionCard`) should not re-render when scoring data changes. Two sub-contexts solve this.

```jsx
const ScoringStateContext = createContext(null);
const ScoringDispatchContext = createContext(null);

function ScoringProvider({ children }) {
  const scoring = useScoring();

  const state = useMemo(() => ({
    sessions: scoring.sessions,
    streak: scoring.streak,
  }), [scoring.data]);

  const dispatch = useMemo(() => ({
    addScore: scoring.addScore,
    updateSessionDuration: scoring.updateSessionDuration,
    getScoresByType: scoring.getScoresByType,
    getWeakSpots: scoring.getWeakSpots,
    getQuantitativeAccuracy: scoring.getQuantitativeAccuracy,
  }), [scoring.addScore, scoring.updateSessionDuration,
       scoring.getScoresByType, scoring.getWeakSpots,
       scoring.getQuantitativeAccuracy]);

  return (
    <ScoringStateContext value={state}>
      <ScoringDispatchContext value={dispatch}>
        {children}
      </ScoringDispatchContext>
    </ScoringStateContext>
  );
}
```

**Race Condition Fix (from Races Reviewer):**

The current `finishCompany` in `App.jsx:131-145` reads `selectedCompany` before nulling it. If moved into context, stale closures can cause it to read `null`. Fix with refs:

```jsx
const selectedCompanyRef = useRef(null);

// Mirror state to ref on every change
useEffect(() => {
  selectedCompanyRef.current = selectedCompany;
}, [selectedCompany]);

const finishPractice = useCallback(() => {
  const company = selectedCompanyRef.current; // ref = live value, not stale closure
  timer.stop();
  if (company) {
    scoring.updateSessionDuration(
      company._scenarioId || company.id,
      timer.elapsedMinutes
    );
    // ...
  }
}, [timer, scoring]);
```

**Timer must stay isolated (from Performance + Simplicity Reviews):**
- Timer ticks every second via `setInterval`
- If timer state is in PracticeContext, every consumer re-renders 1x/second
- Keep `useTimer` as a standalone hook called in App.jsx
- Only `TimerBar` and `SessionSummary` receive timer props (2 components)

**Testing:**
- Hook tests (`useScoring.test.js`, etc.) remain unchanged
- Component tests (`FinancialTable.test.jsx`, etc.) receive data as props and are unaffected
- Only HomeScreen and ProgressDashboard need context wrappers (they currently receive scoring as props)
- Create a minimal `renderWithScoringProvider` test helper

**Fix existing bug (from Pattern Review):**
`PracticeRedirect` at `App.jsx:258-263` uses `useState` as a side-effect trigger. Change to `useEffect`:
```jsx
function PracticeRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/", { replace: true }); }, [navigate]);
  return null;
}
```

## System-Wide Impact

- **Interaction graph**: ScoringContext.Provider sits at the top of the tree. Components switch from props to `useContext()`. No other callbacks or observers affected.
- **Error propagation**: No change. `useScoring` handles its own errors (localStorage try/catch).
- **State lifecycle risks**: None. State ownership stays with the hook; context only changes delivery.
- **Re-render scope**: With state/dispatch split, AppShell (which only reads `streak`) won't re-render when `addScore` is called. QuestionCard (which only calls `addScore`) won't re-render when data changes.

## Acceptance Criteria

- [ ] `ScoringContext` (state + dispatch split) wraps app; HomeScreen, ProgressDashboard consume via context
- [ ] Context values memoized with `useMemo`
- [ ] Timer stays as standalone hook, NOT in any context
- [ ] `finishCompany` uses ref to read selectedCompany before any state mutation
- [ ] `PracticeRedirect` fixed to use `useEffect` instead of `useState` side effect
- [ ] All 104 existing tests pass
- [ ] `src/test/renderWithProviders.jsx` helper exists
- [ ] No new npm dependencies
- [ ] React 19 `<Context value={}>` syntax used (not deprecated `.Provider`)

## Success Metrics

- Scoring-related props eliminated from AppShellWrapper (8 props removed)
- Zero test regressions
- No per-second re-renders in components that don't display the timer

## Dependencies & Risks

- **Risk: Over-rendering.** Mitigated by state/dispatch split + useMemo. If React Compiler is enabled, further optimization is automatic.
- **Risk: Stale closure in finishPractice.** Mitigated by ref-mirroring pattern.
- **Dependency: None.** Pure refactor with no external dependencies.

## MVP

### src/contexts/ScoringContext.jsx

```jsx
import { createContext, useContext, useMemo } from "react";
import useScoring from "../hooks/useScoring";

const ScoringStateContext = createContext(null);
const ScoringDispatchContext = createContext(null);

export function ScoringProvider({ children }) {
  const scoring = useScoring();

  const state = useMemo(() => ({
    sessions: scoring.sessions,
    streak: scoring.streak,
    data: scoring.data,
  }), [scoring.data]);

  const dispatch = useMemo(() => ({
    addScore: scoring.addScore,
    updateSessionDuration: scoring.updateSessionDuration,
    getAllScores: scoring.getAllScores,
    getScoresByType: scoring.getScoresByType,
    getWeakSpots: scoring.getWeakSpots,
    getQuantitativeAccuracy: scoring.getQuantitativeAccuracy,
  }), [scoring.addScore, scoring.updateSessionDuration,
       scoring.getAllScores, scoring.getScoresByType,
       scoring.getWeakSpots, scoring.getQuantitativeAccuracy]);

  return (
    <ScoringStateContext value={state}>
      <ScoringDispatchContext value={dispatch}>
        {children}
      </ScoringDispatchContext>
    </ScoringStateContext>
  );
}

export function useScoringState() {
  const ctx = useContext(ScoringStateContext);
  if (!ctx) throw new Error("useScoringState must be used within ScoringProvider");
  return ctx;
}

export function useScoringDispatch() {
  const ctx = useContext(ScoringDispatchContext);
  if (!ctx) throw new Error("useScoringDispatch must be used within ScoringProvider");
  return ctx;
}
```

### Implementation order (3 commits):

1. **Create ScoringContext + fix PracticeRedirect bug** - Create `src/contexts/ScoringContext.jsx`, wrap app in `main.jsx`, update HomeScreen + ProgressDashboard + AppShell to consume from context. Fix PracticeRedirect `useState` -> `useEffect`. Create `src/test/renderWithProviders.jsx`.
2. **Fix finishCompany race condition** - Add ref-mirroring for `selectedCompany` and `sessionQuestions` in App.jsx. Read from refs in `finishCompany` callback.
3. **Remove scoring props from AppShellWrapper** - Clean up the prop forwarding for scoring-related data. Reduce AppShellWrapper from 18 to ~10 props.

## Sources & References

- Current prop drilling: `src/App.jsx:172-196`
- Scoring hook: `src/hooks/useScoring.js:21-125`
- Timer hook: `src/hooks/useTimer.js:9-71` (keep isolated, do NOT contextualize)
- PracticeRedirect bug: `src/App.jsx:258-263` (useState misuse)
- React 19 Context docs: `<Context value={}>` replaces deprecated `<Context.Provider>`
- React Compiler: `babel-plugin-react-compiler` for auto-memoization
