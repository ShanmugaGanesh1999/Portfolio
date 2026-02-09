# Remove Covered Intervals

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1288 | Intervals + Sorting |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Remove intervals completely covered by another. Count remaining.

### Constraints & Clarifying Questions
1. **Covered = a≤c and d≤b?** Yes, [c,d] covered by [a,b].
2. **Equal intervals?** One covers the other.
3. **Empty list?** Return 0.
4. **Self-covering?** Not counted.

### Edge Cases
1. **Single interval:** 1
2. **No covers:** Return count
3. **All cover one:** 1

---

## Phase 2: High-Level Approach

### Approach: Sort and Track Max End
Sort by start ascending, then end descending.
Interval is covered if its end ≤ max end seen so far.

**Core Insight:** Same start → longer interval comes first (covers shorter).

---

## Phase 3: Python Code

```python
from typing import List


def solve(intervals: List[List[int]]) -> int:
    """
    Count intervals not covered by any other.
    
    Args:
        intervals: List of [start, end]
    
    Returns:
        Count of remaining intervals
    """
    # Sort by start ascending, then by end descending
    intervals.sort(key=lambda x: (x[0], -x[1]))
    
    count = 0
    max_end = 0
    
    for start, end in intervals:
        # If end > max_end, this interval is not covered
        if end > max_end:
            count += 1
            max_end = end
    
    return count


def solve_track_covered(intervals: List[List[int]]) -> int:
    """
    Count covered intervals instead.
    """
    intervals.sort(key=lambda x: (x[0], -x[1]))
    
    covered = 0
    max_end = 0
    
    for start, end in intervals:
        if end <= max_end:
            covered += 1
        else:
            max_end = end
    
    return len(intervals) - covered


def solve_verbose(intervals: List[List[int]]) -> int:
    """
    More verbose explanation.
    """
    if not intervals:
        return 0
    
    # Sort by start (ascending)
    # If same start, sort by end (descending) - longer first
    sorted_intervals = sorted(intervals, key=lambda x: (x[0], -x[1]))
    
    remaining = []
    max_end = 0
    
    for start, end in sorted_intervals:
        # An interval is covered if end <= max_end seen so far
        # Because we sorted by start, all previous intervals have start <= current start
        # If end <= max_end, some previous interval covers this one
        if end > max_end:
            remaining.append([start, end])
            max_end = end
    
    return len(remaining)
```

---

## Phase 4: Dry Run

**Input:** `[[1,4],[3,6],[2,8]]`

**Sorted (start asc, end desc):** [[1,4], [2,8], [3,6]]

| Interval | max_end | Covered? | Action |
|----------|---------|----------|--------|
| [1,4] | 0 | 4>0 No | count=1, max_end=4 |
| [2,8] | 4 | 8>4 No | count=2, max_end=8 |
| [3,6] | 8 | 6≤8 Yes | Skip |

**Result:** 2

**Explanation:**
- [1,4]: Not covered
- [2,8]: Not covered
- [3,6]: Covered by [2,8] (2≤3 and 6≤8)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting dominates.

### Space Complexity: O(1)
Excluding sort space.

---

## Phase 6: Follow-Up Questions

1. **"Return which intervals are covered?"**
   → Track indices of covered intervals.

2. **"Remove overlapping (not just covered)?"**
   → Different problem; merge intervals variant.

3. **"Minimum intervals to remove to have no covers?"**
   → Same answer; remove all covered ones.
