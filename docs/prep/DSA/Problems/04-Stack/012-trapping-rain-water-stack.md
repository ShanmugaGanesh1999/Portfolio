# Trapping Rain Water (Stack Approach)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 42 | Monotonic Stack |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Calculate water trapped between bars after rain.

### Constraints & Clarifying Questions
1. **Bar width?** Each bar has width 1.
2. **Negative heights?** No, 0 to 10^5.
3. **Minimum bars?** At least 1.
4. **Water can't stay on edges?** Correct, needs walls on both sides.
5. **Expected approach?** Stack-based (also solvable with two pointers, DP).

### Edge Cases
1. **Flat surface:** `[1,1,1]` → 0
2. **V-shape:** `[2,0,2]` → 2
3. **Decreasing:** `[3,2,1]` → 0

---

## Phase 2: High-Level Approach

### Approach: Monotonic Stack
Maintain decreasing stack. When increasing height found, calculate trapped water in "valleys".

**Core Insight:** Water is trapped horizontally between bars; stack helps find left boundary for each valley.

---

## Phase 3: Python Code

```python
def solve(height: list[int]) -> int:
    """
    Calculate trapped rain water using stack approach.
    
    Args:
        height: Bar heights
    
    Returns:
        Total units of trapped water
    """
    stack = []  # Stack of indices (decreasing heights)
    water = 0
    
    for i, h in enumerate(height):  # O(N)
        # While current is taller than stack top, we found a valley
        while stack and height[stack[-1]] < h:
            bottom = stack.pop()  # Valley bottom
            
            if not stack:
                break  # No left wall
            
            left = stack[-1]  # Left wall index
            
            # Calculate water trapped above bottom
            width = i - left - 1
            bounded_height = min(height[left], h) - height[bottom]
            water += width * bounded_height
        
        stack.append(i)
    
    return water


def solve_two_pointers(height: list[int]) -> int:
    """
    Alternative: Two pointers approach.
    """
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    
    return water
```

---

## Phase 4: Dry Run

**Input:** `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`

| i | h | Stack | Action | Water added |
|---|---|-------|--------|-------------|
| 0 | 0 | [0] | push | - |
| 1 | 1 | [1] | pop 0, push 1 | 0 (no left) |
| 2 | 0 | [1,2] | push | - |
| 3 | 2 | [3] | pop 2: w=1×min(1,2)-0=1; pop 1; push 3 | 1 |
| 4 | 1 | [3,4] | push | - |
| 5 | 0 | [3,4,5] | push | - |
| 6 | 1 | [3,4,6] | pop 5: w=1×min(1,1)-0=1 | 1 |
| 7 | 3 | [7] | pop 6: w=2×min(1,3)-1=0; pop 4: w=3×min(2,3)-1=3; pop 3: none | 3 |
| ... | ... | ... | ... | ... |

**Total Water:** `6`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
- Each index pushed and popped at most once.

### Space Complexity: O(N)
- Stack may hold all indices.

---

## Phase 6: Follow-Up Questions

1. **"Compare stack vs two-pointer vs DP approaches?"**
   → All O(N) time. Two-pointer is O(1) space. DP uses O(N) for precomputing maxes. Stack processes valleys horizontally.

2. **"What if bars have different widths?"**
   → Modify width calculation; track cumulative widths.

3. **"3D version (trapping water in matrix)?"**
   → Use BFS from borders with priority queue; process cells from lowest boundary inward.
