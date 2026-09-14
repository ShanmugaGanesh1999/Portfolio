// ============================================================
// CODEX AGENTS — the "Agent command center" strip:
// status counts, ● working / ✓ finished rows, and the
// "Nickname [role]" label grammar from the Codex TUI.
// ============================================================

import { formatTokens } from "../claude/verbs";

export default function CodexAgents({ agents }) {
  if (!agents.length) return null;
  const working = agents.filter((a) => a.status === "running").length;
  const finished = agents.length - working;

  return (
    <div className="border-t border-border bg-sidebar/40 px-3 py-1.5 text-xs font-mono select-none">
      <div className="flex items-baseline gap-3">
        <span className="font-bold text-text">Agent command center</span>
        <span className="text-comment">
          {working} working · {finished} finished
        </span>
      </div>
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="flex items-baseline gap-2 mt-0.5 flex-wrap"
          title={agent.task}
        >
          {agent.status === "running" ? (
            <span className="shimmer text-accent">●</span>
          ) : (
            <span className="text-success">✓</span>
          )}
          <span className="text-text font-semibold">
            {agent.name} <span className="text-comment">[{agent.role}]</span>
          </span>
          <span className="text-comment truncate min-w-0 max-w-[45vw]">
            {agent.task}
          </span>
          <span className="ml-auto text-comment/70 shrink-0">
            {agent.status === "running" ? (
              "Working"
            ) : (
              <span className="text-success">
                Finished · ↓ {formatTokens(agent.tokens)}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
