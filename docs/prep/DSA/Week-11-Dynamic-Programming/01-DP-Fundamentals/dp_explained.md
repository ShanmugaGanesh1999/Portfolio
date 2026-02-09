# 🎯 Dynamic Programming - Complete Guide

## 📌 What is Dynamic Programming?

Dynamic Programming (DP) is an optimization technique that solves complex problems by:
1. Breaking them into **overlapping subproblems**
2. Storing results to avoid **redundant computations**

### Two Key Properties:
1. **Optimal Substructure**: Optimal solution can be built from optimal solutions of subproblems
2. **Overlapping Subproblems**: Same subproblems are solved multiple times

---

## 🔄 Two Approaches

### 1. Top-Down (Memoization)
- Start from the original problem
- Recursively solve subproblems
- Cache results to avoid recomputation

```python
def fibonacci_memo(n: int) -> int:
    """
    Top-down DP using memoization.
    
    Time: O(n)
    Space: O(n)
    """
    memo = {}
    
    def fib(n):
        if n <= 1:
            return n
        
        if n in memo:
            return memo[n]
        
        memo[n] = fib(n - 1) + fib(n - 2)
        return memo[n]
    
    return fib(n)
```

### 2. Bottom-Up (Tabulation)
- Start from smallest subproblems
- Build up to the original problem
- Usually more efficient (no recursion overhead)

```python
def fibonacci_tabulation(n: int) -> int:
    """
    Bottom-up DP using tabulation.
    
    Time: O(n)
    Space: O(n)
    """
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]

def fibonacci_optimized(n: int) -> int:
    """
    Space-optimized version.
    
    Time: O(n)
    Space: O(1)
    """
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    
    for _ in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

---

## 🎨 DP Problem-Solving Framework

### Step 1: Define the State
What information do we need to describe a subproblem?

```
Example: Climbing Stairs
- State: dp[i] = number of ways to reach step i
```

### Step 2: Write Recurrence Relation
How do subproblems relate to each other?

```
Example: Climbing Stairs
- Recurrence: dp[i] = dp[i-1] + dp[i-2]
  (can reach step i from step i-1 or i-2)
```

### Step 3: Identify Base Cases
What are the smallest subproblems we can solve directly?

```
Example: Climbing Stairs
- Base cases: dp[0] = 1, dp[1] = 1
```

### Step 4: Determine Computation Order
In what order should we solve subproblems?

```
Example: Climbing Stairs
- Order: i = 2 to n (smaller to larger)
```

---

## 🔥 1D DP Problems

### Climbing Stairs (LC 70)

```python
def climb_stairs(n: int) -> int:
    """
    Count ways to climb n stairs (1 or 2 steps at a time).
    
    State: dp[i] = ways to reach step i
    Recurrence: dp[i] = dp[i-1] + dp[i-2]
    
    Time: O(n), Space: O(1)
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

### House Robber (LC 198)

```python
def rob(nums: list[int]) -> int:
    """
    Maximum money without robbing adjacent houses.
    
    State: dp[i] = max money robbing houses 0..i
    Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
                       (skip i or rob i)
    
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

### Maximum Subarray (LC 53)

```python
def max_subarray(nums: list[int]) -> int:
    """
    Find contiguous subarray with largest sum.
    
    State: dp[i] = max sum ending at index i
    Recurrence: dp[i] = max(nums[i], dp[i-1] + nums[i])
    
    Time: O(n), Space: O(1)
    """
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

### Longest Increasing Subsequence (LC 300)

```python
def length_of_lis(nums: list[int]) -> int:
    """
    Find length of longest increasing subsequence.
    
    State: dp[i] = length of LIS ending at index i
    Recurrence: dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]
    
    Time: O(n²), Space: O(n)
    """
    n = len(nums)
    dp = [1] * n  # Each element is LIS of length 1
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# O(n log n) solution using binary search
def length_of_lis_optimized(nums: list[int]) -> int:
    """
    Maintain array of smallest tail elements.
    
    Time: O(n log n)
    Space: O(n)
    """
    from bisect import bisect_left
    
    tails = []
    
    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

### Word Break (LC 139)

```python
def word_break(s: str, word_dict: list[str]) -> bool:
    """
    Check if s can be segmented into dictionary words.
    
    State: dp[i] = True if s[0:i] can be segmented
    Recurrence: dp[i] = dp[j] AND s[j:i] in dict, for some j < i
    
    Time: O(n³) with string slicing
    Space: O(n)
    """
    word_set = set(word_dict)
    n = len(s)
    
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

---

## 🔥 2D DP Problems

### Unique Paths (LC 62)

```python
def unique_paths(m: int, n: int) -> int:
    """
    Count paths from top-left to bottom-right.
    
    State: dp[i][j] = paths to reach (i, j)
    Recurrence: dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    Time: O(m*n), Space: O(n)
    """
    # Space optimized: only need previous row
    dp = [1] * n
    
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    
    return dp[n - 1]
```

### Minimum Path Sum (LC 64)

```python
def min_path_sum(grid: list[list[int]]) -> int:
    """
    Find path with minimum sum from top-left to bottom-right.
    
    State: dp[i][j] = min sum to reach (i, j)
    Recurrence: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
    
    Time: O(m*n), Space: O(n)
    """
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * n
    dp[0] = 0
    
    for i in range(m):
        for j in range(n):
            if j == 0:
                dp[j] = dp[j] + grid[i][j]
            else:
                dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
    
    return dp[n - 1]
```

---

## 📋 DP Pattern Recognition

| Pattern | Key Indicator | Example |
|---------|---------------|---------|
| Fibonacci-like | Current depends on previous 1-2 | Climbing stairs |
| Knapsack | Choose or skip items | Coin change, subset sum |
| String DP | Compare characters | LCS, Edit distance |
| Grid DP | 2D traversal | Unique paths |
| Interval DP | Consider ranges | Matrix chain |
| State Machine | Multiple states | Stock problems |

---

## 🎓 Key Takeaways

1. **State design is crucial** - think about what info defines a subproblem
2. **Draw decision tree** to visualize recurrence
3. **Start with brute force**, then memoize
4. **Optimize space** by analyzing dependencies
5. **Practice patterns** - most problems are variations

---

## ➡️ Next: [Knapsack Patterns](../04-Knapsack-Pattern/)
