# Best Time to Buy and Sell Stock with Cooldown

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 309 | State Machine DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Buy/sell stocks with 1-day cooldown after selling. Maximize profit.

### Constraints & Clarifying Questions
1. **Multiple transactions?** Yes, unlimited.
2. **Cooldown = 1 day after sell?** Yes.
3. **Can hold multiple stocks?** No, sell before buying.
4. **Empty prices?** Return 0.

### Edge Cases
1. **Single day:** 0 (can't complete transaction)
2. **Decreasing prices:** 0 (don't trade)
3. **Two days:** max(0, prices[1] - prices[0])

---

## Phase 2: High-Level Approach

### Approach: State Machine DP
Three states: held (holding stock), sold (just sold), rest (cooldown).

**Transitions:**
- held[i] = max(held[i-1], rest[i-1] - price)
- sold[i] = held[i-1] + price
- rest[i] = max(rest[i-1], sold[i-1])

---

## Phase 3: Python Code

```python
from typing import List


def solve(prices: List[int]) -> int:
    """
    Max profit with cooldown.
    
    Args:
        prices: Stock prices by day
    
    Returns:
        Maximum profit
    """
    if len(prices) <= 1:
        return 0
    
    # States: held, sold, rest
    held = float('-inf')  # Holding stock
    sold = 0              # Just sold
    rest = 0              # Cooldown/resting
    
    for price in prices:
        prev_held = held
        prev_sold = sold
        
        held = max(held, rest - price)    # Keep holding or buy
        sold = prev_held + price           # Sell
        rest = max(rest, prev_sold)        # Stay resting or finish cooldown
    
    # End either sold or resting (not holding)
    return max(sold, rest)


def solve_dp_array(prices: List[int]) -> int:
    """
    Full DP arrays.
    """
    n = len(prices)
    if n <= 1:
        return 0
    
    held = [float('-inf')] * n
    sold = [0] * n
    rest = [0] * n
    
    held[0] = -prices[0]
    
    for i in range(1, n):
        held[i] = max(held[i - 1], rest[i - 1] - prices[i])
        sold[i] = held[i - 1] + prices[i]
        rest[i] = max(rest[i - 1], sold[i - 1])
    
    return max(sold[n - 1], rest[n - 1])


def solve_alternative(prices: List[int]) -> int:
    """
    Alternative formulation: buy, sell states.
    """
    n = len(prices)
    if n <= 1:
        return 0
    
    # buy[i] = max profit ending in buy state at day i
    # sell[i] = max profit ending in sell state at day i
    buy = [0] * n
    sell = [0] * n
    
    buy[0] = -prices[0]
    
    for i in range(1, n):
        # Buy: either continue holding or buy today (need i-2 sell due to cooldown)
        buy[i] = max(buy[i - 1], (sell[i - 2] if i >= 2 else 0) - prices[i])
        # Sell: either stay sold or sell today
        sell[i] = max(sell[i - 1], buy[i - 1] + prices[i])
    
    return sell[n - 1]
```

---

## Phase 4: Dry Run

**Input:** `[1, 2, 3, 0, 2]`

| Day | Price | held | sold | rest |
|-----|-------|------|------|------|
| 0 | 1 | -1 | 0 | 0 |
| 1 | 2 | max(-1,0-2)=-1 | -1+2=1 | max(0,0)=0 |
| 2 | 3 | max(-1,0-3)=-1 | -1+3=2 | max(0,1)=1 |
| 3 | 0 | max(-1,1-0)=1 | -1+0=-1 | max(1,2)=2 |
| 4 | 2 | max(1,2-2)=1 | 1+2=3 | max(2,-1)=2 |

**max(sold, rest) = max(3, 2) = 3**

**Transactions:** Buy@1, Sell@3, Cooldown, Buy@0, Sell@2

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Three state variables.

---

## Phase 6: Follow-Up Questions

1. **"With transaction fee?"**
   → Subtract fee on sell.

2. **"At most k transactions?"**
   → Add transaction count dimension.

3. **"Cooldown of k days?"**
   → Track rest[i-k] for buying.
