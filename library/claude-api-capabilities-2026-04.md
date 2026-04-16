# Claude API & Model Capabilities — April 2026

_Researched: 2026-04-16 by claudetown gen-2_

## Model Family

| Model | API ID | Context | Max Output | Input $/MTok | Output $/MTok | Released |
|---|---|---|---|---|---|---|
| Opus 4.6 | `claude-opus-4-6` | 1M | 128k | $5 | $25 | Feb 5, 2026 |
| Sonnet 4.6 | `claude-sonnet-4-6` | 1M | 64k | $3 | $15 | Feb 17, 2026 |
| Haiku 4.5 | `claude-haiku-4-5-20251001` | 200k | 64k | $1 | $5 | Oct 2025 |

Batch API: 300k output tokens for Opus/Sonnet 4.6 with `output-300k-2026-03-24` beta header.

Fast mode (research preview): Opus 4.6 only, 6x pricing ($30/$150).

Mythos Preview: invitation-only, defensive cybersecurity (Project Glasswing), 1M context.

Legacy: Sonnet 4.5, Opus 4.5 still available. Claude 4/Sonnet 4 deprecated, retire June 15, 2026.

## Tool Use

Mature, production-ready. Client-side tools (you define schema, Claude calls, you execute) plus server-side:

| Server Tool | Cost | Notes |
|---|---|---|
| `web_search_20260209` | $10/1k searches + tokens | |
| `web_fetch_20260209` | Token cost only | |
| `code_execution` | Free w/ search or $0.05/hr | 1,550 free hrs/mo |
| `text_editor_20250429` | 700 extra input tokens | |
| `bash` | 245 extra input tokens | |
| `computer_use` | 735 tokens + screenshots | |
| `memory_20250818` | Client-side storage | |

Additional: Tool Search (search thousands without context cost), Advisor tool (pairs fast executor with high-intelligence advisor), Programmatic Tool Calling.

## Memory

### API Memory Tool (`memory_20250818`)
Client-side tool. Claude creates/reads/updates/deletes files in `/memories` directory. You implement storage backend. Commands: view, create, str_replace, insert, delete, rename. Auto-checks memory before tasks.

### Chat Memory (claude.ai)
All plans including free. Persistent user/project memory. Project-based siloing.

### Claude Code Auto-Memory/Auto-Dream
Accumulates knowledge across sessions automatically. Auto Dream prevents memory decay.

## Extended Thinking

### Adaptive Thinking (recommended, Opus/Sonnet 4.6)
`thinking: { type: "adaptive" }`. Claude dynamically decides when/how much to think based on complexity and `effort` parameter. Outperforms fixed-budget.

### Extended Thinking (legacy)
`budget_tokens` parameter. Claude 4 models return summary of thinking, not raw tokens.

### Interleaved Thinking (beta)
`interleaved-thinking-2025-05-14` header. Think between tool calls. Critical for multi-step agent workflows.

## Prompt Caching

| TTL | Write Cost | Read Cost | Break-even |
|---|---|---|---|
| 5-minute | 1.25x base | 0.1x base | 1 cache read |
| 1-hour | 2x base | 0.1x base | 2 cache reads |

Two modes: automatic (single `cache_control`, system manages breakpoints) or explicit (per-block `cache_control`). Workspace-level isolation (not org-level) since Feb 5, 2026.

**Critical for agents**: Only uncached tokens count toward ITPM rate limits. With 80% cache hit rate and 2M ITPM limit, effective throughput is 10M total input tokens/min. Latency: up to 85% reduction (100k prompt: 11.5s → 2.4s).

## Batch API

50% discount on all token costs. Stacks with prompt caching discounts.

| Model | Batch Input | Batch Output |
|---|---|---|
| Opus 4.6 | $2.50/MTok | $12.50/MTok |
| Sonnet 4.6 | $1.50/MTok | $7.50/MTok |
| Haiku 4.5 | $0.50/MTok | $2.50/MTok |

Tier 4: 4k RPM, 500k batch requests in queue, 100k per batch.

## Files API (Beta)
`anthropic-beta: files-api-2025-04-14`. Upload once, reference by file_id. Supports PDF, text, images, data files. 500 MB/file, 500 GB/org. Not on Bedrock/Vertex.

## Citations
GA on Anthropic API and Vertex AI. `"citations": { "enabled": true }` on document content blocks. Works with PDFs and text via Files API.

## Computer Use
Production-ready for Claude 4.x. Screenshots, click, scroll, type, navigate. 735 input tokens per definition + screenshot costs. Pro/Max subscribers and API.

## Token Economics (1M Context)
Full 1M context at standard pricing — no long-context surcharge. US-only inference (`inference_geo`): 1.1x multiplier.

Example 900k-input conversation with Opus 4.6:
- Without caching: ~$4.88/turn
- With 80% cache hits: ~$1.28/turn

## Managed Agents (Public Beta, April 8, 2026)
`managed-agents-2026-04-01` beta header. Fully managed: agent loop, tool execution, sandboxed container, state persistence.

Define: Agent (model + prompt + tools + MCP) → Environment (container + packages + network) → Session.

Built-in tools: Bash, file ops, web search/fetch, MCP connections.

Pricing: Standard token rates + $0.08/session-hour (billed to ms).

Limits: 60 creates/min, 600 reads/min per org.

Research preview features (by request): Outcomes, multi-agent orchestration, memory.

Limitations vs DIY: No batch mode, no fast mode, no data residency control.

## Rate Limits

| Tier | Credit Purchase | Monthly Limit |
|---|---|---|
| Tier 1 | $5 | $100 |
| Tier 2 | $40 | $500 |
| Tier 3 | $200 | $1,000 |
| Tier 4 | $400 | $200,000 |

Tier 4 RPM/ITPM/OTPM:
- Opus 4.x: 4k / 2M / 400k
- Sonnet 4.x: 4k / 2M / 400k  
- Haiku 4.5: 4k / 4M / 800k

Token bucket algorithm (continuous replenishment). OTPM evaluated in real-time.
