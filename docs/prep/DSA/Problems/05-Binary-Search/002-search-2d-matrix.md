# Search a 2D Matrix

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 74 | Binary Search |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Search target in row-wise and column-wise sorted matrix where each row's first element > previous row's last element.

### Constraints & Clarifying Questions
1. **Matrix properties?** Sorted left-to-right, top row < bottom row.
2. **Can treat as 1D array?** Yes, due to sorted property.
3. **Duplicates?** No.
4. **Target not found?** Return False.
5. **Empty matrix?** Return False.

### Edge Cases
1. **Single element:** Matrix is [[5]], target = 5 → True
2. **Target smaller than all:** Return False
3. **Target larger than all:** Return False

---

## Phase 2: High-Level Approach

### Option 1: Two Binary Searches
First find row, then search within row.
- **Time:** O(log M + log N)
- **Space:** O(1)

### Option 2: Single Binary Search (Treat as 1D)
Flatten matrix virtually; convert 1D index to 2D coordinates.

**Core Insight:** Matrix can be treated as sorted 1D array of size M×N.

---

## Phase 3: Python Code

```python
def solve(matrix: list[list[int]], target: int) -> bool:
    """
    Search target in sorted 2D matrix.
    
    Args:
        matrix: Row and column sorted matrix
        target: Value to find
    
    Returns:
        True if target exists
    """
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:  # O(log(M×N))
        mid = left + (right - left) // 2
        
        # Convert 1D index to 2D coordinates
        row = mid // n
        col = mid % n
        value = matrix[row][col]
        
        if value == target:
            return True
        elif value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False


def solve_two_binary(matrix: list[list[int]], target: int) -> bool:
    """
    Two binary searches: find row, then find in row.
    """
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    
    # Binary search for row
    top, bottom = 0, m - 1
    while top <= bottom:
        mid_row = (top + bottom) // 2
        if target < matrix[mid_row][0]:
            bottom = mid_row - 1
        elif target > matrix[mid_row][-1]:
            top = mid_row + 1
        else:
            # Target could be in this row
            break
    
    if top > bottom:
        return False
    
    row = (top + bottom) // 2
    
    # Binary search in row
    left, right = 0, n - 1
    while left <= right:
        mid = (left + right) // 2
        if matrix[row][mid] == target:
            return True
        elif matrix[row][mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False
```

---

## Phase 4: Dry Run

**Input:**
```
matrix = [
    [1,  3,  5,  7],
    [10, 11, 16, 20],
    [23, 30, 34, 60]
], target = 3
```

M = 3, N = 4, total elements = 12

| Iteration | left | right | mid | (row, col) | value | Action |
|-----------|------|-------|-----|------------|-------|--------|
| 1 | 0 | 11 | 5 | (1, 1) | 11 | 11 > 3, right = 4 |
| 2 | 0 | 4 | 2 | (0, 2) | 5 | 5 > 3, right = 1 |
| 3 | 0 | 1 | 0 | (0, 0) | 1 | 1 < 3, left = 1 |
| 4 | 1 | 1 | 1 | (0, 1) | 3 | 3 = 3, return True |

**Result:** `True`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log(M × N)) = O(log M + log N)
Binary search on M×N elements.

### Space Complexity: O(1)
Constant extra space.

---

## Phase 6: Follow-Up Questions

1. **"What about Search 2D Matrix II (different sorting)?"**
   → Matrix where each row and column sorted but rows not related; use staircase search O(M+N).

2. **"What if we need count of elements ≤ target?"**
   → Use binary search per row or staircase approach.

3. **"What about unsorted matrix?"**
   → Must check all elements: O(M × N).
