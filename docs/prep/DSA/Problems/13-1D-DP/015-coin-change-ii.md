# Coin Change II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 518 | 1D DP (Unbounded Knapsack) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count number of combinations to make amount using coins (unlimited supply).

### Constraints & Clarifying Questions
1. **Combinations, not permutations?** Yes, [1,2] = [2,1].
2. **Unlimited coins?** Yes.
3. **Amount 0?** Return 1 (empty combination).
4. **No coins?** Return 0 if amount > 0.

### Edge Cases
1. **Amount = 0:** 1 way (use nothing)
2. **No valid combination:** 0
3. **Single coin exactly:** 1

---

## Phase 2: High-Level Approach

### Approach: DP - Count Combinations
dp[i] = number of ways to make amount i.
Process coins in outer loop to avoid counting permutations.

**Core Insight:** Coins outer loop ensures each combination counted once.

---

## Phase 3: Python Code

```python
from typing import List


def solve(amount: int, coins: List[int]) -> int:
    """
    Count combinations to make amount.
    
    Args:
        amount: Target amount
        coins: Available denominations
    
    Returns:
        Number of combinations
    """
    # dp[i] = ways to make amount i
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make 0
    
    # Process each coin (outer loop for combinations)
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]


def solve_2d_dp(amount: int, coins: List[int]) -> int:
    """
    2D DP version (more intuitive).
    """
    n = len(coins)
    
    # dp[i][j] = ways using first i coins to make amount j
    dp = [[0] * (amount + 1) for _ in range(n + 1)]
    
    # One way to make amount 0
    for i in range(n + 1):
        dp[i][0] = 1
    
    for i in range(1, n + 1):
        coin = coins[i - 1]
        for j in range(amount + 1):
            # Don't use this coin
            dp[i][j] = dp[i - 1][j]
            # Use this coin (can use multiple times)
            if j >= coin:
                dp[i][j] += dp[i][j - coin]
    
    return dp[n][amount]


def solve_recursive(amount: int, coins: List[int]) -> int:
    """
    Recursive with memoization.
    """
    memo = {}
    
    def dp(idx: int, remaining: int) -> int:
        if remaining == 0:
            return 1
        if remaining < 0 or idx >= len(coins):
            return 0
        if (idx, remaining) in memo:
            return memo[(idx, remaining)]
        
        # Include current coin (stay at same idx) or skip
        ways = dp(idx, remaining - coins[idx]) + dp(idx + 1, remaining)
        
        memo[(idx, remaining)] = ways
        return ways
    
    return dp(0, amount)


def solve_permutations(amount: int, coins: List[int]) -> int:
    """
    Count permutations instead (different problem).
    """
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    # Amount outer loop counts permutations
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

## Phase 4: Dry Run

**Input:** `amount = 5, coins = [1, 2, 5]`

**Processing coins:**

| coin | dp[0] | dp[1] | dp[2] | dp[3] | dp[4] | dp[5] |
|------|-------|-------|-------|-------|-------|-------|
| init | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 1 | 1 | 2 | 2 | 3 | 3 |
| 5 | 1 | 1 | 2 | 2 | 3 | 4 |

**Combinations:**
- 5
- 2+2+1
- 2+1+1+1
- 1+1+1+1+1

**Result:** 4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(amount × coins)
Nested loops.

### Space Complexity: O(amount)
1D DP array.

---

## Phase 6: Follow-Up Questions

1. **"Count permutations instead?"**
   → Swap loop order (amount outer).

2. **"Limited supply of each coin?"**
   → 0/1 knapsack; reverse inner loop.

3. **"Return all combinations?"**
   → Backtracking enumeration.
