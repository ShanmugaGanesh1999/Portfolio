# Decode Ways

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 91 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count ways to decode digit string where A=1, B=2, ..., Z=26.

### Constraints & Clarifying Questions
1. **Leading zeros?** Invalid (can't decode).
2. **00, 30, etc.?** Invalid.
3. **Empty string?** Return 0 or 1 (problem-specific).
4. **Valid codes?** 1-26.

### Edge Cases
1. **"0":** 0 ways (invalid)
2. **"10":** 1 way (J)
3. **"27":** 1 way (2,7 = BG)

---

## Phase 2: High-Level Approach

### Approach: DP - Single or Double Digit
dp[i] = ways to decode first i characters.
Add dp[i-1] if single digit valid, dp[i-2] if double digit valid.

**Core Insight:** Each position can extend 1-digit or 2-digit decodings.

---

## Phase 3: Python Code

```python
def solve(s: str) -> int:
    """
    Count decoding ways.
    
    Args:
        s: Digit string
    
    Returns:
        Number of ways to decode
    """
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    
    # Space-optimized DP
    prev2, prev1 = 1, 1  # dp[0] = 1, dp[1] = 1
    
    for i in range(2, n + 1):
        curr = 0
        
        # Single digit decode (s[i-1])
        if s[i - 1] != '0':
            curr += prev1
        
        # Double digit decode (s[i-2:i])
        two_digit = int(s[i - 2:i])
        if 10 <= two_digit <= 26:
            curr += prev2
        
        prev2, prev1 = prev1, curr
    
    return prev1


def solve_dp_array(s: str) -> int:
    """
    Full DP array version.
    """
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string
    dp[1] = 1  # First char (validated above)
    
    for i in range(2, n + 1):
        # Single digit
        if s[i - 1] != '0':
            dp[i] += dp[i - 1]
        
        # Double digit
        two = int(s[i - 2:i])
        if 10 <= two <= 26:
            dp[i] += dp[i - 2]
    
    return dp[n]


def solve_recursive(s: str) -> int:
    """
    Top-down with memoization.
    """
    if not s:
        return 0
    
    memo = {}
    
    def dp(i: int) -> int:
        if i == len(s):
            return 1
        if s[i] == '0':
            return 0
        if i in memo:
            return memo[i]
        
        # Single digit
        ways = dp(i + 1)
        
        # Double digit
        if i + 1 < len(s) and int(s[i:i + 2]) <= 26:
            ways += dp(i + 2)
        
        memo[i] = ways
        return ways
    
    return dp(0)
```

---

## Phase 4: Dry Run

**Input:** `"226"`

| i | s[i-1] | s[i-2:i] | prev2 | prev1 | curr |
|---|--------|----------|-------|-------|------|
| 2 | '2' ✓ | '22' ✓ | 1 | 1 | 1+1=2 |
| 3 | '6' ✓ | '26' ✓ | 1 | 2 | 2+1=3 |

**Decodings:**
- 2,2,6 → BBF
- 22,6 → VF
- 2,26 → BZ

**Result:** 3

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Single pass.

### Space Complexity: O(1)
Two variables.

---

## Phase 6: Follow-Up Questions

1. **"With wildcard '*' (1-9)?"**
   → Decode Ways II: multiply by valid options.

2. **"Return all decodings?"**
   → Backtracking to enumerate.

3. **"Minimum characters to remove for valid decoding?"**
   → DP with deletion cost.
