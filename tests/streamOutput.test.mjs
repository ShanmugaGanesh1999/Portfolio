import { test } from 'node:test';
import assert from 'node:assert/strict';
import { streamOutput } from '../src/shell/claude/streamOutput.js';

test('fast responses wait, then reveal word groups without losing whitespace', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const seen = [];
  const result = streamOutput(async (emit) => emit('One two three four five six\nseven.'), (text) => seen.push(text), { delay: 500 });
  await new Promise((resolve) => setImmediate(resolve));
  t.mock.timers.tick(499); assert.deepEqual(seen, []);
  t.mock.timers.tick(1); assert.equal(seen[0], 'One two three four five ');
  t.mock.timers.tick(55);
  assert.equal(await result, 'One two three four five six\nseven.');
  assert.equal(seen.at(-1), 'One two three four five six\nseven.');
});

test('interrupting buffered output prevents late text', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const controller = new AbortController(); const seen = [];
  const result = streamOutput(async (emit) => emit('late output'), (text) => seen.push(text), {delay:500, signal:controller.signal});
  controller.abort();
  await assert.rejects(result, {name:'AbortError'});
  t.mock.timers.tick(3000); assert.deepEqual(seen, []);
});
