# Partition Equal Subset Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 416 | 1D DP (0/1 Knapsack) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Can array be partitioned into two subsets with equal sum?

### Constraints & Clarifying Questions
1. **Elements positive?** Yes.
2. **Can't reuse elements?** Correct.
3. **Empty partitions?** Both must be non-empty.
4. **Odd total sum?** Impossible.

### Edge Cases
1. **Odd sum:** False immediately
2. **Single element:** False
3. **Two equal elements:** True

---

## Phase 2: High-Level Approach

### Approach: DP - Can Achieve Sum
If total sum is S, find if subset can sum to S/2.
This is 0/1 knapsack with target = sum/2.

**Core Insight:** If one half exists, other automatically does.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int]) -> bool:
    """
    Check if array can be partitioned into equal sum subsets.
    
    Args:
        nums: Array of positive integers
    
    Returns:
        True if can be partitioned
    """
    total = sum(nums)
    
    # Odd sum can't be split equally
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # dp[i] = True if sum i is achievable
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        # Traverse backwards to avoid using same num twice
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]


def solve_set(nums: List[int]) -> bool:
    """
    Using set instead of array.
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return False
    
    target = total // 2
    achievable = {0}
    
    for num in nums:
        achievable = achievable | {x + num for x in achievable if x + num <= target}
        if target in achievable:
            return True
    
    return target in achievable


def solve_recursive(nums: List[int]) -> bool:
    """
    Recursive with memoization.
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    memo = {}
    
    def dp(i: int, remaining: int) -> bool:
        if remaining == 0:
            return True
        if i >= n or remaining < 0:
            return False
        if (i, remaining) in memo:
            return memo[(i, remaining)]
        
        # Include or exclude current number
        result = dp(i + 1, remaining - nums[i]) or dp(i + 1, remaining)
        memo[(i, remaining)] = result
        return result
    
    return dp(0, target)


def solve_bitset(nums: List[int]) -> bool:
    """
    Bitset optimization.
    """
    total = sum(nums)
    
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # bits represents achievable sums
    bits = 1  # bit 0 is set (sum 0 achievable)
    
    for num in nums:
        bits |= (bits << num)
    
    return bool(bits & (1 << target))
```

---

## Phase 4: Dry Run

**Input:** `[1, 5, 11, 5]`
**Total:** 22, Target: 11

| num | dp (achievable sums) |
|-----|----------------------|
| - | [T,F,F,...] (only 0) |
| 1 | [T,T,F,...] (0,1) |
| 5 | [T,T,F,F,F,T,T,...] (0,1,5,6) |
| 11 | (0,1,5,6,11,12) dp[11]=T ✓ |

**Partition:** {1,5,5} and {11}

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × sum)
N numbers, sum/2 possible targets.

### Space Complexity: O(sum)
DP array of size sum/2.

---

## Phase 6: Follow-Up Questions

1. **"Partition into k equal subsets?"**
   → Backtracking with k buckets.

2. **"Minimize difference between two subsets?"**
   → Find closest achievable sum to sum/2.

3. **"Return the actual partition?"**
   → Track which numbers were included.
