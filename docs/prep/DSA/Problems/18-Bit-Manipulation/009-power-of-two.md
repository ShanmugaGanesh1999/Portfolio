# Power of Two

| Difficulty | LeetCode # | Pattern |
|------------|------------|---------|
| Easy | 231 | Bit Manipulation |

---

## Phase 1: Clarification & Edge Cases

### Interpretation
Check if n is a power of two.

### Constraints & Clarifying Questions
1. **n = 0?** Not power of 2.
2. **n = 1?** Yes (2^0).
3. **Negative n?** No (negative can't be power of 2).
4. **Large n?** Bit manipulation handles.

### Edge Cases
1. **n ≤ 0:** False
2. **n = 1:** True
3. **n = MAX_INT + 1:** Overflow

---

## Phase 2: High-Level Approach

### Approach: n & (n-1) == 0
Power of 2 has exactly one bit set.
n & (n-1) removes that bit; result is 0.

**Core Insight:** 2^k has single 1-bit.

---

## Phase 3: Python Code

```python
def solve(n: int) -> bool:
    """
    Check if n is power of two.
    
    Args:
        n: Integer
    
    Returns:
        True if power of 2
    """
    return n > 0 and (n & (n - 1)) == 0


def solve_count_bits(n: int) -> bool:
    """
    Count set bits.
    """
    if n <= 0:
        return False
    
    count = 0
    while n:
        count += n & 1
        n >>= 1
    
    return count == 1


def solve_log(n: int) -> bool:
    """
    Using logarithm.
    """
    import math
    
    if n <= 0:
        return False
    
    log = math.log2(n)
    return log == int(log)


def solve_bit_check(n: int) -> bool:
    """
    Alternative bit trick: n & -n == n.
    """
    return n > 0 and (n & -n) == n


def is_power_of_four(n: int) -> bool:
    """
    Related: check if power of 4 (LeetCode 342).
    """
    # Power of 4: single bit at even position
    return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0


def is_power_of_three(n: int) -> bool:
    """
    Related: check if power of 3 (LeetCode 326).
    """
    # 3^19 = 1162261467 is largest power of 3 in 32-bit
    return n > 0 and 1162261467 % n == 0
```

---

## Phase 4: Dry Run

**Input:** n = 16 (binary: 10000)

**Method: n & (n-1)**
- n = 16 = 10000
- n-1 = 15 = 01111
- n & (n-1) = 00000 = 0 ✓

**Result:** True

**Input:** n = 18 (binary: 10010)

- n = 18 = 10010
- n-1 = 17 = 10001
- n & (n-1) = 10000 ≠ 0

**Result:** False

---

## Phase 5: Complexity Analysis

### Time Complexity: O(1)
Single bitwise operation.

### Space Complexity: O(1)
No extra space.

---

## Phase 6: Follow-Up Questions

1. **"Power of 4?"**
   → Additional check: bit at even position (mask 0x55555555).

2. **"Power of 3?"**
   → No bit trick; use largest power divides n.

3. **"Largest power of 2 ≤ n?"**
   → Highest set bit: `1 << (n.bit_length() - 1)`.
