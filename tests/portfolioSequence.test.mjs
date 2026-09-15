import assert from 'node:assert/strict';
import { test } from 'node:test';
import { playSections } from '../src/shell/claude/portfolioSequence.js';

// A missing delay, early output, duplicate completion, or uncancelled timer fails these checks.
test('commands precede delayed sections and complete in order', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(Math, 'random', () => 0);
  const events = [];
  playSections(['info', 'projects'], {
    onCommand: (value) => events.push(value),
    onStatus: (value) => events.push(value),
    onSection: (value) => events.push(`output:${value}`),
    onDone: () => events.push('done'),
  });
  t.mock.timers.tick(0);
  assert.deepEqual(events, ['/info', 'Thinking…']);
  t.mock.timers.tick(500);
  assert.equal(events.at(-1), 'Loading info…');
  t.mock.timers.tick(499);
  assert.ok(!events.includes('output:info'));
  t.mock.timers.tick(1);
  assert.deepEqual(events.slice(-3), ['output:info', '/projects', 'Thinking…']);
  t.mock.timers.tick(500);
  t.mock.timers.tick(500);
  assert.deepEqual(events.slice(-2), ['output:projects', 'done']);
});

test('cancelled introduction cannot print late content or finish', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const events = [];
  const cancel = playSections(['info', 'projects'], {
    intro: true,
    onCommand: (value) => events.push(value),
    onStatus: (value) => events.push(value),
    onSection: (value) => events.push(value),
    onDone: () => events.push('done'),
  });
  t.mock.timers.tick(0);
  assert.deepEqual(events, ['claude --dangerously-skip-permissions', 'executing…']);
  cancel();
  t.mock.timers.tick(30000);
  assert.equal(events.length, 2);
});

test('a cancelled section can be requested again as a fresh run', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(Math, 'random', () => 1);
  const output = [];
  const callbacks = { onCommand() {}, onStatus() {}, onSection: (s) => output.push(s), onDone() {} };
  const cancel = playSections(['projects'], callbacks);
  t.mock.timers.tick(0);
  t.mock.timers.tick(1500);
  cancel();
  playSections(['projects'], callbacks);
  t.mock.timers.tick(0);
  t.mock.timers.tick(1500);
  t.mock.timers.tick(1499);
  assert.deepEqual(output, []);
  t.mock.timers.tick(1);
  assert.deepEqual(output, ['projects']);
  playSections(['projects'], callbacks);
  t.mock.timers.tick(0);
  t.mock.timers.tick(1500);
  t.mock.timers.tick(1500);
  assert.deepEqual(output, ['projects', 'projects']);
});
