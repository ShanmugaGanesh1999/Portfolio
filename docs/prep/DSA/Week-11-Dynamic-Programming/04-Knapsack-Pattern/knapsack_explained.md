# 🎯 Knapsack Patterns - Complete Guide

## 📌 What is the Knapsack Pattern?

The knapsack pattern deals with choosing items to maximize/minimize value under constraints. It's one of the most important DP patterns.

---

## 📊 Types of Knapsack

### 1. 0/1 Knapsack
- Each item can be chosen **at most once**
- Examples: Partition Equal Subset Sum, Target Sum

### 2. Unbounded Knapsack
- Each item can be chosen **unlimited times**
- Examples: Coin Change, Rod Cutting

### 3. Bounded Knapsack
- Each item has a **limited quantity**
- Examples: 0/1 with multiple copies

---

## 🔥 0/1 Knapsack

### Classic Problem

```python
def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    """
    Maximum value with capacity constraint.
    Each item can be used at most once.
    
    State: dp[i][w] = max value using items 0..i-1 with capacity w
    Recurrence: dp[i][w] = max(
        dp[i-1][w],                           # Don't take item i
        dp[i-1][w - weights[i]] + values[i]   # Take item i
    )
    
    Time: O(n * capacity)
    Space: O(n * capacity) or O(capacity) optimized
    """
    n = len(weights)
    
    # 2D DP
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't take item
            dp[i][w] = dp[i-1][w]
            
            # Take item (if possible)
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], 
                              dp[i-1][w - weights[i-1]] + values[i-1])
    
    return dp[n][capacity]

def knapsack_01_optimized(weights: list[int], values: list[int], capacity: int) -> int:
    """
    Space-optimized 0/1 Knapsack.
    
    Key insight: dp[i][w] only depends on dp[i-1][...].
    Traverse capacity in REVERSE to avoid using updated values.
    
    Time: O(n * capacity)
    Space: O(capacity)
    """
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # REVERSE order to ensure each item used once
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

### Partition Equal Subset Sum (LC 416)

```python
def can_partition(nums: list[int]) -> bool:
    """
    Check if array can be partitioned into two equal sum subsets.
    
    This is 0/1 Knapsack with target = sum/2.
    
    State: dp[s] = True if subset with sum s exists
    
    Time: O(n * sum)
    Space: O(sum)
    """
    total = sum(nums)
    
    # If odd, can't partition equally
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset has sum 0
    
    for num in nums:
        # Reverse to ensure each element used once
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    return dp[target]
```

### Target Sum (LC 494)

```python
def find_target_sum_ways(nums: list[int], target: int) -> int:
    """
    Count ways to assign +/- to get target sum.
    
    Transform: Let P = positive subset, N = negative subset
    P + N = total, P - N = target
    => P = (total + target) / 2
    
    Find subsets summing to P (0/1 Knapsack count variant).
    
    Time: O(n * sum)
    Space: O(sum)
    """
    total = sum(nums)
    
    # Check validity
    if (total + target) % 2 != 0 or abs(target) > total:
        return 0
    
    subset_sum = (total + target) // 2
    
    dp = [0] * (subset_sum + 1)
    dp[0] = 1  # One way to get sum 0 (empty)
    
    for num in nums:
        for s in range(subset_sum, num - 1, -1):
            dp[s] += dp[s - num]
    
    return dp[subset_sum]
```

---

## 🔥 Unbounded Knapsack

### Classic Problem

```python
def knapsack_unbounded(weights: list[int], values: list[int], capacity: int) -> int:
    """
    Maximum value with capacity constraint.
    Each item can be used UNLIMITED times.
    
    Key difference from 0/1: traverse capacity in FORWARD order.
    
    Time: O(n * capacity)
    Space: O(capacity)
    """
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # FORWARD order allows reusing items
        for w in range(weights[i], capacity + 1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

### Coin Change (LC 322)

```python
def coin_change(coins: list[int], amount: int) -> int:
    """
    Find minimum coins to make amount.
    
    State: dp[a] = min coins to make amount a
    Recurrence: dp[a] = min(dp[a - coin] + 1) for all coins
    
    Time: O(amount * n)
    Space: O(amount)
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins to make 0
    
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

### Coin Change 2 (LC 518)

```python
def change(amount: int, coins: list[int]) -> int:
    """
    Count number of combinations to make amount.
    
    State: dp[a] = number of ways to make amount a
    
    Important: Loop coins OUTSIDE to count combinations (not permutations)
    
    Time: O(amount * n)
    Space: O(amount)
    """
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make 0 (use nothing)
    
    for coin in coins:  # Outer loop = combinations
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    
    return dp[amount]
```

### Perfect Squares (LC 279)

```python
def num_squares(n: int) -> int:
    """
    Find minimum perfect squares that sum to n.
    
    Same as Coin Change with coins = [1, 4, 9, 16, ...]
    
    Time: O(n * sqrt(n))
    Space: O(n)
    """
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    # Generate perfect squares up to n
    squares = []
    i = 1
    while i * i <= n:
        squares.append(i * i)
        i += 1
    
    for sq in squares:
        for num in range(sq, n + 1):
            dp[num] = min(dp[num], dp[num - sq] + 1)
    
    return dp[n]
```

---

## 📋 Knapsack Pattern Summary

| Variant | Items | Loop Order | Use Case |
|---------|-------|------------|----------|
| 0/1 Knapsack | Once | Capacity: Reverse | Subset selection |
| Unbounded | Unlimited | Capacity: Forward | Coins, rod cutting |
| Count combinations | - | Items outer | Coin Change 2 |
| Count permutations | - | Amount outer | Combination Sum IV |

---

## 🔍 Key Differences

### 0/1 vs Unbounded
```python
# 0/1: Reverse order - each item once
for w in range(capacity, weight - 1, -1):
    dp[w] = max(dp[w], dp[w - weight] + value)

# Unbounded: Forward order - reuse items
for w in range(weight, capacity + 1):
    dp[w] = max(dp[w], dp[w - weight] + value)
```

### Combinations vs Permutations
```python
# Combinations: coins outer (order doesn't matter)
for coin in coins:
    for amount in range(coin, target + 1):
        dp[amount] += dp[amount - coin]

# Permutations: amount outer (order matters)
for amount in range(1, target + 1):
    for coin in coins:
        if coin <= amount:
            dp[amount] += dp[amount - coin]
```

---

## 🎓 Key Takeaways

1. **0/1 Knapsack**: Reverse iteration for single use
2. **Unbounded Knapsack**: Forward iteration for reuse
3. **Loop order matters** for combinations vs permutations
4. **Space optimization**: 1D array when only previous row needed
5. **Transform problems**: Many problems reduce to knapsack
