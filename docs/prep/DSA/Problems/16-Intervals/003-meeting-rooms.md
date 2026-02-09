# Meeting Rooms

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 252 | Intervals |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Determine if person can attend all meetings (no overlaps).

### Constraints & Clarifying Questions
1. **[0, 30] and [30, 40] overlap?** No, back-to-back ok.
2. **Empty list?** Yes, can attend (nothing to attend).
3. **Single meeting?** Yes.
4. **Meetings sorted?** Not necessarily.

### Edge Cases
1. **Empty:** True
2. **Single meeting:** True
3. **All overlap:** False

---

## Phase 2: High-Level Approach

### Approach: Sort and Check Adjacent
Sort by start. Check if any meeting starts before previous ends.

**Core Insight:** If sorted, only need to check consecutive pairs.

---

## Phase 3: Python Code

```python
from typing import List


def solve(intervals: List[List[int]]) -> bool:
    """
    Check if all meetings can be attended.
    
    Args:
        intervals: List of [start, end]
    
    Returns:
        True if no overlaps
    """
    if len(intervals) <= 1:
        return True
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    for i in range(1, len(intervals)):
        # If current starts before previous ends
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    
    return True


def solve_one_liner(intervals: List[List[int]]) -> bool:
    """
    Concise version.
    """
    intervals.sort(key=lambda x: x[0])
    return all(
        intervals[i][0] >= intervals[i - 1][1]
        for i in range(1, len(intervals))
    )


def solve_sort_by_end(intervals: List[List[int]]) -> bool:
    """
    Alternative: sort by end time.
    """
    if len(intervals) <= 1:
        return True
    
    intervals.sort(key=lambda x: x[1])
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    
    return True


def solve_brute_force(intervals: List[List[int]]) -> bool:
    """
    Brute force: check all pairs.
    O(n²) - for comparison only.
    """
    n = len(intervals)
    
    for i in range(n):
        for j in range(i + 1, n):
            # Check overlap
            a, b = intervals[i], intervals[j]
            if max(a[0], b[0]) < min(a[1], b[1]):
                return False
    
    return True
```

---

## Phase 4: Dry Run

**Input:** `[[0,30],[5,10],[15,20]]`

**Sorted:** [[0,30], [5,10], [15,20]]

| i | Current | Previous End | Overlap? |
|---|---------|--------------|----------|
| 1 | [5,10] | 30 | 5<30 ✓ Overlap |

**Result:** False (can't attend all)

**Input 2:** `[[7,10],[2,4]]`

**Sorted:** [[2,4], [7,10]]

| i | Current | Previous End | Overlap? |
|---|---------|--------------|----------|
| 1 | [7,10] | 4 | 7≥4 No overlap |

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting dominates.

### Space Complexity: O(1)
Excluding sort space.

---

## Phase 6: Follow-Up Questions

1. **"Return conflicting meetings?"**
   → Track pairs where overlap occurs.

2. **"Find maximum meetings attendable?"**
   → Activity selection / weighted interval scheduling.

3. **"With travel time between locations?"**
   → End time + travel time ≤ next start.
