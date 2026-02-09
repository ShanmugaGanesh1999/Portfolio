# Longest Increasing Subsequence (Greedy + Binary Search)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 300 | Greedy + Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find length of longest strictly increasing subsequence using greedy approach.

### Constraints & Clarifying Questions
1. **Subsequence = not contiguous?** Correct.
2. **Strictly increasing?** Yes.
3. **O(n log n) required?** Yes for optimal.
4. **Duplicates?** Don't extend with equal.

### Edge Cases
1. **Single element:** 1
2. **Decreasing:** 1
3. **All same:** 1

---

## Phase 2: High-Level Approach

### Approach: Greedy with Binary Search
Maintain array of smallest tail values for each LIS length.
Binary search to find position to update.

**Core Insight:** Keep smallest possible tail values to maximize extension opportunities.

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
        Length of LIS
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


def solve_manual_binary_search(nums: List[int]) -> int:
    """
    Without bisect library.
    """
    if not nums:
        return 0
    
    tails = []
    
    def binary_search(arr: List[int], target: int) -> int:
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


def solve_with_reconstruction(nums: List[int]) -> List[int]:
    """
    Return actual LIS (one possible).
    """
    if not nums:
        return []
    
    n = len(nums)
    tails = []
    indices = []  # indices[i] = index in nums for tails[i]
    parent = [-1] * n  # parent[i] = index of previous element in LIS
    
    for i, num in enumerate(nums):
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            if tails:
                parent[i] = indices[-1]
            tails.append(num)
            indices.append(i)
        else:
            tails[pos] = num
            indices[pos] = i
            if pos > 0:
                parent[i] = indices[pos - 1]
    
    # Reconstruct from last element
    result = []
    idx = indices[-1]
    while idx != -1:
        result.append(nums[idx])
        idx = parent[idx]
    
    return result[::-1]
```

---

## Phase 4: Dry Run

**Input:** `[10, 9, 2, 5, 3, 7, 101, 18]`

| num | tails | Action | Position |
|-----|-------|--------|----------|
| 10 | [10] | Append | 0 |
| 9 | [9] | Replace @ 0 | 0 |
| 2 | [2] | Replace @ 0 | 0 |
| 5 | [2,5] | Append | 1 |
| 3 | [2,3] | Replace @ 1 | 1 |
| 7 | [2,3,7] | Append | 2 |
| 101 | [2,3,7,101] | Append | 3 |
| 18 | [2,3,7,18] | Replace @ 3 | 3 |

**Tails represents:** Smallest tails for LIS of lengths 1,2,3,4
**One valid LIS:** [2, 3, 7, 101]

**Result:** 4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
N elements × O(log N) binary search.

### Space Complexity: O(N)
Tails array.

---

## Phase 6: Follow-Up Questions

1. **"Count number of LIS?"**
   → Need additional DP tracking.

2. **"Non-strictly increasing (>=)?"**
   → Use bisect_right instead.

3. **"Print all LIS?"**
   → Track all predecessors; backtrack.
