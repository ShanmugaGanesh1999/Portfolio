# Merge Intervals

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 56 | Intervals |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Merge all overlapping intervals.

### Constraints & Clarifying Questions
1. **Input sorted?** Not necessarily.
2. **[1,4] and [4,5] overlap?** Yes, touching overlaps.
3. **Empty list?** Return [].
4. **Single interval?** Return as is.

### Edge Cases
1. **Empty:** []
2. **No overlaps:** Return sorted
3. **All overlap:** Single merged interval

---

## Phase 2: High-Level Approach

### Approach: Sort and Merge
Sort by start. Merge consecutive overlapping intervals.

**Core Insight:** After sorting, if current start ≤ previous end, merge.

---

## Phase 3: Python Code

```python
from typing import List


def solve(intervals: List[List[int]]) -> List[List[int]]:
    """
    Merge overlapping intervals.
    
    Args:
        intervals: List of [start, end]
    
    Returns:
        Merged intervals
    """
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    result = [intervals[0]]
    
    for start, end in intervals[1:]:
        last = result[-1]
        
        if start <= last[1]:
            # Overlapping, merge
            last[1] = max(last[1], end)
        else:
            # Non-overlapping, add new
            result.append([start, end])
    
    return result


def solve_in_place(intervals: List[List[int]]) -> List[List[int]]:
    """
    In-place variant (modifies input).
    """
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    
    write = 0  # Write pointer
    
    for i in range(1, len(intervals)):
        if intervals[i][0] <= intervals[write][1]:
            # Merge
            intervals[write][1] = max(intervals[write][1], intervals[i][1])
        else:
            # Move to next position
            write += 1
            intervals[write] = intervals[i]
    
    return intervals[:write + 1]


def solve_with_reduce(intervals: List[List[int]]) -> List[List[int]]:
    """
    Functional approach with reduce.
    """
    from functools import reduce
    
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    
    def merge(acc, interval):
        if acc and interval[0] <= acc[-1][1]:
            acc[-1][1] = max(acc[-1][1], interval[1])
        else:
            acc.append(interval)
        return acc
    
    return reduce(merge, intervals, [])
```

---

## Phase 4: Dry Run

**Input:** `[[1,3],[2,6],[8,10],[15,18]]`

**Sorted:** [[1,3],[2,6],[8,10],[15,18]] (already sorted)

| Interval | result[-1] | Overlap? | Action |
|----------|------------|----------|--------|
| [1,3] | - | - | result=[[1,3]] |
| [2,6] | [1,3] | 2≤3 Yes | Merge: [[1,6]] |
| [8,10] | [1,6] | 8>6 No | Append: [[1,6],[8,10]] |
| [15,18] | [8,10] | 15>10 No | Append: [[1,6],[8,10],[15,18]] |

**Result:** [[1,6],[8,10],[15,18]]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting dominates.

### Space Complexity: O(N)
Result array (O(1) for in-place).

---

## Phase 6: Follow-Up Questions

1. **"Already sorted input?"**
   → Skip sort; O(N) time.

2. **"Stream of intervals?"**
   → Use interval tree; O(log N) per insert.

3. **"Find gaps between merged intervals?"**
   → Compute [prev_end, curr_start] for non-overlapping.
