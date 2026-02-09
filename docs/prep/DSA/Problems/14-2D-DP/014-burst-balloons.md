# Burst Balloons

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 312 | Interval DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Burst balloons to maximize coins. Bursting balloon i gives nums[left] × nums[i] × nums[right].

### Constraints & Clarifying Questions
1. **Adjacent changes after burst?** Yes.
2. **Boundary values?** Treat as 1 (virtual balloons).
3. **Empty array?** Return 0.
4. **Single balloon?** 1 × nums[0] × 1.

### Edge Cases
1. **Empty:** 0
2. **Single:** nums[0]
3. **Two balloons:** Burst order matters

---

## Phase 2: High-Level Approach

### Approach: Interval DP
Think in reverse: which balloon is burst LAST in interval [i,j]?
dp[i][j] = max coins from bursting balloons in (i,j) exclusive.

**Core Insight:** Last balloon bursted in interval has fixed neighbors (i and j).

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> int:
    """
    Maximize coins from bursting balloons.
    
    Args:
        nums: Balloon values
    
    Returns:
        Maximum coins
    """
    if not nums:
        return 0
    
    # Add virtual balloons at boundaries
    nums = [1] + nums + [1]
    n = len(nums)
    
    # dp[i][j] = max coins from bursting balloons in (i, j) exclusive
    dp = [[0] * n for _ in range(n)]
    
    # Iterate by interval length
    for length in range(2, n):
        for i in range(n - length):
            j = i + length
            
            # Try each balloon k as the LAST to burst in (i,j)
            for k in range(i + 1, j):
                coins = nums[i] * nums[k] * nums[j]
                coins += dp[i][k] + dp[k][j]
                dp[i][j] = max(dp[i][j], coins)
    
    return dp[0][n - 1]


def solve_recursive(nums: List[int]) -> int:
    """
    Recursive with memoization.
    """
    if not nums:
        return 0
    
    nums = [1] + nums + [1]
    n = len(nums)
    memo = {}
    
    def dp(i: int, j: int) -> int:
        if j - i <= 1:
            return 0
        if (i, j) in memo:
            return memo[(i, j)]
        
        max_coins = 0
        for k in range(i + 1, j):
            coins = nums[i] * nums[k] * nums[j]
            coins += dp(i, k) + dp(k, j)
            max_coins = max(max_coins, coins)
        
        memo[(i, j)] = max_coins
        return max_coins
    
    return dp(0, n - 1)


def solve_verbose(nums: List[int]) -> int:
    """
    More verbose with explanation.
    """
    if not nums:
        return 0
    
    # Pad with 1s at boundaries
    balloons = [1] + nums + [1]
    n = len(balloons)
    
    # dp[left][right] = max coins from bursting all balloons
    # strictly between left and right
    dp = [[0] * n for _ in range(n)]
    
    # length = right - left (distance between boundaries)
    for length in range(2, n):
        for left in range(n - length):
            right = left + length
            
            # k is the last balloon to burst between left and right
            for k in range(left + 1, right):
                # Coins from bursting k last
                # (all others between left and right already gone)
                gain = balloons[left] * balloons[k] * balloons[right]
                
                # Plus coins from bursting left-k and k-right intervals
                total = dp[left][k] + gain + dp[k][right]
                
                dp[left][right] = max(dp[left][right], total)
    
    return dp[0][n - 1]
```

---

## Phase 4: Dry Run

**Input:** `[3, 1, 5, 8]`
**Padded:** `[1, 3, 1, 5, 8, 1]`

**Interval lengths:**

| i | j | length | Best k | Coins |
|---|---|--------|--------|-------|
| 0 | 2 | 2 | k=1 | 1×3×1=3 |
| 1 | 3 | 2 | k=2 | 3×1×5=15 |
| 2 | 4 | 2 | k=3 | 1×5×8=40 |
| 3 | 5 | 2 | k=4 | 5×8×1=40 |
| 0 | 3 | 3 | k=1: 3+15+3=21, k=2: 0+5+40=45 | 45 |
| ... | ... | ... | ... | ... |
| 0 | 5 | 5 | Best combination | 167 |

**Result:** 167

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N³)
O(N²) intervals × O(N) choices per interval.

### Space Complexity: O(N²)
DP table.

---

## Phase 6: Follow-Up Questions

1. **"Return burst order?"**
   → Track choices and backtrack.

2. **"Minimum coins?"**
   → Change max to min.

3. **"With negative values?"**
   → Same algorithm works.
