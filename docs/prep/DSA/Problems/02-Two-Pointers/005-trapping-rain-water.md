# Trapping Rain Water

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 42 | Two Pointers / DP / Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Calculate total water that can be trapped after raining, given elevation map bars.

### Constraints & Clarifying Questions
1. **Bar width?** Each bar has unit width.
2. **Can heights be zero?** Yes.
3. **Minimum bars?** At least 1 bar.
4. **Water can escape at edges?** Yes, only trapped between taller bars.
5. **Maximum array size?** Up to 2 × 10^4.

### Edge Cases
1. **Flat surface:** `height = [1, 1, 1]` → 0
2. **Descending:** `height = [3, 2, 1]` → 0
3. **Single bar:** `height = [1]` → 0

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Per-bar calculation)
For each bar, find tallest to left and right; water at bar = min(maxLeft, maxRight) - height[i].
- **Time:** O(N²)
- **Space:** O(1)

### Option 2: DP (Precompute max arrays)
Precompute left_max and right_max arrays, then calculate water.
- **Time:** O(N)
- **Space:** O(N)

### Option 3: Optimal (Two Pointers)
Track left_max and right_max while moving pointers inward. Process the side with smaller max since that determines water level for that position.

**Core Insight:** Water at position depends on the minimum of max heights on both sides. If left_max < right_max, water at left position is determined by left_max regardless of actual right values.

### Why Optimal?
Single pass with O(1) space by exploiting the property that smaller max determines water level.

---

## Phase 3: Python Code

```python
def solve(heights: list[int]) -> int:
    """
    Calculate trapped rain water using two pointers.
    
    Args:
        heights: Elevation map (bar heights)
    
    Returns:
        Total units of water that can be trapped
    """
    if not heights:
        return 0
    
    left = 0
    right = len(heights) - 1
    left_max = heights[left]
    right_max = heights[right]
    total_water = 0
    
    while left < right:  # O(N)
        if left_max < right_max:
            # Process left side - water level determined by left_max
            left += 1
            left_max = max(left_max, heights[left])
            total_water += left_max - heights[left]  # Water above current bar
        else:
            # Process right side - water level determined by right_max
            right -= 1
            right_max = max(right_max, heights[right])
            total_water += right_max - heights[right]  # Water above current bar
    
    return total_water


def solve_dp(heights: list[int]) -> int:
    """
    DP approach with precomputed arrays.
    Clearer logic but uses O(N) space.
    """
    if not heights:
        return 0
    
    n = len(heights)
    left_max = [0] * n
    right_max = [0] * n
    
    # Fill left_max
    left_max[0] = heights[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i-1], heights[i])
    
    # Fill right_max
    right_max[-1] = heights[-1]
    for i in range(n-2, -1, -1):
        right_max[i] = max(right_max[i+1], heights[i])
    
    # Calculate water
    total = 0
    for i in range(n):
        total += min(left_max[i], right_max[i]) - heights[i]
    
    return total
```

---

## Phase 4: Dry Run

**Input:** `heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`

| Step | left | right | L_max | R_max | Condition | Action | Water |
|------|------|-------|-------|-------|-----------|--------|-------|
| 1 | 0 | 11 | 0 | 1 | 0<1 | L++, L_max=1 | 0 |
| 2 | 1 | 11 | 1 | 1 | 1≤1 | R--, R_max=2 | 0 |
| 3 | 1 | 10 | 1 | 2 | 1<2 | L++, L_max=1 | 1 |
| 4 | 2 | 10 | 1 | 2 | 1<2 | L++, L_max=2 | 0 |
| 5 | 3 | 10 | 2 | 2 | 2≤2 | R--, R_max=2 | 0 |
| 6 | 3 | 9 | 2 | 2 | 2≤2 | R--, R_max=2 | 1 |
| 7 | 3 | 8 | 2 | 2 | 2≤2 | R--, R_max=3 | 0 |
| 8 | 3 | 7 | 2 | 3 | 2<3 | L++, L_max=2 | 1 |
| 9 | 4 | 7 | 2 | 3 | 2<3 | L++, L_max=2 | 2 |
| 10 | 5 | 7 | 2 | 3 | 2<3 | L++, L_max=2 | 1 |
| 11 | 6 | 7 | 2 | 3 | 2<3 | L++, L_max=3 | 0 |
| 12 | 7 | 7 | — | — | exit | — | — |

**Total Water:** 0+0+1+0+0+1+0+1+2+1+0 = **6**

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass with two pointers, each position visited exactly once.

### Space Complexity: O(1)
Only constant variables: pointers and running max values.

---

## Phase 6: Follow-Up Questions

1. **"How does the stack-based approach work?"**
   → Use decreasing stack; when taller bar found, pop and calculate water in the "valley" formed. Good for understanding water layers.

2. **"What if we have 2D terrain?"**
   → Use BFS/DFS from boundaries, processing cells in order of height using min-heap. O(MN log(MN)).

3. **"What if we need to visualize the water levels?"**
   → Store water height at each position: `water[i] = min(left_max[i], right_max[i]) - height[i]`.
