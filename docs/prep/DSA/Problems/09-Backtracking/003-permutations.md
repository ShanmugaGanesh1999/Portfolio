# Permutations

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 46 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Generate all permutations of array with distinct integers.

### Constraints & Clarifying Questions
1. **Distinct elements?** Yes.
2. **Order matters?** Yes (that's what makes it permutation).
3. **Return order?** Any order of permutations.
4. **Input size?** Up to ~8 (8! = 40320).

### Edge Cases
1. **Single element:** `[[x]]`
2. **Two elements:** `[[a,b], [b,a]]`
3. **Empty array:** `[[]]`

---

## Phase 2: High-Level Approach

### Option 1: Backtracking with Used Set
Track used indices; build permutation element by element.

### Option 2: Swapping
Swap current position with each remaining position.

**Core Insight:** Unlike subsets, order matters; every element must be used exactly once.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> List[List[int]]:
    """
    Generate all permutations using backtracking.
    
    Args:
        nums: Array of distinct integers
    
    Returns:
        All permutations
    """
    result = []
    
    def backtrack(current: List[int], remaining: set):
        if not remaining:
            result.append(current.copy())
            return
        
        for num in list(remaining):  # Iterate copy to allow modification
            current.append(num)
            remaining.remove(num)
            
            backtrack(current, remaining)
            
            current.pop()
            remaining.add(num)
    
    backtrack([], set(nums))
    return result


def solve_swap(nums: List[int]) -> List[List[int]]:
    """
    Using swapping approach.
    """
    result = []
    
    def backtrack(start: int):
        if start == len(nums):
            result.append(nums.copy())
            return
        
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]  # Swap
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]  # Swap back
    
    backtrack(0)
    return result


def solve_itertools(nums: List[int]) -> List[List[int]]:
    """
    Using itertools (for reference).
    """
    from itertools import permutations
    return [list(p) for p in permutations(nums)]
```

---

## Phase 4: Dry Run

**Input:** `[1, 2, 3]`

**Swap Approach Tree:**
```
                [1,2,3]
       /          |          \
    [1,2,3]    [2,1,3]     [3,2,1]
     /   \      /   \       /   \
 [1,2,3][1,3,2][2,1,3][2,3,1][3,2,1][3,1,2]
```

**Execution:**

| start | Swaps | Result Added |
|-------|-------|--------------|
| 0 | i=0 (no swap) | - |
| 1 | i=1 (no swap) | - |
| 2 | i=2 (no swap) | [1,2,3] |
| 2 | backtrack | - |
| 1 | i=2, swap 2↔3 | - |
| 2 | - | [1,3,2] |
| ... | ... | ... |

**Result:** `[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N! × N)
N! permutations, each takes O(N) to copy.

### Space Complexity: O(N)
Recursion depth + current permutation (excluding output).

---

## Phase 6: Follow-Up Questions

1. **"What if duplicates exist?"**
   → Permutations II: sort and skip duplicates at same level.

2. **"Next permutation?"**
   → Find rightmost ascending pair, swap, reverse suffix.

3. **"kth permutation?"**
   → Use factorial numbering system for O(N²).
