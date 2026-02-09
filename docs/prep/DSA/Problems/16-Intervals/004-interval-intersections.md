# Interval List Intersections

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 986 | Intervals + Two Pointers |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find intersections of two sorted interval lists.

### Constraints & Clarifying Questions
1. **Both lists sorted?** Yes.
2. **Within each list, non-overlapping?** Yes.
3. **Empty list?** Return [].
4. **Point intersection [5,5]?** Valid.

### Edge Cases
1. **One empty:** []
2. **No intersections:** []
3. **Complete overlap:** One list contained in other

---

## Phase 2: High-Level Approach

### Approach: Two Pointers
Compare intervals from both lists.
Intersection: [max(starts), min(ends)] if valid.
Advance pointer of interval that ends first.

**Core Insight:** Sorted input allows single-pass with two pointers.

---

## Phase 3: Python Code

```python
from typing import List


def solve(firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
    """
    Find intersections of two interval lists.
    
    Args:
        firstList: Sorted intervals
        secondList: Sorted intervals
    
    Returns:
        List of intersections
    """
    result = []
    i = j = 0
    
    while i < len(firstList) and j < len(secondList):
        a_start, a_end = firstList[i]
        b_start, b_end = secondList[j]
        
        # Find intersection
        start = max(a_start, b_start)
        end = min(a_end, b_end)
        
        if start <= end:
            result.append([start, end])
        
        # Advance pointer of interval that ends first
        if a_end < b_end:
            i += 1
        else:
            j += 1
    
    return result


def solve_verbose(firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
    """
    More verbose with explanation.
    """
    result = []
    i = j = 0
    
    while i < len(firstList) and j < len(secondList):
        a = firstList[i]
        b = secondList[j]
        
        # Check if intervals overlap
        # They overlap if max(start) <= min(end)
        lo = max(a[0], b[0])
        hi = min(a[1], b[1])
        
        if lo <= hi:
            result.append([lo, hi])
        
        # Move forward the pointer with smaller end
        # That interval can't intersect with any future intervals
        if a[1] < b[1]:
            i += 1
        else:
            j += 1
    
    return result


def solve_merge_all(firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
    """
    Alternative: process all intervals together.
    """
    # Mark intervals with source
    events = []
    for start, end in firstList:
        events.append((start, 0, 1))   # Start of list 1
        events.append((end, 1, 1))     # End of list 1
    for start, end in secondList:
        events.append((start, 0, 2))   # Start of list 2
        events.append((end, 1, 2))     # End of list 2
    
    events.sort()
    
    result = []
    active1 = active2 = 0
    int_start = None
    
    for pos, is_end, source in events:
        if is_end == 0:  # Start
            if source == 1:
                active1 += 1
            else:
                active2 += 1
            if active1 > 0 and active2 > 0 and int_start is None:
                int_start = pos
        else:  # End
            if active1 > 0 and active2 > 0:
                result.append([int_start, pos])
            if source == 1:
                active1 -= 1
            else:
                active2 -= 1
            if active1 == 0 or active2 == 0:
                int_start = None if active1 == 0 or active2 == 0 else pos
    
    return result
```

---

## Phase 4: Dry Run

**Input:**
- firstList: [[0,2],[5,10],[13,23],[24,25]]
- secondList: [[1,5],[8,12],[15,24],[25,26]]

| i | j | A | B | Intersection | Advance |
|---|---|---|---|--------------|---------|
| 0 | 0 | [0,2] | [1,5] | [1,2] | i (2<5) |
| 1 | 0 | [5,10] | [1,5] | [5,5] | j (5<10) |
| 1 | 1 | [5,10] | [8,12] | [8,10] | i (10<12) |
| 2 | 1 | [13,23] | [8,12] | None | j (12<23) |
| 2 | 2 | [13,23] | [15,24] | [15,23] | i (23<24) |
| 3 | 2 | [24,25] | [15,24] | [24,24] | j (24<25) |
| 3 | 3 | [24,25] | [25,26] | [25,25] | i (25<26) |

**Result:** [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M + N)
Each pointer advances at most M and N times.

### Space Complexity: O(M + N)
Result array.

---

## Phase 6: Follow-Up Questions

1. **"Three lists intersection?"**
   → Extend to three pointers.

2. **"Union instead of intersection?"**
   → Merge intervals after combining lists.

3. **"Difference (A - B)?"**
   → Track parts of A not covered by B.
