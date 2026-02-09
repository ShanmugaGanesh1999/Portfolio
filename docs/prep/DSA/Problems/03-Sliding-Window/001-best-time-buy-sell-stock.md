# Best Time to Buy and Sell Stock

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 121 | Sliding Window / One Pass |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find maximum profit from buying and selling a stock once, where you must buy before selling.

### Constraints & Clarifying Questions
1. **Can we buy and sell on same day?** No, must buy before sell.
2. **Must we make a transaction?** No, return 0 if no profit possible.
3. **Can prices be zero?** Yes, 0 to 10^4.
4. **Maximum array length?** Up to 10^5.
5. **Only one transaction allowed?** Yes, exactly one buy and one sell.

### Edge Cases
1. **Decreasing prices:** `prices = [7,6,4,3,1]` → 0 (no profit possible)
2. **Single day:** `prices = [5]` → 0 (can't sell)
3. **Two days, profit:** `prices = [1, 5]` → 4

---

## Phase 2: High-Level Approach

### Option 1: Naïve (All Pairs)
Check all buy-sell pairs.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Track Minimum)
Track minimum price seen so far; at each day, calculate potential profit if selling today.

**Core Insight:** Maximum profit = max(price[i] - min_price_before_i) for all i.

### Why Optimal?
Single pass tracking minimum eliminates need to compare all pairs.

---

## Phase 3: Python Code

```python
def solve(prices: list[int]) -> int:
    """
    Find maximum profit from single buy-sell transaction.
    
    Args:
        prices: Daily stock prices
    
    Returns:
        Maximum possible profit (0 if no profit possible)
    """
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices:  # O(N)
        # Update minimum price seen so far
        min_price = min(min_price, price)  # O(1)
        
        # Calculate profit if selling today
        current_profit = price - min_price
        max_profit = max(max_profit, current_profit)  # O(1)
    
    return max_profit


def solve_two_pointer(prices: list[int]) -> int:
    """
    Two-pointer sliding window interpretation.
    """
    if not prices:
        return 0
    
    left = 0  # Buy day
    max_profit = 0
    
    for right in range(1, len(prices)):  # Sell day
        if prices[right] < prices[left]:
            # Found lower buy price, move buy day
            left = right
        else:
            # Calculate profit
            max_profit = max(max_profit, prices[right] - prices[left])
    
    return max_profit
```

---

## Phase 4: Dry Run

**Input:** `prices = [7, 1, 5, 3, 6, 4]`

| Day | Price | min_price | Profit if sell today | max_profit |
|-----|-------|-----------|---------------------|------------|
| 0 | 7 | 7 | 7-7=0 | 0 |
| 1 | 1 | 1 | 1-1=0 | 0 |
| 2 | 5 | 1 | 5-1=4 | 4 |
| 3 | 3 | 1 | 3-1=2 | 4 |
| 4 | 6 | 1 | 6-1=5 | 5 |
| 5 | 4 | 1 | 4-1=3 | 5 |

**Result:** `5`

**Verification:** Buy at day 1 (price=1), sell at day 4 (price=6) → Profit = 5 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through prices array.

### Space Complexity: O(1)
Only two variables: min_price and max_profit.

---

## Phase 6: Follow-Up Questions

1. **"What if we can make multiple transactions?"**
   → Sum all positive differences between consecutive days (buy-sell-buy-sell pattern).

2. **"What if there's a transaction fee?"**
   → Subtract fee from profit calculation; may use DP for optimal decisions.

3. **"What if we need to return the buy and sell days?"**
   → Track `best_buy_day` and `best_sell_day` when updating max_profit.
