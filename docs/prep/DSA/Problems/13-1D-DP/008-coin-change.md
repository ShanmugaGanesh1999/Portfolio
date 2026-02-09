# Coin Change

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 322 | 1D DP (Unbounded Knapsack) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum coins to make amount. Unlimited supply of each coin.

### Constraints & Clarifying Questions
1. **Unlimited coins?** Yes.
2. **Amount 0?** Return 0 coins.
3. **Impossible?** Return -1.
4. **Coin values?** Positive integers.

### Edge Cases
1. **Amount = 0:** 0 coins
2. **No valid combination:** Return -1
3. **Amount equals a coin:** 1 coin

---

## Phase 2: High-Level Approach

### Approach: DP - Minimum Coins for Each Amount
dp[i] = minimum coins for amount i.
dp[i] = min(dp[i], dp[i - coin] + 1) for each coin.

**Core Insight:** Build up from smaller amounts.

---

## Phase 3: Python Code

```python
from typing import List


def solve(coins: List[int], amount: int) -> int:
    """
    Find minimum coins for amount.
    
    Args:
        coins: Available coin denominations
        amount: Target amount
    
    Returns:
        Minimum coins, -1 if impossible
    """
    if amount == 0:
        return 0
    
    # dp[i] = min coins for amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1


def solve_coin_outer(coins: List[int], amount: int) -> int:
    """
    Coins in outer loop (same result for this problem).
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            if dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1


def solve_bfs(coins: List[int], amount: int) -> int:
    """
    BFS approach (levels = number of coins).
    """
    from collections import deque
    
    if amount == 0:
        return 0
    
    visited = {0}
    queue = deque([0])
    level = 0
    
    while queue:
        level += 1
        for _ in range(len(queue)):
            curr = queue.popleft()
            
            for coin in coins:
                new_amount = curr + coin
                
                if new_amount == amount:
                    return level
                
                if new_amount < amount and new_amount not in visited:
                    visited.add(new_amount)
                    queue.append(new_amount)
    
    return -1
```

---

## Phase 4: Dry Run

**Input:** `coins = [1, 2, 5], amount = 11`

| Amount | Coins tried | dp[i] |
|--------|-------------|-------|
| 0 | - | 0 |
| 1 | 1 | 1 |
| 2 | 1,2 | min(2,1)=1 |
| 3 | 1,2 | min(2,2)=2 |
| 4 | 1,2 | min(3,2)=2 |
| 5 | 1,2,5 | min(3,3,1)=1 |
| ... | ... | ... |
| 11 | 1,2,5 | 3 (5+5+1) |

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(amount × coins)
Nested loops.

### Space Complexity: O(amount)
DP array.

---

## Phase 6: Follow-Up Questions

1. **"Count ways instead of minimum?"**
   → Coin Change II: sum instead of min.

2. **"Return actual coins used?"**
   → Track which coin was chosen at each step.

3. **"Limited supply of each coin?"**
   → Bounded knapsack; different DP formulation.
