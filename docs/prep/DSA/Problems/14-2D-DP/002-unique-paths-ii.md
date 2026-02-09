# Unique Paths II

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 63 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count paths with obstacles. 1 = obstacle, 0 = empty.

### Constraints & Clarifying Questions
1. **Obstacle representation?** 1 = blocked.
2. **Start/end blocked?** Return 0.
3. **All blocked?** Return 0.
4. **Grid guaranteed non-empty?** Yes.

### Edge Cases
1. **Start blocked:** 0
2. **End blocked:** 0
3. **No path due to wall:** 0

---

## Phase 2: High-Level Approach

### Approach: DP with Obstacle Check
Same as Unique Paths, but set dp[i][j] = 0 if obstacle.

**Core Insight:** Obstacles block that cell's contribution.

---

## Phase 3: Python Code

```python
from typing import List


def solve(obstacleGrid: List[List[int]]) -> int:
    """
    Count unique paths with obstacles.
    
    Args:
        obstacleGrid: Grid with obstacles (1) and empty (0)
    
    Returns:
        Number of unique paths
    """
    if not obstacleGrid or obstacleGrid[0][0] == 1:
        return 0
    
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    
    # Space-optimized
    dp = [0] * n
    dp[0] = 1
    
    for i in range(m):
        for j in range(n):
            if obstacleGrid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j - 1]
    
    return dp[n - 1]


def solve_2d(obstacleGrid: List[List[int]]) -> int:
    """
    Full 2D DP.
    """
    if obstacleGrid[0][0] == 1:
        return 0
    
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    dp = [[0] * n for _ in range(m)]
    
    # First cell
    dp[0][0] = 1
    
    # First column
    for i in range(1, m):
        if obstacleGrid[i][0] == 0:
            dp[i][0] = dp[i - 1][0]
    
    # First row
    for j in range(1, n):
        if obstacleGrid[0][j] == 0:
            dp[0][j] = dp[0][j - 1]
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            if obstacleGrid[i][j] == 0:
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    
    return dp[m - 1][n - 1]


def solve_in_place(obstacleGrid: List[List[int]]) -> int:
    """
    Modify input grid (if allowed).
    """
    if obstacleGrid[0][0] == 1:
        return 0
    
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    obstacleGrid[0][0] = 1
    
    # First column
    for i in range(1, m):
        obstacleGrid[i][0] = 0 if obstacleGrid[i][0] == 1 else obstacleGrid[i - 1][0]
    
    # First row
    for j in range(1, n):
        obstacleGrid[0][j] = 0 if obstacleGrid[0][j] == 1 else obstacleGrid[0][j - 1]
    
    # Rest of grid
    for i in range(1, m):
        for j in range(1, n):
            if obstacleGrid[i][j] == 1:
                obstacleGrid[i][j] = 0
            else:
                obstacleGrid[i][j] = obstacleGrid[i - 1][j] + obstacleGrid[i][j - 1]
    
    return obstacleGrid[m - 1][n - 1]
```

---

## Phase 4: Dry Run

**Input:**
```
[[0, 0, 0],
 [0, 1, 0],
 [0, 0, 0]]
```

**DP Grid:**
```
[1, 1, 1]
[1, 0, 1]  (obstacle blocks center)
[1, 1, 2]
```

| (i,j) | obstacle? | dp[i][j] |
|-------|-----------|----------|
| (1,1) | Yes | 0 |
| (1,2) | No | 0+1=1 |
| (2,1) | No | 1+0=1 |
| (2,2) | No | 1+1=2 |

**Result:** 2

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Visit each cell once.

### Space Complexity: O(n)
Single row DP (optimized).

---

## Phase 6: Follow-Up Questions

1. **"Minimum path sum with obstacles?"**
   → Set obstacle cells to infinity.

2. **"Can destroy one obstacle?"**
   → BFS with state (x, y, destroyed).

3. **"Moving obstacles?"**
   → Time-expanded graph or simulation.
