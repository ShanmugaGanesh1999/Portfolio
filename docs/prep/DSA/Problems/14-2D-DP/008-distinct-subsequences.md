# Distinct Subsequences

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 115 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count distinct subsequences of s that equal t.

### Constraints & Clarifying Questions
1. **Subsequence = not contiguous?** Correct.
2. **Different positions = different subsequences?** Yes.
3. **Empty t?** Return 1 (empty subsequence).
4. **t longer than s?** Return 0.

### Edge Cases
1. **s empty, t non-empty:** 0
2. **t empty:** 1
3. **s == t:** 1

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = ways to form t[0:j] from s[0:i].

**Transitions:**
- If s[i-1] == t[j-1]: dp[i-1][j-1] + dp[i-1][j]
- Else: dp[i-1][j]

---

## Phase 3: Python Code

```python
def solve(s: str, t: str) -> int:
    """
    Count distinct subsequences of s equaling t.
    
    Args:
        s: Source string
        t: Target string
    
    Returns:
        Number of distinct subsequences
    """
    m, n = len(s), len(t)
    
    if n > m:
        return 0
    
    # Space-optimized: only need previous row
    prev = [0] * (n + 1)
    prev[0] = 1
    
    for i in range(1, m + 1):
        # Process right to left to avoid overwriting
        for j in range(min(i, n), 0, -1):
            if s[i - 1] == t[j - 1]:
                prev[j] += prev[j - 1]
    
    return prev[n]


def solve_2d(s: str, t: str) -> int:
    """
    Full 2D DP.
    """
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Empty t can be formed from any prefix
    for i in range(m + 1):
        dp[i][0] = 1
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                # Use s[i-1] or skip it
                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]
            else:
                # Must skip s[i-1]
                dp[i][j] = dp[i - 1][j]
    
    return dp[m][n]


def solve_recursive(s: str, t: str) -> int:
    """
    Recursive with memoization.
    """
    memo = {}
    
    def dp(i: int, j: int) -> int:
        if j == 0:
            return 1
        if i == 0:
            return 0
        if (i, j) in memo:
            return memo[(i, j)]
        
        if s[i - 1] == t[j - 1]:
            result = dp(i - 1, j - 1) + dp(i - 1, j)
        else:
            result = dp(i - 1, j)
        
        memo[(i, j)] = result
        return result
    
    return dp(len(s), len(t))


def solve_optimized(s: str, t: str) -> int:
    """
    Further optimized with character positions.
    """
    from collections import defaultdict
    
    n = len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    
    # Map t characters to their positions (for pruning)
    t_chars = set(t)
    
    for c in s:
        if c not in t_chars:
            continue
        
        # Update right to left
        for j in range(n, 0, -1):
            if t[j - 1] == c:
                dp[j] += dp[j - 1]
    
    return dp[n]
```

---

## Phase 4: Dry Run

**Input:** `s = "rabbbit", t = "rabbit"`

**DP Table:**
```
       ""   r   a   b   b   i   t
""      1   0   0   0   0   0   0
r       1   1   0   0   0   0   0
a       1   1   1   0   0   0   0
b       1   1   1   1   0   0   0
b       1   1   1   2   1   0   0
b       1   1   1   3   3   0   0
i       1   1   1   3   3   3   0
t       1   1   1   3   3   3   3
```

| Position | t[j-1] | Match? | dp[i][j] |
|----------|--------|--------|----------|
| (4,4) b | b | ✓ | dp[3][3]+dp[3][4]=1+0=1 |
| (5,4) b | b | ✓ | dp[4][3]+dp[4][4]=2+1=3 |
| (7,6) t | t | ✓ | dp[6][5]+dp[6][6]=3+0=3 |

**3 ways:** Using b at position 3,4,5 with the third b.

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Fill DP table.

### Space Complexity: O(n)
Space-optimized.

---

## Phase 6: Follow-Up Questions

1. **"Return all distinct subsequences?"**
   → Backtracking enumeration.

2. **"With wildcard in t?"**
   → Regular expression matching DP.

3. **"Longest common subsequence?"**
   → Different DP formulation.
