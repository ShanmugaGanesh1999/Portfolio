# Word Break

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 139 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Can string be segmented into space-separated dictionary words?

### Constraints & Clarifying Questions
1. **Same word multiple times?** Yes.
2. **Empty string?** True (trivially segmented).
3. **Case sensitive?** Yes.
4. **Dictionary size?** Can be large.

### Edge Cases
1. **Empty string:** True
2. **No match possible:** False
3. **Single word equals string:** True

---

## Phase 2: High-Level Approach

### Approach: DP - Can Segment Up to Index
dp[i] = True if s[0:i] can be segmented.
Check all j < i: if dp[j] and s[j:i] in wordDict.

**Core Insight:** Build up valid segmentation from left.

---

## Phase 3: Python Code

```python
from typing import List


def solve(s: str, wordDict: List[str]) -> bool:
    """
    Check if string can be segmented into dictionary words.
    
    Args:
        s: Input string
        wordDict: List of valid words
    
    Returns:
        True if segmentable
    """
    word_set = set(wordDict)
    n = len(s)
    
    # dp[i] = True if s[0:i] can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]


def solve_optimized(s: str, wordDict: List[str]) -> bool:
    """
    Optimized with max word length bound.
    """
    word_set = set(wordDict)
    max_len = max(len(w) for w in wordDict) if wordDict else 0
    n = len(s)
    
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        # Only check back up to max word length
        for j in range(max(0, i - max_len), i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]


def solve_bfs(s: str, wordDict: List[str]) -> bool:
    """
    BFS approach.
    """
    from collections import deque
    
    word_set = set(wordDict)
    n = len(s)
    visited = [False] * (n + 1)
    
    queue = deque([0])
    visited[0] = True
    
    while queue:
        start = queue.popleft()
        
        for end in range(start + 1, n + 1):
            if not visited[end] and s[start:end] in word_set:
                if end == n:
                    return True
                visited[end] = True
                queue.append(end)
    
    return False


def solve_recursive(s: str, wordDict: List[str]) -> bool:
    """
    Recursive with memoization.
    """
    word_set = set(wordDict)
    memo = {}
    
    def dp(start: int) -> bool:
        if start == len(s):
            return True
        if start in memo:
            return memo[start]
        
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in word_set and dp(end):
                memo[start] = True
                return True
        
        memo[start] = False
        return False
    
    return dp(0)
```

---

## Phase 4: Dry Run

**Input:** `s = "leetcode", wordDict = ["leet", "code"]`

| i | j | s[j:i] | dp[j] | dp[i] |
|---|---|--------|-------|-------|
| 1-3 | 0 | "l","le","lee" | T | F |
| 4 | 0 | "leet" ✓ | T | T |
| 5-7 | ... | no match | - | F |
| 8 | 4 | "code" ✓ | T | T |

**Result:** True

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N² × M)
N² pairs, M = avg word length for hashing.

### Space Complexity: O(N)
DP array + word set.

---

## Phase 6: Follow-Up Questions

1. **"Return all segmentations?"**
   → Word Break II: backtracking with memo.

2. **"Minimum words needed?"**
   → BFS (levels) or DP counting.

3. **"With edit distance allowed?"**
   → Much harder; fuzzy matching DP.
