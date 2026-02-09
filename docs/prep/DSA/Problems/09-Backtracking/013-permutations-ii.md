# Permutations II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 47 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Generate all unique permutations from array that may contain duplicates.

### Constraints & Clarifying Questions
1. **Duplicates in input?** Yes.
2. **Duplicate permutations allowed?** No.
3. **Input order?** Can sort.
4. **Return order?** Any.

### Edge Cases
1. **All same:** Single permutation
2. **All distinct:** Same as Permutations I
3. **Pairs:** Some duplicates

---

## Phase 2: High-Level Approach

### Approach: Sort + Skip Duplicates
Sort array. At each level, skip if same value used before at that level.

**Core Insight:** Sort groups duplicates; skip same value at same recursion level.

---

## Phase 3: Python Code

```python
from typing import List
from collections import Counter


def solve(nums: List[int]) -> List[List[int]]:
    """
    Generate unique permutations from array with duplicates.
    
    Args:
        nums: Array possibly with duplicates
    
    Returns:
        All unique permutations
    """
    result = []
    nums.sort()
    used = [False] * len(nums)
    
    def backtrack(current: List[int]):
        if len(current) == len(nums):
            result.append(current.copy())
            return
        
        for i in range(len(nums)):
            # Skip if used
            if used[i]:
                continue
            
            # Skip duplicates at same level
            # Only use duplicate if previous duplicate was used (in current path)
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            
            backtrack(current)
            
            current.pop()
            used[i] = False
    
    backtrack([])
    return result


def solve_counter(nums: List[int]) -> List[List[int]]:
    """
    Using Counter - cleaner for duplicates.
    """
    result = []
    counter = Counter(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current.copy())
            return
        
        for num in counter:
            if counter[num] > 0:
                current.append(num)
                counter[num] -= 1
                
                backtrack(current)
                
                current.pop()
                counter[num] += 1
    
    backtrack([])
    return result
```

---

## Phase 4: Dry Run

**Input:** `[1, 1, 2]`

**After Sort:** `[1, 1, 2]`

**Backtracking with Skip:**

| Level 0 | Level 1 | Level 2 | Result |
|---------|---------|---------|--------|
| i=0: 1 | i=1: 1 | i=2: 2 | [1,1,2] ✓ |
| i=0: 1 | i=2: 2 | i=1: 1 | [1,2,1] ✓ |
| i=1: 1 | Skip (dup, prev unused) | | |
| i=2: 2 | i=0: 1 | i=1: 1 | [2,1,1] ✓ |
| i=2: 2 | i=1: 1 | Skip | |

**Result:** `[[1,1,2], [1,2,1], [2,1,1]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N! / (k1! × k2! × ...))
Where ki = count of each distinct element.

### Space Complexity: O(N)
Recursion depth + used array.

---

## Phase 6: Follow-Up Questions

1. **"Next permutation?"**
   → Find rightmost ascending pair, swap, reverse suffix.

2. **"Count unique permutations?"**
   → Use formula: N! / (count1! × count2! × ...).

3. **"Lexicographically smallest?"**
   → Sort array first (already done); first permutation generated.
