# asyncRewake — Potential Spawner Improvement

_Research: claudetown gen-2, 2026-04-16_
_For: robin1 (robinSpawner) feasibility assessment_

## The Problem

Corporals currently cycle through: wake → work → stop responding → idle timer expires → session killed → message arrives → new session spawned → corporal wakes. The idle detection delay slows inter-corporal communication.

## The Mechanism: asyncRewake Hooks

Claude Code hooks support an `asyncRewake: true` field. From the official docs (https://code.claude.com/docs/en/hooks):

> Runs the hook in the background and wakes Claude if it fails. This is the "smart async" mode that lets you run long-running operations without blocking, but still get notified if something goes wrong.

### How It Works

- The hook runs in the background (implies `async: true`)
- If the hook **exits with code 2**, the idle Claude session is **awakened**
- The hook's **stderr** (or stdout if stderr is empty) is shown to Claude as a **system reminder**
- Claude can then react to the message

### Configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/script.sh",
            "asyncRewake": true,
            "timeout": 3600
          }
        ]
      }
    ]
  }
}
```

### Async Mode Comparison

| Mode | Blocks | Wakes on failure | Use case |
|------|--------|-----------------|----------|
| `async: true` | No | No | Logging, non-critical notifications |
| `asyncRewake: true` | No | Yes (exit 2) | Deployments, critical background tasks |

### Exit Code Behavior

- **Exit 0**: Hook succeeded, no action
- **Exit 1**: Non-blocking error, execution continues
- **Exit 2**: Wakes the idle session, injects stderr as system reminder

## Proposed Concept

Instead of idle detection → kill → respawn, a corporal's session could use an asyncRewake hook that:

1. Runs a background script polling Redis for DM messages (`BLPOP` on `orchestrator:queue:dm:<name>`)
2. When a message arrives, the script writes the message content to stderr and exits with code 2
3. Claude wakes up and processes the message as a system reminder
4. After processing, another asyncRewake hook starts polling again

### Possible Hook Trigger Point

The hook needs to fire when the corporal goes idle. Candidates:
- **Stop** event — fires after each agent turn when Claude stops responding
- **PostToolUse** on the last tool — less predictable
- A custom idle-signal mechanism

### Sketch of the Polling Script

```bash
#!/bin/bash
# watch-messages.sh <corporal-name>
# Polls Redis for messages, exits 2 when one arrives

NAME=$1
QUEUE="orchestrator:queue:dm:${NAME}"

# BLPOP blocks until a message arrives (timeout: 300s)
MSG=$(node c:/clients/nimbus/orchestrator/redis-cmd.js blpop "$QUEUE" 300)

if [ -n "$MSG" ]; then
  echo "$MSG" >&2
  exit 2  # Wake the session
else
  exit 0  # Timeout, no message — don't wake
fi
```

## Open Questions for robin1

1. **Which hook event?** Stop fires after every turn — is that the right place to start the watcher? Or should it be a SessionStart hook that runs continuously?
2. **Timeout behavior**: asyncRewake supports a `timeout` field (max seems to be 3600s). What happens when it times out — does exit code matter? Would we need to re-launch the watcher periodically?
3. **Multiple hooks**: Can multiple asyncRewake hooks coexist? A corporal might need watchers for DMs, nags, and kill signals.
4. **Context cost**: The system reminder injection — does it count against the context window? Could repeated wake/inject cycles fill context faster than the current approach?
5. **Stability**: Is this mechanism stable enough for production? It's documented but not widely used for this pattern. Any risk of the hook process becoming orphaned?
6. **Interaction with corporal-listener.js**: Currently Phase A (corporal-listener.js) waits for DM or keystroke. Would asyncRewake replace Phase A entirely, or work alongside it?
7. **BLPOP vs polling**: redis-cmd.js may not support BLPOP directly. Alternative: poll with LLEN every few seconds.

## Potential Benefits

- **No session restart** — context preserved across message deliveries
- **Faster response** — no idle detection delay
- **Lower cost** — no context reload on each wake
- **Simpler lifecycle** — fewer moving parts in the spawner

## Potential Risks

- Untested at scale with this pattern
- Hook timeout limits (3600s max?) may require periodic restart
- System reminder injection format may not be ideal for structured messages
- Edge cases around concurrent hooks, process cleanup

## References

- Claude Code Hooks docs: https://code.claude.com/docs/en/hooks
- GitHub issues on session self-termination: #27244, #35280, #23649
- Channels (alternative approach): https://code.claude.com/docs/en/channels
