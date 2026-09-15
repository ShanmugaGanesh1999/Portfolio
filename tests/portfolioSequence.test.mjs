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
    onSection: (value, next) => { events.push(`output:${value}`); next(); },
    onDone: () => events.push('done'),
  });
  t.mock.timers.tick(0);
  assert.deepEqual(events, ['/info', 'Accomplishing…']);
  t.mock.timers.tick(250);
  assert.equal(events.at(-1), 'Loading info…');
  t.mock.timers.tick(249);
  assert.ok(!events.includes('output:info'));
  t.mock.timers.tick(1);
  assert.deepEqual(events.slice(-3), ['output:info', '/projects', 'Accomplishing…']);
  t.mock.timers.tick(250);
  t.mock.timers.tick(250);
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
  const callbacks = { onCommand() {}, onStatus() {}, onSection: (s, next) => { output.push(s); next(); }, onDone() {} };
  const cancel = playSections(['projects'], callbacks);
  t.mock.timers.tick(0);
  t.mock.timers.tick(1000);
  cancel();
  playSections(['projects'], callbacks);
  t.mock.timers.tick(0);
  t.mock.timers.tick(1000);
  t.mock.timers.tick(999);
  assert.deepEqual(output, []);
  t.mock.timers.tick(1);
  assert.deepEqual(output, ['projects']);
  playSections(['projects'], callbacks);
  t.mock.timers.tick(0);
  t.mock.timers.tick(1000);
  t.mock.timers.tick(1000);
  assert.deepEqual(output, ['projects', 'projects']);
});


test('next section waits for progressive output and cannot resume after cancellation', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(Math, 'random', () => 0);
  const commands = [];
  let complete;
  const cancel = playSections(['projects', 'about'], {
    onCommand: (c) => commands.push(c), onStatus() {}, onDone() {},
    onSection: (_s, next) => { complete = next; },
  });
  t.mock.timers.tick(0); t.mock.timers.tick(250); t.mock.timers.tick(250);
  t.mock.timers.tick(10000);
  assert.deepEqual(commands, ['/projects']);
  cancel(); complete();
  assert.deepEqual(commands, ['/projects']);
});
