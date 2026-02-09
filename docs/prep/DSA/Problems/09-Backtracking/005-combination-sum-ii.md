# Combination Sum II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 40 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all unique combinations summing to target. Each candidate can be used only once.

### Constraints & Clarifying Questions
1. **Candidates may have duplicates?** Yes.
2. **Use each once?** Yes.
3. **Result duplicates allowed?** No.
4. **All positive?** Yes.

### Edge Cases
1. **No valid combination:** `[]`
2. **Multiple same candidates:** Handle duplicates
3. **Single candidate equals target:** `[[candidate]]`

---

## Phase 2: High-Level Approach

### Approach: Sort + Skip Duplicates
Sort candidates. Skip duplicates at same recursion level.

**Core Insight:** Sort to group duplicates; skip same value at same level to avoid duplicate combinations.

---

## Phase 3: Python Code

```python
from typing import List


def solve(candidates: List[int], target: int) -> List[List[int]]:
    """
    Find unique combinations summing to target (each used once).
    
    Args:
        candidates: Available numbers (may have duplicates)
        target: Target sum
    
    Returns:
        All unique combinations
    """
    candidates.sort()
    result = []
    
    def backtrack(start: int, current: List[int], remaining: int):
        if remaining == 0:
            result.append(current.copy())
            return
        
        for i in range(start, len(candidates)):
            # Pruning: sorted, so all following are too large
            if candidates[i] > remaining:
                break
            
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])  # i+1: use once
            current.pop()
    
    backtrack(0, [], target)
    return result
```

---

## Phase 4: Dry Run

**Input:** `candidates = [10,1,2,7,6,1,5], target = 8`

**After Sort:** `[1, 1, 2, 5, 6, 7, 10]`

**Backtracking (selected paths):**

| Path | Sum | Skip/Prune? | Result |
|------|-----|-------------|--------|
| [1,1,2,5] | 9 | >8, prune | |
| [1,1,6] | 8 | | ✓ |
| [1,2,5] | 8 | | ✓ |
| [1,7] | 8 | | ✓ |
| [2,6] | 8 | | ✓ |
| Second 1 at level 0 | - | Skip (dup) | |

**Result:** `[[1,1,6], [1,2,5], [1,7], [2,6]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(2^N)
Each candidate in or out (with pruning).

### Space Complexity: O(N)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"Combination Sum III: k numbers from 1-9?"**
   → Fixed candidate set [1-9], must use exactly k numbers.

2. **"Return combinations closest to target?"**
   → Track best sum seen; different problem.

3. **"Unlimited use but limit total count?"**
   → Add count parameter to state.
