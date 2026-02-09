# House Robber

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 198 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Maximize robbery amount without robbing adjacent houses.

### Constraints & Clarifying Questions
1. **Adjacent = immediately next?** Yes.
2. **Empty array?** Return 0.
3. **Negative values?** No, all non-negative.
4. **Single house?** Rob it.

### Edge Cases
1. **One house:** Return that value
2. **Two houses:** Return max of both
3. **All same values:** Alternate robbery

---

## Phase 2: High-Level Approach

### Approach: DP - Rob or Skip
dp[i] = max money robbing up to house i.
dp[i] = max(dp[i-1], dp[i-2] + nums[i]).

**Core Insight:** For each house, either rob it (skip previous) or don't rob it.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Find maximum robbery amount without adjacent houses.
    
    Args:
        nums: Money in each house
    
    Returns:
        Maximum amount
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Space-optimized
    prev2, prev1 = 0, 0
    
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2, prev1 = prev1, curr
    
    return prev1


def solve_dp_array(nums: List[int]) -> int:
    """
    Full DP array version.
    """
    if not nums:
        return 0
    
    n = len(nums)
    if n == 1:
        return nums[0]
    
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, n):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
    
    return dp[n - 1]


def solve_recursive(nums: List[int]) -> int:
    """
    Top-down with memoization.
    """
    memo = {}
    
    def dp(i):
        if i < 0:
            return 0
        if i in memo:
            return memo[i]
        
        memo[i] = max(dp(i - 1), dp(i - 2) + nums[i])
        return memo[i]
    
    return dp(len(nums) - 1)
```

---

## Phase 4: Dry Run

**Input:** `[2, 7, 9, 3, 1]`

| i | num | prev2 | prev1 | curr |
|---|-----|-------|-------|------|
| 0 | 2 | 0 | 0 | max(0, 0+2)=2 |
| 1 | 7 | 0 | 2 | max(2, 0+7)=7 |
| 2 | 9 | 2 | 7 | max(7, 2+9)=11 |
| 3 | 3 | 7 | 11 | max(11, 7+3)=11 |
| 4 | 1 | 11 | 11 | max(11, 11+1)=12 |

**Rob houses:** 0, 2, 4 → 2 + 9 + 1 = 12

**Result:** 12

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Two variables.

---

## Phase 6: Follow-Up Questions

1. **"Houses in a circle?"**
   → House Robber II: run twice (exclude first or last).

2. **"Binary tree of houses?"**
   → House Robber III: tree DP.

3. **"Return which houses to rob?"**
   → Backtrack through DP decisions.
