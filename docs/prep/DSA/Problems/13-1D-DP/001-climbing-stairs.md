# Climbing Stairs

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 70 | 1D DP |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count ways to climb n stairs taking 1 or 2 steps at a time.

### Constraints & Clarifying Questions
1. **Start position?** Ground (step 0).
2. **n = 0?** Usually 1 way (stay).
3. **n = 1?** 1 way.
4. **Large n?** Check overflow.

### Edge Cases
1. **n = 1:** 1 way
2. **n = 2:** 2 ways (1+1 or 2)
3. **n = 45:** Large number (Fibonacci ~10^9)

---

## Phase 2: High-Level Approach

### Approach: DP (Fibonacci Pattern)
dp[i] = dp[i-1] + dp[i-2]. Ways to reach step i from step i-1 or i-2.

**Core Insight:** This is the Fibonacci sequence!

---

## Phase 3: Python Code

```python
def solve(n: int) -> int:
    """
    Count ways to climb n stairs.
    
    Args:
        n: Number of stairs
    
    Returns:
        Number of distinct ways
    """
    if n <= 2:
        return n
    
    # Space-optimized: only need last two values
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    
    return prev1


def solve_dp_array(n: int) -> int:
    """
    Full DP array version.
    """
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]


def solve_recursive(n: int) -> int:
    """
    Recursive with memoization.
    """
    memo = {}
    
    def dp(i):
        if i <= 2:
            return i
        if i in memo:
            return memo[i]
        
        memo[i] = dp(i - 1) + dp(i - 2)
        return memo[i]
    
    return dp(n)


def solve_matrix(n: int) -> int:
    """
    Matrix exponentiation for O(log n).
    """
    def multiply(A, B):
        return [
            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
        ]
    
    def power(M, p):
        result = [[1, 0], [0, 1]]  # Identity
        while p:
            if p & 1:
                result = multiply(result, M)
            M = multiply(M, M)
            p >>= 1
        return result
    
    if n <= 2:
        return n
    
    M = [[1, 1], [1, 0]]
    result = power(M, n)
    return result[0][0]
```

---

## Phase 4: Dry Run

**Input:** `n = 5`

| Step | prev2 | prev1 | curr |
|------|-------|-------|------|
| Init | 1 | 2 | - |
| i=3 | 2 | 3 | 3 |
| i=4 | 3 | 5 | 5 |
| i=5 | 5 | 8 | 8 |

**Ways:**
- 1+1+1+1+1
- 1+1+1+2, 1+1+2+1, 1+2+1+1, 2+1+1+1
- 1+2+2, 2+1+2, 2+2+1
- Total: 8

**Result:** 8

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N)
Linear scan (or O(log N) with matrix).

### Space Complexity: O(1)
Only two variables.

---

## Phase 6: Follow-Up Questions

1. **"Can take 1, 2, or 3 steps?"**
   → dp[i] = dp[i-1] + dp[i-2] + dp[i-3].

2. **"Minimum cost to climb?"**
   → Min-DP with costs.

3. **"Return actual step sequences?"**
   → Backtrack or enumerate recursively.
