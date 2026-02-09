# Combination Sum III

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 216 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find all combinations of k numbers from 1-9 that sum to n. Each number used at most once.

### Constraints & Clarifying Questions
1. **Numbers available?** 1 to 9 only.
2. **Use each once?** Yes.
3. **k and n bounds?** 2 ≤ k ≤ 9, 1 ≤ n ≤ 60.
4. **Always has solution?** Not guaranteed.

### Edge Cases
1. **Impossible sum:** Return `[]`
2. **k = 9:** Must use all 1-9, sum must be 45
3. **Minimum sum:** 1+2+...+k; maximum: (10-k)+...+9

---

## Phase 2: High-Level Approach

### Approach: Backtracking with Pruning
Similar to Combination Sum, but fixed k numbers from 1-9.

**Core Insight:** Combine combination count constraint with sum constraint.

---

## Phase 3: Python Code

```python
from typing import List


def solve(k: int, n: int) -> List[List[int]]:
    """
    Find combinations of k numbers (1-9) summing to n.
    
    Args:
        k: Number of elements
        n: Target sum
    
    Returns:
        All valid combinations
    """
    result = []
    
    def backtrack(start: int, current: List[int], remaining: int):
        # Found valid combination
        if len(current) == k:
            if remaining == 0:
                result.append(current.copy())
            return
        
        # Pruning
        need = k - len(current)
        
        for num in range(start, 10):
            # Too large
            if num > remaining:
                break
            
            # Not enough numbers left
            if 10 - num < need:
                break
            
            current.append(num)
            backtrack(num + 1, current, remaining - num)
            current.pop()
    
    backtrack(1, [], n)
    return result


def solve_with_bounds_check(k: int, n: int) -> List[List[int]]:
    """
    With early bounds checking.
    """
    # Check feasibility
    min_sum = sum(range(1, k + 1))  # 1+2+...+k
    max_sum = sum(range(10 - k, 10))  # (10-k)+...+9
    
    if n < min_sum or n > max_sum:
        return []
    
    result = []
    
    def backtrack(start, current, remaining):
        if len(current) == k:
            if remaining == 0:
                result.append(current.copy())
            return
        
        for num in range(start, 10):
            if num > remaining:
                break
            
            current.append(num)
            backtrack(num + 1, current, remaining - num)
            current.pop()
    
    backtrack(1, [], n)
    return result
```

---

## Phase 4: Dry Run

**Input:** `k = 3, n = 7`

**Backtracking:**

| current | remaining | Next | Valid? |
|---------|-----------|------|--------|
| [] | 7 | 1,2,3... | |
| [1] | 6 | 2,3,4,5,6 | |
| [1,2] | 4 | 3,4 | |
| [1,2,3] | 1 | - | k=3, rem≠0 |
| [1,2,4] | 0 | - | ✓ Found! |

**Result:** `[[1,2,4]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(C(9, k) × k)
At most C(9, k) combinations to explore.

### Space Complexity: O(k)
Recursion depth + current combination.

---

## Phase 6: Follow-Up Questions

1. **"What if range is 1 to m?"**
   → Generalize: loop from start to m+1.

2. **"Allow repeats?"**
   → Use `start = num` instead of `num + 1`.

3. **"Find combination closest to n?"**
   → Track best sum seen; different approach.
