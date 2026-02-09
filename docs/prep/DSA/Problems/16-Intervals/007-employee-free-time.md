# Employee Free Time

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 759 | Intervals + Merge |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find common free time across all employees' schedules.

### Constraints & Clarifying Questions
1. **Each employee's schedule sorted?** Yes.
2. **Within employee, non-overlapping?** Yes.
3. **Free time = gaps between busy intervals?** Yes.
4. **Include infinite before/after?** No, only finite gaps.

### Edge Cases
1. **Single employee, single interval:** []
2. **No common free time:** []
3. **All employees free at same time:** Return that interval

---

## Phase 2: High-Level Approach

### Approach: Flatten, Sort, Merge, Find Gaps
Collect all intervals → Sort by start → Merge overlapping → Find gaps.

**Core Insight:** Free time = gaps between merged busy intervals.

---

## Phase 3: Python Code

```python
from typing import List
import heapq


class Interval:
    def __init__(self, start: int = 0, end: int = 0):
        self.start = start
        self.end = end


def solve(schedule: List[List[Interval]]) -> List[Interval]:
    """
    Find common free time intervals.
    
    Args:
        schedule: List of employee schedules
    
    Returns:
        List of free time intervals
    """
    # Flatten all intervals
    all_intervals = []
    for employee in schedule:
        for interval in employee:
            all_intervals.append((interval.start, interval.end))
    
    # Sort by start time
    all_intervals.sort()
    
    # Merge overlapping intervals
    merged = []
    for start, end in all_intervals:
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    
    # Find gaps
    result = []
    for i in range(1, len(merged)):
        gap_start = merged[i - 1][1]
        gap_end = merged[i][0]
        if gap_start < gap_end:
            result.append(Interval(gap_start, gap_end))
    
    return result


def solve_heap(schedule: List[List[Interval]]) -> List[Interval]:
    """
    Use heap for efficient merging.
    """
    # Min heap: (start, end, employee_idx, interval_idx)
    heap = []
    
    for i, employee in enumerate(schedule):
        if employee:
            heapq.heappush(heap, (employee[0].start, employee[0].end, i, 0))
    
    result = []
    prev_end = -1
    
    while heap:
        start, end, emp_idx, int_idx = heapq.heappop(heap)
        
        # Check for gap
        if prev_end != -1 and start > prev_end:
            result.append(Interval(prev_end, start))
        
        prev_end = max(prev_end, end)
        
        # Add next interval from same employee
        if int_idx + 1 < len(schedule[emp_idx]):
            next_int = schedule[emp_idx][int_idx + 1]
            heapq.heappush(heap, (next_int.start, next_int.end, emp_idx, int_idx + 1))
    
    return result


def solve_simple(schedule: List[List[List[int]]]) -> List[List[int]]:
    """
    Simple version with list inputs (no Interval class).
    """
    # Flatten
    intervals = [iv for emp in schedule for iv in emp]
    
    # Sort
    intervals.sort()
    
    # Merge
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    
    # Find gaps
    return [
        [merged[i - 1][1], merged[i][0]]
        for i in range(1, len(merged))
        if merged[i - 1][1] < merged[i][0]
    ]
```

---

## Phase 4: Dry Run

**Input:**
```
schedule = [
    [[1,2], [5,6]],   # Employee 1
    [[1,3]],          # Employee 2
    [[4,10]]          # Employee 3
]
```

**Flatten:** [[1,2], [5,6], [1,3], [4,10]]
**Sorted:** [[1,2], [1,3], [4,10], [5,6]]

**Merge:**
| Interval | Merged |
|----------|--------|
| [1,2] | [[1,2]] |
| [1,3] | [[1,3]] (1≤2, merge) |
| [4,10] | [[1,3], [4,10]] (4>3) |
| [5,6] | [[1,3], [4,10]] (5≤10, merge stays) |

**Find gaps:** [3, 4] (gap between 3 and 4)

**Result:** [[3, 4]]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Where N = total intervals across all employees.

### Space Complexity: O(N)
Storing all intervals.

---

## Phase 6: Follow-Up Questions

1. **"Find time when all employees are busy?"**
   → Return merged intervals instead of gaps.

2. **"Find free time for subset of employees?"**
   → Only merge intervals from selected employees.

3. **"Stream of schedule updates?"**
   → Use interval tree for dynamic updates.
