# Counting Bits

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 338 | Bit Manipulation + DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return array where ans[i] = number of 1s in binary of i.

### Constraints & Clarifying Questions
1. **Range [0, n]?** Yes, inclusive.
2. **n = 0?** Return [0].
3. **Optimal O(n) time?** Yes.
4. **Space O(n)?** For result array.

### Edge Cases
1. **n = 0:** [0]
2. **n = 1:** [0, 1]
3. **Powers of 2:** Have exactly one 1 bit

---

## Phase 2: High-Level Approach

### Approach: DP with Last Set Bit
ans[i] = ans[i & (i-1)] + 1 (remove last bit, add 1).
Or: ans[i] = ans[i >> 1] + (i & 1).

**Core Insight:** Reuse previous calculations.

---

## Phase 3: Python Code

```python
from typing import List


def solve(n: int) -> List[int]:
    """
    Count bits for all numbers 0 to n.
    
    Args:
        n: Upper bound
    
    Returns:
        Array of bit counts
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # ans[i] = ans[i with last bit removed] + 1
        ans[i] = ans[i & (i - 1)] + 1
    
    return ans


def solve_right_shift(n: int) -> List[int]:
    """
    Using right shift relationship.
    """
    ans = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # ans[i] = ans[i//2] + last bit
        ans[i] = ans[i >> 1] + (i & 1)
    
    return ans


def solve_offset(n: int) -> List[int]:
    """
    Using power of 2 offset.
    """
    ans = [0] * (n + 1)
    offset = 1
    
    for i in range(1, n + 1):
        if offset * 2 == i:
            offset = i
        ans[i] = 1 + ans[i - offset]
    
    return ans


def solve_naive(n: int) -> List[int]:
    """
    Naive: count bits for each number.
    """
    def count_bits(x):
        count = 0
        while x:
            x &= x - 1
            count += 1
        return count
    
    return [count_bits(i) for i in range(n + 1)]
```

---

## Phase 4: Dry Run

**Input:** n = 5

**Method 1 (Brian Kernighan DP):**

| i | i & (i-1) | ans[i & (i-1)] | ans[i] |
|---|-----------|----------------|--------|
| 0 | - | - | 0 |
| 1 | 0 | 0 | 1 |
| 2 | 0 | 0 | 1 |
| 3 | 2 | 1 | 2 |
| 4 | 0 | 0 | 1 |
| 5 | 4 | 1 | 2 |

**Result:** [0, 1, 1, 2, 1, 2] ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(N)
Result array.

---

## Phase 6: Follow-Up Questions

1. **"Sum of all bits from 0 to n?"**
   → Sum the result array.

2. **"Count numbers with exactly k bits?"**
   → Filter result array.

3. **"Bitwise AND of range [m, n]?"**
   → Different problem; find common prefix.
