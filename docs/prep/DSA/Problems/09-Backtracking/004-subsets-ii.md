# Subsets II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 90 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Generate all subsets of array that may contain duplicates. Result must not contain duplicate subsets.

### Constraints & Clarifying Questions
1. **Duplicates in input?** Yes.
2. **Duplicate subsets allowed?** No.
3. **Order within subset?** Any.
4. **Order of result?** Any.

### Edge Cases
1. **All same elements:** [1,1,1] → [[], [1], [1,1], [1,1,1]]
2. **No duplicates:** Same as Subsets I
3. **Single element:** [[], [x]]

---

## Phase 2: High-Level Approach

### Approach: Sort + Skip Duplicates
Sort array first. When backtracking at same level, skip elements equal to previous.

**Core Insight:** Sorting groups duplicates; skip same value at same recursion level.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> List[List[int]]:
    """
    Generate all unique subsets from array with duplicates.
    
    Args:
        nums: Array possibly with duplicates
    
    Returns:
        All unique subsets
    """
    nums.sort()  # Critical: group duplicates together
    result = []
    
    def backtrack(start: int, current: List[int]):
        result.append(current.copy())
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result


def solve_iterative(nums: List[int]) -> List[List[int]]:
    """
    Iterative approach with duplicate handling.
    """
    nums.sort()
    result = [[]]
    
    start = 0
    for i, num in enumerate(nums):
        # If duplicate, only add to subsets created in last iteration
        if i > 0 and nums[i] == nums[i - 1]:
            start = end
        else:
            start = 0
        
        end = len(result)
        
        for j in range(start, end):
            result.append(result[j] + [num])
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `[1, 2, 2]`

**After Sort:** `[1, 2, 2]`

**Backtracking:**

| Level | i | nums[i] | Skip? | current |
|-------|---|---------|-------|---------|
| 0 | - | - | - | [] ✓ |
| 0 | 0 | 1 | No | [1] ✓ |
| 1 | 1 | 2 | No | [1,2] ✓ |
| 2 | 2 | 2 | No | [1,2,2] ✓ |
| 1 | 2 | 2 | Yes (2==2) | Skip |
| 0 | 1 | 2 | No | [2] ✓ |
| 1 | 2 | 2 | No | [2,2] ✓ |
| 0 | 2 | 2 | Yes (2==2) | Skip |

**Result:** `[[], [1], [1,2], [1,2,2], [2], [2,2]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × 2^N)
Same as Subsets I in worst case.

### Space Complexity: O(N)
Recursion depth.

---

## Phase 6: Follow-Up Questions

1. **"What if we need count only?"**
   → Use formula: for each unique element with count c, multiply by (c+1).

2. **"Subsets of exact size k with duplicates?"**
   → Same skip logic; only add when size == k.

3. **"Maintain original order?"**
   → Track indices instead of values; more complex.
