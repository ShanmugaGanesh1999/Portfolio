# Longest Increasing Subsequence

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 300 | 1D DP / Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find length of longest strictly increasing subsequence.

### Constraints & Clarifying Questions
1. **Subsequence = not contiguous?** Correct.
2. **Strictly increasing?** Yes, not >=.
3. **Empty array?** Return 0.
4. **Duplicates?** Don't extend with equal values.

### Edge Cases
1. **Single element:** 1
2. **Decreasing order:** 1
3. **All same:** 1

---

## Phase 2: High-Level Approach

### Approach 1: DP O(N²)
dp[i] = LIS ending at i. For each j < i, if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j] + 1).

### Approach 2: Binary Search O(N log N)
Maintain sorted subsequence. Binary search to find position to replace or extend.

**Core Insight:** Replace to keep smallest possible tail values.

---

## Phase 3: Python Code

```python
from typing import List
import bisect


def solve(nums: List[int]) -> int:
    """
    Find LIS length using binary search.
    
    Args:
        nums: Array of integers
    
    Returns:
        Length of longest increasing subsequence
    """
    if not nums:
        return 0
    
    # tails[i] = smallest tail of LIS of length i+1
    tails = []
    
    for num in nums:
        # Binary search for position
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)  # Extend
        else:
            tails[pos] = num  # Replace
    
    return len(tails)


def solve_dp(nums: List[int]) -> int:
    """
    DP approach O(N²).
    """
    if not nums:
        return 0
    
    n = len(nums)
    dp = [1] * n  # Each element is LIS of length 1
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)


def solve_with_reconstruction(nums: List[int]) -> List[int]:
    """
    Return actual LIS (one possibility).
    """
    if not nums:
        return []
    
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
    
    # Find index of max
    max_len = max(dp)
    idx = dp.index(max_len)
    
    # Reconstruct
    result = []
    while idx != -1:
        result.append(nums[idx])
        idx = parent[idx]
    
    return result[::-1]


def solve_binary_search_manual(nums: List[int]) -> int:
    """
    Binary search without library.
    """
    if not nums:
        return 0
    
    tails = []
    
    def binary_search(arr, target):
        left, right = 0, len(arr)
        while left < right:
            mid = (left + right) // 2
            if arr[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left
    
    for num in nums:
        pos = binary_search(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

---

## Phase 4: Dry Run

**Input:** `[10, 9, 2, 5, 3, 7, 101, 18]`

**Binary Search Approach:**

| num | tails | Action |
|-----|-------|--------|
| 10 | [10] | Append |
| 9 | [9] | Replace at 0 |
| 2 | [2] | Replace at 0 |
| 5 | [2,5] | Append |
| 3 | [2,3] | Replace at 1 |
| 7 | [2,3,7] | Append |
| 101 | [2,3,7,101] | Append |
| 18 | [2,3,7,18] | Replace at 3 |

**LIS length:** 4 (e.g., [2,3,7,101])

**Result:** 4

---

## Phase 5: Complexity Analysis

### Binary Search Approach:
- **Time:** O(N log N)
- **Space:** O(N)

### DP Approach:
- **Time:** O(N²)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Return actual LIS?"**
   → Track parent pointers or patience sorting piles.

2. **"Non-strictly increasing?"**
   → Use bisect_right instead of bisect_left.

3. **"Count number of LIS?"**
   → Track count alongside length in DP.
