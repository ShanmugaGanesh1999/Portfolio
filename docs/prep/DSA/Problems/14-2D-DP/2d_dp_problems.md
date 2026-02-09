# 📊 2-D Dynamic Programming - Complete Problem Set

## Problem 1: Unique Paths (Medium)
**LeetCode 62**

### Problem
Count paths from top-left to bottom-right (only right/down moves).

### Intuition
dp[i][j] = dp[i-1][j] + dp[i][j-1]

### Solution
```python
def uniquePaths(m: int, n: int) -> int:
    """
    Time: O(m * n)
    Space: O(n)
    """
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    
    return dp[-1]
```

---

## Problem 2: Unique Paths II (Medium)
**LeetCode 63**

### Problem
Unique paths with obstacles.

### Intuition
Same as above, but dp = 0 at obstacles.

### Solution
```python
def uniquePathsWithObstacles(obstacleGrid: list[list[int]]) -> int:
    """
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    
    if obstacleGrid[0][0] == 1:
        return 0
    
    dp = [0] * n
    dp[0] = 1
    
    for i in range(m):
        for j in range(n):
            if obstacleGrid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j-1]
    
    return dp[-1]
```

---

## Problem 3: Minimum Path Sum (Medium)
**LeetCode 64**

### Problem
Find path with minimum sum from top-left to bottom-right.

### Intuition
dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])

### Solution
```python
def minPathSum(grid: list[list[int]]) -> int:
    """
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * n
    dp[0] = 0
    
    for i in range(m):
        dp[0] += grid[i][0]
        for j in range(1, n):
            dp[j] = grid[i][j] + min(dp[j], dp[j-1])
    
    return dp[-1]
```

---

## Problem 4: Longest Common Subsequence (Medium)
**LeetCode 1143**

### Problem
Find length of longest common subsequence.

### Intuition
If match: dp[i][j] = dp[i-1][j-1] + 1. Else: max(dp[i-1][j], dp[i][j-1])

### Solution
```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    """
    Time: O(m * n)
    Space: O(min(m, n))
    """
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    prev = [0] * (len(text2) + 1)
    
    for i in range(1, len(text1) + 1):
        curr = [0] * (len(text2) + 1)
        
        for j in range(1, len(text2) + 1):
            if text1[i-1] == text2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        
        prev = curr
    
    return prev[-1]
```

---

## Problem 5: Edit Distance (Medium)
**LeetCode 72**

### Problem
Minimum operations (insert, delete, replace) to convert word1 to word2.

### Intuition
If match: dp[i-1][j-1]. Else: 1 + min(insert, delete, replace)

### Solution
```python
def minDistance(word1: str, word2: str) -> int:
    """
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(word1), len(word2)
    prev = list(range(n + 1))
    
    for i in range(1, m + 1):
        curr = [i] + [0] * n
        
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(prev[j],      # delete
                                  curr[j-1],    # insert
                                  prev[j-1])    # replace
        
        prev = curr
    
    return prev[-1]
```

---

## Problem 6: Coin Change II (Medium)
**LeetCode 518**

### Problem
Count ways to make amount using coins (unlimited supply).

### Intuition
Unbounded knapsack: iterate coins first to avoid counting permutations.

### Solution
```python
def change(amount: int, coins: list[int]) -> int:
    """
    Time: O(amount * n)
    Space: O(amount)
    """
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

## Problem 7: Target Sum (Medium)
**LeetCode 494**

### Problem
Count ways to assign +/- to reach target sum.

### Intuition
Convert to subset sum: find subsets with sum = (total + target) / 2

### Solution
```python
def findTargetSumWays(nums: list[int], target: int) -> int:
    """
    Time: O(n * sum)
    Space: O(sum)
    """
    total = sum(nums)
    
    # sum(P) - sum(N) = target
    # sum(P) + sum(N) = total
    # sum(P) = (target + total) / 2
    
    if (total + target) % 2 == 1 or abs(target) > total:
        return 0
    
    subset_sum = (total + target) // 2
    
    dp = [0] * (subset_sum + 1)
    dp[0] = 1
    
    for num in nums:
        for i in range(subset_sum, num - 1, -1):
            dp[i] += dp[i - num]
    
    return dp[subset_sum]
```

---

## Problem 8: Interleaving String (Medium)
**LeetCode 97**

### Problem
Check if s3 is interleaving of s1 and s2.

### Intuition
dp[i][j] = can we form s3[:i+j] using s1[:i] and s2[:j]

### Solution
```python
def isInterleave(s1: str, s2: str, s3: str) -> bool:
    """
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(s1), len(s2)
    
    if m + n != len(s3):
        return False
    
    dp = [False] * (n + 1)
    
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0 and j == 0:
                dp[j] = True
            elif i == 0:
                dp[j] = dp[j-1] and s2[j-1] == s3[j-1]
            elif j == 0:
                dp[j] = dp[j] and s1[i-1] == s3[i-1]
            else:
                dp[j] = (dp[j] and s1[i-1] == s3[i+j-1]) or \
                        (dp[j-1] and s2[j-1] == s3[i+j-1])
    
    return dp[-1]
```

---

## Problem 9: Longest Increasing Path in a Matrix (Hard)
**LeetCode 329**

### Problem
Find longest strictly increasing path in matrix.

### Intuition
DFS with memoization. Each cell's answer is fixed.

### Solution
```python
def longestIncreasingPath(matrix: list[list[int]]) -> int:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    memo = {}
    
    def dfs(r, c):
        if (r, c) in memo:
            return memo[(r, c)]
        
        max_len = 1
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < m and 0 <= nc < n and matrix[nr][nc] > matrix[r][c]:
                max_len = max(max_len, 1 + dfs(nr, nc))
        
        memo[(r, c)] = max_len
        return max_len
    
    return max(dfs(r, c) for r in range(m) for c in range(n))
```

---

## Problem 10: Distinct Subsequences (Hard)
**LeetCode 115**

### Problem
Count distinct subsequences of s that equal t.

### Intuition
If match: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]. Else: dp[i-1][j]

### Solution
```python
def numDistinct(s: str, t: str) -> int:
    """
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(s), len(t)
    
    if m < n:
        return 0
    
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, m + 1):
        # Traverse backwards to avoid overwriting
        for j in range(min(i, n), 0, -1):
            if s[i-1] == t[j-1]:
                dp[j] += dp[j-1]
    
    return dp[n]
```

---

## Problem 11: Best Time to Buy and Sell Stock with Cooldown (Medium)
**LeetCode 309**

### Problem
Buy/sell with one day cooldown after sell.

### Intuition
State machine: held, sold, rest.

### Solution
```python
def maxProfit(prices: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    if len(prices) < 2:
        return 0
    
    # held: max profit holding stock
    # sold: max profit just sold (cooldown tomorrow)
    # rest: max profit in cooldown
    
    held = -prices[0]
    sold = 0
    rest = 0
    
    for price in prices[1:]:
        prev_held = held
        held = max(held, rest - price)  # Keep or buy
        rest = max(rest, sold)          # Keep resting or done cooldown
        sold = prev_held + price        # Sell today
    
    return max(sold, rest)
```

---

## Problem 12: Best Time to Buy and Sell with Transaction Fee (Medium)
**LeetCode 714**

### Problem
Buy/sell with transaction fee per trade.

### Intuition
Two states: cash (not holding), hold (holding stock).

### Solution
```python
def maxProfit(prices: list[int], fee: int) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    cash = 0  # Not holding stock
    hold = -prices[0]  # Holding stock
    
    for price in prices[1:]:
        cash = max(cash, hold + price - fee)  # Sell
        hold = max(hold, cash - price)        # Buy
    
    return cash
```

---

## Problem 13: Burst Balloons (Hard)
**LeetCode 312**

### Problem
Maximize coins from bursting balloons.

### Intuition
Think of which balloon to burst LAST in range [i,j].

### Solution
```python
def maxCoins(nums: list[int]) -> int:
    """
    Time: O(n³)
    Space: O(n²)
    """
    # Add boundary balloons
    nums = [1] + nums + [1]
    n = len(nums)
    
    # dp[i][j] = max coins for range (i, j) exclusive
    dp = [[0] * n for _ in range(n)]
    
    # Length of range
    for length in range(2, n):
        for left in range(n - length):
            right = left + length
            
            # Try each balloon as LAST to burst
            for k in range(left + 1, right):
                coins = nums[left] * nums[k] * nums[right]
                coins += dp[left][k] + dp[k][right]
                dp[left][right] = max(dp[left][right], coins)
    
    return dp[0][n-1]
```

---

## Problem 14: Regular Expression Matching (Hard)
**LeetCode 10**

### Problem
Implement regex with '.' and '*'.

### Intuition
dp[i][j] = s[:i] matches p[:j]. Handle '*' specially.

### Solution
```python
def isMatch(s: str, p: str) -> bool:
    """
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Handle patterns like a*, a*b*, a*b*c*
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                # Zero occurrences
                dp[i][j] = dp[i][j-2]
                
                # One or more occurrences
                if p[j-2] == '.' or p[j-2] == s[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
    
    return dp[m][n]
```

---

## Problem 15: Wildcard Matching (Hard)
**LeetCode 44**

### Problem
Implement wildcard matching with '?' and '*'.

### Intuition
Similar to regex but '*' matches any sequence.

### Solution
```python
def isMatch(s: str, p: str) -> bool:
    """
    Time: O(m * n)
    Space: O(n)
    """
    m, n = len(s), len(p)
    
    prev = [False] * (n + 1)
    prev[0] = True
    
    # Handle leading *
    for j in range(1, n + 1):
        if p[j-1] == '*':
            prev[j] = prev[j-1]
        else:
            break
    
    for i in range(1, m + 1):
        curr = [False] * (n + 1)
        
        for j in range(1, n + 1):
            if p[j-1] == '*':
                # Match empty or match one + continue
                curr[j] = curr[j-1] or prev[j]
            elif p[j-1] == '?' or p[j-1] == s[i-1]:
                curr[j] = prev[j-1]
        
        prev = curr
    
    return prev[n]
```

---

## Problem 16: Maximal Square (Medium)
**LeetCode 221**

### Problem
Find largest square containing only 1s.

### Intuition
dp[i][j] = side length of square with bottom-right at (i,j)

### Solution
```python
def maximalSquare(matrix: list[list[str]]) -> int:
    """
    Time: O(m * n)
    Space: O(n)
    """
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [0] * (n + 1)
    max_side = 0
    prev = 0
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            temp = dp[j]
            
            if matrix[i-1][j-1] == '1':
                dp[j] = min(dp[j], dp[j-1], prev) + 1
                max_side = max(max_side, dp[j])
            else:
                dp[j] = 0
            
            prev = temp
        
        prev = 0
    
    return max_side * max_side
```

---

## 📊 2-D DP Summary

| Problem | Pattern | Key Insight |
|---------|---------|-------------|
| Unique Paths | Grid | dp[i][j] = up + left |
| Min Path Sum | Grid | + min(up, left) |
| LCS | Two Strings | Match: diagonal + 1, else max |
| Edit Distance | Two Strings | 3 operations to consider |
| Coin Change II | Unbounded Knapsack | Iterate coins first |
| Target Sum | 0/1 Knapsack | Convert to subset sum |
| Interleaving | Three Strings | 2D state |
| Longest Path | DAG/Grid | DFS + memo |
| Distinct Subseq | Counting | Match: include + exclude |
| Stock Cooldown | State Machine | 3 states |
| Burst Balloons | Interval | Last to burst |
| Regex Matching | Two Strings | Handle * specially |
| Maximal Square | Grid | min(3 neighbors) + 1 |

### 2D DP Patterns:

**Grid DP:**
```python
dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
```

**Two String DP:**
```python
if s1[i] == s2[j]:
    dp[i][j] = dp[i-1][j-1] + something
else:
    dp[i][j] = combine(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
```

**Interval DP:**
```python
for length in range(2, n):
    for i in range(n - length):
        j = i + length
        for k in range(i, j):  # Split point
            dp[i][j] = opt(dp[i][k], dp[k][j])
```

**State Machine DP:**
```python
for each state:
    new_state = transition(old_states)
```
