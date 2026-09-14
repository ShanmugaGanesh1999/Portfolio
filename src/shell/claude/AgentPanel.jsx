// ============================================================
// AGENT PANEL — Claude Code's running-agents strip below the
// prompt: bold "● main" row plus one "◯ name task · ↓ tokens"
// row per agent, using the CLI's 8-color agent palette.
// ============================================================

import { formatTokens } from "./verbs";

/** Claude Code's sub-agent identity colors (8-color cycle). */
const AGENT_COLORS = [
  "#ff6b80", // red
  "#6a9bcc", // blue
  "#4eba65", // green
  "#d4a27f", // yellow/kraft
  "#b1b9f9", // purple
  "#d97757", // orange
  "#e8a0bf", // pink
  "#5fc4c4", // cyan
];

// eslint-disable-next-line react-refresh/only-export-components -- shared palette helper
export const agentColor = (i) => AGENT_COLORS[i % AGENT_COLORS.length];

export default function AgentPanel({ agents }) {
  if (!agents.length) return null;
  const running = agents.filter((a) => a.status === "running").length;

  return (
    <div className="border-t border-border bg-sidebar/40 px-3 py-1.5 text-xs font-mono select-none">
      <div className="flex items-center gap-2 text-text font-bold">
        <span className="text-accent">●</span> main
        <span className="ml-auto text-comment/70 font-normal">
          {running > 0
            ? `${running} local agent${running > 1 ? "s" : ""} running`
            : "agents idle"}
        </span>
      </div>
      {agents.map((agent, i) => (
        <div
          key={agent.id}
          className="flex items-baseline gap-2 mt-0.5 flex-wrap"
          title={agent.task}
        >
          <span style={{ color: agentColor(i) }}>◯</span>
          <span style={{ color: agentColor(i) }} className="font-semibold">
            {agent.name}
          </span>
          <span className="text-comment truncate min-w-0 max-w-[50vw]">
            {agent.status === "running" ? agent.task : `⎿ ${agent.task}`}
          </span>
          <span className="ml-auto text-comment/60 shrink-0">
            {agent.status === "running" ? (
              <>
                {agent.verb}… · ↓ {formatTokens(agent.tokens)}
              </>
            ) : (
              <span className="text-success">done · ↓ {formatTokens(agent.tokens)}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
