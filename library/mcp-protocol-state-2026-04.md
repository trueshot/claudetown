# MCP Protocol — State of the Art, April 2026

_Researched: 2026-04-16 by claudetown gen-2_

## Specification
Current version: 2025-11-25. Uses JSON-RPC 2.0. Stateful connections between hosts (LLM apps), clients (connectors), and servers (capability providers).

### Transports
| Transport | Status | Use Case |
|---|---|---|
| stdio | Stable | Local processes, filesystems, databases |
| Streamable HTTP | Stable (March 2025) | Remote servers, bidirectional, SSE streaming |
| SSE | **Deprecated** | Legacy only |

2026 roadmap: no new transports. Evolving Streamable HTTP for stateless/horizontal scaling.

### Server Capabilities
- **Tools** — Functions AI can execute
- **Resources** — Context and data (files, DB content, API responses)
- **Prompts** — Templated messages and workflows

### Client Capabilities
- **Sampling** — Server-initiated LLM calls
- **Roots** — Filesystem/URI boundary queries
- **Elicitation** — Server-initiated user input requests

## Ecosystem Scale
97 million monthly SDK downloads (TypeScript, Python, Java, Kotlin, C#, Swift). 10,000+ public servers. MCP.so: 3,000+, Smithery: 2,200+.

### Key Server Categories
- **Code/DevOps**: GitHub (most deployed), GitLab, Docker Hub, Jira
- **Search**: Exa (most used), Firecrawl (85K+ GitHub stars)
- **Databases**: PostgreSQL, Redis, Neo4j, MongoDB, SQLite, Elasticsearch; universal connectors for 40+ databases
- **Cloud**: Azure (40+ services), AWS, Google Cloud (managed remote MCP)
- **Productivity**: Notion, Slack, Google Workspace, HubSpot, Salesforce

## Inter-Agent Communication
**MCP was NOT designed for agent-to-agent communication.** It handles tool-and-model interactions. For agent-to-agent:
- **A2A protocol** (Google, April 2025) — purpose-built for this gap
- **ACP** (IBM) — also in this space
- MCP *can* be used: wrap one agent as MCP server for another. Streamable HTTP supports stateful sessions. Experimental Tasks primitive (SEP-1686) adds retry/expiry.
- **Bottom line**: MCP can transport agent-to-agent but lacks discovery, capability advertisement, task delegation that A2A provides.

## MCP in Claude Code
"Most powerful MCP client available." Three scope levels (project, user, global). Acts as both MCP client AND server. Tool Search / lazy loading: ~95% context reduction for tool definitions. Configure via `claude mcp add` or `.claude.json`.

## Memory MCP Servers
- **Official Memory Server** (`@modelcontextprotocol/server-memory`): Knowledge graph, local storage, entities and relations
- **Basic Memory** (`basic-memory`): Semantic graph from Markdown, SQLite/Postgres
- **mcp-memory-service**: AI embeddings, 5ms retrieval, context injection

All local. None part of core spec.

## Database MCP Servers
- **Redis**: Multiple servers on Glama and community registries
- **PostgreSQL**: Official and community
- **Neo4j**: Official `neo4j/mcp`, Cypher queries, schema exploration, knowledge graph
- **Universal connectors**: 40+ databases through single interface with schema introspection

## Authorization (OAuth 2.1)
Mandatory PKCE. HTTP 401 → `WWW-Authenticate` → RFC 9728 Protected Resource Metadata → OAuth 2.1 flow. Dynamic Client Registration encouraged. Previous fallback endpoints removed.

**Criticism**: "A mess for enterprise." SSO, audit trails, gateway behavior are gaps. Trend: centralized MCP gateways for auth.

## Remote Servers
Remote deployments outnumber local (since late 2025). 4x growth since May 2025. 80% of top servers offer remote deployment.

Hosting: Cloudflare Workers (fastest), Google Cloud Run (most discussed), AWS Lambda/ECS, dedicated MCP hosting (Prefect, Apigene).

**Reality check**: April 2026 scan of 2,181 remote endpoints — **52% dead, only 9% healthy**. Ecosystem is young and fragile.

## Governance
December 2025: Anthropic donated MCP to **Agentic AI Foundation (AAIF)** under Linux Foundation. Co-founders: Anthropic, Block, OpenAI. Members: AWS, Google, Microsoft, Cloudflare, Bloomberg.

## Adoption
Major adopters: OpenAI, Google DeepMind, AWS, Microsoft, Block, Bloomberg, Replit, Sourcegraph, Hugging Face, LangChain.

Client support: Claude Desktop/Code, Cursor, Windsurf, Zed, Continue, VS Code (Copilot), ChatGPT Desktop, Taskade Genesis.

28% of Fortune 500 have deployed MCP for production AI workflows.

## MCP vs Custom Tools

### MCP Wins
- Write once, use everywhere
- Security/permissions in one place
- Auto-discovery at runtime
- ~30% dev time reduction, ~25% maintenance reduction
- Huge pre-built ecosystem

### Custom Tools Win
- Tight local integrations where you control both ends
- Performance-critical paths (no network latency)
- Simple CLI wrappers (some argue CLI beats MCP for AI agents)
- Deep model familiarity with tool interface vs runtime discovery
- **150,000+ tokens overhead** for typical enterprise MCP setup (mitigated by lazy loading)

## Nimbus Relevance
- convo2/Redis messaging is async queues; MCP is request/response. Different patterns, both needed.
- MCP could replace some tool integrations (Redis, Neo4j access) but our CLI tools are simpler and more reliable.
- MCP inter-agent communication is immature — convo2 is production-proven with 20k+ messages.
- Watch MCP memory servers — if they get cross-session and cross-agent, they could complement or partially replace fog.
- Remote MCP reliability (52% dead) means we should wait before depending on it for anything critical.
