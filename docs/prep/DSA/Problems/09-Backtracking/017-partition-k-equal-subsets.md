# Partition to K Equal Sum Subsets

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 698 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if array can be partitioned into k subsets with equal sum.

### Constraints & Clarifying Questions
1. **Use all elements?** Yes.
2. **Each element in exactly one subset?** Yes.
3. **k and n bounds?** 1 ≤ k ≤ n ≤ 16.
4. **Positive numbers?** Yes.

### Edge Cases
1. **k = 1:** Always true
2. **k = n:** All elements must be equal
3. **Sum not divisible by k:** False

---

## Phase 2: High-Level Approach

### Approach: Backtracking with k Buckets
Generalization of Matchsticks to Square. Place each element into one of k buckets.

**Core Insight:** Sort descending + skip duplicate buckets for pruning.

---

## Phase 3: Python Code

```python
from typing import List


def solve(nums: List[int], k: int) -> bool:
    """
    Check if array can be partitioned into k equal sum subsets.
    
    Args:
        nums: Input array
        k: Number of subsets
    
    Returns:
        True if partition possible
    """
    total = sum(nums)
    
    if total % k != 0:
        return False
    
    target = total // k
    
    if max(nums) > target:
        return False
    
    # Sort descending for better pruning
    nums.sort(reverse=True)
    
    buckets = [0] * k
    
    def backtrack(idx: int) -> bool:
        if idx == len(nums):
            return True  # All elements placed
        
        num = nums[idx]
        
        seen = set()  # Track bucket values to skip duplicates
        
        for i in range(k):
            # Skip if this bucket value already tried
            if buckets[i] in seen:
                continue
            
            # Skip if would exceed target
            if buckets[i] + num > target:
                continue
            
            seen.add(buckets[i])
            buckets[i] += num
            
            if backtrack(idx + 1):
                return True
            
            buckets[i] -= num
        
        return False
    
    return backtrack(0)


def solve_bitmask_dp(nums: List[int], k: int) -> bool:
    """
    Bitmask DP approach.
    """
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    n = len(nums)
    
    # dp[mask] = current bucket sum (mod target)
    dp = [-1] * (1 << n)
    dp[0] = 0
    
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        
        for i in range(n):
            if mask & (1 << i):
                continue
            
            if dp[mask] + nums[i] <= target:
                new_mask = mask | (1 << i)
                dp[new_mask] = (dp[mask] + nums[i]) % target
    
    return dp[(1 << n) - 1] == 0
```

---

## Phase 4: Dry Run

**Input:** `nums = [4, 3, 2, 3, 5, 2, 1], k = 4`

- Total = 20, target = 5
- Sorted: [5, 4, 3, 3, 2, 2, 1]

**Backtracking (key decisions):**

| idx | num | buckets | Action |
|-----|-----|---------|--------|
| 0 | 5 | [5,0,0,0] | 5 fills bucket 0 |
| 1 | 4 | [5,4,0,0] | 4 to bucket 1 |
| 2 | 3 | [5,4,3,0] | 3 to bucket 2 |
| 3 | 3 | [5,4,3,3] | 3 to bucket 3 |
| 4 | 2 | [5,4,5,3] | 2 to bucket 2 |
| 5 | 2 | [5,4,5,5] | 2 to bucket 3 |
| 6 | 1 | [5,5,5,5] | 1 to bucket 1 |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Backtracking:
- **Time:** O(k^N) worst case, but pruning helps significantly
- **Space:** O(N)

### Bitmask DP:
- **Time:** O(N × 2^N)
- **Space:** O(2^N)

---

## Phase 6: Follow-Up Questions

1. **"Return the actual partitions?"**
   → Track which bucket each element goes to.

2. **"Minimize difference between max and min subset sums?"**
   → Different problem; load balancing approach.

3. **"What if subsets must have equal count too?"**
   → Additional constraint: n must be divisible by k.
