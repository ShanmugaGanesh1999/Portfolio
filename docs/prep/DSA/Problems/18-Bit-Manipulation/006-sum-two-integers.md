# Sum of Two Integers

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Medium | 371 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Add two integers without using + or -.

### Constraints & Clarifying Questions
1. **Negative numbers?** Yes.
2. **32-bit integers?** Yes.
3. **Overflow handling?** Use masking.
4. **Can use increment?** No.

### Edge Cases
1. **a = 0:** Return b
2. **b = 0:** Return a
3. **Opposite signs:** Subtraction effect

---

## Phase 2: High-Level Approach

### Approach: Bit-by-bit Addition
- Sum without carry: a XOR b
- Carry: (a AND b) << 1
- Repeat until no carry.

**Core Insight:** XOR gives sum, AND gives carry.

---

## Phase 3: Python Code

```python
def solve(a: int, b: int) -> int:
    """
    Add two integers without + or -.
    
    Args:
        a, b: Integers to add
    
    Returns:
        Sum of a and b
    """
    # 32-bit mask
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    
    while b != 0:
        # Sum without carry
        temp = (a ^ b) & MASK
        # Carry
        b = ((a & b) << 1) & MASK
        a = temp
    
    # Handle negative numbers (Python's infinite precision)
    return a if a <= MAX_INT else ~(a ^ MASK)


def solve_recursive(a: int, b: int) -> int:
    """
    Recursive approach.
    """
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    
    if b == 0:
        return a if a <= MAX_INT else ~(a ^ MASK)
    
    return solve_recursive((a ^ b) & MASK, ((a & b) << 1) & MASK)


def subtract(a: int, b: int) -> int:
    """
    Subtraction: a - b = a + (-b) = a + (~b + 1).
    """
    return solve(a, solve(~b, 1))


def multiply(a: int, b: int) -> int:
    """
    Multiplication using addition and shifts.
    """
    result = 0
    negative = (a < 0) ^ (b < 0)
    a, b = abs(a), abs(b)
    
    while b > 0:
        if b & 1:
            result = solve(result, a)
        a <<= 1
        b >>= 1
    
    return -result if negative else result
```

---

## Phase 4: Dry Run

**Input:** a = 5, b = 3

| Step | a (binary) | b (binary) | a^b | (a&b)<<1 |
|------|------------|------------|-----|----------|
| 1 | 0101 | 0011 | 0110 | 0010 |
| 2 | 0110 | 0010 | 0100 | 0100 |
| 3 | 0100 | 0100 | 0000 | 1000 |
| 4 | 0000 | 1000 | 1000 | 0000 |
| 5 | 1000 | 0000 | Done | - |

**Result:** 8 ✓ (5 + 3 = 8)

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
Maximum 32 iterations for 32-bit integers.

### Space Complexity: O(1)
Constant variables.

---

## Phase 6: Follow-Up Questions

1. **"Subtract without operators?"**
   → a - b = a + (~b + 1).

2. **"Multiply without operators?"**
   → Add and shift.

3. **"Divide without operators?"**
   → Subtract repeatedly with binary search.
