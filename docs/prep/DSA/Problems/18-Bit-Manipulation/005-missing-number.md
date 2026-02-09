# Missing Number

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 268 | Bit Manipulation / Math |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find missing number in [0, n] from array of n numbers.

### Constraints & Clarifying Questions
1. **Exactly one missing?** Yes.
2. **Range [0, n]?** Yes, n+1 numbers total.
3. **No duplicates?** Correct.
4. **Unsorted?** Yes.

### Edge Cases
1. **[0]:** Missing is 1
2. **[1]:** Missing is 0
3. **[0,1,2]:** Missing is 3

---

## Phase 2: High-Level Approach

### Approach 1: XOR
XOR indices (0 to n) with all elements. Pairs cancel.

### Approach 2: Sum
Sum of [0,n] - Sum of array = missing.

**Core Insight:** XOR is self-inverse; sum formula is n(n+1)/2.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Find missing number using XOR.
    
    Args:
        nums: Array with one missing number from [0, n]
    
    Returns:
        The missing number
    """
    n = len(nums)
    result = n  # Start with n (index we won't visit)
    
    for i in range(n):
        result ^= i ^ nums[i]
    
    return result


def solve_sum(nums: List[int]) -> int:
    """
    Using sum formula.
    """
    n = len(nums)
    expected = n * (n + 1) // 2
    return expected - sum(nums)


def solve_set(nums: List[int]) -> int:
    """
    Using set difference (O(n) space).
    """
    full = set(range(len(nums) + 1))
    return (full - set(nums)).pop()


def solve_sort(nums: List[int]) -> int:
    """
    Sort and find gap (O(n log n) time).
    """
    nums.sort()
    
    for i, num in enumerate(nums):
        if i != num:
            return i
    
    return len(nums)


def solve_binary_search(nums: List[int]) -> int:
    """
    If sorted: binary search for discontinuity.
    """
    nums.sort()
    left, right = 0, len(nums)
    
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > mid:
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

## Phase 4: Dry Run

**Input:** [3, 0, 1]

**XOR Method:**
- n = 3
- result = 3 (initial)

| i | nums[i] | i ^ nums[i] | result |
|---|---------|-------------|--------|
| 0 | 3 | 0^3=3 | 3^3=0 |
| 1 | 0 | 1^0=1 | 0^1=1 |
| 2 | 1 | 2^1=3 | 1^3=2 |

**Result:** 2 ✓

**Sum Method:**
- Expected: 3×4/2 = 6
- Actual: 3+0+1 = 4
- Missing: 6-4 = 2 ✓

---

## Phase 5: Complexity Analysis

### XOR / Sum:
- **Time:** O(N)
- **Space:** O(1)

### Set:
- **Time:** O(N)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Two missing numbers?"**
   → XOR to get a^b, split by bit.

2. **"Find duplicate instead?"**
   → Linked List cycle detection.

3. **"Range [a, b] instead of [0, n]?"**
   → Adjust sum formula.
