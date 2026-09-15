import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DOCUMENTS, getDocument, searchDocuments } from '../src/workspace/documents.js';
import { makeTab, hashForTab, parseHash } from '../src/workspace/registry.js';
import { workspaceReducer, initialState } from '../src/workspace/workspaceReducer.js';

test('portfolio documents have stable routes and searchable source lines', () => {
  assert.equal(DOCUMENTS.length, 6);
  for (const doc of DOCUMENTS) {
    assert.equal(makeTab(doc.id).kind, 'document');
    assert.equal(getDocument(doc.title), doc);
    assert.deepEqual(parseHash(hashForTab(doc.id)), { id: doc.id });
    assert.ok(doc.content.length > 20);
  }
  assert.ok(JSON.parse(getDocument('skills').content).Languages.includes('Java'));
  const result = searchDocuments('SHERWIN WILLIAMS').find((item) => item.documentId === 'doc:experience');
  assert.ok(result);
  assert.equal(getDocument(result.documentId).content.split('\n')[result.line - 1], result.text);
  assert.deepEqual(searchDocuments('  '), []);
  assert.equal(parseHash('#/documents/missing'), null);
  assert.equal(makeTab('missing'), null);
  assert.deepEqual(parseHash('#/rollup-summary'), { id: 'rollup-summary' });
});

test('preview replacement, keep, pin and close preserve the active document', () => {
  const run = (state, type, args = {}) => workspaceReducer(state, { type, ...args });
  let state = run(initialState, 'OPEN_TAB', { id: 'doc:about', preview: true });
  state = run(state, 'OPEN_TAB', { id: 'doc:experience', preview: true });
  assert.deepEqual(state.tabs.map((item) => item.id), ['welcome', 'doc:experience']);
  state = run(state, 'KEEP_TAB', { id: 'doc:experience' });
  state = run(state, 'OPEN_TAB', { id: 'doc:about', preview: true });
  state = run(state, 'PIN_TAB', { id: 'doc:experience' });
  state = run(state, 'CLOSE_OTHER_TABS', { id: 'doc:about' });
  assert.ok(state.tabs.some((item) => item.id === 'doc:experience'));
  state = run(state, 'CLOSE_TAB', { id: 'doc:experience' });
  assert.equal(state.activeTabId, 'doc:about');
  state = run(state, 'CLOSE_TAB', { id: 'doc:about' });
  assert.equal(state.activeTabId, 'welcome');
});
