# Minimum Number of Arrows to Burst Balloons

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 452 | Greedy + Intervals |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum arrows to burst all balloons. Arrow at x bursts all balloons containing x.

### Constraints & Clarifying Questions
1. **Balloon = interval [start, end]?** Yes.
2. **Inclusive endpoints?** Yes.
3. **Arrow at boundary works?** Yes.
4. **Empty list?** Return 0.

### Edge Cases
1. **No balloons:** 0
2. **Non-overlapping:** Count of balloons
3. **All overlapping:** 1 arrow

---

## Phase 2: High-Level Approach

### Approach: Greedy - Sort by End Point
Sort by end coordinate. Shoot at each balloon's end point if not already burst.

**Core Insight:** Shooting at rightmost point of earliest-ending balloon bursts maximum overlapping balloons.

---

## Phase 3: Python Code

```python
from typing import List


def solve(points: List[List[int]]) -> int:
    """
    Minimum arrows to burst all balloons.
    
    Args:
        points: List of [start, end] balloon intervals
    
    Returns:
        Minimum arrows needed
    """
    if not points:
        return 0
    
    # Sort by end point
    points.sort(key=lambda x: x[1])
    
    arrows = 1
    arrow_pos = points[0][1]  # Shoot at end of first balloon
    
    for start, end in points[1:]:
        # If balloon starts after arrow position, need new arrow
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end
    
    return arrows


def solve_sort_start(points: List[List[int]]) -> int:
    """
    Alternative: sort by start, track min end.
    """
    if not points:
        return 0
    
    points.sort(key=lambda x: x[0])
    
    arrows = 1
    min_end = points[0][1]  # Track minimum end in current group
    
    for start, end in points[1:]:
        if start > min_end:
            # New group
            arrows += 1
            min_end = end
        else:
            # Overlapping, update min end
            min_end = min(min_end, end)
    
    return arrows


def solve_verbose(points: List[List[int]]) -> int:
    """
    More verbose with explanation.
    """
    if not points:
        return 0
    
    # Sort by end point (greedy: shoot earliest end first)
    balloons = sorted(points, key=lambda x: x[1])
    
    arrows = 0
    current_arrow = float('-inf')
    
    for start, end in balloons:
        # If this balloon starts after current arrow position
        if start > current_arrow:
            # Need a new arrow, shoot at this balloon's end
            arrows += 1
            current_arrow = end
        # Otherwise, current arrow already bursts this balloon
    
    return arrows
```

---

## Phase 4: Dry Run

**Input:** `[[10,16],[2,8],[1,6],[7,12]]`

**Sorted by end:** [[1,6], [2,8], [7,12], [10,16]]

| Balloon | arrow_pos | Overlaps? | Action |
|---------|-----------|-----------|--------|
| [1,6] | -∞ | No | arrows=1, pos=6 |
| [2,8] | 6 | 2≤6 ✓ | Skip |
| [7,12] | 6 | 7>6 | arrows=2, pos=12 |
| [10,16] | 12 | 10≤12 ✓ | Skip |

**Arrows at x=6 and x=12**

**Result:** 2

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log N)
Sorting dominates.

### Space Complexity: O(1)
Excluding sort space.

---

## Phase 6: Follow-Up Questions

1. **"Return arrow positions?"**
   → Track positions when incrementing arrows.

2. **"Weighted balloons (minimize weight)?"**
   → Different problem; may need DP.

3. **"3D balloons (spheres)?"**
   → Much more complex geometry.
