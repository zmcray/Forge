---
title: Wave-based parallel agent backlog burndown with dependency-ordered merges
date: 2026-07-05
category: workflow-issues
module: process/parallel-agent-orchestration
problem_type: workflow_issue
component: development_workflow
severity: medium
applies_when:
  - "Burning down a large, well-specced backlog (10+ issues) with parallel background agents"
  - "Multiple agents working the same repo simultaneously via git worktrees, each opening its own PR"
  - "A keystone structural refactor has dependent issues queued behind it"
  - "Merging many PRs in one session where later issues' line numbers go stale after earlier merges"
tags: [parallel-agents, git-worktrees, wave-scheduling, file-overlap-analysis, merge-ordering, backlog-burndown, keystone-refactor, squash-merge]
---

# Wave-based parallel agent backlog burndown with dependency-ordered merges

## Context

The Forge repo had 23 open codebase-audit issues in Linear (source audit: `docs/plans/2026-07-01-001-codebase-review.md`), each well-specced with a per-issue file footprint. A single autonomous session cleared all 23, producing 26 merged PRs (#24-#49), with main's test count growing 479 to 679 and CI green throughout. Only 3 of 26 PRs conflicted. This doc codifies the orchestration method that made that throughput safe.

## Guidance

**1. Scope waves by file overlap, not just priority.** Before launching anything, map each issue's file footprint from its text. A wave is a set of issues with mostly-disjoint footprints. Keystone structural refactors (here: the App.jsx monolith split, MCR-412) get a wave of their own; anything touching files it will rewrite (route splitting MCR-400, timer containment MCR-407, context selectors MCR-404) waits until it merges. Interlocking refactors defer to later waves.

**2. One worktree agent per issue.** Each issue runs in a background agent with worktree isolation, branched off the same green main using the tracker's `gitBranchName`, TDD-first, full suite + build + lint before push, own PR with the issue ID in the title. Every agent prompt includes:

- the full issue spec inline (agents don't share the orchestrator's context)
- "Read the CURRENT file first; the issue's line numbers are stale."
- explicit scope fences naming sibling issues NOT to absorb, e.g. "Fix only the listed sites. Do NOT sweep the other 52 palette sites, that's MCR-443."
- hot-file guards when a wave-mate owns a shared file: "Do NOT touch App.jsx; another agent is restructuring it."

**3. Merge in dependency order between waves.** Squash-merge with the biggest-surface PR last:

```
data -> API -> hooks/storage -> UI -> tests -> docs
```

GitHub recomputes mergeability asynchronously; `UNKNOWN` means wait and re-check:

```bash
until [ "$(gh pr view N --json mergeable -q .mergeable)" != "UNKNOWN" ]; do sleep 5; done
```

On `CONFLICTING`: remove leftover agent worktrees first (they pin branches), check out the branch locally, `git merge origin/main`, resolve by combining both sides' intent rather than picking a winner, run the full suite, push, then merge. Re-baseline the suite on main after every wave.

**4. Verify-first for dependent issues.** Agents on issues a keystone refactor "should have fixed" must verify current reality before acting, never close on the refactor's reputation.

**Pitfalls observed:**

- `git add -A` during conflict resolution sweeps untracked local files into the PR. Stage specific paths.
- Leftover agent worktrees block `git checkout <branch>` in the main repo (`fatal: already checked out`), and a failed checkout followed by `git merge origin/main` merges into whatever branch IS checked out (main; a benign fast-forward here, but a real footgun). Clean worktrees before local conflict work.
- ~26 preview deploys in a day hit Vercel free-plan rate limits; only the Vercel check fails, so build/test checks remain the merge signal.

## Why This Matters

Throughput with safety: 23 issues in one session, 3 conflicts across 26 PRs, CI never red. Wave scoping converts merge conflicts from an emergent hazard into a scheduled, rare event; scope fences prevent duplicate or overlapping work across agents; dependency-ordered merges plus per-wave baselining keep main provably green at every step; verify-first prevents silent false "done"s on dependent issues.

## When to Apply

- Large, well-specced backlog: each issue names its files and acceptance criteria, so overlap is computable from issue text
- Green baseline on main and a full local test suite agents can run
- Squash-merge repo (linear main history keeps conflict resolution tractable)
- Not for exploratory or under-specced work; wave scoping requires knowing footprints up front

## Examples

**Wave assignment.** Naive: launch all 23 at once, and MCR-400/404/407 all collide with the MCR-412 App.jsx rewrite. Applied: MCR-412 ran solo in its wave; 400/404/407 waited for it to merge, then ran against the rewritten files.

**Conflict resolution combining intent.** Two PRs touched the same FinancialTable cell: one added dark-mode classes, the other replaced hand-rolled formatting with a shared `formatPercent` call. The resolution kept both (dark classes on the element that now calls the shared formatter), verified by the full suite before push.

**Verify-first payoff.** MCR-407 (timer containment) was assumed fixed by the App split. The agent, instructed to verify current reality, found the ticking hook was still mounted at App root, re-rendering the whole tree every second. It shipped a real structural fix (PracticeRoute owns the session) plus render-probe regression tests instead of rubber-stamping the issue done.

## Related

- AGENTS.md > Execution Rules > "Subagent Isolation" and "Branch Isolation": this doc is the scaled-up, worktree-based evolution of those rules
- AGENTS.md Compound Learning [2026-04-13] on squash-merge divergence ("push prep commits before cutting a feature branch"): same mechanics the dependency-ordered merge protocol addresses
- `docs/plans/2026-07-01-001-codebase-review.md`: the audit that produced the 23-issue backlog
