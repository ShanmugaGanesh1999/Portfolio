# Reorganize String

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 767 | Greedy + Heap |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Rearrange string so no two adjacent chars are same.

### Constraints & Clarifying Questions
1. **Return any valid arrangement?** Yes.
2. **Not possible?** Return "".
3. **Lowercase only?** Yes.
4. **Preserve character count?** Yes.

### Edge Cases
1. **Single char:** Return it
2. **All same chars:** "" if len > 1
3. **"aab":** "aba"

---

## Phase 2: High-Level Approach

### Approach: Greedy with Max Heap
Always place most frequent character (that isn't previous).
Use heap to efficiently get next most frequent.

**Core Insight:** Most frequent must be spread out maximally.

---

## Phase 3: Python Code

```python
from collections import Counter
import heapq


def solve(s: str) -> str:
    """
    Reorganize string with no adjacent duplicates.
    
    Args:
        s: Input string
    
    Returns:
        Reorganized string or "" if impossible
    """
    count = Counter(s)
    
    # Check if possible: max freq <= (len + 1) // 2
    max_freq = max(count.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max heap (negate for Python)
    heap = [(-freq, char) for char, freq in count.items()]
    heapq.heapify(heap)
    
    result = []
    prev_freq, prev_char = 0, ''
    
    while heap:
        freq, char = heapq.heappop(heap)
        result.append(char)
        
        # Put back previous char if it has remaining count
        if prev_freq < 0:
            heapq.heappush(heap, (prev_freq, prev_char))
        
        # Update prev to current (decrement freq)
        prev_freq = freq + 1
        prev_char = char
    
    return ''.join(result)


def solve_fill_positions(s: str) -> str:
    """
    Fill even then odd positions.
    """
    count = Counter(s)
    n = len(s)
    
    max_freq = max(count.values())
    if max_freq > (n + 1) // 2:
        return ""
    
    # Sort by frequency descending
    chars = sorted(count.keys(), key=lambda x: -count[x])
    
    result = [''] * n
    idx = 0
    
    for char in chars:
        freq = count[char]
        while freq > 0:
            if idx >= n:
                idx = 1  # Switch to odd positions
            result[idx] = char
            idx += 2
            freq -= 1
    
    return ''.join(result)


def solve_most_frequent_first(s: str) -> str:
    """
    Place most frequent at even positions first.
    """
    count = Counter(s)
    n = len(s)
    
    # Find most frequent
    max_char = max(count.keys(), key=lambda x: count[x])
    max_freq = count[max_char]
    
    if max_freq > (n + 1) // 2:
        return ""
    
    result = [''] * n
    idx = 0
    
    # Place most frequent at even indices
    while count[max_char] > 0:
        result[idx] = max_char
        idx += 2
        count[max_char] -= 1
    
    # Place remaining characters
    del count[max_char]
    
    for char, freq in count.items():
        while freq > 0:
            if idx >= n:
                idx = 1
            result[idx] = char
            idx += 2
            freq -= 1
    
    return ''.join(result)
```

---

## Phase 4: Dry Run

**Input:** `"aab"`

**Count:** {a: 2, b: 1}
**Max freq = 2 <= (3+1)/2 = 2 ✓**

**Heap approach:**

| Step | Pop | result | Push back |
|------|-----|--------|-----------|
| 1 | (-2, a) | "a" | prev=(−1,a) waiting |
| 2 | (-1, b) | "ab" | push (-1,a), prev=(0,b) |
| 3 | (-1, a) | "aba" | prev=(0,a) done |

**Result:** "aba"

---

## Phase 5: Complexity Analysis

### Heap Approach:
- **Time:** O(N log 26) = O(N)
- **Space:** O(26) = O(1)

### Fill Positions:
- **Time:** O(N)
- **Space:** O(N) for result

---

## Phase 6: Follow-Up Questions

1. **"Distance at least k apart?"**
   → Task Scheduler variant.

2. **"Lexicographically smallest?"**
   → Different approach; not just frequency-based.

3. **"Count valid arrangements?"**
   → Combinatorics; much harder.
