# Range Sum Query 2D - Immutable

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 304 | 2D Prefix Sum |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Design a data structure for efficient sum queries over rectangular regions in a 2D matrix.

### Constraints & Clarifying Questions
1. **Is the matrix immutable?** Yes, no updates after initialization.
2. **How many queries?** Up to 10^4.
3. **Matrix dimensions?** Up to 200 × 200.
4. **Can values be negative?** Yes.
5. **Are query coordinates always valid?** Yes.

### Edge Cases
1. **Single cell query:** row1=col1=row2=col2 → Just that element
2. **Full matrix query:** (0, 0) to (m-1, n-1) → Total sum
3. **Single row/column:** Either width or height is 1

---

## Phase 2: High-Level Approach

### Option 1: Naïve (Per-Query Sum)
Sum all elements in the rectangle for each query.
- **Time:** O(M × N) per query
- **Space:** O(1)

### Option 2: Optimal (2D Prefix Sum)
Precompute prefix[i][j] = sum of rectangle (0,0) to (i-1, j-1). Query uses inclusion-exclusion: add bottom-right, subtract overlaps, add back double-subtracted corner.

**Core Insight:** Any rectangular sum can be computed from four corner prefix values using inclusion-exclusion principle.

### Why Optimal?
O(M × N) preprocessing enables O(1) queries regardless of rectangle size.

---

## Phase 3: Python Code

```python
class NumMatrix:
    """
    2D range sum query using prefix sums.
    Query any rectangle in O(1) after O(M*N) initialization.
    """
    
    def __init__(self, matrix: list[list[int]]):
        """
        Build 2D prefix sum array.
        
        Args:
            matrix: 2D input matrix for range sum queries
        
        Time: O(M * N)
        Space: O(M * N)
        """
        if not matrix or not matrix[0]:
            self.prefix = [[]]
            return
        
        rows, cols = len(matrix), len(matrix[0])
        
        # prefix[i][j] = sum of matrix[0..i-1][0..j-1]
        self.prefix = [[0] * (cols + 1) for _ in range(rows + 1)]
        
        for row in range(rows):  # O(M * N)
            for col in range(cols):
                # Include current cell + left prefix + top prefix - overlap
                self.prefix[row + 1][col + 1] = (
                    matrix[row][col] +
                    self.prefix[row][col + 1] +      # Sum above
                    self.prefix[row + 1][col] -      # Sum to left
                    self.prefix[row][col]            # Subtract double-counted corner
                )
    
    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        """
        Return sum of rectangle from (row1, col1) to (row2, col2).
        
        Args:
            row1, col1: Top-left corner (inclusive)
            row2, col2: Bottom-right corner (inclusive)
        
        Returns:
            Sum of all elements in the specified rectangle
        
        Time: O(1)
        """
        # Inclusion-exclusion principle
        return (
            self.prefix[row2 + 1][col2 + 1] -    # Full rectangle to (row2, col2)
            self.prefix[row1][col2 + 1] -        # Remove region above
            self.prefix[row2 + 1][col1] +        # Remove region to left
            self.prefix[row1][col1]              # Add back double-removed corner
        )
```

---

## Phase 4: Dry Run

**Input Matrix:**
```
matrix = [
    [3, 0, 1, 4, 2],
    [5, 6, 3, 2, 1],
    [1, 2, 0, 1, 5],
    [4, 1, 0, 1, 7],
    [1, 0, 3, 0, 5]
]
```

**Build Prefix Sum (showing partial computation):**

For cell (1,1) containing 6:
```
prefix[2][2] = matrix[1][1] + prefix[1][2] + prefix[2][1] - prefix[1][1]
             = 6 + 3 + 8 - 3
             = 14
```

**Prefix sum array (simplified view):**
```
prefix = [
    [0,  0,  0,  0,  0,  0],
    [0,  3,  3,  4,  8, 10],
    [0,  8, 14, 18, 24, 27],
    [0,  9, 17, 21, 28, 36],
    [0, 13, 22, 26, 34, 49],
    [0, 14, 23, 30, 38, 58]
]
```

**Query: sumRegion(2, 1, 4, 3)**
- Top-left: (2, 1), Bottom-right: (4, 3)

```
result = prefix[5][4] - prefix[2][4] - prefix[5][1] + prefix[2][1]
       = 38 - 24 - 14 + 8
       = 8
```

**Manual verification:**
```
[2, 0, 1]    → 2+0+1 = 3
[1, 0, 1]    → 1+0+1 = 2
[0, 3, 0]    → 0+3+0 = 3
Total = 8 ✓
```

---

## Phase 5: Complexity Analysis

### Time Complexity:
- **Initialization:** O(M × N) to build prefix array
- **Query:** O(1) per sumRegion call using 4 lookups

### Space Complexity: O(M × N)
Prefix sum array has (M+1) × (N+1) elements.

---

## Phase 6: Follow-Up Questions

1. **"What if the matrix can be updated?"**
   → Use 2D Segment Tree or 2D Binary Indexed Tree for O(log M × log N) updates and queries.

2. **"How would you extend to 3D?"**
   → 3D prefix sums with inclusion-exclusion on 8 corners; O(1) query, O(L×M×N) space.

3. **"What if matrix is sparse?"**
   → Store only non-zero values in coordinate list; compute prefix sums dynamically or use sparse matrix representations.
