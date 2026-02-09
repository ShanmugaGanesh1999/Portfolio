# Combination Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 39 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all unique combinations where candidates sum to target. Same number can be used unlimited times.

### Constraints & Clarifying Questions
1. **Candidates unique?** Yes.
2. **All positive?** Yes.
3. **Can reuse same number?** Yes.
4. **Order matters?** No, [2,3] same as [3,2].
5. **Empty result?** Return `[]` if no combination.

### Edge Cases
1. **Target = 0:** `[[]]` (empty combination)
2. **No valid combination:** `[]`
3. **Target = one candidate:** `[[candidate]]`

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Reuse
Explore using current candidate again or moving to next. Prune when sum exceeds target.

**Core Insight:** Unlike permutations, order doesn't matter; use index to avoid duplicates.

---

## Phase 3: Python Code

```python
from typing import List


def solve(candidates: List[int], target: int) -> List[List[int]]:
    """
    Find combinations that sum to target (reuse allowed).
    
    Args:
        candidates: Available numbers
        target: Target sum
    
    Returns:
        All valid combinations
    """
    result = []
    
    def backtrack(start: int, current: List[int], remaining: int):
        if remaining == 0:
            result.append(current.copy())
            return
        
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            # Pruning: skip if candidate too large
            if candidates[i] > remaining:
                continue
            
            current.append(candidates[i])
            # Use i (not i+1) to allow reuse
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result


def solve_sorted_pruning(candidates: List[int], target: int) -> List[List[int]]:
    """
    With sorting for early termination.
    """
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current.copy())
            return
        
        for i in range(start, len(candidates)):
            # Early termination if sorted
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result
```

---

## Phase 4: Dry Run

**Input:** `candidates = [2, 3, 6, 7], target = 7`

**Backtracking Tree:**
```
                    target=7
           /        |        \        \
          2         3         6        7
         /|\        |
        2 3 6      3
       /
      2
     /
    (sum=8, prune)
```

**Execution:**

| Path | Sum | Action |
|------|-----|--------|
| [2,2,2,2] | 8 | Prune (>7) |
| [2,2,3] | 7 | ✓ Found! |
| [2,3] | 5 | Continue |
| [2,3,3] | 8 | Prune |
| [3,3] | 6 | Continue |
| [3,3,3] | 9 | Prune |
| [7] | 7 | ✓ Found! |

**Result:** `[[2,2,3], [7]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N^(T/M))
Where T = target, M = minimum candidate. Branching factor N, depth T/M.

### Space Complexity: O(T/M)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"Each candidate used once?"**
   → Combination Sum II: use i+1 in recursion, handle duplicates.

2. **"Return count instead of combinations?"**
   → DP approach: dp[i] = ways to make sum i.

3. **"Limited usage (use at most k times)?"**
   → Track count per candidate in state.
