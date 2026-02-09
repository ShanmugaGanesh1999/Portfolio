# GCD and LCM

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | Various | Math |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Compute Greatest Common Divisor and Least Common Multiple.

### Constraints & Clarifying Questions
1. **Positive integers?** Yes.
2. **Zero input?** GCD(a, 0) = a.
3. **Negative numbers?** Use absolute values.
4. **Multiple numbers?** Reduce pairwise.

### Edge Cases
1. **GCD(0, a):** a
2. **GCD(a, a):** a
3. **Coprime numbers:** GCD = 1

---

## Phase 2: High-Level Approach

### Approach: Euclidean Algorithm
GCD(a, b) = GCD(b, a mod b), base: GCD(a, 0) = a.
LCM(a, b) = (a × b) / GCD(a, b).

**Core Insight:** Repeated remainder until zero.

---

## Phase 3: Python Code

```python
from typing import List
from functools import reduce
import math


def gcd(a: int, b: int) -> int:
    """
    Greatest Common Divisor using Euclidean algorithm.
    
    Args:
        a, b: Integers
    
    Returns:
        GCD of a and b
    """
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a


def gcd_recursive(a: int, b: int) -> int:
    """
    Recursive GCD.
    """
    if b == 0:
        return abs(a)
    return gcd_recursive(b, a % b)


def lcm(a: int, b: int) -> int:
    """
    Least Common Multiple.
    
    Args:
        a, b: Positive integers
    
    Returns:
        LCM of a and b
    """
    return abs(a * b) // gcd(a, b)


def gcd_multiple(nums: List[int]) -> int:
    """
    GCD of multiple numbers.
    """
    return reduce(gcd, nums)


def lcm_multiple(nums: List[int]) -> int:
    """
    LCM of multiple numbers.
    """
    return reduce(lcm, nums)


def gcd_binary(a: int, b: int) -> int:
    """
    Binary GCD (Stein's algorithm) - no division.
    """
    if a == 0:
        return b
    if b == 0:
        return a
    
    # Count common factors of 2
    shift = 0
    while ((a | b) & 1) == 0:
        a >>= 1
        b >>= 1
        shift += 1
    
    # Remove factors of 2 from a
    while (a & 1) == 0:
        a >>= 1
    
    while b:
        # Remove factors of 2 from b
        while (b & 1) == 0:
            b >>= 1
        
        # Swap so a <= b
        if a > b:
            a, b = b, a
        
        b -= a
    
    return a << shift


def extended_gcd(a: int, b: int) -> tuple:
    """
    Extended Euclidean algorithm.
    Returns (gcd, x, y) where ax + by = gcd.
    """
    if b == 0:
        return (a, 1, 0)
    
    g, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    
    return (g, x, y)


# Python 3.9+ has math.gcd and math.lcm built-in
def solve_builtin(nums: List[int]) -> int:
    """
    Using Python's built-in.
    """
    return reduce(math.gcd, nums)
```

---

## Phase 4: Dry Run

**Input:** GCD(48, 18)

| a | b | a % b |
|---|---|-------|
| 48 | 18 | 12 |
| 18 | 12 | 6 |
| 12 | 6 | 0 |
| 6 | 0 | Done |

**GCD(48, 18) = 6**

**LCM(48, 18) = (48 × 18) / 6 = 864 / 6 = 144**

**Extended GCD(48, 18):**
- 48 = 2×18 + 12
- 18 = 1×12 + 6
- 12 = 2×6 + 0
- Backtrack: 6 = 18 - 1×12 = 18 - 1×(48 - 2×18) = 3×18 - 48
- So: 48×(-1) + 18×3 = 6 ✓

---

## Phase 5: Complexity Analysis

### Time Complexity: O(log(min(a,b)))
Number of iterations bounded by Fibonacci.

### Space Complexity: O(1) iterative, O(log n) recursive

---

## Phase 6: Follow-Up Questions

1. **"GCD of array?"**
   → Reduce with pairwise GCD.

2. **"Modular inverse (a^-1 mod m)?"**
   → Extended GCD when GCD(a, m) = 1.

3. **"Coprime check?"**
   → GCD = 1 means coprime.
