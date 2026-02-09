# Factorial and Permutations

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy-Medium | Various | Math + Combinatorics |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Compute factorials, permutations, and combinations.

### Constraints & Clarifying Questions
1. **Overflow concerns?** May need modular arithmetic.
2. **0!?** Defined as 1.
3. **Large n?** Use iterative or memoization.
4. **Negative input?** Invalid for factorial.

### Edge Cases
1. **n = 0:** 0! = 1
2. **P(n, r) where r > n:** 0
3. **C(n, n):** 1

---

## Phase 2: High-Level Approach

### Formulas
- **Factorial:** n! = n × (n-1) × ... × 1
- **Permutation:** P(n, r) = n! / (n-r)!
- **Combination:** C(n, r) = n! / (r! × (n-r)!)

**Core Insight:** Use iterative for factorial; Pascal's triangle for combinations.

---

## Phase 3: Python Code

```python
from typing import List
from functools import lru_cache


def factorial(n: int) -> int:
    """
    Compute n factorial.
    
    Args:
        n: Non-negative integer
    
    Returns:
        n!
    """
    if n < 0:
        raise ValueError("Factorial undefined for negative numbers")
    
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def factorial_recursive(n: int) -> int:
    """
    Recursive factorial with memoization.
    """
    @lru_cache(maxsize=None)
    def helper(k):
        if k <= 1:
            return 1
        return k * helper(k - 1)
    
    return helper(n)


def permutation(n: int, r: int) -> int:
    """
    P(n, r) = n! / (n-r)!
    Number of ways to arrange r items from n.
    """
    if r > n or r < 0:
        return 0
    
    result = 1
    for i in range(n, n - r, -1):
        result *= i
    return result


def combination(n: int, r: int) -> int:
    """
    C(n, r) = n! / (r! * (n-r)!)
    Number of ways to choose r items from n.
    """
    if r > n or r < 0:
        return 0
    
    # Optimization: C(n, r) = C(n, n-r)
    r = min(r, n - r)
    
    result = 1
    for i in range(r):
        result = result * (n - i) // (i + 1)
    return result


def combination_pascal(n: int, r: int) -> int:
    """
    Using Pascal's triangle.
    """
    # Build row by row
    row = [1]
    
    for i in range(n):
        # Next row: [1, sum of adjacent pairs..., 1]
        new_row = [1]
        for j in range(len(row) - 1):
            new_row.append(row[j] + row[j + 1])
        new_row.append(1)
        row = new_row
    
    return row[r] if r <= len(row) - 1 else 0


def factorial_mod(n: int, mod: int) -> int:
    """
    n! mod m for large numbers.
    """
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % mod
    return result


def combination_mod(n: int, r: int, mod: int) -> int:
    """
    C(n, r) mod p using Fermat's little theorem.
    Requires p to be prime.
    """
    if r > n:
        return 0
    
    # Precompute factorials
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % mod
    
    # Modular inverse using Fermat's theorem: a^-1 = a^(p-2) mod p
    def mod_inverse(a, p):
        return pow(a, p - 2, p)
    
    return fact[n] * mod_inverse(fact[r], mod) % mod * mod_inverse(fact[n - r], mod) % mod


def trailing_zeros_factorial(n: int) -> int:
    """
    Count trailing zeros in n! (LeetCode 172).
    """
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count
```

---

## Phase 4: Dry Run

**Factorial(5):**
result = 1 → 2 → 6 → 24 → 120
**5! = 120**

**P(5, 3):** 5 × 4 × 3 = 60

**C(5, 2):**
- r = min(2, 3) = 2
- i=0: result = 1 × 5 / 1 = 5
- i=1: result = 5 × 4 / 2 = 10

**C(5, 2) = 10**

**Trailing zeros in 25!:**
- 25/5 = 5
- 5/5 = 1
- Total = 6 trailing zeros

---

## Phase 5: Complexity Analysis

### Factorial:
- **Time:** O(N)
- **Space:** O(1)

### Combination (multiplicative):
- **Time:** O(min(r, n-r))
- **Space:** O(1)

### Pascal's Triangle:
- **Time:** O(N²)
- **Space:** O(N)

---

## Phase 6: Follow-Up Questions

1. **"Compute all combinations?"**
   → Backtracking to generate subsets.

2. **"Catalan numbers?"**
   → C(n) = C(2n, n) / (n+1).

3. **"Derangements?"**
   → D(n) = (n-1)(D(n-1) + D(n-2)).
