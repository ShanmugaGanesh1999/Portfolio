# Longest Palindromic Subsequence

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 516 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find length of longest palindromic subsequence.

### Constraints & Clarifying Questions
1. **Subsequence vs substring?** Subsequence (not contiguous).
2. **Case sensitive?** Yes.
3. **Empty string?** Return 0.
4. **Single char?** Return 1.

### Edge Cases
1. **Single char:** 1
2. **All same chars:** Full length
3. **Already palindrome:** Full length

---

## Phase 2: High-Level Approach

### Approach 1: LCS of s and reverse(s)
LPS(s) = LCS(s, reverse(s)).

### Approach 2: Direct 2D DP
dp[i][j] = LPS length of s[i:j+1].

**Core Insight:** Palindrome = same from both ends; recurse inward.

---

## Phase 3: Python Code

```python
def solve(s: str) -> int:
    """
    Find longest palindromic subsequence length.
    
    Args:
        s: Input string
    
    Returns:
        Length of LPS
    """
    n = len(s)
    if n == 0:
        return 0
    
    # Space-optimized: only need previous row
    prev = [0] * n
    
    for i in range(n - 1, -1, -1):
        curr = [0] * n
        curr[i] = 1  # Single char palindrome
        
        for j in range(i + 1, n):
            if s[i] == s[j]:
                curr[j] = prev[j - 1] + 2
            else:
                curr[j] = max(prev[j], curr[j - 1])
        
        prev = curr
    
    return prev[n - 1]


def solve_2d(s: str) -> int:
    """
    Full 2D DP.
    """
    n = len(s)
    if n == 0:
        return 0
    
    # dp[i][j] = LPS of s[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single chars
    for i in range(n):
        dp[i][i] = 1
    
    # Fill by increasing length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    return dp[0][n - 1]


def solve_lcs(s: str) -> int:
    """
    Using LCS approach.
    """
    t = s[::-1]
    n = len(s)
    
    # LCS of s and reverse(s)
    prev = [0] * (n + 1)
    
    for i in range(1, n + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev = curr
    
    return prev[n]


def solve_with_reconstruction(s: str) -> str:
    """
    Return actual LPS string.
    """
    n = len(s)
    if n == 0:
        return ""
    
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = 1
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    # Reconstruct
    result = [''] * dp[0][n - 1]
    i, j = 0, n - 1
    left, right = 0, dp[0][n - 1] - 1
    
    while i <= j:
        if i == j:
            result[left] = s[i]
            break
        elif s[i] == s[j]:
            result[left] = s[i]
            result[right] = s[j]
            left += 1
            right -= 1
            i += 1
            j -= 1
        elif dp[i + 1][j] > dp[i][j - 1]:
            i += 1
        else:
            j -= 1
    
    return ''.join(result)
```

---

## Phase 4: Dry Run

**Input:** `"bbbab"`

**DP Table:**
```
       b   b   b   a   b
b      1   2   3   3   4
b      -   1   2   2   3
b      -   -   1   1   3
a      -   -   -   1   1
b      -   -   -   -   1
```

| (i,j) | s[i],s[j] | match? | dp[i][j] |
|-------|-----------|--------|----------|
| (0,1) | b,b | ✓ | dp[1][0]+2=0+2=2 |
| (0,4) | b,b | ✓ | dp[1][3]+2=2+2=4 |
| (2,4) | b,b | ✓ | dp[3][3]+2=1+2=3 |

**LPS:** "bbbb"

**Result:** 4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N²)
Fill half of N×N table.

### Space Complexity: O(N)
Space-optimized.

---

## Phase 6: Follow-Up Questions

1. **"Minimum deletions to make palindrome?"**
   → n - LPS length.

2. **"Minimum insertions to make palindrome?"**
   → Same: n - LPS length.

3. **"Count palindromic subsequences?"**
   → Different DP: count instead of max.
