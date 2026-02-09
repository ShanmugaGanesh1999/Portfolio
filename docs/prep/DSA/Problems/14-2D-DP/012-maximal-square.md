# Maximal Square

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 221 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find largest square containing only 1s. Return area.

### Constraints & Clarifying Questions
1. **Matrix contains?** Only '0' and '1' (chars).
2. **Empty matrix?** Return 0.
3. **No 1s?** Return 0.
4. **Return area or side?** Area.

### Edge Cases
1. **Empty:** 0
2. **All 0s:** 0
3. **Single 1:** 1

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = side length of largest square ending at (i,j) as bottom-right.

If matrix[i][j] == '1':
  dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1

**Core Insight:** Square limited by smallest adjacent squares.

---

## Phase 3: Python Code

```python
from typing import List


def solve(matrix: List[List[str]]) -> int:
    """
    Find area of largest square of 1s.
    
    Args:
        matrix: 2D matrix of '0' and '1'
    
    Returns:
        Area of largest square
    """
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    max_side = 0
    
    # Space-optimized
    prev = [0] * n
    
    for i in range(m):
        curr = [0] * n
        for j in range(n):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    curr[j] = 1
                else:
                    curr[j] = min(prev[j], curr[j - 1], prev[j - 1]) + 1
                max_side = max(max_side, curr[j])
        prev = curr
    
    return max_side * max_side


def solve_2d(matrix: List[List[str]]) -> int:
    """
    Full 2D DP.
    """
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * n for _ in range(m)]
    max_side = 0
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
                max_side = max(max_side, dp[i][j])
    
    return max_side * max_side


def solve_single_var(matrix: List[List[str]]) -> int:
    """
    Single row with diagonal tracking.
    """
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [0] * (n + 1)
    max_side = 0
    prev_diag = 0
    
    for i in range(m):
        for j in range(1, n + 1):
            temp = dp[j]
            if matrix[i][j - 1] == '1':
                dp[j] = min(dp[j], dp[j - 1], prev_diag) + 1
                max_side = max(max_side, dp[j])
            else:
                dp[j] = 0
            prev_diag = temp
    
    return max_side * max_side
```

---

## Phase 4: Dry Run

**Input:**
```
[["1","0","1","0","0"],
 ["1","0","1","1","1"],
 ["1","1","1","1","1"],
 ["1","0","0","1","0"]]
```

**DP Table:**
```
[[1,0,1,0,0],
 [1,0,1,1,1],
 [1,1,1,2,2],
 [1,0,0,1,0]]
```

| (i,j) | matrix | top | left | diag | dp[i][j] |
|-------|--------|-----|------|------|----------|
| (2,3) | 1 | 1 | 1 | 1 | min(1,1,1)+1=2 |
| (2,4) | 1 | 1 | 2 | 1 | min(1,2,1)+1=2 |

**Max side = 2, Area = 4**

**Result:** 4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Visit each cell once.

### Space Complexity: O(n)
Space-optimized row.

---

## Phase 6: Follow-Up Questions

1. **"Maximal rectangle?"**
   → Different approach: histogram method.

2. **"Count all squares?"**
   → Sum all dp[i][j] values.

3. **"With at most k 0s flipped?"**
   → More complex DP with flip count.
