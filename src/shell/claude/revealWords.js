import { Children, cloneElement, isValidElement } from 'react';

// Preserve the element tree, links, and whitespace while revealing only visible words.
export function revealWords(node, limit = Infinity) {
  let remaining = limit;
  let total = 0;
  function visit(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      const parts = String(value).match(/\s*\S+\s*/g) || [];
      if (!parts.length) return remaining > 0 ? value : '';
      total += parts.length;
      const visible = parts.slice(0, Math.max(0, remaining)).join('');
      remaining -= parts.length;
      return visible;
    }
    if (Array.isArray(value)) return Children.map(value, visit);
    if (!isValidElement(value)) return value;
    const started = remaining > 0;
    const children = visit(value.props.children);
    if (value.props['data-reveal-item']) {
      total += 12;
      remaining -= 12;
    }
    return started ? cloneElement(value, {}, children) : null;
  }
  return { content: visit(node), total };
}
