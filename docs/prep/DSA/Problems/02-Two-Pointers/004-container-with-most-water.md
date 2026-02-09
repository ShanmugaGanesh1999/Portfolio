# Container With Most Water

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 11 | Two Pointers (Greedy) |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find two lines that together with the x-axis form a container holding the most water.

### Constraints & Clarifying Questions
1. **Can lines have zero height?** Yes, but container would hold no water.
2. **Are there at least 2 lines?** Yes, n ≥ 2.
3. **What determines water volume?** min(height[i], height[j]) × (j - i).
4. **Can we slant the container?** No, it's strictly vertical.
5. **Maximum array size?** Up to 10^5.

### Edge Cases
1. **Two elements:** `height = [1, 1]` → 1
2. **Monotonic array:** `height = [1, 2, 3, 4]` → 4 (first and last: min(1,4) × 3 = 3, but 2 × 2 = 4 at indices 1,3)
3. **Single tall line:** `height = [1, 100, 1]` → 2

---

## Phase 2: High-Level Approach

### Option 1: Naïve (All Pairs)
Check every pair of lines.
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: Optimal (Two Pointers)
Start with widest container (leftmost and rightmost lines). Move the pointer pointing to shorter line inward—keeping the shorter side can never improve area.

**Core Insight:** Moving the shorter line might find a taller one, potentially increasing area despite reduced width; moving the taller line can only decrease area.

### Why Optimal?
Eliminates provably suboptimal configurations without checking them, achieving O(N) time.

---

## Phase 3: Python Code

```python
def solve(heights: list[int]) -> int:
    """
    Find maximum water container area.
    
    Args:
        heights: Array of line heights
    
    Returns:
        Maximum area between any two lines
    """
    left = 0
    right = len(heights) - 1
    max_area = 0
    
    while left < right:  # O(N)
        # Calculate current container area
        width = right - left
        height = min(heights[left], heights[right])
        current_area = width * height
        
        max_area = max(max_area, current_area)  # O(1)
        
        # Move pointer at shorter line inward
        # (moving the taller one can only decrease or maintain area)
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    
    return max_area


def solve_with_optimization(heights: list[int]) -> int:
    """
    With skip optimization for repeated shorter heights.
    """
    left = 0
    right = len(heights) - 1
    max_area = 0
    
    while left < right:
        current_area = min(heights[left], heights[right]) * (right - left)
        max_area = max(max_area, current_area)
        
        if heights[left] < heights[right]:
            current_height = heights[left]
            # Skip all lines shorter or equal (they can't improve)
            while left < right and heights[left] <= current_height:
                left += 1
        else:
            current_height = heights[right]
            while left < right and heights[right] <= current_height:
                right -= 1
    
    return max_area
```

---

## Phase 4: Dry Run

**Input:** `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

| Step | left | right | height[L] | height[R] | Width | Height | Area | max_area | Move |
|------|------|-------|-----------|-----------|-------|--------|------|----------|------|
| 1 | 0 | 8 | 1 | 7 | 8 | 1 | 8 | 8 | L++ |
| 2 | 1 | 8 | 8 | 7 | 7 | 7 | 49 | 49 | R-- |
| 3 | 1 | 7 | 8 | 3 | 6 | 3 | 18 | 49 | R-- |
| 4 | 1 | 6 | 8 | 8 | 5 | 8 | 40 | 49 | R-- |
| 5 | 1 | 5 | 8 | 4 | 4 | 4 | 16 | 49 | R-- |
| 6 | 1 | 4 | 8 | 5 | 3 | 5 | 15 | 49 | R-- |
| 7 | 1 | 3 | 8 | 2 | 2 | 2 | 4 | 49 | R-- |
| 8 | 1 | 2 | 8 | 6 | 1 | 6 | 6 | 49 | R-- |
| 9 | 1 | 1 | — | — | — | — | — | — | Exit |

**Result:** `49`

**Verification:** Container at indices (1, 8) with heights (8, 7): min(8,7) × 7 = 49 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Each iteration moves either left or right pointer. Total movements = N-1.

### Space Complexity: O(1)
Only constant extra variables for pointers and area tracking.

---

## Phase 6: Follow-Up Questions

1. **"Why does moving the shorter line pointer work?"**
   → Container area is limited by shorter line. Moving the taller line can only decrease width while keeping height bounded by the shorter line—area can't improve.

2. **"What if we need to return the indices instead of just the area?"**
   → Track `best_left` and `best_right` when updating `max_area`.

3. **"What if lines have varying widths (not just unit width)?"**
   → Would need different approach; two-pointer greedy doesn't directly apply. Might use segment tree or different DP formulation.
