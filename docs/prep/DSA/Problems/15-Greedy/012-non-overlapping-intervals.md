# Non-overlapping Intervals

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 435 | Greedy + Intervals |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Remove minimum intervals to make rest non-overlapping.

### Constraints & Clarifying Questions
1. **[1,2] and [2,3] overlap?** No, touching is fine.
2. **Empty list?** Return 0.
3. **All overlapping?** Keep 1, remove rest.
4. **None overlapping?** Remove 0.

### Edge Cases
1. **Empty:** 0
2. **Single interval:** 0
3. **All same:** Remove all but one

---

## Phase 2: High-Level Approach

### Approach: Greedy - Keep Early Ending
Sort by end. Keep intervals that don't conflict with last kept.
Removals = total - kept.

**Core Insight:** Same as activity selection; maximize non-overlapping.

---

## Phase 3: Python Code

```python
from typing import List


def solve(intervals: List[List[int]]) -> int:
    """
    Minimum removals to make non-overlapping.
    
    Args:
        intervals: List of [start, end]
    
    Returns:
        Minimum removals
    """
    if not intervals:
        return 0
    
    # Sort by end point
    intervals.sort(key=lambda x: x[1])
    
    kept = 1
    end = intervals[0][1]
    
    for start, finish in intervals[1:]:
        # Non-overlapping: start >= previous end
        if start >= end:
            kept += 1
            end = finish
    
    return len(intervals) - kept


def solve_count_overlaps(intervals: List[List[int]]) -> int:
    """
    Count overlaps directly.
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[1])
    
    removals = 0
    end = intervals[0][1]
    
    for start, finish in intervals[1:]:
        if start < end:
            # Overlapping, remove this one (it ends later)
            removals += 1
        else:
            end = finish
    
    return removals


def solve_sort_by_start(intervals: List[List[int]]) -> int:
    """
    Alternative: sort by start.
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[0])
    
    removals = 0
    prev_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start < prev_end:
            # Overlapping
            removals += 1
            # Keep the one that ends earlier
            prev_end = min(prev_end, end)
        else:
            prev_end = end
    
    return removals
```

---

## Phase 4: Dry Run

**Input:** `[[1,2],[2,3],[3,4],[1,3]]`

**Sorted by end:** [[1,2], [2,3], [1,3], [3,4]]

| Interval | end | Overlaps? | Action |
|----------|-----|-----------|--------|
| [1,2] | 2 | - | Keep, end=2 |
| [2,3] | 2 | 2≥2 No | Keep, end=3 |
| [1,3] | 3 | 1<3 Yes | Remove |
| [3,4] | 3 | 3≥3 No | Keep, end=4 |

**Kept: 3, Removals: 1**

**Result:** 1

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting dominates.

### Space Complexity: O(1)
Excluding sort space.

---

## Phase 6: Follow-Up Questions

1. **"Return which intervals to remove?"**
   → Track indices of removed intervals.

2. **"Minimum total length removed?"**
   → Different objective; may need DP.

3. **"Weighted intervals?"**
   → Weighted activity selection; DP needed.
