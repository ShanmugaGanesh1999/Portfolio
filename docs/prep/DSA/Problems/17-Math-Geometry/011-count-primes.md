# Count Primes

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 204 | Math + Sieve |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Count primes less than n.

### Constraints & Clarifying Questions
1. **Less than n (exclusive)?** Yes.
2. **n = 0 or 1?** Return 0.
3. **Large n?** Up to 5×10^6.
4. **1 is prime?** No.

### Edge Cases
1. **n ≤ 2:** 0
2. **n = 3:** 1 (just 2)
3. **n = 10:** 4 (2,3,5,7)

---

## Phase 2: High-Level Approach

### Approach: Sieve of Eratosthenes
Mark composites by sieving multiples of each prime.

**Core Insight:** Only need to check up to √n; mark multiples as composite.

---

## Phase 3: Python Code

```python
def solve(n: int) -> int:
    """
    Count primes less than n using Sieve of Eratosthenes.
    
    Args:
        n: Upper bound (exclusive)
    
    Returns:
        Count of primes < n
    """
    if n <= 2:
        return 0
    
    # is_prime[i] represents whether i is prime
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    # Sieve
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            # Mark all multiples of i as composite
            for j in range(i * i, n, i):
                is_prime[j] = False
    
    return sum(is_prime)


def solve_optimized(n: int) -> int:
    """
    Optimized: only odd numbers after 2.
    """
    if n <= 2:
        return 0
    if n == 3:
        return 1
    
    # Only track odd numbers
    # sieve[i] represents whether 2*i+1 is prime
    size = (n - 1) // 2
    sieve = [True] * size
    
    for i in range(1, int(n ** 0.5) // 2 + 1):
        if sieve[i]:
            p = 2 * i + 1  # Actual prime
            # Mark multiples starting from p^2
            start = 2 * i * (i + 1)
            for j in range(start, size, p):
                sieve[j] = False
    
    return sum(sieve) + 1  # +1 for prime 2


def solve_bitset(n: int) -> int:
    """
    Memory-efficient using bits.
    """
    if n <= 2:
        return 0
    
    # Each bit represents primality
    import math
    
    is_prime = [0xFF] * ((n + 7) // 8)  # All 1s initially
    
    def set_composite(x):
        is_prime[x >> 3] &= ~(1 << (x & 7))
    
    def is_prime_check(x):
        return (is_prime[x >> 3] >> (x & 7)) & 1
    
    set_composite(0)
    set_composite(1)
    
    for i in range(2, int(math.sqrt(n)) + 1):
        if is_prime_check(i):
            for j in range(i * i, n, i):
                set_composite(j)
    
    return sum(bin(byte).count('1') for byte in is_prime) - (n // 8) * 8 + sum(is_prime_check(i) for i in range(n % 8 * 8, n))


def count_primes_simple(n: int) -> int:
    """
    Simple trial division (slow but educational).
    """
    def is_prime(num):
        if num < 2:
            return False
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                return False
        return True
    
    return sum(is_prime(i) for i in range(n))
```

---

## Phase 4: Dry Run

**Input:** n = 10

**Initial:** is_prime = [F, F, T, T, T, T, T, T, T, T]

| i | Prime? | Mark multiples |
|---|--------|----------------|
| 2 | Yes | 4,6,8 → False |
| 3 | Yes | 9 → False |

**Final:** [F, F, T, T, F, T, F, T, F, F]

**Primes:** 2, 3, 5, 7

**Result:** 4

---

## Phase 5: Complexity Analysis

### Time Complexity: O(N log log N)
Sieve of Eratosthenes.

### Space Complexity: O(N)
Boolean array.

---

## Phase 6: Follow-Up Questions

1. **"Return the primes instead of count?"**
   → Collect indices where is_prime[i] = True.

2. **"Count primes in range [a, b]?"**
   → Segmented sieve.

3. **"Check if single number is prime?"**
   → Trial division up to √n.
