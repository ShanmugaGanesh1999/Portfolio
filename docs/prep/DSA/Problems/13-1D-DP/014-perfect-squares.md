# Perfect Squares

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 279 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find minimum number of perfect squares summing to n.

### Constraints & Clarifying Questions
1. **Perfect squares = 1,4,9,16,...?** Yes.
2. **n = 0?** Return 0.
3. **n is perfect square?** Return 1.
4. **Always possible?** Yes (use 1s).

### Edge Cases
1. **n = 1:** 1 (just 1)
2. **n = 4:** 1 (just 4)
3. **n = 12:** 3 (4+4+4)

---

## Phase 2: High-Level Approach

### Approach: DP - Minimum Squares for Each Number
dp[i] = minimum squares for i.
dp[i] = min(dp[i - j²] + 1) for all valid j.

**Core Insight:** Like coin change with "coins" being perfect squares.

---

## Phase 3: Python Code

```python
import math


def solve(n: int) -> int:
    """
    Find minimum perfect squares summing to n.
    
    Args:
        n: Target number
    
    Returns:
        Minimum count of perfect squares
    """
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    # Precompute perfect squares up to n
    squares = []
    i = 1
    while i * i <= n:
        squares.append(i * i)
        i += 1
    
    for i in range(1, n + 1):
        for sq in squares:
            if sq > i:
                break
            dp[i] = min(dp[i], dp[i - sq] + 1)
    
    return dp[n]


def solve_bfs(n: int) -> int:
    """
    BFS approach (finds minimum levels).
    """
    from collections import deque
    
    if n == 0:
        return 0
    
    # Precompute squares
    squares = []
    i = 1
    while i * i <= n:
        squares.append(i * i)
        i += 1
    
    visited = {n}
    queue = deque([n])
    level = 0
    
    while queue:
        level += 1
        for _ in range(len(queue)):
            curr = queue.popleft()
            
            for sq in squares:
                remainder = curr - sq
                
                if remainder == 0:
                    return level
                
                if remainder > 0 and remainder not in visited:
                    visited.add(remainder)
                    queue.append(remainder)
    
    return level


def solve_math(n: int) -> int:
    """
    Mathematical solution using Lagrange's four square theorem.
    """
    # Check if perfect square
    if int(math.sqrt(n)) ** 2 == n:
        return 1
    
    # Check if sum of 2 squares
    def is_square(x):
        s = int(math.sqrt(x))
        return s * s == x
    
    for i in range(1, int(math.sqrt(n)) + 1):
        if is_square(n - i * i):
            return 2
    
    # Legendre's three-square theorem:
    # n = 4^a(8b+7) can't be sum of 3 squares
    temp = n
    while temp % 4 == 0:
        temp //= 4
    
    if temp % 8 == 7:
        return 4
    
    return 3


def solve_static_dp(n: int) -> int:
    """
    Static DP (reusable across calls).
    """
    dp = [0]
    
    while len(dp) <= n:
        m = len(dp)
        min_squares = float('inf')
        j = 1
        while j * j <= m:
            min_squares = min(min_squares, dp[m - j * j] + 1)
            j += 1
        dp.append(min_squares)
    
    return dp[n]
```

---

## Phase 4: Dry Run

**Input:** `n = 12`
**Squares:** [1, 4, 9]

| i | dp[i-1]+1 | dp[i-4]+1 | dp[i-9]+1 | dp[i] |
|---|-----------|-----------|-----------|-------|
| 1 | 0+1=1 | - | - | 1 |
| 2 | 1+1=2 | - | - | 2 |
| 3 | 2+1=3 | - | - | 3 |
| 4 | 3+1=4 | 0+1=1 | - | 1 |
| 5 | 1+1=2 | 1+1=2 | - | 2 |
| 8 | - | 1+1=2 | - | 2 |
| 12 | - | 2+1=3 | 3+1=4 | 3 |

**12 = 4 + 4 + 4**

**Result:** 3

---

## Phase 5: Complexity Analysis

### DP Approach:
- **Time:** O(N × √N)
- **Space:** O(N)

### BFS Approach:
- **Time:** O(N × √N)
- **Space:** O(N)

### Math Approach:
- **Time:** O(√N)
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Return actual squares used?"**
   → Track parent/choice in DP.

2. **"At most k squares allowed?"**
   → Add constraint or return -1.

3. **"Cubes instead of squares?"**
   → Same DP with different "coins".
