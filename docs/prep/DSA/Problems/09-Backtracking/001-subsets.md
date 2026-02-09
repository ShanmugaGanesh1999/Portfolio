# Subsets

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 78 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Generate all subsets (power set) of array with unique integers.

### Constraints & Clarifying Questions
1. **Unique elements?** Yes.
2. **Order of subsets?** Any order.
3. **Order within subset?** Any order.
4. **Empty set included?** Yes.
5. **Input size?** Up to ~15 (2^15 subsets).

### Edge Cases
1. **Empty array:** `[[]]`
2. **Single element:** `[[], [x]]`
3. **Two elements:** `[[], [a], [b], [a,b]]`

---

## Phase 2: High-Level Approach

### Option 1: Backtracking
For each element, decide include or exclude.

### Option 2: Iterative
Start with `[[]]`, for each num, add to all existing subsets.

### Option 3: Bit Manipulation
Each subset is a bitmask.

**Core Insight:** Each element has binary choice: in or out.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> List[List[int]]:
    """
    Generate all subsets using backtracking.
    
    Args:
        nums: Array of unique integers
    
    Returns:
        All possible subsets
    """
    result = []
    
    def backtrack(start: int, current: List[int]):
        # Add current subset (valid at any point)
        result.append(current.copy())
        
        # Try adding each remaining element
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()  # Backtrack
    
    backtrack(0, [])
    return result


def solve_iterative(nums: List[int]) -> List[List[int]]:
    """
    Iterative approach.
    """
    result = [[]]
    
    for num in nums:
        # Add num to all existing subsets
        result += [subset + [num] for subset in result]
    
    return result


def solve_bitmask(nums: List[int]) -> List[List[int]]:
    """
    Bitmask approach.
    """
    n = len(nums)
    result = []
    
    for mask in range(2 ** n):  # 0 to 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `[1, 2, 3]`

**Backtracking Tree:**
```
                    []
        /           |           \
      [1]          [2]          [3]
     /   \          |
   [1,2] [1,3]    [2,3]
    |
 [1,2,3]
```

**Execution:**

| Call | current | start | Action |
|------|---------|-------|--------|
| 1 | [] | 0 | Add [], try 1,2,3 |
| 2 | [1] | 1 | Add [1], try 2,3 |
| 3 | [1,2] | 2 | Add [1,2], try 3 |
| 4 | [1,2,3] | 3 | Add [1,2,3], done |
| 5 | [1,3] | 3 | Add [1,3], done |
| 6 | [2] | 2 | Add [2], try 3 |
| 7 | [2,3] | 3 | Add [2,3], done |
| 8 | [3] | 3 | Add [3], done |

**Result:** `[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × 2^N)
2^N subsets, each takes O(N) to copy.

### Space Complexity: O(N)
Recursion depth (excluding output).

---

## Phase 6: Follow-Up Questions

1. **"What if duplicates exist?"**
   → Sort first; skip duplicates in same position (Subsets II).

2. **"Only subsets of size k?"**
   → Add condition: only add when len(current) == k.

3. **"Lexicographically sorted subsets?"**
   → Sort input; subsets naturally come in order.
