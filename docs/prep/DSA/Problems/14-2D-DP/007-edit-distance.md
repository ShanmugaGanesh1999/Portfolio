# Edit Distance

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 72 | 2D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Minimum operations to convert word1 to word2. Operations: insert, delete, replace.

### Constraints & Clarifying Questions
1. **Operations cost same?** Yes, all cost 1.
2. **Empty strings?** Length of other string.
3. **Case sensitive?** Yes.
4. **Only lowercase letters?** Usually yes.

### Edge Cases
1. **One empty:** Length of other
2. **Identical:** 0
3. **Completely different:** max of lengths

---

## Phase 2: High-Level Approach

### Approach: 2D DP
dp[i][j] = edit distance of word1[0:i] and word2[0:j].

**Transitions:**
- If match: dp[i-1][j-1]
- Else: 1 + min(insert, delete, replace)

---

## Phase 3: Python Code

```python
def solve(word1: str, word2: str) -> int:
    """
    Find minimum edit distance.
    
    Args:
        word1: Source string
        word2: Target string
    
    Returns:
        Minimum operations
    """
    m, n = len(word1), len(word2)
    
    # Space-optimized
    prev = list(range(n + 1))
    
    for i in range(1, m + 1):
        curr = [i]  # First column
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                curr.append(prev[j - 1])
            else:
                curr.append(1 + min(
                    prev[j],      # Delete
                    curr[j - 1],  # Insert
                    prev[j - 1]   # Replace
                ))
        prev = curr
    
    return prev[n]


def solve_2d(word1: str, word2: str) -> int:
    """
    Full 2D DP.
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],     # Delete from word1
                    dp[i][j - 1],     # Insert into word1
                    dp[i - 1][j - 1]  # Replace
                )
    
    return dp[m][n]


def solve_with_operations(word1: str, word2: str) -> list:
    """
    Return actual operations.
    """
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    
    # Backtrack
    operations = []
    i, j = m, n
    while i > 0 or j > 0:
        if i > 0 and j > 0 and word1[i - 1] == word2[j - 1]:
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i - 1][j - 1] + 1:
            operations.append(f"Replace '{word1[i - 1]}' with '{word2[j - 1]}'")
            i -= 1
            j -= 1
        elif j > 0 and dp[i][j] == dp[i][j - 1] + 1:
            operations.append(f"Insert '{word2[j - 1]}'")
            j -= 1
        else:
            operations.append(f"Delete '{word1[i - 1]}'")
            i -= 1
    
    return list(reversed(operations))
```

---

## Phase 4: Dry Run

**Input:** `word1 = "horse", word2 = "ros"`

**DP Table:**
```
       ""   r   o   s
""      0   1   2   3
h       1   1   2   3
o       2   2   1   2
r       3   2   2   2
s       4   3   3   2
e       5   4   4   3
```

**Operations:** horse → rorse → rose → ros

| (i,j) | chars | match | operation | dp[i][j] |
|-------|-------|-------|-----------|----------|
| (1,1) | h,r | ✗ | replace h→r | 1 |
| (2,2) | o,o | ✓ | - | 1 |
| (4,3) | s,s | ✓ | - | 2 |
| (5,3) | e,s | ✗ | delete e | 3 |

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(m × n)
Fill DP table.

### Space Complexity: O(n)
Space-optimized row.

---

## Phase 6: Follow-Up Questions

1. **"Different operation costs?"**
   → Use weighted costs in min().

2. **"Only insertions and deletions?"**
   → Longest Common Subsequence based.

3. **"With transposition allowed?"**
   → Damerau-Levenshtein distance.
