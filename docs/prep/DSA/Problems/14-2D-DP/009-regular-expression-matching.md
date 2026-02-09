# Regular Expression Matching

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Hard | 10 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Match string against pattern with '.' (any char) and '*' (zero or more of preceding).

### Constraints & Clarifying Questions
1. **'.' matches any single char?** Yes.
2. **'*' alone?** No, always follows a character.
3. **Empty pattern?** Matches empty string only.
4. **Consecutive '*'?** No, guaranteed well-formed.

### Edge Cases
1. **Empty string, "a*" pattern:** True
2. **Empty string, "." pattern:** False
3. **Pattern starts with '*':** Invalid input

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = True if s[0:i] matches p[0:j].

**Key transitions for '*':**
- Zero occurrences: dp[i][j-2]
- One+ occurrences: dp[i-1][j] if s[i-1] matches p[j-2]

---

## Phase 3: Python Code

```python
def solve(s: str, p: str) -> bool:
    """
    Match string against regex pattern.
    
    Args:
        s: Input string
        p: Pattern with . and *
    
    Returns:
        True if matches
    """
    m, n = len(s), len(p)
    
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Handle patterns like a*, a*b*, etc. (can match empty)
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                # Zero occurrences of preceding element
                dp[i][j] = dp[i][j - 2]
                
                # One or more occurrences
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
            
            elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    
    return dp[m][n]


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
        
        first_match = i < len(s) and (p[j] == s[i] or p[j] == '.')
        
        if j + 1 < len(p) and p[j + 1] == '*':
            # Zero matches OR one match and continue
            result = dp(i, j + 2) or (first_match and dp(i + 1, j))
        else:
            result = first_match and dp(i + 1, j + 1)
        
        memo[(i, j)] = result
        return result
    
    return dp(0, 0)


def solve_space_optimized(s: str, p: str) -> bool:
    """
    Space-optimized DP.
    """
    m, n = len(s), len(p)
    
    prev = [False] * (n + 1)
    prev[0] = True
    
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            prev[j] = prev[j - 2]
    
    for i in range(1, m + 1):
        curr = [False] * (n + 1)
        
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                curr[j] = curr[j - 2]
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    curr[j] = curr[j] or prev[j]
            elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                curr[j] = prev[j - 1]
        
        prev = curr
    
    return prev[n]
```

---

## Phase 4: Dry Run

**Input:** `s = "aab", p = "c*a*b"`

**DP Table:**
```
       ""   c   *   a   *   b
""      T   F   T   F   T   F
a       F   F   F   T   T   F
a       F   F   F   F   T   F
b       F   F   F   F   F   T
```

| (i,j) | p[j-1] | Action | dp[i][j] |
|-------|--------|--------|----------|
| (0,2) | * | zero c's: dp[0][0] | T |
| (0,4) | * | zero a's: dp[0][2] | T |
| (1,3) | a | match: dp[0][2] | T |
| (1,4) | * | extend: dp[0][4] OR dp[1][3] | T |
| (2,4) | * | extend a*: dp[1][4] | T |
| (3,5) | b | match: dp[2][4] | T |

**Pattern interpretation:** c* (zero c's) + a* (two a's) + b (one b)

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Fill DP table.

### Space Complexity: O(n)
Space-optimized.

---

## Phase 6: Follow-Up Questions

1. **"Wildcard matching ('?' and '*')?"**
   → LeetCode 44: Different '*' semantics.

2. **"Count matches instead?"**
   → Sum instead of OR in transitions.

3. **"Support '+' (one or more)?"**
   → Adjust '*' logic to require at least one match.
