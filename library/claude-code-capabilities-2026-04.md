# Claude Code Capabilities — April 2026

_Researched: 2026-04-16 by claudetown gen-2_

## Memory and Persistence

### Session Memory (automatic, per-project)
Introduced ~v2.0.64 (late 2025), UI from v2.1.30+ (Feb 2026). Runs continuously in background, extracting summaries after ~10k tokens initially, then every ~5k tokens or 3 tool calls. Stored at `~/.claude/projects/<project-hash>/<session-id>/session-memory/summary.md`. Past summaries injected on new session start. `/remember` command reviews session memories and proposes permanent CLAUDE.local.md additions. Feature-gated behind `tengu_session_memory` and `tengu_sm_compact`. Supported on Anthropic API (Pro/Max) only — not Bedrock, Vertex, or Foundry.

### CLAUDE.md (manual, persistent)
Plain markdown loaded at session start. Survives `/clear`, session termination, restarts. Hierarchical scope: managed > user (`~/.claude/`) > project (`.claude/`) > local (`.claude/settings.local.json`). `/init` auto-generates from codebase scan. `.claude/rules/*.md` for modular instruction sets. Recommended: under 200 lines.

### Subagent Memory (per-agent, persistent)
Custom subagents can have `memory` field set to `user`, `project`, or `local` scope. Persistent directories at `~/.claude/agent-memory/<agent-name>/`. First 200 lines / 25KB of `MEMORY.md` auto-loaded into context.

## Agent/Subagent Capabilities

### Built-in Subagents
- **Explore** (Haiku, read-only) — codebase search
- **Plan** (inherits model, read-only) — research during plan mode
- **General-purpose** (all tools) — complex multi-step tasks
- **statusline-setup** (Sonnet), **Claude Code Guide** (Haiku)

### Custom Subagents
Defined as Markdown with YAML frontmatter in `.claude/agents/` (project) or `~/.claude/agents/` (user). Frontmatter: `name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`. Run in own context window with custom system prompt. **Cannot spawn other subagents.**

### Agent Teams
2-16 coordinated sessions with peer-to-peer messaging and shared task lists. Agents message each other directly without going through a lead. Experimental.

### Claude Agent SDK
Renamed from "Claude Code SDK" (Sep 2025). Available as `@anthropic-ai/claude-agent-sdk` (TypeScript) and `claude-agent-sdk` (Python). Provides same infrastructure as Claude Code, programmable. Works through Bedrock, Vertex AI, Azure AI Foundry. `agentProgressSummaries` for periodic AI-generated progress updates.

## Session Persistence
Sessions saved as plaintext JSONL under `~/.claude/projects/`. Resume: `claude -c` (most recent) or `claude -r <session-id>`. Each message, tool use, and result written to disk.

## Identity/Naming
Subagents display as `@<name>`. `/agents` command provides management UI. **No built-in persistent named identity for main session.** Feature request: GitHub issue #40749. Community frameworks: **Instar**, **claude-remember**.

## Hooks System
26 event types including: SessionStart, SessionEnd, UserPromptSubmit, PreToolUse, PostToolUse, SubagentStart, SubagentStop, TaskCreated, TaskCompleted, Stop, TeammateIdle, InstructionsLoaded, CwdChanged, FileChanged, WorktreeCreate/Remove, PreCompact, PostCompact, Elicitation.

Four hook types: `command` (shell), `http` (POST), `prompt` (single-turn LLM via Haiku), `agent` (multi-turn subagent, 50 turns, 60s timeout).

Configured in settings.json (global/project/local/managed/plugin/subagent frontmatter). PreToolUse fires before permission checks.

## Remote Triggers / Routines
Launched April 14, 2026 (research preview). Saved configuration (prompt + repos + connectors) running on Anthropic cloud.

Trigger types:
- **Scheduled**: hourly/daily/nightly/weekdays/weekly, custom cron via `/schedule update`, min 1-hour interval
- **API**: HTTP POST to per-routine endpoint with bearer token, accepts `text` field, returns session URL
- **GitHub events**: pull_request.opened, push, issues, releases, check runs

Limits: Pro=5/day, Max=15/day, Team/Enterprise=25/day.

## Context Compaction
Auto-triggers at ~80-90% utilization. `/compact` for manual. With Session Memory, compaction is instant (loads pre-written summary). `PreCompact` hook can block. Target 60% utilization to avoid losing early instructions.

## IDE Integrations
- **VS Code**: Native extension, review/edit plans, auto-accept, @-mention files with line ranges, multiple tabs
- **JetBrains**: Plugin for IntelliJ/WebStorm/PyCharm
- **Desktop App**: Redesigned April 2026 — integrated terminal, faster diff, in-app file editor, sidebar for sessions, drag-and-drop. Mac and Windows
- **Web App**: claude.ai/code
- **Computer Use**: Available on Pro/Max plans in Claude Code

## MCP Integration
Native in Claude Code. 10,000+ public servers, 97M monthly SDK downloads. Configured in `.mcp.json` or subagent frontmatter. Supports stdio, http, sse, ws transports. Tool Search / lazy loading reduces context usage ~95%. Acts as both MCP client and server.
