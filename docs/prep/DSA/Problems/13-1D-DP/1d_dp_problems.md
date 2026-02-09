# 📈 1-D Dynamic Programming - Complete Problem Set

## Problem 1: Climbing Stairs (Easy)
**LeetCode 70**

### Problem
Find number of ways to climb n stairs (1 or 2 steps at a time).

### Intuition
Fibonacci: dp[i] = dp[i-1] + dp[i-2]

### Solution
```python
def climbStairs(n: int) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    
    return prev1
```

---

## Problem 2: Min Cost Climbing Stairs (Easy)
**LeetCode 746**

### Problem
Find minimum cost to reach top, paying cost[i] at step i.

### Intuition
dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])

### Solution
```python
def minCostClimbingStairs(cost: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    n = len(cost)
    prev2, prev1 = 0, 0
    
    for i in range(2, n + 1):
        curr = min(prev1 + cost[i-1], prev2 + cost[i-2])
        prev2, prev1 = prev1, curr
    
    return prev1
```

---

## Problem 3: House Robber (Medium)
**LeetCode 198**

### Problem
Rob houses, can't rob adjacent. Maximize money.

### Intuition
At each house: dp[i] = max(dp[i-1], dp[i-2] + nums[i])

### Solution
```python
def rob(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    if len(nums) == 1:
        return nums[0]
    
    prev2, prev1 = 0, 0
    
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2, prev1 = prev1, curr
    
    return prev1
```

---

## Problem 4: House Robber II (Medium)
**LeetCode 213**

### Problem
Houses in circle. Can't rob first and last together.

### Intuition
Run twice: houses[0:n-1] and houses[1:n]. Take max.

### Solution
```python
def rob(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    if len(nums) == 1:
        return nums[0]
    
    def rob_linear(houses):
        prev2, prev1 = 0, 0
        for num in houses:
            curr = max(prev1, prev2 + num)
            prev2, prev1 = prev1, curr
        return prev1
    
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

---

## Problem 5: Longest Palindromic Substring (Medium)
**LeetCode 5**

### Problem
Find longest palindromic substring.

### Intuition
Expand around center for each position (odd and even length).

### Solution
```python
def longestPalindrome(s: str) -> str:
    """
    Time: O(n²)
    Space: O(1)
    """
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]
    
    result = ""
    
    for i in range(len(s)):
        # Odd length
        odd = expand(i, i)
        if len(odd) > len(result):
            result = odd
        
        # Even length
        even = expand(i, i + 1)
        if len(even) > len(result):
            result = even
    
    return result
```

---

## Problem 6: Palindromic Substrings (Medium)
**LeetCode 647**

### Problem
Count all palindromic substrings.

### Intuition
Expand around each center, count while expanding.

### Solution
```python
def countSubstrings(s: str) -> int:
    """
    Time: O(n²)
    Space: O(1)
    """
    count = 0
    
    def expand(left, right):
        nonlocal count
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    for i in range(len(s)):
        expand(i, i)      # Odd
        expand(i, i + 1)  # Even
    
    return count
```

---

## Problem 7: Decode Ways (Medium)
**LeetCode 91**

### Problem
Count ways to decode digit string to letters.

### Intuition
dp[i] = dp[i-1] (if valid single) + dp[i-2] (if valid double)

### Solution
```python
def numDecodings(s: str) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    if not s or s[0] == '0':
        return 0
    
    prev2, prev1 = 1, 1
    
    for i in range(1, len(s)):
        curr = 0
        
        # Single digit
        if s[i] != '0':
            curr += prev1
        
        # Two digits
        two_digit = int(s[i-1:i+1])
        if 10 <= two_digit <= 26:
            curr += prev2
        
        prev2, prev1 = prev1, curr
    
    return prev1
```

---

## Problem 8: Coin Change (Medium)
**LeetCode 322**

### Problem
Find minimum coins to make amount.

### Intuition
dp[i] = min(dp[i - coin] + 1) for all coins

### Solution
```python
def coinChange(coins: list[int], amount: int) -> int:
    """
    Time: O(amount * n)
    Space: O(amount)
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

## Problem 9: Maximum Product Subarray (Medium)
**LeetCode 152**

### Problem
Find contiguous subarray with largest product.

### Intuition
Track both max and min (min can become max with negative).

### Solution
```python
def maxProduct(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    result = max(nums)
    curr_max = curr_min = 1
    
    for num in nums:
        if num == 0:
            curr_max = curr_min = 1
            continue
        
        temp = curr_max * num
        curr_max = max(num, temp, curr_min * num)
        curr_min = min(num, temp, curr_min * num)
        
        result = max(result, curr_max)
    
    return result
```

---

## Problem 10: Word Break (Medium)
**LeetCode 139**

### Problem
Check if string can be segmented into dictionary words.

### Intuition
dp[i] = True if s[:i] can be segmented

### Solution
```python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    """
    Time: O(n² * m) where m = avg word length
    Space: O(n)
    """
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[len(s)]
```

---

## Problem 11: Longest Increasing Subsequence (Medium)
**LeetCode 300**

### Problem
Find length of longest strictly increasing subsequence.

### Intuition
Binary search with patience sort. Or dp[i] = longest ending at i.

### Solution
```python
def lengthOfLIS(nums: list[int]) -> int:
    """
    Binary Search approach
    Time: O(n log n)
    Space: O(n)
    """
    from bisect import bisect_left
    
    tails = []  # tails[i] = smallest tail of LIS length i+1
    
    for num in nums:
        pos = bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)

# DP approach O(n²)
def lengthOfLIS_dp(nums: list[int]) -> int:
    """
    Time: O(n²)
    Space: O(n)
    """
    dp = [1] * len(nums)
    
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)
```

---

## Problem 12: Partition Equal Subset Sum (Medium)
**LeetCode 416**

### Problem
Check if array can be partitioned into two equal sum subsets.

### Intuition
0/1 Knapsack: can we make sum/2?

### Solution
```python
def canPartition(nums: list[int]) -> bool:
    """
    Time: O(n * sum)
    Space: O(sum)
    """
    total = sum(nums)
    
    if total % 2 == 1:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        # Traverse backwards to avoid using same num twice
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]
    
    return dp[target]
```

---

## Problem 13: Triangle (Medium)
**LeetCode 120**

### Problem
Find minimum path sum from top to bottom of triangle.

### Intuition
Bottom-up DP. dp[j] = min(dp[j], dp[j+1]) + triangle[i][j]

### Solution
```python
def minimumTotal(triangle: list[list[int]]) -> int:
    """
    Time: O(n²)
    Space: O(n)
    """
    # Start from second to last row
    dp = triangle[-1][:]
    
    for i in range(len(triangle) - 2, -1, -1):
        for j in range(len(triangle[i])):
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
    
    return dp[0]
```

---

## Problem 14: Delete and Earn (Medium)
**LeetCode 740**

### Problem
Delete num, earn num points, delete all num-1 and num+1.

### Intuition
Transform to House Robber: points[i] = i * count[i]

### Solution
```python
def deleteAndEarn(nums: list[int]) -> int:
    """
    Time: O(n + max_num)
    Space: O(max_num)
    """
    if not nums:
        return 0
    
    max_num = max(nums)
    points = [0] * (max_num + 1)
    
    for num in nums:
        points[num] += num
    
    # House Robber
    prev2, prev1 = 0, 0
    
    for point in points:
        curr = max(prev1, prev2 + point)
        prev2, prev1 = prev1, curr
    
    return prev1
```

---

## Problem 15: Maximum Subarray (Easy)
**LeetCode 53**

### Problem
Find contiguous subarray with largest sum.

### Intuition
Kadane's algorithm: extend or start new.

### Solution
```python
def maxSubArray(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

---

## Problem 16: Jump Game (Medium)
**LeetCode 55**

### Problem
Check if you can reach last index.

### Intuition
Track farthest reachable position.

### Solution
```python
def canJump(nums: list[int]) -> bool:
    """
    Time: O(n)
    Space: O(1)
    """
    farthest = 0
    
    for i in range(len(nums)):
        if i > farthest:
            return False
        farthest = max(farthest, i + nums[i])
    
    return True
```

---

## Problem 17: Jump Game II (Medium)
**LeetCode 45**

### Problem
Find minimum jumps to reach last index.

### Intuition
BFS level by level (greedy).

### Solution
```python
def jump(nums: list[int]) -> int:
    """
    Time: O(n)
    Space: O(1)
    """
    jumps = 0
    current_end = 0
    farthest = 0
    
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        
        if i == current_end:
            jumps += 1
            current_end = farthest
    
    return jumps
```

---

## 📊 1-D DP Summary

| Problem | Pattern | Recurrence |
|---------|---------|------------|
| Climbing Stairs | Fibonacci | dp[i] = dp[i-1] + dp[i-2] |
| Min Cost Stairs | Fibonacci | min(prev1 + cost, prev2 + cost) |
| House Robber | Max Skip | max(prev1, prev2 + curr) |
| House Robber II | Circular | Two passes |
| Palindrome | Expand | Expand from center |
| Decode Ways | Counting | Valid 1-digit + valid 2-digit |
| Coin Change | Unbounded | min(dp[i-coin] + 1) |
| Max Product | Track Min/Max | Negatives can flip |
| Word Break | Partition | Check all splits |
| LIS | Binary Search | Patience sort |
| Partition Sum | 0/1 Knapsack | Can make target? |
| Max Subarray | Kadane | max(num, curr + num) |
| Jump Game | Greedy | Track farthest |

### DP State Optimization:
- **Fibonacci-like**: Only need prev 2 values → O(1) space
- **Running aggregates**: Track max/min as you go
- **Backward traversal**: When current depends on "rest"
