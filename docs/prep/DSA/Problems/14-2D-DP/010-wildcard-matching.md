# Wildcard Matching

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 44 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Match string against pattern with '?' (any single char) and '*' (any sequence including empty).

### Constraints & Clarifying Questions
1. **'?' matches exactly one char?** Yes.
2. **'*' matches any sequence (including empty)?** Yes.
3. **Empty string and "*" pattern?** True.
4. **Consecutive '*'?** Valid, same as single '*'.

### Edge Cases
1. **Empty string, empty pattern:** True
2. **Empty string, only '*'s:** True
3. **Empty string, any other pattern:** False

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = True if s[0:i] matches p[0:j].

**Key insight:** '*' can match empty (dp[i][j-1]) or extend match (dp[i-1][j]).

---

## Phase 3: Python Code

```python
def solve(s: str, p: str) -> bool:
    """
    Match string against wildcard pattern.
    
    Args:
        s: Input string
        p: Pattern with ? and *
    
    Returns:
        True if matches
    """
    m, n = len(s), len(p)
    
    # Space-optimized DP
    prev = [False] * (n + 1)
    prev[0] = True
    
    # Handle leading *'s
    for j in range(1, n + 1):
        if p[j - 1] == '*':
            prev[j] = prev[j - 1]
        else:
            break
    
    for i in range(1, m + 1):
        curr = [False] * (n + 1)
        
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                # Match empty or extend
                curr[j] = curr[j - 1] or prev[j]
            elif p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                curr[j] = prev[j - 1]
        
        prev = curr
    
    return prev[n]


def solve_2d(s: str, p: str) -> bool:
    """
    Full 2D DP.
    """
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # First row: empty string
    for j in range(1, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 1]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                # Empty match or extend
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
            elif p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    
    return dp[m][n]


def solve_greedy(s: str, p: str) -> bool:
    """
    Two-pointer greedy approach.
    """
    si = pi = 0
    star_idx = -1
    match_idx = 0
    
    while si < len(s):
        if pi < len(p) and (p[pi] == '?' or p[pi] == s[si]):
            si += 1
            pi += 1
        elif pi < len(p) and p[pi] == '*':
            star_idx = pi
            match_idx = si
            pi += 1
        elif star_idx != -1:
            # Backtrack: extend star's match
            pi = star_idx + 1
            match_idx += 1
            si = match_idx
        else:
            return False
    
    # Check remaining pattern (must be all '*')
    while pi < len(p) and p[pi] == '*':
        pi += 1
    
    return pi == len(p)


def solve_recursive(s: str, p: str) -> bool:
    """
    Recursive with memoization.
    """
    memo = {}
    
    def dp(i: int, j: int) -> bool:
        if (i, j) in memo:
            return memo[(i, j)]
        
        if j == len(p):
            return i == len(s)
        
        if p[j] == '*':
            # Try matching empty or one more character
            result = dp(i, j + 1) or (i < len(s) and dp(i + 1, j))
        elif i < len(s) and (p[j] == '?' or p[j] == s[i]):
            result = dp(i + 1, j + 1)
        else:
            result = False
        
        memo[(i, j)] = result
        return result
    
    return dp(0, 0)
```

---

## Phase 4: Dry Run

**Input:** `s = "adceb", p = "*a*b"`

**DP Table:**
```
       ""   *   a   *   b
""      T   T   F   F   F
a       F   T   T   T   F
d       F   T   F   T   F
c       F   T   F   T   F
e       F   T   F   T   F
b       F   T   F   T   T
```

**Greedy Approach:**

| Step | si | pi | Action |
|------|----|----|--------|
| 1 | 0 | 0 | p[0]='*', star_idx=0, pi=1 |
| 2 | 0 | 1 | p[1]='a'=s[0], match, si=1, pi=2 |
| 3 | 1 | 2 | p[2]='*', star_idx=2, pi=3 |
| 4 | 1 | 3 | p[3]='b'≠s[1]='d', backtrack |
| ... | ... | ... | Continue until b matches |

**Result:** True

---

## Phase 5: Complexity Analysis

### DP Approach:
- **Time:** O(m × n)
- **Space:** O(n)

### Greedy Approach:
- **Time:** O(m × n) worst case
- **Space:** O(1)

---

## Phase 6: Follow-Up Questions

1. **"Regular expression matching?"**
   → LeetCode 10: Different '*' semantics.

2. **"Case-insensitive matching?"**
   → Convert to same case before matching.

3. **"Support character classes [abc]?"**
   → Extend pattern handling.
