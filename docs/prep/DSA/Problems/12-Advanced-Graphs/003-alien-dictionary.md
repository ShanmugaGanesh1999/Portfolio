# Alien Dictionary

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 269 | Topological Sort |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Derive character ordering from sorted alien word list.

### Constraints & Clarifying Questions
1. **Valid ordering exists?** Not guaranteed (detect invalid).
2. **Multiple valid orderings?** Return any.
3. **Single word?** Just its characters (no ordering info).
4. **Empty input?** Return empty string.

### Edge Cases
1. **Prefix conflict:** "abc" before "ab" → invalid
2. **No ordering info:** Multiple valid results
3. **Cycle in dependencies:** Invalid

---

## Phase 2: High-Level Approach

### Approach: Build Graph + Topological Sort
Compare adjacent words to extract ordering constraints. Topological sort for result.

**Core Insight:** First differing character gives ordering: a < b.

---

## Phase 3: Python Code

```python
from typing import List
from collections import defaultdict, deque


def solve(words: List[str]) -> str:
    """
    Derive alien alphabet order.
    
    Args:
        words: Sorted list of alien words
    
    Returns:
        Character ordering, "" if invalid
    """
    # Build graph
    graph = defaultdict(set)
    in_degree = {c: 0 for word in words for c in word}
    
    # Compare adjacent words
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        
        # Check prefix conflict
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        
        # Find first difference
        for c1, c2 in zip(w1, w2):
            if c1 != c2:
                if c2 not in graph[c1]:
                    graph[c1].add(c2)
                    in_degree[c2] += 1
                break
    
    # Topological sort (Kahn's)
    queue = deque([c for c in in_degree if in_degree[c] == 0])
    result = []
    
    while queue:
        char = queue.popleft()
        result.append(char)
        
        for neighbor in graph[char]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycle
    if len(result) != len(in_degree):
        return ""
    
    return ''.join(result)


def solve_dfs(words: List[str]) -> str:
    """
    DFS topological sort approach.
    """
    graph = defaultdict(set)
    chars = set()
    
    for word in words:
        chars.update(word)
    
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        
        for c1, c2 in zip(w1, w2):
            if c1 != c2:
                graph[c1].add(c2)
                break
    
    # DFS with cycle detection
    # States: 0=unvisited, 1=visiting, 2=visited
    state = {c: 0 for c in chars}
    result = []
    
    def dfs(char):
        if state[char] == 1:
            return False  # Cycle
        if state[char] == 2:
            return True
        
        state[char] = 1
        
        for neighbor in graph[char]:
            if not dfs(neighbor):
                return False
        
        state[char] = 2
        result.append(char)
        return True
    
    for char in chars:
        if state[char] == 0:
            if not dfs(char):
                return ""
    
    return ''.join(reversed(result))
```

---

## Phase 4: Dry Run

**Input:** `["wrt", "wrf", "er", "ett", "rftt"]`

**Extract Constraints:**
- "wrt" vs "wrf": t < f
- "wrf" vs "er": w < e
- "er" vs "ett": r < t
- "ett" vs "rftt": e < r

**Graph:**
```
t → f
w → e
r → t
e → r
```

**Topological Sort:**
- In-degree: {w:0, e:1, r:1, t:1, f:1}
- Start with 'w'
- Process: w → e → r → t → f

**Result:** "wertf"

---

## Phase 5: Complexity Analysis

### Time Complexity: O(C)
C = total characters in all words.

### Space Complexity: O(U)
U = unique characters.

---

## Phase 6: Follow-Up Questions

1. **"Verify given ordering?"**
   → Check all constraints satisfied.

2. **"Multiple valid orderings?"**
   → Use backtracking to enumerate all.

3. **"Partial ordering (some chars unrelated)?"**
   → Graph may have multiple components; any interleaving valid.
