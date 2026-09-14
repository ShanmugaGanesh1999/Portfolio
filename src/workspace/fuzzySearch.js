// ============================================================
// FUZZY SEARCH — lightweight VS Code quick-open scoring.
// Subsequence matching with bonuses for word starts and runs.
// No dependencies; O(query × target) per call.
// ============================================================

/**
 * Score a candidate string against a query.
 * @param {string} query - User query (case-insensitive)
 * @param {string} target - Candidate label
 * @returns {{score: number, indices: number[]}|null} null when no match
 */
export function fuzzyMatch(query, target) {
  if (!query) return { score: 0, indices: [] };
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Fast exact-substring path with a strong bonus.
  const substrIdx = t.indexOf(q);
  if (substrIdx !== -1) {
    const indices = [];
    for (let i = 0; i < q.length; i++) indices.push(substrIdx + i);
    let score = 100 + q.length * 4;
    if (substrIdx === 0) score += 20; // prefix match
    return { score, indices };
  }

  // Subsequence path.
  const indices = [];
  let score = 0;
  let ti = 0;
  let prevMatch = -2;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    let found = -1;
    while (ti < t.length) {
      if (t[ti] === ch) {
        found = ti;
        break;
      }
      ti++;
    }
    if (found === -1) return null;
    indices.push(found);
    score += 4;
    if (found === prevMatch + 1) score += 8; // consecutive run
    const prevChar = found > 0 ? t[found - 1] : "";
    if (!prevChar || /[\s\-_./]/.test(prevChar)) score += 10; // word start
    prevMatch = found;
    ti = found + 1;
  }

  return { score, indices };
}

/**
 * Rank a list of items by fuzzy score.
 * @param {Array} items - Items with a `label` (and optional `keywords`) field
 * @param {string} query
 * @param {number} limit - Max results
 * @returns {Array} Matched items with `_score` and `_indices` attached
 */
export function fuzzyRank(items, query, limit = 40) {
  if (!query) {
    return items.slice(0, limit).map((it) => ({ ...it, _score: 0, _indices: [] }));
  }
  return items
    .map((item) => {
      const byLabel = fuzzyMatch(query, item.label ?? "");
      const byKeywords = item.keywords
        ? fuzzyMatch(query, item.keywords)
        : null;
      const best = [byLabel, byKeywords]
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)[0];
      return best ? { ...item, _score: best.score, _indices: byLabel ? byLabel.indices : [] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b._score - a._score || a.label.localeCompare(b.label))
    .slice(0, limit);
}

/**
 * Split a label into matched/unmatched parts for highlighting.
 * @param {string} label
 * @param {number[]} indices - Matched character indexes
 * @returns {Array<{text: string, match: boolean}>}
 */
export function highlightParts(label, indices) {
  if (!indices?.length) return [{ text: label, match: false }];
  const parts = [];
  const matchSet = new Set(indices);
  let buf = "";
  let inMatch = false;
  for (let i = 0; i < label.length; i++) {
    const m = matchSet.has(i);
    if (m === inMatch) {
      buf += label[i];
    } else {
      parts.push({ text: buf, match: inMatch });
      buf = label[i];
      inMatch = m;
    }
  }
  parts.push({ text: buf, match: inMatch });
  return parts.filter((p) => p.text.length > 0);
}
