# Combinations

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 77 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return all combinations of k numbers from [1, n].

### Constraints & Clarifying Questions
1. **Order within combination?** Doesn't matter (but maintain for uniqueness).
2. **Order of result?** Any order.
3. **n and k bounds?** 1 ≤ k ≤ n ≤ 20.
4. **Return what?** List of lists.

### Edge Cases
1. **k = n:** Single combination with all numbers
2. **k = 1:** Each number as separate combination
3. **k = 0:** `[[]]` (empty combination)

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Pruning
Build combinations incrementally. Only go forward (start parameter) to avoid duplicates.

**Core Insight:** C(n, k) = total combinations; prune when remaining numbers < needed.

---

## Phase 3: Python Code

```python
from typing import List


def solve(n: int, k: int) -> List[List[int]]:
    """
    Generate all combinations of k numbers from 1 to n.
    
    Args:
        n: Range upper bound
        k: Combination size
    
    Returns:
        All combinations
    """
    result = []
    
    def backtrack(start: int, current: List[int]):
        if len(current) == k:
            result.append(current.copy())
            return
        
        # Pruning: need k - len(current) more numbers
        # Available: n - start + 1 numbers
        need = k - len(current)
        available = n - start + 1
        
        if available < need:
            return
        
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(1, [])
    return result


def solve_itertools(n: int, k: int) -> List[List[int]]:
    """
    Using itertools (for reference).
    """
    from itertools import combinations
    return [list(c) for c in combinations(range(1, n + 1), k)]


def solve_optimized(n: int, k: int) -> List[List[int]]:
    """
    Tighter pruning in loop boundary.
    """
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current.copy())
            return
        
        # Can only go up to n - (k - len(current)) + 1
        for i in range(start, n - (k - len(current)) + 2):
            current.append(i)
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(1, [])
    return result
```

---

## Phase 4: Dry Run

**Input:** `n = 4, k = 2`

**Backtracking:**

| start | current | Action |
|-------|---------|--------|
| 1 | [] | Try 1,2,3,4 |
| 1 | [1] | Try 2,3,4 |
| 2 | [1,2] | Found ✓ |
| 3 | [1,3] | Found ✓ |
| 4 | [1,4] | Found ✓ |
| 2 | [2] | Try 3,4 |
| 3 | [2,3] | Found ✓ |
| 4 | [2,4] | Found ✓ |
| 3 | [3] | Try 4 |
| 4 | [3,4] | Found ✓ |
| 4 | [4] | Need 1 more, only 0 available → prune |

**Result:** `[[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(k × C(n, k))
C(n, k) combinations, each takes O(k) to copy.

### Space Complexity: O(k)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"Combinations with repetition?"**
   → Allow same number multiple times: use `start = i` instead of `i + 1`.

2. **"kth combination?"**
   → Use combinatorial mathematics to directly compute.

3. **"Iterator for combinations?"**
   → Track state; generate one at a time.
