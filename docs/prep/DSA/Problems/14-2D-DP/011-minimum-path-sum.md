# Minimum Path Sum

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 64 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find path from top-left to bottom-right with minimum sum. Move only right or down.

### Constraints & Clarifying Questions
1. **Grid values?** Non-negative integers.
2. **Empty grid?** Return 0.
3. **1×1 grid?** Return that value.
4. **Can modify input?** Often yes for space optimization.

### Edge Cases
1. **1×1:** Return grid[0][0]
2. **Single row/column:** Sum all
3. **All zeros:** Return 0

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = min path sum to reach (i,j).
dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).

**Core Insight:** Can only come from top or left.

---

## Phase 3: Python Code

```python
from typing import List


def solve(grid: List[List[int]]) -> int:
    """
    Find minimum path sum.
    
    Args:
        grid: 2D grid of non-negative integers
    
    Returns:
        Minimum path sum
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    # Space-optimized: single row
    dp = [0] * n
    
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0:
                dp[j] = grid[0][0]
            elif i == 0:
                dp[j] = dp[j - 1] + grid[i][j]
            elif j == 0:
                dp[j] = dp[j] + grid[i][j]
            else:
                dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]
    
    return dp[n - 1]


def solve_2d(grid: List[List[int]]) -> int:
    """
    Full 2D DP.
    """
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    dp[0][0] = grid[0][0]
    
    # First row
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    
    # First column
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
    
    return dp[m - 1][n - 1]


def solve_in_place(grid: List[List[int]]) -> int:
    """
    Modify input grid (if allowed).
    """
    m, n = len(grid), len(grid[0])
    
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0:
                continue
            elif i == 0:
                grid[i][j] += grid[i][j - 1]
            elif j == 0:
                grid[i][j] += grid[i - 1][j]
            else:
                grid[i][j] += min(grid[i - 1][j], grid[i][j - 1])
    
    return grid[m - 1][n - 1]


def solve_with_path(grid: List[List[int]]) -> tuple:
    """
    Return min sum and path.
    """
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    dp[0][0] = grid[0][0]
    
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
    
    # Backtrack path
    path = [(m - 1, n - 1)]
    i, j = m - 1, n - 1
    while i > 0 or j > 0:
        if i == 0:
            j -= 1
        elif j == 0:
            i -= 1
        elif dp[i - 1][j] < dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
        path.append((i, j))
    
    return dp[m - 1][n - 1], list(reversed(path))
```

---

## Phase 4: Dry Run

**Input:**
```
[[1, 3, 1],
 [1, 5, 1],
 [4, 2, 1]]
```

**DP Table:**
```
[[1, 4, 5],
 [2, 7, 6],
 [6, 8, 7]]
```

| (i,j) | grid | from top | from left | dp[i][j] |
|-------|------|----------|-----------|----------|
| (0,0) | 1 | - | - | 1 |
| (1,0) | 1 | 1 | - | 2 |
| (2,1) | 2 | 7 | 6 | 6+2=8 |
| (2,2) | 1 | 6 | 8 | 6+1=7 |

**Path:** (0,0)→(0,1)→(0,2)→(1,2)→(2,2) = 1+3+1+1+1=7

**Result:** 7

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Visit each cell once.

### Space Complexity: O(n)
Space-optimized row.

---

## Phase 6: Follow-Up Questions

1. **"Can move in all 4 directions?"**
   → Dijkstra's algorithm.

2. **"Maximum path sum?"**
   → Change min to max.

3. **"With obstacles?"**
   → Set obstacle cells to infinity.
