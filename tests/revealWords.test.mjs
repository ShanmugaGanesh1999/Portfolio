import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { revealWords } from '../src/shell/claude/revealWords.js';

test('progressive output preserves formatting and hides later items until their turn', () => {
  const tree = h('section', null, h('h2', null, 'My projects'),
    h('p', null, 'Built ', h('strong', null, 'reliable APIs'), ' for teams.'),
    h('a', { href: 'https://example.com', target: '_blank' }, 'Read more'));
  const first = revealWords(tree, 4);
  assert.equal(first.total, 9);
  assert.equal(renderToStaticMarkup(first.content), '<section><h2>My projects</h2><p>Built <strong>reliable </strong></p></section>');
  assert.equal(renderToStaticMarkup(revealWords(tree, 0).content), '');
  assert.equal(renderToStaticMarkup(revealWords(tree).content), renderToStaticMarkup(tree));
});

test('spaces between inline elements survive a full reveal', () => {
  const tree = h('p', null, h('strong', null, 'Hello'), ' ', h('a', { href: '/about' }, 'world'));
  assert.equal(renderToStaticMarkup(revealWords(tree).content), renderToStaticMarkup(tree));
});
