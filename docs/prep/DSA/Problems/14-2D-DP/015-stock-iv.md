# Best Time to Buy and Sell Stock IV

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 188 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
At most k transactions to maximize profit.

### Constraints & Clarifying Questions
1. **One transaction = buy + sell?** Yes.
2. **Must sell before buying again?** Yes.
3. **k >= n/2?** Unlimited transactions (simplify).
4. **k = 0?** Return 0.

### Edge Cases
1. **Empty prices:** 0
2. **k = 0:** 0
3. **k >= n/2:** Unlimited case

---

## Phase 2: High-Level Approach

### Approach: 2D DP with States
dp[t][i] = max profit using at most t transactions up to day i.
Track holding and not-holding states.

**Core Insight:** State = (day, transactions used, holding stock or not).

---

## Phase 3: Python Code

```python
from typing import List


def solve(k: int, prices: List[int]) -> int:
    """
    Max profit with at most k transactions.
    
    Args:
        k: Maximum transactions
        prices: Stock prices
    
    Returns:
        Maximum profit
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    # If k >= n/2, unlimited transactions
    if k >= n // 2:
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, n))
    
    # dp[t][0] = max profit with t transactions, not holding
    # dp[t][1] = max profit with t transactions, holding
    dp = [[0, float('-inf')] for _ in range(k + 1)]
    
    for price in prices:
        for t in range(k, 0, -1):
            dp[t][0] = max(dp[t][0], dp[t][1] + price)      # Sell
            dp[t][1] = max(dp[t][1], dp[t - 1][0] - price)  # Buy
    
    return dp[k][0]


def solve_2d_explicit(k: int, prices: List[int]) -> int:
    """
    Full 2D DP with day dimension.
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    if k >= n // 2:
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, n))
    
    # dp[i][t] = max profit on day i with t transactions completed
    dp = [[0] * (k + 1) for _ in range(n)]
    
    for t in range(1, k + 1):
        max_diff = -prices[0]  # Best (profit - buy price) so far
        
        for i in range(1, n):
            dp[i][t] = max(dp[i - 1][t], prices[i] + max_diff)
            max_diff = max(max_diff, dp[i][t - 1] - prices[i])
    
    return dp[n - 1][k]


def solve_recursive(k: int, prices: List[int]) -> int:
    """
    Recursive with memoization.
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    memo = {}
    
    def dp(day: int, trans: int, holding: bool) -> int:
        if day >= n or trans == 0:
            return 0
        if (day, trans, holding) in memo:
            return memo[(day, trans, holding)]
        
        # Do nothing
        result = dp(day + 1, trans, holding)
        
        if holding:
            # Sell (complete transaction)
            result = max(result, prices[day] + dp(day + 1, trans - 1, False))
        else:
            # Buy
            result = max(result, -prices[day] + dp(day + 1, trans, True))
        
        memo[(day, trans, holding)] = result
        return result
    
    return dp(0, k, False)
```

---

## Phase 4: Dry Run

**Input:** `k = 2, prices = [3, 2, 6, 5, 0, 3]`

**Processing (state-based DP):**

| Price | t=1 hold | t=1 no | t=2 hold | t=2 no |
|-------|----------|--------|----------|--------|
| 3 | -3 | 0 | -3 | 0 |
| 2 | -2 | 0 | -2 | 0 |
| 6 | -2 | 4 | -2 | 4 |
| 5 | -2 | 4 | -1 | 4 |
| 0 | 0 | 4 | 4 | 4 |
| 3 | 0 | 4 | 4 | 7 |

**Transactions:**
1. Buy@2, Sell@6 (profit 4)
2. Buy@0, Sell@3 (profit 3)
**Total: 7**

**Result:** 7

---

## Phase 5: Complexity Analysis

### Time Complexity: O(n × k)
Process each day with k states.

### Space Complexity: O(k)
Only need k transaction states.

---

## Phase 6: Follow-Up Questions

1. **"With transaction fee?"**
   → Subtract fee on sell.

2. **"With cooldown?"**
   → Add rest state.

3. **"Exactly k transactions?"**
   → Only return dp[k] if completed k.
