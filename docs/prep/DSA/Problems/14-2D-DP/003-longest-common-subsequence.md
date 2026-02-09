# Longest Common Subsequence

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 1143 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find length of longest subsequence common to both strings.

### Constraints & Clarifying Questions
1. **Subsequence vs substring?** Subsequence (not contiguous).
2. **Case sensitive?** Yes.
3. **Empty strings?** Return 0.
4. **Same characters different order?** Still counts.

### Edge Cases
1. **One empty:** 0
2. **Identical strings:** Full length
3. **No common chars:** 0

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = LCS of text1[0:i] and text2[0:j].
If match: dp[i-1][j-1] + 1. Else: max(dp[i-1][j], dp[i][j-1]).

**Core Insight:** Match extends LCS; mismatch takes best of excluding either char.

---

## Phase 3: Python Code

```python
def solve(text1: str, text2: str) -> int:
    """
    Find longest common subsequence length.
    
    Args:
        text1: First string
        text2: Second string
    
    Returns:
        Length of LCS
    """
    m, n = len(text1), len(text2)
    
    # Space-optimized: only need previous row
    prev = [0] * (n + 1)
    
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev = curr
    
    return prev[n]


def solve_2d(text1: str, text2: str) -> int:
    """
    Full 2D DP.
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]


def solve_with_reconstruction(text1: str, text2: str) -> str:
    """
    Return actual LCS string.
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Backtrack
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            result.append(text1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(result))


def solve_recursive(text1: str, text2: str) -> int:
    """
    Recursive with memoization.
    """
    memo = {}
    
    def dp(i: int, j: int) -> int:
        if i == 0 or j == 0:
            return 0
        if (i, j) in memo:
            return memo[(i, j)]
        
        if text1[i - 1] == text2[j - 1]:
            result = dp(i - 1, j - 1) + 1
        else:
            result = max(dp(i - 1, j), dp(i, j - 1))
        
        memo[(i, j)] = result
        return result
    
    return dp(len(text1), len(text2))
```

---

## Phase 4: Dry Run

**Input:** `text1 = "abcde", text2 = "ace"`

**DP Table:**
```
    ""  a  c  e
""   0  0  0  0
a    0  1  1  1
b    0  1  1  1
c    0  1  2  2
d    0  1  2  2
e    0  1  2  3
```

| (i,j) | chars | match? | dp[i][j] |
|-------|-------|--------|----------|
| (1,1) | a,a | ✓ | 0+1=1 |
| (3,2) | c,c | ✓ | 1+1=2 |
| (5,3) | e,e | ✓ | 2+1=3 |

**LCS:** "ace"
**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Fill entire table.

### Space Complexity: O(n)
Space-optimized row.

---

## Phase 6: Follow-Up Questions

1. **"Longest common substring?"**
   → Reset to 0 on mismatch; track max.

2. **"Shortest common supersequence?"**
   → m + n - LCS length.

3. **"Edit distance?"**
   → Different DP formulation.
