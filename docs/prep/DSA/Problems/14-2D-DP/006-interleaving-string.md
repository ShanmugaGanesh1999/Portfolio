# Interleaving String

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 97 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Can s3 be formed by interleaving s1 and s2?

### Constraints & Clarifying Questions
1. **Interleave = alternate chars maintaining order?** Yes.
2. **Use all chars?** Yes, completely.
3. **Length constraint?** len(s3) must equal len(s1) + len(s2).
4. **Empty strings?** Valid edge case.

### Edge Cases
1. **s1 empty:** s3 must equal s2
2. **s2 empty:** s3 must equal s1
3. **Length mismatch:** Immediately false

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = True if s1[0:i] and s2[0:j] can form s3[0:i+j].

**Core Insight:** At each step, either take from s1 or s2.

---

## Phase 3: Python Code

```python
def solve(s1: str, s2: str, s3: str) -> bool:
    """
    Check if s3 is interleaving of s1 and s2.
    
    Args:
        s1: First string
        s2: Second string
        s3: Target interleaved string
    
    Returns:
        True if valid interleaving
    """
    m, n = len(s1), len(s2)
    
    if m + n != len(s3):
        return False
    
    # Space-optimized DP
    dp = [False] * (n + 1)
    
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0 and j == 0:
                dp[j] = True
            elif i == 0:
                dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]
            elif j == 0:
                dp[j] = dp[j] and s1[i - 1] == s3[i - 1]
            else:
                dp[j] = (dp[j] and s1[i - 1] == s3[i + j - 1]) or \
                        (dp[j - 1] and s2[j - 1] == s3[i + j - 1])
    
    return dp[n]


def solve_2d(s1: str, s2: str, s3: str) -> bool:
    """
    Full 2D DP.
    """
    m, n = len(s1), len(s2)
    
    if m + n != len(s3):
        return False
    
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # First column (only s1)
    for i in range(1, m + 1):
        dp[i][0] = dp[i - 1][0] and s1[i - 1] == s3[i - 1]
    
    # First row (only s2)
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j - 1] and s2[j - 1] == s3[j - 1]
    
    # Fill rest
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            k = i + j - 1  # Current index in s3
            dp[i][j] = (dp[i - 1][j] and s1[i - 1] == s3[k]) or \
                       (dp[i][j - 1] and s2[j - 1] == s3[k])
    
    return dp[m][n]


def solve_bfs(s1: str, s2: str, s3: str) -> bool:
    """
    BFS approach.
    """
    from collections import deque
    
    if len(s1) + len(s2) != len(s3):
        return False
    
    visited = set()
    queue = deque([(0, 0)])
    
    while queue:
        i, j = queue.popleft()
        
        if i == len(s1) and j == len(s2):
            return True
        
        if (i, j) in visited:
            continue
        visited.add((i, j))
        
        k = i + j
        
        if i < len(s1) and s1[i] == s3[k]:
            queue.append((i + 1, j))
        
        if j < len(s2) and s2[j] == s3[k]:
            queue.append((i, j + 1))
    
    return False


def solve_recursive(s1: str, s2: str, s3: str) -> bool:
    """
    Recursive with memoization.
    """
    if len(s1) + len(s2) != len(s3):
        return False
    
    memo = {}
    
    def dp(i: int, j: int) -> bool:
        if i == len(s1) and j == len(s2):
            return True
        if (i, j) in memo:
            return memo[(i, j)]
        
        k = i + j
        result = False
        
        if i < len(s1) and s1[i] == s3[k]:
            result = dp(i + 1, j)
        
        if not result and j < len(s2) and s2[j] == s3[k]:
            result = dp(i, j + 1)
        
        memo[(i, j)] = result
        return result
    
    return dp(0, 0)
```

---

## Phase 4: Dry Run

**Input:** `s1 = "aab", s2 = "axy", s3 = "aaxaby"`

**DP Table:**
```
       ""    a     x     y
""      T    T     F     F
a       T    T     T     F
a       T    T     T     T
b       F    F     F     T
```

| (i,j) | k | s3[k] | from top? | from left? | dp[i][j] |
|-------|---|-------|-----------|------------|----------|
| (1,1) | 1 | a | s1[0]=a✓,T | s2[0]=a✓,T | T |
| (2,2) | 3 | a | s1[1]=a✓,T | s2[1]=x✗ | T |
| (3,3) | 5 | y | s1[2]=b✗ | s2[2]=y✓,T | T |

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Fill DP table.

### Space Complexity: O(n)
Space-optimized row.

---

## Phase 6: Follow-Up Questions

1. **"Return all valid interleavings?"**
   → Backtracking enumeration.

2. **"Minimum swaps to make valid?"**
   → Edit distance variant.

3. **"Three strings interleaved?"**
   → 3D DP.
