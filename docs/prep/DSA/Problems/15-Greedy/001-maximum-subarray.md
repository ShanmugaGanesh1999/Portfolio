# Maximum Subarray (Greedy)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 53 | Greedy / Kadane |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find contiguous subarray with largest sum using greedy approach.

### Constraints & Clarifying Questions
1. **At least one element?** Yes.
2. **All negative?** Return max single element.
3. **Return sum or subarray?** Sum.
4. **Greedy vs DP?** Same algorithm (Kadane's).

### Edge Cases
1. **Single element:** Return it
2. **All negatives:** Return largest
3. **All positives:** Return total

---

## Phase 2: High-Level Approach

### Approach: Kadane's Algorithm (Greedy)
Reset running sum when it goes negative. Track maximum seen.

**Greedy Insight:** Negative prefix never helps; discard it.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Find maximum subarray sum using Kadane's algorithm.
    
    Args:
        nums: Array of integers
    
    Returns:
        Maximum subarray sum
    """
    max_sum = nums[0]
    curr_sum = 0
    
    for num in nums:
        # Greedy choice: start fresh or extend
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    
    return max_sum


def solve_explicit(nums: List[int]) -> int:
    """
    More explicit greedy approach.
    """
    max_sum = float('-inf')
    curr_sum = 0
    
    for num in nums:
        curr_sum += num
        max_sum = max(max_sum, curr_sum)
        
        # Greedy: discard negative prefix
        if curr_sum < 0:
            curr_sum = 0
    
    return max_sum


def solve_with_indices(nums: List[int]) -> tuple:
    """
    Return sum and indices.
    """
    max_sum = nums[0]
    curr_sum = 0
    start = end = 0
    temp_start = 0
    
    for i, num in enumerate(nums):
        curr_sum += num
        
        if curr_sum > max_sum:
            max_sum = curr_sum
            start = temp_start
            end = i
        
        if curr_sum < 0:
            curr_sum = 0
            temp_start = i + 1
    
    return max_sum, start, end, nums[start:end + 1]
```

---

## Phase 4: Dry Run

**Input:** `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| i | num | curr_sum | max_sum | Action |
|---|-----|----------|---------|--------|
| 0 | -2 | 0 → -2 → 0 | -2 | Reset |
| 1 | 1 | 1 | 1 | Keep |
| 2 | -3 | -2 → 0 | 1 | Reset |
| 3 | 4 | 4 | 4 | Keep |
| 4 | -1 | 3 | 4 | Keep |
| 5 | 2 | 5 | 5 | Keep |
| 6 | 1 | 6 | 6 | Keep |
| 7 | -5 | 1 | 6 | Keep |
| 8 | 4 | 5 | 6 | Keep |

**Subarray:** [4, -1, 2, 1]

**Result:** 6

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Constant variables.

---

## Phase 6: Follow-Up Questions

1. **"Maximum product subarray?"**
   → Track min and max (negatives).

2. **"Circular array?"**
   → Max of Kadane OR total - min subarray.

3. **"At most k elements?"**
   → Different approach needed.
