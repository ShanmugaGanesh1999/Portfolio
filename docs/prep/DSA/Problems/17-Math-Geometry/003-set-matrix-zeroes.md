# Set Matrix Zeroes

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 73 | Matrix + In-Place |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
If element is 0, set entire row and column to 0. Do in-place.

### Constraints & Clarifying Questions
1. **In-place O(1) space?** Optimal.
2. **Original zeros only trigger?** Yes.
3. **Empty matrix?** Handle.
4. **All zeros?** All become zeros.

### Edge Cases
1. **No zeros:** No change
2. **All zeros:** No change
3. **Single zero:** Row and column zeroed

---

## Phase 2: High-Level Approach

### Approach: Use First Row/Column as Markers
Use first row and first column to mark which rows/cols should be zeroed.
Track if first row/col themselves need zeroing.

**Core Insight:** O(1) space using matrix itself as storage.

---

## Phase 3: Python Code

```python
from typing import List


def solve(matrix: List[List[int]]) -> None:
    """
    Set row and column to 0 if cell is 0. In-place.
    
    Args:
        matrix: m x n matrix
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Track if first row/col need to be zeroed
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Use first row/col as markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0  # Mark row
                matrix[0][j] = 0  # Mark column
    
    # Zero cells based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first row
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    # Handle first column
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0


def solve_extra_space(matrix: List[List[int]]) -> None:
    """
    O(m+n) space solution.
    """
    m, n = len(matrix), len(matrix[0])
    
    zero_rows = set()
    zero_cols = set()
    
    # Find zeros
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                zero_rows.add(i)
                zero_cols.add(j)
    
    # Zero rows
    for i in zero_rows:
        for j in range(n):
            matrix[i][j] = 0
    
    # Zero columns
    for j in zero_cols:
        for i in range(m):
            matrix[i][j] = 0


def solve_single_variable(matrix: List[List[int]]) -> None:
    """
    Using single variable for first column.
    """
    m, n = len(matrix), len(matrix[0])
    first_col_zero = False
    
    for i in range(m):
        if matrix[i][0] == 0:
            first_col_zero = True
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Zero cells (bottom to top to preserve markers)
    for i in range(m - 1, -1, -1):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
        if first_col_zero:
            matrix[i][0] = 0
```

---

## Phase 4: Dry Run

**Input:**
```
[[1,1,1],
 [1,0,1],
 [1,1,1]]
```

**Step 1:** Find flags
- first_row_zero = False
- first_col_zero = False

**Step 2:** Mark using first row/col
- matrix[1][1] = 0 → matrix[1][0] = 0, matrix[0][1] = 0

**Matrix after marking:**
```
[[1,0,1],
 [0,0,1],
 [1,1,1]]
```

**Step 3:** Zero based on markers
```
[[1,0,1],
 [0,0,0],
 [1,0,1]]
```

**Result:** Row 1 and Col 1 zeroed ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(M × N)
Two passes through matrix.

### Space Complexity: O(1)
Using matrix itself as storage.

---

## Phase 6: Follow-Up Questions

1. **"Set to -1 instead of 0?"**
   → Same approach, different marker handling.

2. **"Only adjacent cells (not full row/col)?"**
   → BFS/DFS from each zero.

3. **"Streaming input?"**
   → Cannot do in-place with O(1) space.
