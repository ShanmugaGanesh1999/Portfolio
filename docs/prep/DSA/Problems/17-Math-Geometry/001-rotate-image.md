# Rotate Image

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 48 | Matrix + Math |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Rotate n×n matrix 90 degrees clockwise in-place.

### Constraints & Clarifying Questions
1. **In-place required?** Yes.
2. **Square matrix only?** Yes.
3. **90 degrees clockwise?** Yes.
4. **Empty matrix?** Handle gracefully.

### Edge Cases
1. **1×1 matrix:** No change
2. **2×2 matrix:** Simple rotation
3. **Odd n:** Middle element stays

---

## Phase 2: High-Level Approach

### Approach: Transpose + Reverse Rows
1. Transpose matrix (swap matrix[i][j] with matrix[j][i])
2. Reverse each row

**Core Insight:** Clockwise 90° = Transpose + Reverse rows.

---

## Phase 3: Python Code

```python
from typing import List


def solve(matrix: List[List[int]]) -> None:
    """
    Rotate matrix 90 degrees clockwise in-place.
    
    Args:
        matrix: n x n matrix
    """
    n = len(matrix)
    
    # Step 1: Transpose (swap across diagonal)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Step 2: Reverse each row
    for i in range(n):
        matrix[i].reverse()


def solve_layer_rotation(matrix: List[List[int]]) -> None:
    """
    Rotate layer by layer (four-way swap).
    """
    n = len(matrix)
    
    for layer in range(n // 2):
        first = layer
        last = n - 1 - layer
        
        for i in range(first, last):
            offset = i - first
            
            # Save top
            top = matrix[first][i]
            
            # Left → Top
            matrix[first][i] = matrix[last - offset][first]
            
            # Bottom → Left
            matrix[last - offset][first] = matrix[last][last - offset]
            
            # Right → Bottom
            matrix[last][last - offset] = matrix[i][last]
            
            # Top → Right
            matrix[i][last] = top


def solve_counter_clockwise(matrix: List[List[int]]) -> None:
    """
    Rotate 90 degrees counter-clockwise.
    """
    n = len(matrix)
    
    # Reverse each row first
    for row in matrix:
        row.reverse()
    
    # Then transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]


def solve_180(matrix: List[List[int]]) -> None:
    """
    Rotate 180 degrees.
    """
    n = len(matrix)
    
    # Reverse all rows
    matrix.reverse()
    
    # Reverse each row
    for row in matrix:
        row.reverse()
```

---

## Phase 4: Dry Run

**Input:**
```
[[1,2,3],
 [4,5,6],
 [7,8,9]]
```

**Step 1: Transpose**
```
[[1,4,7],
 [2,5,8],
 [3,6,9]]
```

**Step 2: Reverse rows**
```
[[7,4,1],
 [8,5,2],
 [9,6,3]]
```

**Result:** Matrix rotated 90° clockwise ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
Visit each cell once.

### Space Complexity: O(1)
In-place modification.

---

## Phase 6: Follow-Up Questions

1. **"Rotate counter-clockwise?"**
   → Reverse rows first, then transpose.

2. **"Rotate by k*90 degrees?"**
   → k % 4 rotations (optimize).

3. **"Non-square matrix?"**
   → Cannot rotate in-place; need new matrix.
