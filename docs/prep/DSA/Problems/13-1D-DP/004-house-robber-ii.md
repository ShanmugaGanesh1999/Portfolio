# House Robber II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 213 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Same as House Robber, but houses are in a circle (first and last are adjacent).

### Constraints & Clarifying Questions
1. **Circle means?** Can't rob both first and last.
2. **Single house?** Rob it.
3. **Two houses?** Rob max of both.
4. **Empty array?** Return 0.

### Edge Cases
1. **One house:** Return that value
2. **Two houses:** Return max
3. **Three houses:** Rob middle OR max(first, last)

---

## Phase 2: High-Level Approach

### Approach: Two House Robber Runs
Run House Robber on [0, n-2] and [1, n-1]. Take max.

**Core Insight:** If we rob first, can't rob last; if we rob last, can't rob first. Run both scenarios.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    House Robber on circular houses.
    
    Args:
        nums: Money in each house (circular)
    
    Returns:
        Maximum amount
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    if len(nums) == 2:
        return max(nums)
    
    def rob_linear(houses: List[int]) -> int:
        prev2, prev1 = 0, 0
        for num in houses:
            curr = max(prev1, prev2 + num)
            prev2, prev1 = prev1, curr
        return prev1
    
    # Either exclude last house or exclude first house
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))


def solve_indices(nums: List[int]) -> int:
    """
    Use indices instead of slicing.
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    def rob_range(start: int, end: int) -> int:
        prev2, prev1 = 0, 0
        for i in range(start, end + 1):
            curr = max(prev1, prev2 + nums[i])
            prev2, prev1 = prev1, curr
        return prev1
    
    n = len(nums)
    return max(rob_range(0, n - 2), rob_range(1, n - 1))


def solve_verbose(nums: List[int]) -> int:
    """
    More explicit version.
    """
    n = len(nums)
    
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    if n == 2:
        return max(nums[0], nums[1])
    
    # Case 1: Don't rob last house (can consider first)
    dp1 = [0] * n
    dp1[0] = nums[0]
    dp1[1] = max(nums[0], nums[1])
    for i in range(2, n - 1):
        dp1[i] = max(dp1[i - 1], dp1[i - 2] + nums[i])
    
    # Case 2: Don't rob first house (can consider last)
    dp2 = [0] * n
    dp2[1] = nums[1]
    dp2[2] = max(nums[1], nums[2])
    for i in range(3, n):
        dp2[i] = max(dp2[i - 1], dp2[i - 2] + nums[i])
    
    return max(dp1[n - 2], dp2[n - 1])
```

---

## Phase 4: Dry Run

**Input:** `[2, 3, 2]`

**Case 1: nums[0:2] = [2, 3]**
- Rob at most one of first two
- max(2, 3) = 3

**Case 2: nums[1:3] = [3, 2]**
- Rob at most one of last two
- max(3, 2) = 3

**Result:** max(3, 3) = 3

**Verification:** Can't rob 2,2 (adjacent in circle). Best is 3.

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Two linear passes.

### Space Complexity: O(1)
Two variables per pass.

---

## Phase 6: Follow-Up Questions

1. **"Three adjacent houses can't be robbed?"**
   → dp[i] = max(dp[i-1], dp[i-2] + nums[i], dp[i-3] + nums[i]).

2. **"Double circle (second ring)?"**
   → More complex state management.

3. **"Return robbed house indices?"**
   → Track decisions; handle circular constraint.
