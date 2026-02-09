# Maximum Subsequence Score

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 2542 | Heap / Greedy |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Select k indices; score = sum(nums1[indices]) × min(nums2[indices]). Maximize score.

### Constraints & Clarifying Questions
1. **Same k indices for both arrays?** Yes.
2. **k always valid?** Yes, k ≤ n.
3. **Negative values?** Possible.
4. **Duplicates?** Allowed.

### Edge Cases
1. **k = 1:** max(nums1[i] × nums2[i])
2. **k = n:** Use all elements
3. **All same values:** Simple calculation

---

## Phase 2: High-Level Approach

### Approach: Sort by nums2 + Min Heap
1. Sort pairs by nums2 descending
2. Use min heap to track k largest nums1 values
3. As we iterate, nums2[i] becomes the new minimum

**Core Insight:** If we sort by nums2 descending and pick current as minimum, we can freely choose k-1 elements from nums1 that we've seen.

---

## Phase 3: Python Code

```python
import heapq
from typing import List


def solve(nums1: List[int], nums2: List[int], k: int) -> int:
    """
    Find maximum subsequence score.
    
    Args:
        nums1: First array (sum component)
        nums2: Second array (min component)
        k: Number of indices to select
    
    Returns:
        Maximum score
    """
    # Pair and sort by nums2 descending
    pairs = sorted(zip(nums2, nums1), reverse=True)
    
    # Min heap to track k largest nums1 values
    heap = []
    sum_nums1 = 0
    max_score = 0
    
    for n2, n1 in pairs:
        # Add current nums1 value
        heapq.heappush(heap, n1)
        sum_nums1 += n1
        
        # If more than k elements, remove smallest
        if len(heap) > k:
            sum_nums1 -= heapq.heappop(heap)
        
        # If we have exactly k elements, calculate score
        # Current n2 is the minimum (sorted descending)
        if len(heap) == k:
            score = sum_nums1 * n2
            max_score = max(max_score, score)
    
    return max_score
```

---

## Phase 4: Dry Run

**Input:** `nums1 = [1,3,3,2], nums2 = [2,1,3,4], k = 3`

**Pairs sorted by nums2 desc:** [(4,2), (3,3), (2,1), (1,3)]

| Step | n2 | n1 | Heap | Sum | Score |
|------|----|----|------|-----|-------|
| 1 | 4 | 2 | [2] | 2 | - |
| 2 | 3 | 3 | [2,3] | 5 | - |
| 3 | 2 | 1 | [1,2,3] | 6 | 6×2=12 |
| 4 | 1 | 3 | [2,3,3] | 8 | 8×1=8 |

**Result:** `12`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
- Sorting: O(N log N)
- Heap operations: O(N log k)

### Space Complexity: O(N)
For pairs and heap.

---

## Phase 6: Follow-Up Questions

1. **"What if we want minimum score?"**
   → Sort by nums2 ascending; use max heap for smallest k nums1 values.

2. **"Variable k?"**
   → Try all k values; maintain running calculation.

3. **"Multiple arrays?"**
   → Generalize to product of mins; more complex greedy needed.
