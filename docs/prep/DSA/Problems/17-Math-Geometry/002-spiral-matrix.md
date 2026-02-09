# Spiral Matrix

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 54 | Matrix Traversal |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Return elements of matrix in spiral order.

### Constraints & Clarifying Questions
1. **Rectangular matrix?** Yes (m×n).
2. **Empty matrix?** Return [].
3. **Single row/column?** Handle.
4. **Direction?** Right → Down → Left → Up → repeat.

### Edge Cases
1. **Empty:** []
2. **Single element:** [element]
3. **Single row:** Return row
4. **Single column:** Return column

---

## Phase 2: High-Level Approach

### Approach: Layer by Layer
Use boundaries: top, bottom, left, right.
Traverse each direction, shrink boundaries.

**Core Insight:** Track four boundaries; shrink as we traverse.

---

## Phase 3: Python Code

```python
from typing import List


def solve(matrix: List[List[int]]) -> List[int]:
    """
    Return elements in spiral order.
    
    Args:
        matrix: m x n matrix
    
    Returns:
        Elements in spiral order
    """
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse right
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Traverse down
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        # Traverse left (if rows remaining)
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Traverse up (if cols remaining)
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result


def solve_direction(matrix: List[List[int]]) -> List[int]:
    """
    Direction-based approach.
    """
    if not matrix or not matrix[0]:
        return []
    
    m, n = len(matrix), len(matrix[0])
    result = []
    seen = [[False] * n for _ in range(m)]
    
    # Directions: right, down, left, up
    dr = [0, 1, 0, -1]
    dc = [1, 0, -1, 0]
    
    r = c = di = 0
    
    for _ in range(m * n):
        result.append(matrix[r][c])
        seen[r][c] = True
        
        # Try next position
        nr, nc = r + dr[di], c + dc[di]
        
        # Check if need to turn
        if not (0 <= nr < m and 0 <= nc < n and not seen[nr][nc]):
            di = (di + 1) % 4
            nr, nc = r + dr[di], c + dc[di]
        
        r, c = nr, nc
    
    return result


def solve_recursive(matrix: List[List[int]]) -> List[int]:
    """
    Recursive peeling approach.
    """
    if not matrix or not matrix[0]:
        return []
    
    # First row
    result = list(matrix[0])
    
    # Remaining rows
    if len(matrix) > 1:
        # Rotate remaining matrix counter-clockwise and recurse
        remaining = list(zip(*matrix[1:]))[::-1]
        result.extend(solve_recursive([list(row) for row in remaining]))
    
    return result
```

---

## Phase 4: Dry Run

**Input:**
```
[[1,2,3],
 [4,5,6],
 [7,8,9]]
```

| Step | Direction | Elements | Boundaries |
|------|-----------|----------|------------|
| 1 | Right | 1,2,3 | top=1 |
| 2 | Down | 6,9 | right=1 |
| 3 | Left | 8,7 | bottom=1 |
| 4 | Up | 4 | left=1 |
| 5 | Right | 5 | done |

**Result:** [1,2,3,6,9,8,7,4,5]

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Visit each cell once.

### Space Complexity: O(1)
Excluding output array.

---

## Phase 6: Follow-Up Questions

1. **"Counter-clockwise spiral?"**
   → Start with down, then right, etc.

2. **"Fill matrix in spiral order?"**
   → Same traversal, fill values 1 to m×n.

3. **"Spiral from center outward?"**
   → Start from center, expand boundaries.
