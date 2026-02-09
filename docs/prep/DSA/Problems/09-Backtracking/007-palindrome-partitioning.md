# Palindrome Partitioning

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 131 | Backtracking |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Partition string so every substring is palindrome. Return all possible partitions.

### Constraints & Clarifying Questions
1. **Single characters?** Always palindrome.
2. **Overlapping partitions?** No, must cover entire string.
3. **Empty string?** `[[]]`
4. **Order in result?** Any order.

### Edge Cases
1. **Single character:** `[["a"]]`
2. **All same characters:** Many partitions
3. **No multi-char palindromes:** Each char separate

---

## Phase 2: High-Level Approach

### Approach: Backtracking + Palindrome Check
Try each prefix that's a palindrome, recursively partition rest.

**Core Insight:** At each position, try all valid palindrome prefixes.

---

## Phase 3: Python Code

```python
from typing import List


def solve(s: str) -> List[List[str]]:
    """
    Find all palindrome partitions.
    
    Args:
        s: Input string
    
    Returns:
        All valid partitions
    """
    result = []
    
    def is_palindrome(start: int, end: int) -> bool:
        while start < end:
            if s[start] != s[end]:
                return False
            start += 1
            end -= 1
        return True
    
    def backtrack(start: int, current: List[str]):
        if start == len(s):
            result.append(current.copy())
            return
        
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()
    
    backtrack(0, [])
    return result


def solve_with_dp(s: str) -> List[List[str]]:
    """
    Precompute palindrome table for O(1) lookup.
    """
    n = len(s)
    
    # dp[i][j] = True if s[i:j+1] is palindrome
    dp = [[False] * n for _ in range(n)]
    
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j]:
                if j - i <= 2:
                    dp[i][j] = True
                else:
                    dp[i][j] = dp[i + 1][j - 1]
    
    result = []
    
    def backtrack(start, current):
        if start == n:
            result.append(current.copy())
            return
        
        for end in range(start, n):
            if dp[start][end]:
                current.append(s[start:end + 1])
                backtrack(end + 1, current)
                current.pop()
    
    backtrack(0, [])
    return result
```

---

## Phase 4: Dry Run

**Input:** `"aab"`

**Backtracking:**

| start | Try | Palindrome? | Recurse |
|-------|-----|-------------|---------|
| 0 | "a" | ✓ | start=1 |
| 1 | "a" | ✓ | start=2 |
| 2 | "b" | ✓ | start=3 → Found ["a","a","b"] |
| 1 | "ab" | ✗ | Skip |
| 0 | "aa" | ✓ | start=2 |
| 2 | "b" | ✓ | start=3 → Found ["aa","b"] |
| 0 | "aab" | ✗ | Skip |

**Result:** `[["a","a","b"], ["aa","b"]]`

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N × 2^N)
2^N possible partitions, each takes O(N) to validate.

### Space Complexity: O(N)
Recursion depth + current partition.

With DP preprocessing: O(N²) space for table, O(1) palindrome checks.

---

## Phase 6: Follow-Up Questions

1. **"Minimum cuts for palindrome partitioning?"**
   → DP problem: min cuts to partition into palindromes.

2. **"Longest palindromic substring?"**
   → Different problem; expand from center or DP.

3. **"Check if string can be partitioned into k palindromes?"**
   → Count characters with odd frequency; need at most k.
