# Unique Paths

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 62 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count paths from top-left to bottom-right. Can only move right or down.

### Constraints & Clarifying Questions
1. **Grid size?** m × n (rows × cols).
2. **Start/end?** (0,0) to (m-1, n-1).
3. **Empty grid?** Return 0 or 1.
4. **Obstacles?** No (that's Unique Paths II).

### Edge Cases
1. **1×1 grid:** 1 path
2. **1×n or m×1:** 1 path
3. **2×2:** 2 paths

---

## Phase 2: High-Level Approach

### Approach: DP - Sum of Ways to Each Cell
dp[i][j] = paths to reach (i,j) = dp[i-1][j] + dp[i][j-1].

**Core Insight:** Can only come from top or left.

---

## Phase 3: Python Code

```python
def solve(m: int, n: int) -> int:
    """
    Count unique paths in m×n grid.
    
    Args:
        m: Number of rows
        n: Number of columns
    
    Returns:
        Number of unique paths
    """
    # Space-optimized: only need previous row
    dp = [1] * n  # First row all 1s
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] = dp[j] + dp[j - 1]  # top + left
    
    return dp[n - 1]


def solve_2d(m: int, n: int) -> int:
    """
    Full 2D DP.
    """
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    
    return dp[m - 1][n - 1]


def solve_math(m: int, n: int) -> int:
    """
    Combinatorial: C(m+n-2, m-1) or C(m+n-2, n-1).
    """
    from math import comb
    return comb(m + n - 2, m - 1)


def solve_recursive(m: int, n: int) -> int:
    """
    Recursive with memoization.
    """
    memo = {}
    
    def dp(i: int, j: int) -> int:
        if i == 0 or j == 0:
            return 1
        if (i, j) in memo:
            return memo[(i, j)]
        
        memo[(i, j)] = dp(i - 1, j) + dp(i, j - 1)
        return memo[(i, j)]
    
    return dp(m - 1, n - 1)
```

---

## Phase 4: Dry Run

**Input:** `m = 3, n = 3`

**DP Grid:**
```
[1, 1, 1]
[1, 2, 3]
[1, 3, 6]
```

| (i,j) | from top | from left | total |
|-------|----------|-----------|-------|
| (1,1) | 1 | 1 | 2 |
| (1,2) | 1 | 2 | 3 |
| (2,1) | 2 | 1 | 3 |
| (2,2) | 3 | 3 | 6 |

**Result:** 6

---

## Phase 5: Complexity Analysis

### DP Approach:
- **Time:** O(m × n)
- **Space:** O(n) optimized, O(m × n) full

### Math Approach:
- **Time:** O(min(m, n)) for combinations
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"With obstacles?"**
   → Unique Paths II: set blocked cells to 0.

2. **"Count paths with exactly k turns?"**
   → 3D DP with turn count.

3. **"Diagonal moves allowed?"**
   → dp[i][j] += dp[i-1][j-1].
