# Longest Palindromic Substring

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 5 | DP / Expand Around Center |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Find the longest substring that is a palindrome.

### Constraints & Clarifying Questions
1. **Case sensitive?** Yes.
2. **Empty string?** Return "".
3. **Multiple same length?** Return any.
4. **Single character?** It's a palindrome.

### Edge Cases
1. **Single char:** Return it
2. **All same chars:** Entire string
3. **No palindrome > 1:** Return first char

---

## Phase 2: High-Level Approach

### Approach 1: Expand Around Center
For each center (and between chars), expand while palindrome.

### Approach 2: DP
dp[i][j] = true if s[i:j+1] is palindrome.

**Core Insight:** Palindrome centers: n single chars + n-1 gaps = 2n-1 centers.

---

## Phase 3: Python Code

```python
def solve_expand(s: str) -> str:
    """
    Find longest palindromic substring using expansion.
    
    Args:
        s: Input string
    
    Returns:
        Longest palindromic substring
    """
    if not s:
        return ""
    
    def expand(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]
    
    result = ""
    
    for i in range(len(s)):
        # Odd length palindromes
        p1 = expand(i, i)
        # Even length palindromes
        p2 = expand(i, i + 1)
        
        if len(p1) > len(result):
            result = p1
        if len(p2) > len(result):
            result = p2
    
    return result


def solve_dp(s: str) -> str:
    """
    DP approach.
    """
    n = len(s)
    if n == 0:
        return ""
    
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    
    start, max_len = 0, 1
    
    # All single chars are palindromes
    for i in range(n):
        dp[i][i] = True
    
    # Check length 2
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            start, max_len = i, 2
    
    # Check length 3 and above
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                start, max_len = i, length
    
    return s[start:start + max_len]


def solve_manacher(s: str) -> str:
    """
    Manacher's algorithm O(n).
    """
    # Transform: "abc" -> "#a#b#c#"
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n  # Palindrome radius at each position
    c = r = 0    # Center and right boundary
    
    for i in range(n):
        if i < r:
            mirror = 2 * c - i
            p[i] = min(r - i, p[mirror])
        
        # Expand
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        
        # Update center if expanded past r
        if i + p[i] > r:
            c, r = i, i + p[i]
    
    # Find max
    max_len, center = max((p[i], i) for i in range(n))
    start = (center - max_len) // 2
    
    return s[start:start + max_len]
```

---

## Phase 4: Dry Run

**Input:** `"babad"`

**Expand from each center:**

| Center | Expand | Palindrome |
|--------|--------|------------|
| 0 (b) | b | "b" |
| 0.5 | ba? no | "" |
| 1 (a) | a, bab | "bab" |
| 1.5 | ab? no | "" |
| 2 (b) | b, aba | "aba" |
| ... | ... | ... |

**Longest:** "bab" or "aba" (length 3)

**Result:** "bab"

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

1. **"Count all palindromic substrings?"**
   → Same expand technique; count instead of track max.

2. **"Longest palindromic subsequence?"**
   → Different problem; 2D DP.

3. **"Make palindrome with minimum insertions?"**
   → n - LPS length.
