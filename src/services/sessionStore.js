// Browser-local, bounded sessions. Storage failures retain this tab's session.
const memory = new Map();
const keyFor = (shell) => `sg-sessions:${shell}:v1`;
function read(shell) {
  if (memory.has(shell)) return memory.get(shell);
  try {
    const raw = globalThis.localStorage?.getItem(keyFor(shell));
    const value = raw ? JSON.parse(raw) : memory.get(shell);
    if (value?.version === 1 && Array.isArray(value.sessions)) {
      const valid = {
        version: 1, activeId: typeof value.activeId === 'string' ? value.activeId : null,
        sessions: value.sessions.filter((session) => session && typeof session.id === 'string' && Array.isArray(session.messages)).slice(0, 20).map((session) => ({
          ...session, name: String(session.name || 'Untitled conversation').slice(0, 80),
          updatedAt: Number.isFinite(session.updatedAt) ? session.updatedAt : Date.now(),
          messages: session.messages.filter((message) => message && typeof message === 'object' && !Array.isArray(message)).slice(-100),
          history: Array.isArray(session.history) ? session.history.filter((entry) => typeof entry === 'string').slice(-100) : [],
        })),
      };
      memory.set(shell, valid);
      return valid;
    }
  } catch { /* Invalid or unavailable storage falls back to this tab. */ }
  return memory.get(shell) || { version: 1, activeId: null, sessions: [] };
}
function write(shell, value) {
  memory.set(shell, value);
  try { globalThis.localStorage?.setItem(keyFor(shell), JSON.stringify(value)); } catch { /* Quota/private browsing: retain memory. */ }
}
export function listSessions(shell) { return read(shell).sessions; }
export function getActiveSession(shell) {
  const value = read(shell);
  return value.sessions.find((session) => session.id === value.activeId) || null;
}
export function setActiveSession(shell, id) {
  const value = read(shell);
  if (value.sessions.some((session) => session.id === id)) write(shell, { ...value, activeId: id });
}
export function saveSession(shell, session) {
  const value = read(shell);
  const saved = JSON.parse(JSON.stringify({
    ...session,
    id: session.id || globalThis.crypto.randomUUID(),
    name: String(session.name || 'Untitled conversation').slice(0, 80),
    updatedAt: Date.now(),
    messages: (Array.isArray(session.messages) ? session.messages : []).slice(-100),
  }));
  write(shell, { version: 1, activeId: saved.id, sessions: [saved, ...value.sessions.filter((item) => item.id !== saved.id)].slice(0, 20) });
  return saved;
}
export function createSession(shell, name = 'Untitled conversation') { return saveSession(shell, { name, messages: [] }); }
export function exportSession(session) {
  return `# ${session.name}\n\n${session.messages.map((message) => {
    const title = message.kind || message.role || 'message';
    return `## ${title}\n\n${message.text || message.content || message.output || (message.section ? `/${message.section}` : '')}`;
  }).join('\n\n')}\n`;
}
