# Subarrays with K Different Integers

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 992 | Sliding Window + At Most K Trick |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count subarrays containing exactly K distinct integers.

### Constraints & Clarifying Questions
1. **Subarray must be contiguous?** Yes.
2. **What's the value range?** 1 to n where n = len(nums).
3. **K range?** 1 to n.
4. **Can K exceed distinct elements?** Yes, return 0.
5. **Empty array?** Return 0.

### Edge Cases
1. **K > distinct elements:** Return 0.
2. **K = 1:** Count subarrays with all same element.
3. **All same elements:** If k=1, count is n*(n+1)/2.

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Subarrays)
Check each subarray for exactly K distinct.
- **Time:** O(N²)
- **Space:** O(N)

### Option 2: Optimal (At Most K Trick)
Exactly K = At Most K - At Most (K-1).

**Core Insight:** Counting "exactly K" is hard; counting "at most K" is easy with sliding window.

---

## Phase 3: Python Code

```python
def solve(nums: list[int], k: int) -> int:
    """
    Count subarrays with exactly K distinct integers.
    
    Args:
        nums: Input array
        k: Exact number of distinct integers required
    
    Returns:
        Count of valid subarrays
    """
    def at_most_k(arr: list[int], k: int) -> int:
        """Count subarrays with at most k distinct integers."""
        if k < 0:
            return 0
        
        count = {}  # value -> frequency
        left = 0
        result = 0
        
        for right in range(len(arr)):  # O(N)
            # Add right element
            count[arr[right]] = count.get(arr[right], 0) + 1
            
            # Shrink while > k distinct
            while len(count) > k:
                count[arr[left]] -= 1
                if count[arr[left]] == 0:
                    del count[arr[left]]
                left += 1
            
            # All subarrays ending at right with start in [left, right]
            result += right - left + 1
        
        return result
    
    # Exactly K = At Most K - At Most (K-1)
    return at_most_k(nums, k) - at_most_k(nums, k - 1)


def solve_single_pass(nums: list[int], k: int) -> int:
    """
    Alternative: Single-pass approach tracking two windows.
    """
    from collections import defaultdict
    
    count1 = defaultdict(int)  # At most k
    count2 = defaultdict(int)  # At most k-1
    left1 = left2 = 0
    result = 0
    
    for right in range(len(nums)):
        count1[nums[right]] += 1
        count2[nums[right]] += 1
        
        while len(count1) > k:
            count1[nums[left1]] -= 1
            if count1[nums[left1]] == 0:
                del count1[nums[left1]]
            left1 += 1
        
        while len(count2) > k - 1:
            count2[nums[left2]] -= 1
            if count2[nums[left2]] == 0:
                del count2[nums[left2]]
            left2 += 1
        
        result += left2 - left1
    
    return result
```

---

## Phase 4: Dry Run

**Input:** `nums = [1, 2, 1, 2, 3], k = 2`

**Step 1: at_most_k(nums, 2)**

| right | num | count | left | subarrays_ending_here |
|-------|-----|-------|------|----------------------|
| 0 | 1 | {1:1} | 0 | 1 → [1] |
| 1 | 2 | {1:1,2:1} | 0 | 2 → [2], [1,2] |
| 2 | 1 | {1:2,2:1} | 0 | 3 → [1], [2,1], [1,2,1] |
| 3 | 2 | {1:2,2:2} | 0 | 4 → [2], [1,2], [2,1,2], [1,2,1,2] |
| 4 | 3 | {2:1,3:1} | 3 | 2 → [3], [2,3] |

**Total at_most_2:** 1+2+3+4+2 = 12

**Step 2: at_most_k(nums, 1)**

| right | num | count | left | subarrays_ending_here |
|-------|-----|-------|------|----------------------|
| 0 | 1 | {1:1} | 0 | 1 |
| 1 | 2 | {2:1} | 1 | 1 |
| 2 | 1 | {1:1} | 2 | 1 |
| 3 | 2 | {2:1} | 3 | 1 |
| 4 | 3 | {3:1} | 4 | 1 |

**Total at_most_1:** 5

**Result:** 12 - 5 = `7`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Two passes of O(N) each (or single pass with two windows).

### Space Complexity: O(K)
- Hash map stores at most K+1 distinct elements.

---

## Phase 6: Follow-Up Questions

1. **"Why does at_most_k - at_most_(k-1) work?"**
   → Subarrays with exactly k are counted in at_most_k but not at_most_(k-1).

2. **"What if we need the actual subarrays?"**
   → Track start indices; enumerate subarrays when right - left is calculated.

3. **"Can we do this in single pass?"**
   → Yes, maintain two windows simultaneously (shown in solve_single_pass).
