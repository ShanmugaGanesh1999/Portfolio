# Largest Rectangle in Histogram

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 84 | Monotonic Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find largest rectangular area in histogram where bars have width 1.

### Constraints & Clarifying Questions
1. **Bar width?** All bars have width 1.
2. **Heights non-negative?** Yes, 0 to 10^4.
3. **Number of bars?** 1 to 10^5.
4. **Empty histogram?** Not possible (at least 1 bar).
5. **Area calculation?** Width × Height (rectangle must fit under bars).

### Edge Cases
1. **Single bar:** Area = height.
2. **All same height:** Area = n × height.
3. **Decreasing heights:** Each bar only extends itself.

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Check All Pairs)
For each bar, expand left and right while height allows.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Monotonic Stack)
Maintain stack of increasing heights. When decreasing height found, calculate areas for taller bars.

**Core Insight:** Each bar's maximum rectangle is limited by first shorter bar on left and right. Use stack to find these boundaries.

---

## Phase 3: Python Code

```python
def solve(heights: list[int]) -> int:
    """
    Find largest rectangle area in histogram.
    
    Args:
        heights: Bar heights in histogram
    
    Returns:
        Area of largest rectangle
    """
    stack = []  # Stack of indices (increasing heights)
    max_area = 0
    
    for i, h in enumerate(heights):  # O(N)
        start = i
        
        # Pop taller bars and calculate their max area
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            width = i - idx
            max_area = max(max_area, height * width)
            start = idx  # Current bar can extend back to popped bar's start
        
        stack.append((start, h))
    
    # Process remaining bars (extend to end)
    for idx, height in stack:
        width = len(heights) - idx
        max_area = max(max_area, height * width)
    
    return max_area


def solve_with_sentinel(heights: list[int]) -> int:
    """
    Version with sentinel values to simplify code.
    """
    heights = [0] + heights + [0]  # Add sentinels
    stack = [0]  # Start with left sentinel
    max_area = 0
    
    for i in range(1, len(heights)):
        while heights[i] < heights[stack[-1]]:
            h = heights[stack.pop()]
            w = i - stack[-1] - 1
            max_area = max(max_area, h * w)
        stack.append(i)
    
    return max_area
```

---

## Phase 4: Dry Run

**Input:** `heights = [2, 1, 5, 6, 2, 3]`

| i | h | Stack (idx, h) | Action | Area calculated |
|---|---|----------------|--------|-----------------|
| 0 | 2 | [(0, 2)] | push | - |
| 1 | 1 | [(0, 1)] | pop (2), push (0,1) | 2×1=2 |
| 2 | 5 | [(0,1), (2,5)] | push | - |
| 3 | 6 | [(0,1), (2,5), (3,6)] | push | - |
| 4 | 2 | [(0,1), (2,2)] | pop 6: 6×1=6, pop 5: 5×2=10 | 6, 10 |
| 5 | 3 | [(0,1), (2,2), (5,3)] | push | - |
| end | - | process remaining | 3×1=3, 2×4=8, 1×6=6 | 3, 8, 6 |

**Max Area:** `10`

**Visualization:**
```
    █
  █ █
  █ █   █
█ █ █ █ █
█ █ █ █ █ █
2 1 5 6 2 3

Maximum rectangle: height=5, width=2 (columns 2-3) → area=10
```

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each bar pushed and popped at most once.

### Space Complexity: O(N)
- Stack may hold all indices (strictly increasing heights).

---

## Phase 6: Follow-Up Questions

1. **"How is this related to maximal rectangle in binary matrix?"**
   → Build histogram row by row; apply this algorithm to each row's histogram.

2. **"What if bars have different widths?"**
   → Modify width calculation; use cumulative widths.

3. **"How to find the actual rectangle (coordinates)?"**
   → Track indices when updating max_area; store left boundary and height.
