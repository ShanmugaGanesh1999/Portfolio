# Maximum Subarray

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 53 | DP / Kadane's Algorithm |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find contiguous subarray with largest sum.

### Constraints & Clarifying Questions
1. **At least one element?** Yes.
2. **All negative?** Return max single element.
3. **Return sum or subarray?** Sum.
4. **Integer overflow?** Consider for large inputs.

### Edge Cases
1. **Single element:** Return it
2. **All negatives:** Return largest (least negative)
3. **All positives:** Return total sum

---

## Phase 2: High-Level Approach

### Approach: Kadane's Algorithm
Track current sum; reset to 0 when it goes negative.

**Core Insight:** Negative prefix never helps; start fresh.

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
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    
    return max_sum


def solve_dp(nums: List[int]) -> int:
    """
    DP formulation.
    """
    n = len(nums)
    dp = [0] * n  # dp[i] = max sum ending at i
    dp[0] = nums[0]
    
    for i in range(1, n):
        dp[i] = max(nums[i], dp[i - 1] + nums[i])
    
    return max(dp)


def solve_with_indices(nums: List[int]) -> tuple:
    """
    Return sum and indices.
    """
    max_sum = nums[0]
    curr_sum = 0
    start = end = 0
    temp_start = 0
    
    for i, num in enumerate(nums):
        if curr_sum < 0:
            curr_sum = num
            temp_start = i
        else:
            curr_sum += num
        
        if curr_sum > max_sum:
            max_sum = curr_sum
            start = temp_start
            end = i
    
    return max_sum, start, end


def solve_divide_conquer(nums: List[int]) -> int:
    """
    Divide and conquer O(n log n).
    """
    def helper(left: int, right: int) -> int:
        if left == right:
            return nums[left]
        
        mid = (left + right) // 2
        
        # Max in left half
        left_max = helper(left, mid)
        # Max in right half
        right_max = helper(mid + 1, right)
        
        # Max crossing middle
        left_sum = float('-inf')
        curr = 0
        for i in range(mid, left - 1, -1):
            curr += nums[i]
            left_sum = max(left_sum, curr)
        
        right_sum = float('-inf')
        curr = 0
        for i in range(mid + 1, right + 1):
            curr += nums[i]
            right_sum = max(right_sum, curr)
        
        cross_max = left_sum + right_sum
        
        return max(left_max, right_max, cross_max)
    
    return helper(0, len(nums) - 1)
```

---

## Phase 4: Dry Run

**Input:** `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| i | num | curr_sum | max_sum |
|---|-----|----------|---------|
| 0 | -2 | max(-2,0+(-2))=-2 | -2 |
| 1 | 1 | max(1,-2+1)=1 | 1 |
| 2 | -3 | max(-3,1-3)=-2 | 1 |
| 3 | 4 | max(4,-2+4)=4 | 4 |
| 4 | -1 | max(-1,4-1)=3 | 4 |
| 5 | 2 | max(2,3+2)=5 | 5 |
| 6 | 1 | max(1,5+1)=6 | 6 |
| 7 | -5 | max(-5,6-5)=1 | 6 |
| 8 | 4 | max(4,1+4)=5 | 6 |

**Subarray:** [4, -1, 2, 1]

**Result:** 6

---

## Phase 5: Complexity Analysis

### Kadane's Algorithm:
- **Time:** O(N)
- **Space:** O(1)

### Divide and Conquer:
- **Time:** O(N log N)
- **Space:** O(log N) recursion

---

## Phase 6: Follow-Up Questions

1. **"Circular array?"**
   → Max of Kadane OR total - min subarray.

2. **"Must include k elements?"**
   → Sliding window + Kadane on sides.

3. **"Maximum product instead?"**
   → Track both min and max (negatives).
