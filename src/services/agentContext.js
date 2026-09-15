let pending = null;
export function peekAgentContext() { return pending || {}; }
export function takeAgentContext() { const value = pending; pending = null; return value || {}; }
export function offerAgentContext(value) {
  pending = value;
  window.dispatchEvent(new Event('portfolio:agent-context'));
}
