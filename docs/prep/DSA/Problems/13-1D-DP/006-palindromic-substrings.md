# Palindromic Substrings

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 647 | DP / Expand Around Center |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count number of palindromic substrings in string.

### Constraints & Clarifying Questions
1. **Substring = contiguous?** Yes.
2. **Single char counts?** Yes.
3. **Duplicates counted separately?** Yes, by position.
4. **Empty string?** Return 0.

### Edge Cases
1. **Single char:** 1
2. **All same chars:** n(n+1)/2
3. **No repeated chars:** n (only single chars)

---

## Phase 2: High-Level Approach

### Approach: Expand Around Center
Same as longest palindrome, but count all expansions.

**Core Insight:** Each successful expansion adds one palindrome.

---

## Phase 3: Python Code

```python
def solve(s: str) -> int:
    """
    Count palindromic substrings.
    
    Args:
        s: Input string
    
    Returns:
        Number of palindromic substrings
    """
    if not s:
        return 0
    
    count = 0
    
    def expand(left: int, right: int) -> int:
        cnt = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            cnt += 1
            left -= 1
            right += 1
        return cnt
    
    for i in range(len(s)):
        # Odd length palindromes (center at i)
        count += expand(i, i)
        # Even length palindromes (center between i and i+1)
        count += expand(i, i + 1)
    
    return count


def solve_dp(s: str) -> int:
    """
    DP approach.
    """
    n = len(s)
    if n == 0:
        return 0
    
    count = 0
    dp = [[False] * n for _ in range(n)]
    
    # Single characters
    for i in range(n):
        dp[i][i] = True
        count += 1
    
    # Length 2
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            count += 1
    
    # Length 3+
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                count += 1
    
    return count


def solve_manacher(s: str) -> int:
    """
    Manacher's algorithm O(n).
    """
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n
    c = r = 0
    
    for i in range(n):
        if i < r:
            p[i] = min(r - i, p[2 * c - i])
        
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        
        if i + p[i] > r:
            c, r = i, i + p[i]
    
    # Count: p[i] gives number of palindromes centered at i
    # For '#' positions: even length palindromes
    # For char positions: odd length palindromes
    return sum((p[i] + 1) // 2 for i in range(n))
```

---

## Phase 4: Dry Run

**Input:** `"aaa"`

**Expand from each center:**

| Center | Expansions | Count |
|--------|------------|-------|
| 0 (a) | a, none | 1 |
| 0.5 | aa | 1 |
| 1 (a) | a, aaa | 2 |
| 1.5 | aa | 1 |
| 2 (a) | a | 1 |

**Total:** 1+1+2+1+1 = 6

**Palindromes:** "a"(0), "a"(1), "a"(2), "aa"(01), "aa"(12), "aaa"

**Result:** 6

---

## Phase 5: Complexity Analysis

### Expand Around Center:
- **Time:** O(N²)
- **Space:** O(1)

### DP:
- **Time:** O(N²)
- **Space:** O(N²)

### Manacher:
- **Time:** O(N)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Count distinct palindromes?"**
   → Use set to store unique ones.

2. **"Substrings of length at least k?"**
   → Filter during expansion.

3. **"Palindromic subsequences?"**
   → Different problem; 2D DP.
