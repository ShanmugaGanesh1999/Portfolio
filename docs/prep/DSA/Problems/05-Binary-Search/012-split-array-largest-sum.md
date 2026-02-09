# Split Array Largest Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 410 | Binary Search on Answer |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Split array into m subarrays to minimize the largest subarray sum.

### Constraints & Clarifying Questions
1. **Subarrays contiguous?** Yes.
2. **Must use all elements?** Yes.
3. **Subarrays non-empty?** Yes.
4. **m guaranteed valid?** Yes, 1 ≤ m ≤ len(nums).
5. **Can reorder?** No.

### Edge Cases
1. **m = 1:** Return sum of all elements.
2. **m = len(nums):** Return max element.
3. **All same elements:** Distribute evenly.

---

## Phase 2: High-Level Approach

### Approach: Binary Search on Maximum Sum
Search for minimum "maximum subarray sum" that allows m splits.

**Core Insight:** If we can split with max sum = X, we can also split with any max sum > X. Binary search for minimum valid X.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], m: int) -> int:
    """
    Split array into m subarrays minimizing largest sum.
    
    Args:
        nums: Array to split
        m: Number of subarrays
    
    Returns:
        Minimum possible largest subarray sum
    """
    def can_split(max_sum: int) -> bool:
        """Check if array can be split into ≤ m parts with each ≤ max_sum."""
        splits = 1
        current_sum = 0
        
        for num in nums:
            if current_sum + num > max_sum:
                splits += 1
                current_sum = num
                if splits > m:
                    return False
            else:
                current_sum += num
        
        return True
    
    # Search range: [max element, total sum]
    left, right = max(nums), sum(nums)
    
    while left < right:  # O(log(sum - max))
        mid = left + (right - left) // 2
        
        if can_split(mid):  # O(N)
            right = mid  # Valid, try smaller max sum
        else:
            left = mid + 1  # Need larger max sum
    
    return left


def solve_dp(nums: list[int], m: int) -> int:
    """
    Alternative: Dynamic Programming approach.
    dp[i][j] = minimum largest sum splitting first i elements into j parts.
    """
    n = len(nums)
    
    # Prefix sums for range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    # dp[i][j] = min largest sum for first i elements in j splits
    dp = [[float('inf')] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    
    for i in range(1, n + 1):
        for j in range(1, min(i, m) + 1):
            for k in range(j - 1, i):
                # Split: first k elements in j-1 parts, elements k+1 to i in last part
                last_sum = prefix[i] - prefix[k]
                dp[i][j] = min(dp[i][j], max(dp[k][j-1], last_sum))
    
    return dp[n][m]
```

---

## Phase 4: Dry Run

**Input:** `nums = [7, 2, 5, 10, 8], m = 2`

sum = 32, max = 10

| left | right | mid | can_split? | splits needed | Action |
|------|-------|-----|------------|---------------|--------|
| 10 | 32 | 21 | Yes | 2 ([7,2,5,|10,8]) | right = 21 |
| 10 | 21 | 15 | Yes | 2 ([7,2,5,|10,...]) | right = 15 |
| 10 | 15 | 12 | No | 3 | left = 13 |
| 13 | 15 | 14 | No | 3 | left = 15 |
| 15 | 15 | - | - | - | left = right, return 15 |

**Verification with max_sum=15:**
- Part 1: 7+2+5=14 (can't add 10: 14+10=24>15)
- Part 2: 10 (can't add 8: 10+8=18>15) → need 3 splits

**With max_sum=18:**
- Part 1: 7+2+5=14 (can't add 10)
- Part 2: 10+8=18 ✓ → 2 splits

**Result:** `18`

Wait, let me recalculate...

Actually: min to split [7,2,5,10,8] into 2 parts:
- [7,2,5], [10,8] → max(14, 18) = 18
- [7,2,5,10], [8] → max(24, 8) = 24
- [7], [2,5,10,8] → max(7, 25) = 25

So minimum is 18.

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × log(sum - max))
- Binary search: O(log(sum - max)) iterations.
- Each iteration: O(N) to check feasibility.

### Space Complexity: O(1)
Constant extra space (binary search approach).

---

## Phase 6: Follow-Up Questions

1. **"What's the DP time complexity?"**
   → O(N² × M) for the DP approach.

2. **"What if we need the actual split positions?"**
   → Track split points during feasibility check when answer found.

3. **"Maximize minimum sum instead?"**
   → Reverse condition: can_split becomes "need ≤ m parts with each ≥ min_sum".
