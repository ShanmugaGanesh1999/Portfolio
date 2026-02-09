# Reorganize String

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 767 | Heap / Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Rearrange string so no two adjacent characters are same. Return empty if impossible.

### Constraints & Clarifying Questions
1. **Multiple valid answers?** Yes, return any.
2. **When impossible?** If any char count > (n+1)/2.
3. **Case sensitive?** Yes, lowercase.
4. **Empty string?** Return empty.

### Edge Cases
1. **Single char:** Return it
2. **Impossible:** "aaa" → ""
3. **Already valid:** Return as-is or rearranged

---

## Phase 2: High-Level Approach

### Approach: Max Heap
Greedy: always place most frequent available character. Use heap to track frequencies; temporarily set aside last used character.

**Core Insight:** If most frequent exceeds half (ceiling), impossible.

---

## Phase 3: Python Code

```python
import heapq
from collections import Counter


def solve(s: str) -> str:
    """
    Reorganize string so no adjacent chars are same.
    
    Args:
        s: Input string
    
    Returns:
        Reorganized string or "" if impossible
    """
    count = Counter(s)
    
    # Check if possible
    max_freq = max(count.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max heap: (-count, char)
    heap = [(-c, ch) for ch, c in count.items()]
    heapq.heapify(heap)
    
    result = []
    prev_count, prev_char = 0, ''
    
    while heap:
        neg_count, char = heapq.heappop(heap)
        result.append(char)
        
        # Re-add previous character if count remaining
        if prev_count < 0:
            heapq.heappush(heap, (prev_count, prev_char))
        
        # Update previous
        prev_count = neg_count + 1  # Decrement (more negative = more count)
        prev_char = char
    
    return ''.join(result)


def solve_interleave(s: str) -> str:
    """
    Alternative: Fill even indices, then odd indices.
    """
    count = Counter(s)
    
    # Sort by frequency
    sorted_chars = sorted(count.keys(), key=lambda c: -count[c])
    
    # Check if possible
    if count[sorted_chars[0]] > (len(s) + 1) // 2:
        return ""
    
    result = [''] * len(s)
    idx = 0
    
    for char in sorted_chars:
        for _ in range(count[char]):
            result[idx] = char
            idx += 2
            
            # Wrap to odd indices
            if idx >= len(s):
                idx = 1
    
    return ''.join(result)
```

---

## Phase 4: Dry Run

**Input:** `"aab"`

**Heap Approach:**

| Step | Heap | Pop | Result | Push Back |
|------|------|-----|--------|-----------|
| init | [(-2,a), (-1,b)] | - | [] | - |
| 1 | [(-1,b)] | a | [a] | prev=(−1,a) |
| 2 | [(-1,a)] | b | [a,b] | prev=(0,b) |
| 3 | [] | a | [a,b,a] | prev=(0,a) |

**Result:** `"aba"`

---

## Phase 5: Complexity Analysis

### Heap Approach:
- **Time:** O(N log A) where A = alphabet size (26)
- **Space:** O(A)

### Interleave Approach:
- **Time:** O(N)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"At least k apart?"**
   → Use queue to hold last k characters; Task Scheduler variant.

2. **"Lexicographically smallest?"**
   → Greedy with different ordering.

3. **"Count all valid arrangements?"**
   → Combinatorics or DP; much harder.
