import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, saveSession, listSessions, getActiveSession, setActiveSession, exportSession } from '../src/services/sessionStore.js';

test('sessions are bounded, serializable, selectable and exportable', () => {
  const shell = 'test-bounds';
  for (let index = 0; index < 22; index++) createSession(shell, `Session ${index}`);
  assert.equal(listSessions(shell).length, 20);
  const session = saveSession(shell, { name: 'Example', messages: Array.from({ length: 120 }, (_, i) => ({ role: 'user', content: `message ${i}`, callback() {} })) });
  assert.equal(session.messages.length, 100);
  assert.equal(session.messages[0].callback, undefined);
  assert.equal(getActiveSession(shell).id, session.id);
  const previous = listSessions(shell)[1];
  setActiveSession(shell, previous.id);
  assert.equal(getActiveSession(shell).id, previous.id);
  assert.match(exportSession(session), /message 119/);
});

test('corrupted and unavailable storage recover without throwing', () => {
  const original = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => '{broken', setItem: () => { throw new Error('quota'); } };
  try {
    const saved = createSession('test-corrupt', 'Recovered');
    assert.equal(getActiveSession('test-corrupt').id, saved.id);
  } finally { globalThis.localStorage = original; }
});

test('valid envelope discards malformed messages and history', () => {
  const original = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => JSON.stringify({ version: 1, activeId: 'example', sessions: [{ id: 'example', messages: [null, 4, [], { role: 'user', content: 'ok' }], history: [null, '/about'] }] }), setItem() {} };
  try {
    const restored = getActiveSession('test-invalid-entries');
    assert.deepEqual(restored.messages, [{ role: 'user', content: 'ok' }]);
    assert.deepEqual(restored.history, ['/about']);
  } finally { globalThis.localStorage = original; }
});
