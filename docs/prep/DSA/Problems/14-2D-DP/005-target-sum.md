# Target Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 494 | 2D DP / Subset Sum |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Assign + or - to each number to achieve target sum. Count ways.

### Constraints & Clarifying Questions
1. **Must use all numbers?** Yes.
2. **Order matters?** Fixed order, only +/-.
3. **Target can be negative?** Yes.
4. **Empty array?** 0 or 1 depending on target.

### Edge Cases
1. **All zeros, target 0:** 2^n ways
2. **Impossible target:** 0 ways
3. **Single element:** 1 or 0 ways

---

## Phase 2: High-Level Approach

### Approach: Subset Sum Transformation
If P = sum of positives, N = sum of negatives:
P - N = target, P + N = total
So P = (total + target) / 2.

Count subsets summing to P.

**Core Insight:** Convert to 0/1 knapsack.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int], target: int) -> int:
    """
    Count ways to achieve target with +/-.
    
    Args:
        nums: Array of integers
        target: Target sum
    
    Returns:
        Number of ways
    """
    total = sum(nums)
    
    # Check if possible
    if (total + target) % 2 != 0 or abs(target) > total:
        return 0
    
    subset_sum = (total + target) // 2
    
    # Count subsets summing to subset_sum
    dp = [0] * (subset_sum + 1)
    dp[0] = 1
    
    for num in nums:
        for j in range(subset_sum, num - 1, -1):
            dp[j] += dp[j - num]
    
    return dp[subset_sum]


def solve_2d_dp(nums: List[int], target: int) -> int:
    """
    2D DP approach (index, current_sum).
    """
    total = sum(nums)
    
    if abs(target) > total:
        return 0
    
    n = len(nums)
    # Shift to handle negative sums: sum range is [-total, total]
    # Use offset = total, so index 0 = sum of -total
    
    # dp[i][j] = ways to reach sum j using first i numbers
    # j is offset by total
    dp = [[0] * (2 * total + 1) for _ in range(n + 1)]
    dp[0][total] = 1  # Sum 0 with offset
    
    for i in range(1, n + 1):
        for j in range(2 * total + 1):
            # Add nums[i-1]
            if j - nums[i - 1] >= 0:
                dp[i][j] += dp[i - 1][j - nums[i - 1]]
            # Subtract nums[i-1]
            if j + nums[i - 1] <= 2 * total:
                dp[i][j] += dp[i - 1][j + nums[i - 1]]
    
    return dp[n][target + total]


def solve_recursive(nums: List[int], target: int) -> int:
    """
    Recursive with memoization.
    """
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(i: int, curr_sum: int) -> int:
        if i == len(nums):
            return 1 if curr_sum == target else 0
        
        # Add or subtract current number
        return dp(i + 1, curr_sum + nums[i]) + dp(i + 1, curr_sum - nums[i])
    
    return dp(0, 0)


def solve_dict(nums: List[int], target: int) -> int:
    """
    Using dictionary for sparse sums.
    """
    from collections import defaultdict
    
    dp = defaultdict(int)
    dp[0] = 1
    
    for num in nums:
        new_dp = defaultdict(int)
        for curr_sum, ways in dp.items():
            new_dp[curr_sum + num] += ways
            new_dp[curr_sum - num] += ways
        dp = new_dp
    
    return dp[target]
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 1, 1, 1, 1], target = 3`

**Subset Sum Approach:**
- total = 5
- subset_sum = (5 + 3) / 2 = 4
- Count subsets summing to 4

| num | dp[0] | dp[1] | dp[2] | dp[3] | dp[4] |
|-----|-------|-------|-------|-------|-------|
| init | 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 2 | 1 | 0 | 0 |
| 1 | 1 | 3 | 3 | 1 | 0 |
| 1 | 1 | 4 | 6 | 4 | 1 |
| 1 | 1 | 5 | 10 | 10 | 5 |

**Result:** 5 ways to select 4 ones with + sign

---

## Phase 5: Complexity Analysis

### Subset Sum Approach:
- **Time:** O(n × sum)
- **Space:** O(sum)

### 2D DP Approach:
- **Time:** O(n × sum)
- **Space:** O(n × sum)

---

## Phase 6: Follow-Up Questions

1. **"Return all expressions?"**
   → Backtracking enumeration.

2. **"With multiplication too?"**
   → Much harder; different approach.

3. **"Minimize absolute difference from target?"**
   → Find closest achievable sum.
