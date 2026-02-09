# Insert Interval

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 57 | Intervals |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Insert new interval into sorted non-overlapping intervals, merging if necessary.

### Constraints & Clarifying Questions
1. **Input already sorted?** Yes.
2. **No overlaps in input?** Correct.
3. **Insert maintains sorted order?** Yes.
4. **Empty intervals?** Return [newInterval].

### Edge Cases
1. **Empty list:** Return [newInterval]
2. **Insert at beginning:** newInterval ends before first starts
3. **Insert at end:** newInterval starts after last ends
4. **Complete overlap:** Absorbs multiple intervals

---

## Phase 2: High-Level Approach

### Approach: Three Phases
1. Add all intervals ending before newInterval starts
2. Merge all overlapping intervals with newInterval
3. Add all intervals starting after merged interval ends

**Core Insight:** Track when overlapping starts and ends.

---

## Phase 3: Python Code

```python
from typing import List


def solve(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    """
    Insert interval into sorted list, merging overlaps.
    
    Args:
        intervals: Sorted non-overlapping intervals
        newInterval: Interval to insert
    
    Returns:
        Merged list
    """
    result = []
    i = 0
    n = len(intervals)
    
    # Phase 1: Add all intervals ending before newInterval starts
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Phase 2: Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    
    result.append(newInterval)
    
    # Phase 3: Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result


def solve_one_pass(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    """
    Single pass approach.
    """
    result = []
    inserted = False
    
    for interval in intervals:
        if interval[1] < newInterval[0]:
            # Current ends before new starts
            result.append(interval)
        elif interval[0] > newInterval[1]:
            # Current starts after new ends
            if not inserted:
                result.append(newInterval)
                inserted = True
            result.append(interval)
        else:
            # Overlapping, merge
            newInterval[0] = min(newInterval[0], interval[0])
            newInterval[1] = max(newInterval[1], interval[1])
    
    if not inserted:
        result.append(newInterval)
    
    return result


def solve_binary_search(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    """
    Binary search to find insertion point.
    """
    import bisect
    
    if not intervals:
        return [newInterval]
    
    # Find left insertion point
    starts = [i[0] for i in intervals]
    ends = [i[1] for i in intervals]
    
    # Find first interval that could overlap
    left = bisect.bisect_left(ends, newInterval[0])
    # Find last interval that could overlap
    right = bisect.bisect_right(starts, newInterval[1])
    
    # Merge overlapping
    if left < right:
        newInterval[0] = min(newInterval[0], intervals[left][0])
        newInterval[1] = max(newInterval[1], intervals[right-1][1])
    
    return intervals[:left] + [newInterval] + intervals[right:]
```

---

## Phase 4: Dry Run

**Input:** intervals = [[1,3],[6,9]], newInterval = [2,5]

**Phase 1:** Add intervals ending before 2
- [1,3] ends at 3 ≥ 2, stop
- result = []

**Phase 2:** Merge while start ≤ 5
- [1,3]: 1 ≤ 5 → merge → newInterval = [1, 5]
- [6,9]: 6 > 5 → stop
- result = [[1,5]]

**Phase 3:** Add remaining
- result = [[1,5], [6,9]]

**Result:** [[1,5], [6,9]]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass through intervals.

### Space Complexity: O(N)
Result array (O(1) excluding output).

---

## Phase 6: Follow-Up Questions

1. **"Insert multiple intervals at once?"**
   → Sort all, then merge intervals problem.

2. **"Stream of insertions?"**
   → Use interval tree for O(log N) per operation.

3. **"Delete instead of insert?"**
   → Remove and potentially split intervals.
