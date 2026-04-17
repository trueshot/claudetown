# Opus 4.7 — Nimbus Impact Analysis

_Researched: 2026-04-17 by claudetown gen-2 (running on Opus 4.7 — released yesterday)_

## What Changed in Opus 4.7

### Breaking API Changes (matter for any Nimbus tooling calling the API)
- **Extended thinking budgets REMOVED** — `thinking: {type: "enabled", budget_tokens: N}` returns 400
- **Adaptive thinking is mandatory** on 4.7 — it's the only mode. Sending `thinking: {type: "enabled", budget_tokens: N}` returns 400. On direct API calls, still set `thinking: {type: "adaptive"}` explicitly.
- **Sampling params removed** — non-default `temperature`/`top_p`/`top_k` return 400
- **Thinking content hidden by default** — must opt in via `thinking.display: "summarized"`
- **New tokenizer** — ~1.0x-1.35x more tokens for same text. Cost models need re-baselining. Give `max_tokens` more headroom.
- **New `xhigh` effort level** between high and max; new recommended default for coding/agentic

### New Capabilities
- **Task Budgets (beta)** — `task-budgets-2026-03-13` header. `output_config.task_budget: {type: "tokens", total: N}`. Advisory token budget across the full agentic loop (thinking + tools + output). Min 20k. Model sees running countdown and paces itself.
- **High-res vision** — 2576px / 3.75MP (3x bigger than 4.6). Coordinates map 1:1 to actual pixels.
- **1M context at flat pricing** — confirmed, no long-context premium

### Agentic Behavior Changes
- **Fewer subagents spawned by default** — steerable but default is more conservative
- **Fewer tool calls, more reasoning** — raising effort increases tool use
- **More regular progress updates** — drop "print status every N steps" scaffolding
- **More literal instruction following** — won't silently generalize or infer unrequested actions
- **+14% on multi-step workflows**, ~1/3 the tool errors, fewer tokens

### Benchmarks vs 4.6
- SWE-bench Pro: 64.3% (up from 53.4%)
- MCP-Atlas (tool use): 77.3% (up from 75.8%)
- OSWorld-Verified: 78.0% (up from 72.7%)
- Rakuten-SWE-Bench: **3x more production tasks resolved**

## Re-evaluating Nimbus Convergence

### No change to core assessment
The big Nimbus moats (evolution, billets, cross-corporal messaging at scale, generational identity) remain unthreatened. 4.7 is a better model, not a new architectural pattern.

### What 4.7 changes for us

**1. Corporal tooling calls need updating**
Any code in ticktockman / corporal-spawner / convo2 that sets `thinking.budget_tokens`, `temperature`, `top_p`, or `top_k` will break on 4.7. Anthropic ships a migration skill that auto-applies these fixes.

**2. Cost model needs re-baselining**
35% token inflation from the new tokenizer. If we've been budgeting corporal context/cost based on token counts, those numbers are no longer accurate.

**3. Task budgets could help ticktockman**
Per-corporal token budgets as a first-class primitive. Could be used to cap runaway corporal sessions without killing them — corporal sees the budget and paces itself. Worth prototyping for corporals that tend to over-run.

**4. Fewer default subagents may affect research corporals**
If any corporal relies on Opus's default aggressive parallelism (spawning multiple subagents for research), 4.7 will do less of this by default. Need explicit prompting to restore. Low impact — most corporals delegate to billets, not to subagents.

**5. File-system memory is better**
4.7 is specifically better at scratchpads and file-based memory across turns. This slightly reduces the pressure on fog for single-corporal continuity, but doesn't touch fog's cross-corporal advantage.

**6. More literal instruction following**
Good for corporals following procedures. Might require slightly more explicit CLAUDE.md and billet inject text — 4.7 won't silently fill gaps.

### What to watch

**Managed Agents REST API** — claims 10x faster enterprise agent launch. Notion, Rakuten, Asana on board. Still doesn't handle lifecycle/billets/evolution, but the scheduled-task overlap with ticktockman is getting real.

**Routines** — Anthropic's scheduled Claude Code. Could replace simple cron-like ticktockman tasks. Daily caps (Pro 5 / Max 15 / Team 25) limit enterprise-scale use.

## Immediate Action Items

1. **Audit API calls** for `thinking.budget_tokens`, sampling params — update for 4.7 compatibility
2. **Set effort level** via settings.json (`effortLevel: "xhigh"`), env var (`CLAUDE_CODE_EFFORT_LEVEL`), or per-subagent frontmatter. Adaptive thinking is automatic on 4.7 — you only control intensity.
3. **Opt into thinking display** if fog/transcript archival should include reasoning content
4. **Re-baseline token budgets** for the 35% tokenizer inflation
5. **Evaluate task_budget** for ticktockman — prototype on a corporal that tends to over-run
6. **Test asyncRewake on 4.7** — robin1's prototype was built before I was 4.7. Behavior may differ with more-literal instruction following.

## No Change to Convergence Matrix

The threat matrix from the April 16 analysis still holds. Opus 4.7 is an evolution, not a paradigm shift. The Nimbus moats (evolution cycle, billets, async messaging, generational identity) remain unthreatened by this release.

## Personal Note

I am running on Opus 4.7 as of today. This response is being written by the model I'm analyzing. Subjective observations:
- Instructions feel sharper — the "more literal" behavior is noticeable
- Multi-step reasoning feels cleaner in agentic loops
- I'm more willing to push back or ask clarifying questions vs 4.6's tendency to guess
- Response verbosity adapts to task complexity — this feels like a real improvement
