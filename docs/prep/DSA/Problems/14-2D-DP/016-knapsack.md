# 0/1 Knapsack

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | - (Classic) | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Given items with weights and values, maximize value within weight capacity. Each item used at most once.

### Constraints & Clarifying Questions
1. **Each item once?** Yes (0/1).
2. **Fractional items?** No (would be fractional knapsack).
3. **Negative values/weights?** No.
4. **Capacity 0?** Return 0.

### Edge Cases
1. **No items:** 0
2. **All items too heavy:** 0
3. **Capacity fits all:** Sum all values

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][w] = max value using first i items with capacity w.
Either include item i or not.

**Core Insight:** Each item: include it (add value, reduce capacity) or exclude it.

---

## Phase 3: Python Code

```python
from typing import List


def solve(weights: List[int], values: List[int], capacity: int) -> int:
    """
    0/1 Knapsack: maximize value within weight capacity.
    
    Args:
        weights: Weight of each item
        values: Value of each item
        capacity: Maximum weight capacity
    
    Returns:
        Maximum value
    """
    n = len(weights)
    
    # Space-optimized: single row
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # Process backwards to avoid using item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]


def solve_2d(weights: List[int], values: List[int], capacity: int) -> int:
    """
    Full 2D DP.
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't include item i
            dp[i][w] = dp[i - 1][w]
            
            # Include item i (if fits)
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
    
    return dp[n][capacity]


def solve_with_items(weights: List[int], values: List[int], capacity: int) -> tuple:
    """
    Return max value and selected items.
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
    
    # Backtrack to find items
    selected = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(i - 1)
            w -= weights[i - 1]
    
    return dp[n][capacity], selected[::-1]


def solve_recursive(weights: List[int], values: List[int], capacity: int) -> int:
    """
    Recursive with memoization.
    """
    n = len(weights)
    memo = {}
    
    def dp(i: int, w: int) -> int:
        if i == n or w == 0:
            return 0
        if (i, w) in memo:
            return memo[(i, w)]
        
        # Don't take item i
        result = dp(i + 1, w)
        
        # Take item i (if fits)
        if weights[i] <= w:
            result = max(result, values[i] + dp(i + 1, w - weights[i]))
        
        memo[(i, w)] = result
        return result
    
    return dp(0, capacity)
```

---

## Phase 4: Dry Run

**Input:** `weights = [1, 2, 3], values = [6, 10, 12], capacity = 5`

**DP Table (2D):**
```
       0   1   2   3   4   5
[]     0   0   0   0   0   0
[1]    0   6   6   6   6   6
[2]    0   6  10  16  16  16
[3]    0   6  10  16  18  22
```

| Item | Weight | Value | Decision at w=5 |
|------|--------|-------|-----------------|
| 1 | 1 | 6 | Include |
| 2 | 2 | 10 | Include |
| 3 | 3 | 12 | Include |

Total weight: 1+2 = 3 (can't fit item 3 with item 1&2, pick best combo)
**Best: Items 2&3 → weight=5, value=22**

**Result:** 22

---

## Phase 5: Complexity Analysis

### Time Complexity: O(n × capacity)
Each item × each capacity value.

### Space Complexity: O(capacity)
Space-optimized.

---

## Phase 6: Follow-Up Questions

1. **"Unlimited items (unbounded)?"**
   → Forward loop (can reuse items).

2. **"Exactly fill capacity?"**
   → Initialize dp[0]=0, others=-inf.

3. **"Minimize value for capacity?"**
   → Change max to min.
