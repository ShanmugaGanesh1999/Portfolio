# Min Cost Climbing Stairs

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 746 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum cost to reach top. Can start from index 0 or 1.

### Constraints & Clarifying Questions
1. **Start position?** Index 0 or 1 (free).
2. **Top = beyond last step?** Yes.
3. **Step 1 or 2 each time?** Yes.
4. **Cost paid when?** When stepping on (leaving from).

### Edge Cases
1. **Two steps:** min(cost[0], cost[1])
2. **All same cost:** Take 2s when possible
3. **Alternating high/low:** Strategic choices

---

## Phase 2: High-Level Approach

### Approach: DP with Min Choice
dp[i] = cost to reach step i. dp[i] = cost[i] + min(dp[i-1], dp[i-2]).

**Core Insight:** At each step, choose cheaper of previous two.

---

## Phase 3: Python Code

```python
from typing import List


def solve(cost: List[int]) -> int:
    """
    Find minimum cost to climb to top.
    
    Args:
        cost: Cost at each step
    
    Returns:
        Minimum total cost
    """
    n = len(cost)
    
    if n == 2:
        return min(cost)
    
    # Space-optimized
    prev2, prev1 = cost[0], cost[1]
    
    for i in range(2, n):
        curr = cost[i] + min(prev1, prev2)
        prev2, prev1 = prev1, curr
    
    # Can reach top from either of last two steps
    return min(prev1, prev2)


def solve_dp_array(cost: List[int]) -> int:
    """
    Full DP array version.
    """
    n = len(cost)
    dp = [0] * n
    
    dp[0] = cost[0]
    dp[1] = cost[1]
    
    for i in range(2, n):
        dp[i] = cost[i] + min(dp[i - 1], dp[i - 2])
    
    return min(dp[n - 1], dp[n - 2])


def solve_top_down(cost: List[int]) -> int:
    """
    Top-down with memoization.
    """
    n = len(cost)
    memo = {}
    
    def dp(i):
        if i < 0:
            return 0
        if i == 0 or i == 1:
            return cost[i]
        if i in memo:
            return memo[i]
        
        memo[i] = cost[i] + min(dp(i - 1), dp(i - 2))
        return memo[i]
    
    return min(dp(n - 1), dp(n - 2))


def solve_modify_input(cost: List[int]) -> int:
    """
    Modify input array (if allowed).
    """
    n = len(cost)
    
    for i in range(2, n):
        cost[i] += min(cost[i - 1], cost[i - 2])
    
    return min(cost[n - 1], cost[n - 2])
```

---

## Phase 4: Dry Run

**Input:** `[10, 15, 20]`

| Step | prev2 | prev1 | curr |
|------|-------|-------|------|
| Init | 10 | 15 | - |
| i=2 | 15 | 30 | 20+min(15,10)=30 |

**Final:** min(30, 15) = 15

**Explanation:** Start at index 1, pay 15, jump 2 steps to top.

**Result:** 15

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Two variables.

---

## Phase 6: Follow-Up Questions

1. **"Can take 1, 2, or k steps?"**
   → Track last k values; dp[i] = cost[i] + min(dp[i-1], ..., dp[i-k]).

2. **"Return the path taken?"**
   → Backtrack from end choosing min parent.

3. **"Some steps are blocked?"**
   → Set blocked step costs to infinity.
