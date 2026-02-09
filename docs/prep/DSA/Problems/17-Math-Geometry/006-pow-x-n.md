# Pow(x, n)

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 50 | Math + Binary Exponentiation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Calculate x^n efficiently.

### Constraints & Clarifying Questions
1. **Negative exponent?** Yes, x^-n = 1/x^n.
2. **n = 0?** Return 1.
3. **x = 0?** Return 0 (if n > 0).
4. **Integer overflow?** Handle -2^31.

### Edge Cases
1. **n = 0:** 1
2. **n < 0:** Calculate 1/x^|n|
3. **n = -2147483648:** Handle overflow when negating

---

## Phase 2: High-Level Approach

### Approach: Binary Exponentiation (Fast Power)
x^n = (x^(n/2))^2 if even, x * x^(n-1) if odd.

**Core Insight:** Reduce exponent by half each step → O(log n).

---

## Phase 3: Python Code

```python
def solve(x: float, n: int) -> float:
    """
    Calculate x raised to power n.
    
    Args:
        x: Base
        n: Exponent
    
    Returns:
        x^n
    """
    if n == 0:
        return 1.0
    
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1.0
    
    while n > 0:
        if n & 1:  # Odd
            result *= x
        x *= x
        n >>= 1
    
    return result


def solve_recursive(x: float, n: int) -> float:
    """
    Recursive approach.
    """
    if n == 0:
        return 1.0
    
    if n < 0:
        return 1 / solve_recursive(x, -n)
    
    if n % 2 == 0:
        half = solve_recursive(x, n // 2)
        return half * half
    else:
        return x * solve_recursive(x, n - 1)


def solve_iterative_verbose(x: float, n: int) -> float:
    """
    Iterative with explanation.
    """
    if n == 0:
        return 1.0
    
    negative = n < 0
    n = abs(n)
    
    result = 1.0
    base = x
    
    # Binary representation of n determines multiplications
    while n > 0:
        if n % 2 == 1:
            # Include this power of base
            result *= base
        base *= base  # Square base for next bit
        n //= 2
    
    return 1 / result if negative else result


def solve_handle_overflow(x: float, n: int) -> float:
    """
    Handle edge case of n = -2147483648.
    """
    if n == 0:
        return 1.0
    
    if n == -2147483648:
        # Handle overflow: -(-2147483648) overflows
        return solve_handle_overflow(x * x, n // 2)
    
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1.0
    while n > 0:
        if n & 1:
            result *= x
        x *= x
        n >>= 1
    
    return result
```

---

## Phase 4: Dry Run

**Input:** x = 2.0, n = 10

**Binary of 10:** 1010

| Step | n | n & 1 | result | x |
|------|---|-------|--------|---|
| 0 | 10 | 0 | 1 | 4 |
| 1 | 5 | 1 | 4 | 16 |
| 2 | 2 | 0 | 4 | 256 |
| 3 | 1 | 1 | 1024 | 65536 |
| 4 | 0 | - | Done | - |

**Result:** 1024.0 ✓ (2^10 = 1024)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log N)
Halve exponent each iteration.

### Space Complexity: O(1) iterative, O(log N) recursive
Stack depth for recursive.

---

## Phase 6: Follow-Up Questions

1. **"Modular exponentiation (x^n mod m)?"**
   → Same algorithm, apply mod at each step.

2. **"Matrix exponentiation?"**
   → Same binary approach with matrix multiplication.

3. **"Compute x^(large string n)?"**
   → Process string digits with modular arithmetic.
