# 🎯 String DP - Complete Guide

## 📌 String DP Patterns

String DP problems typically involve comparing/matching characters of two strings. The state usually tracks positions in both strings.

---

## 🔥 Longest Common Subsequence (LCS) - LC 1143

### Problem
Find the longest subsequence common to both strings.

```python
def longest_common_subsequence(text1: str, text2: str) -> int:
    """
    Find length of longest common subsequence.
    
    State: dp[i][j] = LCS of text1[0:i] and text2[0:j]
    
    Recurrence:
    - If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
    - Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    Time: O(m * n)
    Space: O(m * n), can be optimized to O(min(m, n))
    """
    m, n = len(text1), len(text2)
    
    # dp[i][j] = LCS of text1[0:i] and text2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]

def lcs_space_optimized(text1: str, text2: str) -> int:
    """
    Space-optimized version.
    
    Space: O(min(m, n))
    """
    # Make text2 the shorter string
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        prev, curr = curr, prev
    
    return prev[n]
```

### Reconstruct LCS

```python
def get_lcs_string(text1: str, text2: str) -> str:
    """
    Reconstruct actual LCS string.
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Backtrack to find LCS
    lcs = []
    i, j = m, n
    
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs.append(text1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lcs))
```

---

## 🔥 Edit Distance (Levenshtein) - LC 72

### Problem
Find minimum operations (insert, delete, replace) to convert word1 to word2.

```python
def min_distance(word1: str, word2: str) -> int:
    """
    Minimum edit distance.
    
    State: dp[i][j] = min ops to convert word1[0:i] to word2[0:j]
    
    Recurrence:
    - If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1] (no op)
    - Else: dp[i][j] = 1 + min(
        dp[i-1][j],     # Delete from word1
        dp[i][j-1],     # Insert into word1
        dp[i-1][j-1]    # Replace
    )
    
    Time: O(m * n)
    Space: O(m * n), can be O(n)
    """
    m, n = len(word1), len(word2)
    
    # Base cases
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i  # Delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # Insert all chars to empty word1
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete
                    dp[i][j - 1],      # Insert
                    dp[i - 1][j - 1]   # Replace
                )
    
    return dp[m][n]
```

---

## 🔥 Longest Palindromic Subsequence - LC 516

```python
def longest_palindrome_subseq(s: str) -> int:
    """
    Find length of longest palindromic subsequence.
    
    Key insight: LPS(s) = LCS(s, reverse(s))
    
    Or use interval DP:
    dp[i][j] = LPS of s[i:j+1]
    
    Time: O(n²)
    Space: O(n²)
    """
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single characters
    for i in range(n):
        dp[i][i] = 1
    
    # Fill for lengths 2 to n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    
    return dp[0][n - 1]
```

---

## 🔥 Longest Palindromic Substring - LC 5

```python
def longest_palindrome(s: str) -> str:
    """
    Find longest palindromic substring (contiguous).
    
    Approach: Expand from center.
    
    Time: O(n²)
    Space: O(1)
    """
    def expand_from_center(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]
    
    result = ""
    
    for i in range(len(s)):
        # Odd length palindrome
        odd = expand_from_center(i, i)
        if len(odd) > len(result):
            result = odd
        
        # Even length palindrome
        even = expand_from_center(i, i + 1)
        if len(even) > len(result):
            result = even
    
    return result

def longest_palindrome_dp(s: str) -> str:
    """
    DP approach.
    
    dp[i][j] = True if s[i:j+1] is palindrome
    
    Time: O(n²)
    Space: O(n²)
    """
    n = len(s)
    if n == 0:
        return ""
    
    dp = [[False] * n for _ in range(n)]
    start, max_len = 0, 1
    
    # All single chars are palindromes
    for i in range(n):
        dp[i][i] = True
    
    # Check for length 2
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            start, max_len = i, 2
    
    # Check for lengths 3 to n
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                if length > max_len:
                    start, max_len = i, length
    
    return s[start:start + max_len]
```

---

## 🔥 Regular Expression Matching - LC 10

```python
def is_match(s: str, p: str) -> bool:
    """
    Check if string s matches pattern p.
    '.' matches any single char
    '*' matches zero or more of preceding element
    
    State: dp[i][j] = s[0:i] matches p[0:j]
    
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(s), len(p)
    
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True  # Empty matches empty
    
    # Handle patterns like a*, a*b*, etc. matching empty string
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                # Direct match
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                # '*' matches zero occurrences
                dp[i][j] = dp[i][j - 2]
                
                # '*' matches one or more
                if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
    
    return dp[m][n]
```

---

## 🔥 Wildcard Matching - LC 44

```python
def is_match_wildcard(s: str, p: str) -> bool:
    """
    '?' matches any single char
    '*' matches any sequence (including empty)
    
    Time: O(m * n)
    Space: O(m * n)
    """
    m, n = len(s), len(p)
    
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Handle leading *'s
    for j in range(1, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 1]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            elif p[j - 1] == '*':
                # * matches empty OR * matches s[i-1]
                dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
    
    return dp[m][n]
```

---

## 📋 String DP Pattern Summary

| Problem | State | Key Insight |
|---------|-------|-------------|
| LCS | dp[i][j] = LCS of prefixes | Match or skip |
| Edit Distance | dp[i][j] = min ops | Insert, delete, replace |
| LPS | dp[i][j] = LPS of s[i:j] | Interval DP |
| Longest Palindromic Substring | dp[i][j] = is palindrome | Expand from center |
| Regex Matching | dp[i][j] = matches | Handle * carefully |

---

## 🎓 Key Takeaways

1. **Most string DP uses 2D array** with indices into both strings
2. **LCS is fundamental** - many problems reduce to it
3. **Edit Distance** models many real-world problems
4. **Interval DP** for palindrome problems
5. **Base cases** are crucial - empty strings, single chars
